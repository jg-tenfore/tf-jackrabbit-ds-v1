/**
 * Builds the servable food & beverage image set from the raw capture in
 * `references/pos-item-imagery`.
 *
 * Same job as `build-pos-images.mjs`, different problem. The pro-shop capture
 * arrives as per-product folders with a CSV manifest, so that script can walk
 * it. The food shots are loose screenshots named by the second they were taken
 * — `Screenshot 2026-08-31 at 1.24.34 PM.png` — which says nothing about what
 * is in the frame. So the mapping below is written by eye, once, and is the
 * only place the timestamps appear. Everything downstream refers to the item id.
 *
 * Each shot is flattened onto white, trimmed of its surrounding margin so
 * products fill their cards consistently, resized to 800px on the long edge and
 * written as WebP.
 *
 *   node scripts/build-menu-images.mjs
 *
 * `references/pos-item-imagery` stays gitignored; `public/menu-images` is
 * committed, so the same URLs work locally and on Pages.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = path.join(ROOT, "references/pos-item-imagery");
const OUT = path.join(ROOT, "public/menu-images");

/** Long-edge target. Above any size the kiosk renders, with panel headroom. */
const MAX_EDGE = 800;
const WEBP_QUALITY = 82;

/**
 * Timestamp fragment -> menu item id.
 *
 * Keyed on the distinctive part of the filename rather than the whole thing, so
 * a re-export on a different date still matches.
 */
const SHOTS = {
    "1.24.34": "hot-dog",
    "1.24.54": "cheeseburger",
    "1.25.08": "soft-pretzel",
    "1.25.18": "potato-chips",
    "1.25.35": "snickers",
    "1.26.17": "granola-bar",
    "1.26.32": "fruit-cup",
    "1.26.52": "cookie",
    "1.27.34": "bottle-of-water",
    "1.27.49": "sports-drink",
    "1.28.02": "soda",
    "1.28.23": "coffee",
    "1.28.39": "iced-tea",
    "1.28.59": "energy-drink",
    "1.29.49": "orange-juice",
    "1.30.07": "domestic-beer",
    "1.30.39": "craft-beer",
    "1.31.12": "hard-seltzer",
    "1.31.45": "wine",
    "1.32.08": "cocktail",
    "1.32.25": "bloody-mary",
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(RAW)).filter((file) => file.toLowerCase().endsWith(".png"));
const matched = new Map();

for (const file of files) {
    const key = Object.keys(SHOTS).find((fragment) => file.includes(fragment));
    if (key) matched.set(key, file);
}

let written = 0;
let bytes = 0;

for (const [key, id] of Object.entries(SHOTS)) {
    const file = matched.get(key);
    if (!file) {
        console.log(`  ${id.padEnd(18)} MISSING — no capture matching "${key}"`);
        continue;
    }

    const dest = path.join(OUT, `${id}.webp`);
    await sharp(path.join(RAW, file))
        // Flatten first: several shots are transparent PNGs, and trim needs an
        // opaque ground to measure the margin against.
        .flatten({ background: "#ffffff" })
        .trim({ background: "#ffffff", threshold: 12 })
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(dest);

    const { size } = await stat(dest);
    bytes += size;
    written++;
    console.log(`  ${id.padEnd(18)} ${(size / 1024).toFixed(0)}KB`);
}

console.log(`\n${written} images written to public/menu-images/ (${(bytes / 1024 / 1024).toFixed(1)}MB total)`);

const unused = files.length - matched.size;
if (unused > 0) {
    console.log(`${unused} captures in the raw folder are not mapped — pro-shop shots, or food not yet in the catalogue.`);
}
