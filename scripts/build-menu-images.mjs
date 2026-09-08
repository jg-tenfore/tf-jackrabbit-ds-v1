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
    "1.32.25": "bloody-mary",
};

/**
 * Food and drink, from `references/food-imagery`.
 *
 * That folder is a scrape: 500+ files, every product duplicated at two sizes,
 * names that are content hashes, and a good deal of non-product noise — ad
 * creative, delivery-app logos, even dishwasher tablets. So the map is written
 * by eye against a contact sheet and keys on the **filename**, not a position
 * in a listing, because the folder is still being added to.
 *
 * Every entry is checked for a white ground before it is written. The kiosk
 * places these on white cards, so a product shot on grey reads as a broken
 * cut-out rather than a photograph — and it is the kind of thing that is
 * invisible in a contact sheet and obvious on a 750px panel.
 */

/**
 * Cocktails, from `references/cocktails`.
 *
 * Unlike the POS capture these arrived **named**, so the map keys on a word
 * from the filename rather than a timestamp — which also means a re-download
 * with a different stock id still matches. The folder holds two or three shots
 * of several drinks; the key picks one and the rest are ignored.
 */
const FOOD = {
    "bottle-of-water": "c67fc65e9b4e16a553eb7574fba090f1 (29).jpeg",
    "cheeseburger": "c67fc65e9b4e16a553eb7574fba090f1 (13).jpeg",
    "chicken-sandwich": "c67fc65e9b4e16a553eb7574fba090f1 (19).jpeg",
    "chocolate-bar": "large_185cb682-61eb-4723-973f-5ccb6ea617bf (2).webp",
    "french-fries": "c67fc65e9b4e16a553eb7574fba090f1 (8).jpeg",
    "grilled-cheese": "c67fc65e9b4e16a553eb7574fba090f1 (23).jpeg",
    "hot-dog": "c67fc65e9b4e16a553eb7574fba090f1 (12).jpeg",
    "hummus": "large_0ca29ab0-0a9e-4cb0-9df5-40213f7413a4 (2).webp",
    "kettle-chips": "large_0bee71dc-5449-4c44-b2e4-6cea9ed24ac4 (2).webp",
    "lemon-lime-soda": "c67fc65e9b4e16a553eb7574fba090f1 (27).jpeg",
    "milkshake": "c67fc65e9b4e16a553eb7574fba090f1 (3).jpeg",
    "mms": "large_1fe19135-503f-4e5b-814c-75ff5df4efc0 (2).webp",
    "orange-juice": "c67fc65e9b4e16a553eb7574fba090f1 (28).jpeg",
    "peanut-butter-cups": "large_309bbf8d-9b1c-4a09-b5c4-36cb44413539 (2).webp",
    "popcorn": "large_3b013170-077e-486d-9460-294d7fc0765b (2).webp",
    "potato-chips": "large_2fa53bd5-7ba7-4c2c-966b-09d6af2740a2 (2).webp",
    "pretzel-crisps": "large_20bd97c7-3f66-4ef9-91ea-137fe563e59f (2).webp",
    "pulled-pork-sandwich": "c67fc65e9b4e16a553eb7574fba090f1 (10).jpeg",
    "quesadilla": "c67fc65e9b4e16a553eb7574fba090f1 (14).jpeg",
    "snickers": "large_0e15ff38-a081-4deb-be49-b773badaa93c (2).webp",
    "takis": "large_21e102ac-f17b-4096-a876-65452ddd0098 (2).webp",
};

const COCKTAILS = {
    // A Transfusion is vodka, ginger ale and Concord grape over ice with lime,
    // so it needs a red drink in a rocks glass. The closest shots in the folder
    // sit on a soft grey reflection and the white-ground check rejects them;
    // this one has the same serve on a clean ground.
    "cranberry-orange-whiskey-sour": "transfusion",
    "cape-codder": "cape-codder",
    "whiskey-sour-isolated": "whiskey-sour",
    "classic-gin-tonic": "gin-and-tonic",
    "cosmo-drink": "cosmopolitan",
    "frozen-strawberry-daiquiri": "strawberry-daiquiri",
    "glass-aperol-spritz-cocktail-isolated-white-background_123827-21394": "aperol-spritz",
    "glass-vodka-tonic": "vodka-tonic",
    "lemon-drop-martini-cocktail-isolated-white-background_123827-24014": "lemon-drop-martini",
    "moscow-mule-cocktail-served-with-ice-slice-lime": "moscow-mule",
    negroni: "negroni",
    "old-fashioned": "old-fashioned",
    "orange-mimosa-cocktail-isolated-white-background_123827-19959": "mimosa",
    paloma: "paloma",
    "fresh-mango-cocktail-mexican-mango-cocktail": "mango-margarita",
};

/**
 * True when all four corners are within a whisker of white.
 *
 * Corners rather than an average: a dark product on white would fail an
 * average, and a pale product on grey would pass it. The corners are the
 * ground, whatever is in the middle.
 */
const hasWhiteGround = async (file) => {
    const image = sharp(file).flatten({ background: "#ffffff" });
    const { width, height } = await image.metadata();
    const box = Math.max(4, Math.floor(Math.min(width, height) * 0.02));

    for (const [left, top] of [
        [0, 0],
        [width - box, 0],
        [0, height - box],
        [width - box, height - box],
    ]) {
        const { data } = await sharp(file)
            .flatten({ background: "#ffffff" })
            .extract({ left, top, width: box, height: box })
            .raw()
            .toBuffer({ resolveWithObject: true });
        const mean = data.reduce((total, value) => total + value, 0) / data.length;
        if (mean < 245) return false;
    }
    return true;
};

/** Flatten, trim the margin, cap the long edge, write WebP. */
const write = async (src, id) => {
    const dest = path.join(OUT, `${id}.webp`);
    await sharp(src)
        .flatten({ background: "#ffffff" })
        .trim({ background: "#ffffff", threshold: 12 })
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(dest);
    return (await stat(dest)).size;
};

await mkdir(OUT, { recursive: true });

const rejected = [];

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


const foodDir = path.join(ROOT, "references/food-imagery");
for (const [id, file] of Object.entries(FOOD)) {
    const src = path.join(foodDir, file);
    if (!(await hasWhiteGround(src).catch(() => false))) {
        rejected.push(id);
        continue;
    }
    bytes += await write(src, id);
    written++;
    console.log(`  ${id.padEnd(20)} ${(bytes / 1024).toFixed(0)}KB total`);
}

const cocktailDir = path.join(ROOT, "references/cocktails");
const cocktailFiles = await readdir(cocktailDir).catch(() => []);
for (const [key, id] of Object.entries(COCKTAILS)) {
    const file = cocktailFiles.find((name) => name.includes(key));
    if (!file) {
        console.log(`  ${id.padEnd(20)} MISSING — nothing matching "${key}"`);
        continue;
    }
    const src = path.join(cocktailDir, file);
    if (!(await hasWhiteGround(src).catch(() => false))) {
        rejected.push(id);
        continue;
    }
    bytes += await write(src, id);
    written++;
    console.log(`  ${id.padEnd(20)} ok`);
}

console.log(`\n${written} images written to public/menu-images/ (${(bytes / 1024 / 1024).toFixed(1)}MB total)`);

if (rejected.length) {
    console.log(`\nREJECTED — not on a white ground, so not written: ${rejected.join(", ")}`);
}

const unused = files.length - matched.size;
if (unused > 0) {
    console.log(`${unused} captures in the raw folder are not mapped — pro-shop shots, or food not yet in the catalogue.`);
}
