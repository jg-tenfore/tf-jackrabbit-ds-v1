/**
 * Copies exported screen assets into `public/screen-assets/` and prepares them
 * for use in components.
 *
 * Source of truth is `references/build/<screen>/`. This script copies from
 * there rather than mutating files in place, so it is idempotent and can be
 * re-run whenever an export is replaced.
 *
 * The one transform it applies: the wallet illustrations ship with a solid
 * #079455 background rect. That does not match the design-system token
 * `--color-bg-brand-solid`, so dropping them onto the drawer shows a visible
 * rectangle. Recolouring the drawer to match the asset would fix that one case
 * and break another — the drawer turns **red** when a scan fails, and a
 * green-boxed illustration on a red card looks broken rather than themed.
 *
 * So the ground comes out and the token stays authoritative. The remaining art
 * is white line work, which then takes the colour of whatever card it sits on.
 *
 *   node scripts/build-screen-assets.mjs
 */
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");

/** The solid ground baked into the wallet exports. */
const GROUND = "#079455";

/**
 * from  — path under references/build/
 * to    — path under public/screen-assets/
 * strip — remove a full-bleed background rect of GROUND
 */
const ASSETS = [
    // Global nav
    { from: "globalNav/wallet-normal.svg", to: "global-nav/wallet-small.svg", strip: true },
    { from: "globalNav/waller-big.svg", to: "global-nav/wallet-large.svg", strip: true },
    { from: "globalNav/golfbag.svg", to: "global-nav/golf-bag.svg" },
    { from: "globalNav/reference-loggedout.png", to: "global-nav/reference-logged-out.png" },
    { from: "globalNav/reference-cart-loggedin.png", to: "global-nav/reference-logged-in.png" },

    // How to log in
    // The exported step layout, used whole rather than rebuilt from parts.
    // Exported with a 2px black artboard border on every edge, which would
    // otherwise draw a hairline box across the middle of the screen.
    { from: "how-to-login/howtologin-screen .png", to: "how-to-login/steps.png", cropBorder: 2 },
    { from: "how-to-login/hero-logo.svg", to: "how-to-login/hero-logo.svg" },
    { from: "how-to-login/hero-logo.png", to: "how-to-login/hero-logo.png" },
    { from: "how-to-login/01.png", to: "how-to-login/step-1-badge.png" },
    { from: "how-to-login/02.png", to: "how-to-login/step-2-badge.png" },
    { from: "how-to-login/03.png", to: "how-to-login/step-3-badge.png" },
    { from: "how-to-login/01-image.png", to: "how-to-login/step-1-image.png" },
    { from: "how-to-login/02-image.png", to: "how-to-login/step-2-image.png" },
    { from: "how-to-login/03-image.png", to: "how-to-login/step-3-image.png" },
    { from: "how-to-login/app store.png", to: "how-to-login/app-store-badges.png" },
    { from: "how-to-login/reference.png", to: "how-to-login/reference.png" },
];

/**
 * Drops the first full-bleed background rect matching the ground colour.
 *
 * Matched by *shape and colour together* — a rect spanning the full viewBox and
 * filled with GROUND — so a same-coloured detail elsewhere in the artwork is
 * left alone.
 */
const stripGround = (svg) => {
    const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    if (!viewBox) return { svg, removed: false };
    const [, w, h] = viewBox;

    const pattern = new RegExp(`<rect\\s+width="${w}"\\s+height="${h}"\\s+fill="${GROUND}"\\s*/>\\s*`, "i");
    if (!pattern.test(svg)) return { svg, removed: false };

    return { svg: svg.replace(pattern, ""), removed: true };
};

for (const asset of ASSETS) {
    const src = path.join(ROOT, "references/build", asset.from);
    const dest = path.join(ROOT, "public/screen-assets", asset.to);
    await mkdir(path.dirname(dest), { recursive: true });

    if (asset.cropBorder) {
        const n = asset.cropBorder;
        const { width, height } = await sharp(src).metadata();
        await sharp(src)
            .extract({ left: n, top: n, width: width - n * 2, height: height - n * 2 })
            .toFile(dest);
        console.log(`  ${asset.to}  (cropped ${n}px artboard border)`);
    } else if (asset.strip) {
        const { svg, removed } = stripGround(await readFile(src, "utf8"));
        await writeFile(dest, svg);
        console.log(`  ${asset.to}${removed ? "  (ground removed)" : "  (no ground rect found — check the export)"}`);
    } else {
        await copyFile(src, dest);
        console.log(`  ${asset.to}`);
    }
}

console.log(`\n${ASSETS.length} assets written to public/screen-assets/`);
