/**
 * Prepares exported screen assets for use in components.
 *
 * Right now that means one job: knocking the baked-in green background out of
 * the wallet illustrations.
 *
 * The exports carry a solid rgb(7,148,85) ground, which does not match the
 * design-system token `--color-bg-brand-solid` (rgb(50,131,85)) — so dropping
 * them onto the drawer shows a visible rectangle. Recolouring the drawer to
 * match the asset would fix that one case and break another: the drawer turns
 * **red** when a scan fails, and a green-boxed illustration on a red card looks
 * broken rather than themed.
 *
 * So the background comes out and the token stays authoritative.
 *
 *   node scripts/build-screen-assets.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "public/screen-assets/global-nav");

/** The ground colour baked into the exports. */
const GROUND = [7, 148, 85];
/** Per-channel tolerance, to catch anti-aliased edge pixels of the same hue. */
const TOLERANCE = 26;

const TARGETS = ["wallet-small.png", "wallet-large.png"];

for (const file of TARGETS) {
    const src = path.join(DIR, file);
    const { data, info } = await sharp(await readFile(src)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    let cleared = 0;
    for (let i = 0; i < data.length; i += 4) {
        const near =
            Math.abs(data[i] - GROUND[0]) <= TOLERANCE &&
            Math.abs(data[i + 1] - GROUND[1]) <= TOLERANCE &&
            Math.abs(data[i + 2] - GROUND[2]) <= TOLERANCE;
        if (near) {
            data[i + 3] = 0;
            cleared++;
        }
    }

    const out = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
    await writeFile(src, out);

    const pct = ((cleared / (info.width * info.height)) * 100).toFixed(0);
    console.log(`  ${file}: cleared ${pct}% of pixels to transparent`);
}

console.log("\nWallet illustrations are now background-free and take the colour of whatever card they sit on.");
