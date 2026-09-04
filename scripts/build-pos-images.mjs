/**
 * Builds the servable pro-shop image set from the raw capture in
 * `references/pos-item-imagery`.
 *
 * The raw folder is ~134MB of full-resolution product photography — 188 PNGs
 * averaging 725KB, with up to 13 gallery shots per product. That cannot go into
 * the repo as-is: it would quadruple the clone size and ship to GitHub Pages on
 * every deploy, for images that render at most 400px wide on a 750px canvas.
 *
 * So this script curates rather than copies:
 *
 *   - one hero image per product (the first gallery shot, which is the pack
 *     shot on a white ground in every folder we checked)
 *   - resized to 800px on the long edge — comfortably above the largest size
 *     any kiosk surface renders, with headroom for a 1080px panel
 *   - written as WebP, which is ~10x smaller than these PNGs at visually
 *     identical quality and is supported everywhere this will run
 *
 * Output lands in `public/pos-images/`, which Storybook serves in dev and copies
 * into the static build, so the same URLs work locally and on Pages.
 *
 *   node scripts/build-pos-images.mjs
 *
 * Re-run it whenever the raw capture changes. `references/pos-item-imagery`
 * stays gitignored; `public/pos-images` is committed.
 */
import { mkdir, readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = path.join(ROOT, "references/pos-item-imagery/PGA TOUR Superstore Ball Imagery");
const OUT = path.join(ROOT, "public/pos-images/pro-shop");
const CATALOG = path.join(ROOT, "src/data/pro-shop-catalog.ts");

/** Long-edge target. Above any size the kiosk renders, with panel headroom. */
const MAX_EDGE = 800;
const WEBP_QUALITY = 82;

/** Minimal CSV reader — the manifest has quoted fields containing commas. */
const parseCsv = (text) => {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (c === '"') inQuotes = false;
            else field += c;
        } else if (c === '"') inQuotes = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (c !== "\r") field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    const [header, ...body] = rows.filter((r) => r.some((v) => v.trim()));
    return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
};

const slug = (s) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** "TITLEIST PRO V1 BOX" -> brand Titleist, packaging box. */
const BRANDS = ["TITLEIST", "CALLAWAY", "TAYLORMADE", "SRIXON", "BRIDGESTONE"];
const titleCase = (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

const classify = (button) => {
    const brand = BRANDS.find((b) => button.startsWith(b));
    const packaging = button.includes("SLEEVE") ? "sleeve" : button.includes("BUCKET") ? "bucket" : button.includes("SINGLE") ? "single" : "box";
    let name = button;
    if (brand) name = name.slice(brand.length).trim();
    name = name.replace(/\b(BOX|SLEEVE|SINGLE)\b/g, "").trim();
    return {
        brand: brand ? titleCase(brand) : "Range",
        model: titleCase(name) || titleCase(button),
        packaging,
        category: button.includes("RANGE BUCKET") ? "range" : "golf-balls",
    };
};

/** Plausible pricing so cart totals look real; not from the source pages. */
const priceFor = ({ packaging, model }) => {
    if (packaging === "bucket") return model.toLowerCase().includes("large") ? 1800 : 1200;
    if (packaging === "single") return 500;
    if (packaging === "sleeve") return 1999;
    if (/pro v1|tp5|z-star|tour b/i.test(model)) return 5499;
    if (/chrome soft|avx|tour speed|tour response|q-star/i.test(model)) return 4499;
    return 2499;
};

await mkdir(OUT, { recursive: true });

const manifest = parseCsv(await readFile(path.join(RAW, "manifest.csv"), "utf8"));
const products = [];
let rawBytes = 0, outBytes = 0;

for (const row of manifest) {
    // The manifest records absolute paths from the capture machine, so resolve
    // the folder by its basename inside our own tree instead.
    const folderName = path.basename(row.folder);
    const dir = path.join(RAW, folderName);

    let files;
    try {
        files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith(".png")).sort();
    } catch {
        console.warn(`  skip (folder missing): ${folderName}`);
        continue;
    }
    if (!files.length) { console.warn(`  skip (no images): ${folderName}`); continue; }

    const source = path.join(dir, files[0]);
    rawBytes += (await stat(source)).size;

    const meta = classify(row.button);
    const id = slug(row.button);
    const outFile = path.join(OUT, `${id}.webp`);

    await sharp(source)
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outFile);

    outBytes += (await stat(outFile)).size;

    products.push({
        id,
        name: `${meta.brand} ${meta.model}`.replace(/\s+/g, " ").trim(),
        brand: meta.brand,
        model: meta.model,
        packaging: meta.packaging,
        category: meta.category,
        priceCents: priceFor(meta),
        image: `pos-images/pro-shop/${id}.webp`,
        sourceTitle: row.page_title,
        sourceUrl: row.page_url,
        galleryCount: files.length,
    });

    console.log(`  ${id}`);
}

const header = `// GENERATED by scripts/build-pos-images.mjs — do not edit by hand.
// Re-run \`node scripts/build-pos-images.mjs\` after changing the raw capture in
// references/pos-item-imagery.
//
// \`image\` is a path relative to the deploy base, NOT a leading-slash URL:
// GitHub Pages serves this project from /tf-jackrabbit-ds-v1/, so a rooted path
// would 404 there while working locally. Resolve it with \`assetUrl()\` from
// @/utils/asset-url, which prefixes the base at runtime.

import type { ProShopProduct } from "@/data/pro-shop-types";

export const PRO_SHOP_PRODUCTS: ProShopProduct[] = ${JSON.stringify(products, null, 4)};

export const PRO_SHOP_CATEGORIES = [
    { id: "golf-balls", label: "Golf Balls" },
    { id: "range", label: "Range" },
] as const;
`;

await writeFile(CATALOG, header);

const mb = (b) => (b / 1048576).toFixed(1);
console.log(`\n${products.length} products`);
console.log(`  source heroes: ${mb(rawBytes)} MB  ->  webp: ${mb(outBytes)} MB  (${(rawBytes / outBytes).toFixed(1)}x smaller)`);
console.log(`  images -> public/pos-images/pro-shop/`);
console.log(`  catalog -> src/data/pro-shop-catalog.ts`);
