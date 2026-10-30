/**
 * Prepares per-course branding assets for the Golf Courses stories.
 *
 * Source of truth is the folder each course's marketing team handed over under
 * `references/102926/`. Those are camera originals and web downloads — a 6000px
 * Getty frame next to a 192px favicon — so unlike `build-screen-assets.mjs` this
 * does not copy. Every photo is cropped to the exact box it fills on the kiosk,
 * at 2x, and re-encoded, so a 4.8MB original becomes a few hundred KB and the
 * crop is chosen here, once, instead of by `object-position` guesses per screen.
 *
 * It never upscales. If a source is too small to give 2x of its box, the crop
 * comes out at whatever the source supports and the audit below says so —
 * enlarging would only make the softness official.
 *
 *   node scripts/build-course-assets.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "references/102926");
const OUT = path.join(ROOT, "public/screen-assets/courses");

/**
 * The boxes a course photo can fill, in CSS px. The asset is written at 2x.
 *
 * hero    — the attract screen's photo band (WINDOW_HERO_HEIGHT).
 * standby — the standby board's photo band behind the heading.
 * card    — a ChoiceCard photo; the `lg` hub card is the larger of the two.
 */
const BOX = {
    hero: { width: 750, height: 898 },
    standby: { width: 750, height: 420 },
    card: { width: 254, height: 140 },
};

/**
 * from   — path under references/102926/
 * to     — path under public/screen-assets/courses/
 * box    — which BOX the photo is cropped for
 * focus  — [x, y] in 0..1: the point of the source the crop keeps centred
 * zoom   — optional, 0..1: crop a smaller region than the largest that fits,
 *          for when the whole frame holds something the box should not show
 *
 * Logos take `logo` instead of `box`: `copy` for a vector used as drawn,
 * `white` for the single-colour version that sits on photography.
 */
const ASSETS = [
    // Montgomery County Golf. A vector lettermark, so it is copied as drawn for
    // light screens and recoloured to white for the photo bands — its green and
    // violet both sink into a dimmed fairway.
    { from: "MCG - Montgomery County Golf/MCG_Everything_Golf_Vector.svg", to: "mcg/logo.svg", logo: "copy" },
    { from: "MCG - Montgomery County Golf/MCG_Everything_Golf_Vector.svg", to: "mcg/logo-on-dark.svg", logo: "white" },
    // Hampshire Greens: the sun sits high in the frame, under the gradient, and
    // the green and cart path carry the middle where the cards do not.
    { from: "MCG - Montgomery County Golf/Hampshire-Greens-pic-scaled.jpg", to: "mcg/hero.jpg", box: "hero", focus: [0.42, 0.5] },
    // Little Bennett is mostly sky, which is what a band behind white type wants.
    { from: "MCG - Montgomery County Golf/Little-Bennett-pic-scaled.jpg", to: "mcg/standby.jpg", box: "standby", focus: [0.5, 0.55] },
    { from: "MCG - Montgomery County Golf/JoshuaFernandez.com20250820090648-scaled.jpg", to: "mcg/card-first-time.jpg", box: "card", focus: [0.5, 0.42] },
    { from: "MCG - Montgomery County Golf/JoshuaFernandez.com20250919145107-scaled.jpg", to: "mcg/card-check-in.jpg", box: "card", focus: [0.6, 0.72] },
    { from: "MCG - Montgomery County Golf/NW18Green.jpg", to: "mcg/card-tee-time.jpg", box: "card", focus: [0.7, 0.6] },

    // Memorial Park. The seal is a 192px raster — the only logo supplied — and
    // already a circle on transparency, so it works on light and dark grounds
    // alike. It is the one asset here that cannot be fixed in this script; see
    // the audit.
    {
        from: "Houston - Memorial Park Golf Course/a926d7_246f392db848420bb9efa7a620834863~mv2.png",
        to: "memorial-park/logo.png",
        logo: "copy",
        renderWidth: 112,
    },
    { from: "Houston - Memorial Park Golf Course/GettyImages-1229358769.jpg", to: "memorial-park/hero.jpg", box: "hero", focus: [0.62, 0.5] },
    // The sky and tree line out of the Getty frame. The skyline shot was the
    // obvious pick for Houston, but it was taken during the tournament week: at
    // this band's aspect it cannot be cropped clear of the grandstands and
    // sponsor tents, which would read as an ad behind the waitlist.
    { from: "Houston - Memorial Park Golf Course/GettyImages-1229358769.jpg", to: "memorial-park/standby.jpg", box: "standby", focus: [0.45, 0.32], zoom: 0.5 },
    { from: "Houston - Memorial Park Golf Course/images.jpeg", to: "memorial-park/card-check-in.jpg", box: "card", focus: [0.55, 0.6] },
    // The island green alone, zoomed in past the same tents.
    { from: "Houston - Memorial Park Golf Course/memorial-park-scenic-kp-sder.avif", to: "memorial-park/card-tee-time.jpg", box: "card", focus: [0.72, 0.64], zoom: 0.5 },
];

/** Every fill in the MCG mark goes to white; the drawing has no other colours. */
const toWhite = (svg) => svg.replace(/fill="#[0-9a-f]{3,6}"/gi, 'fill="#FFFFFF"');

/**
 * Crop the largest region of the box's aspect around `focus`, then scale it
 * down to 2x the box — or leave it at native size if it is already smaller.
 */
const cropToBox = async (src, dest, box, [fx, fy], zoom = 1) => {
    const { width: sw, height: sh } = await sharp(src).metadata();
    const aspect = box.width / box.height;

    let cw = sw;
    let ch = Math.round(sw / aspect);
    if (ch > sh) {
        ch = sh;
        cw = Math.round(sh * aspect);
    }
    cw = Math.round(cw * zoom);
    ch = Math.round(ch * zoom);

    const left = Math.round(Math.min(Math.max(fx * sw - cw / 2, 0), sw - cw));
    const top = Math.round(Math.min(Math.max(fy * sh - ch / 2, 0), sh - ch));
    const targetWidth = Math.min(cw, box.width * 2);

    await sharp(src).extract({ left, top, width: cw, height: ch }).resize({ width: targetWidth }).jpeg({ quality: 84, mozjpeg: true }).toFile(dest);

    return { width: targetWidth, renderWidth: box.width };
};

const audit = [];

for (const asset of ASSETS) {
    const src = path.join(SRC, asset.from);
    const dest = path.join(OUT, asset.to);
    await mkdir(path.dirname(dest), { recursive: true });

    if (asset.logo === "white") {
        await writeFile(dest, toWhite(await readFile(src, "utf8")));
        console.log(`  ${asset.to}  (recoloured white)`);
        continue;
    }

    if (asset.logo === "copy") {
        await writeFile(dest, await readFile(src));
        console.log(`  ${asset.to}`);
        if (asset.renderWidth) {
            const { width } = await sharp(dest).metadata();
            if (width / asset.renderWidth < 2) audit.push({ asset: asset.to, width, renderWidth: asset.renderWidth, isLogo: true });
        }
        continue;
    }

    const { width, renderWidth } = await cropToBox(src, dest, BOX[asset.box], asset.focus, asset.zoom);
    console.log(`  ${asset.to}  (${asset.box}, ${width}px wide)`);
    if (width / renderWidth < 2) audit.push({ asset: asset.to, width, renderWidth });
}

console.log(`\n${ASSETS.length} assets written to public/screen-assets/courses/`);

if (audit.length) {
    console.log("\nUNDER 2x — these will look soft on a HiDPI panel. Ask the course for:");
    for (const a of audit) {
        const density = (a.width / a.renderWidth).toFixed(2);
        console.log(
            `  ${a.asset.padEnd(34)} ${String(a.width).padStart(4)}px for a ${a.renderWidth}px render (${density}x) -> need ${a.renderWidth * 2}px${a.isLogo ? ", or a vector" : ""}`,
        );
    }
}
