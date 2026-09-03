/**
 * Sagamore brand imagery, auto-indexed from `images/sagamore/`. Any image
 * dropped into that folder is picked up here automatically (no manual wiring),
 * so the assets stay available across Storybook and future app screens.
 *
 * We use Vite's `import.meta.glob` only to DISCOVER the file names, then serve
 * each via Storybook's `staticDirs` mapping (`/sagamore-images/...`). That
 * stable absolute URL works in dev and static builds and inside Storybook's
 * sandboxed preview iframe — unlike bundled `import.meta.url` asset URLs.
 */

/**
 * Public base path — must match the `staticDirs` mapping in .storybook/main.ts.
 * Relative (no leading slash) so it resolves correctly whether Storybook is
 * served from the domain root (dev / local static) or a repo subpath (GitHub
 * Pages, e.g. /tf-fox-ds-v1/). The Storybook preview iframe resolves it against
 * its own URL, which already carries the right base.
 */
const SAGAMORE_BASE = "sagamore-images";

export type SagamoreAssetCategory = "logo" | "dining" | "photography";

export interface SagamoreAsset {
    /** File name including extension, e.g. "Golf-Day-scaled.jpg". */
    name: string;
    /** Resolved URL — drop straight into an <img src> or CSS background. */
    src: string;
    /** Loose grouping derived from the file name. */
    category: SagamoreAssetCategory;
    /** True for ≥1024px-wide source images (use these for heroes, cards, galleries). */
    isHighRes: boolean;
}

/** Photography that is genuinely high-resolution (≥1024px wide) — never the compressed thumbnails. */
const HIGH_RES_PHOTOS = new Set([
    "5_14_23_LRO_Lynnfield_Magazine_Sagamore_Golf_Course_17-1-scaled.jpg",
    "Golf-Day-scaled.jpg",
    "Sagamore_ninth_2-1024x652.jpg",
    "images_SGI-INC_header-slideshow_home-slide-spring-27.webp",
    "images_Sagamore-SPRING_Header-Slider-Images_spring-22.webp",
]);

// File names in `images/sagamore/` (served at `/sagamore-images/…` by both
// Storybook's staticDirs and the Next app's public/ symlink). Kept as a static
// list — not a Vite `import.meta.glob` — so this module works in Storybook
// (Vite) and the standalone Next.js app (Turbopack) alike. Add a new image to
// the folder and to this list to surface it.
const SAGAMORE_FILES = [
    "348s.jpg",
    "42752.jpg",
    "5_14_23_LRO_Lynnfield_Magazine_Sagamore_Golf_Course_17-1-scaled.jpg",
    "Golf-Day-scaled.jpg",
    "SAGAMORE-SPRING-19.jpg",
    "Sagamore_ninth_2-1024x652.jpg",
    "dish-burger.avif",
    "dish-oysters.jpg",
    "dish-steak.avif",
    "download.webp",
    "golf-club-dining-room.webp",
    "images_SGI-INC_header-slideshow_home-slide-spring-27.webp",
    "images_Sagamore-Hampton_images_sagamore-hampton-photo-gallery_SAGAMORE-HAMPTON_-78.webp",
    "images_Sagamore-SPRING_Header-Slider-Images_spring-22.webp",
    "images_Sagamore-SPRING_images_photo-gallery-sagamore-SPRING_SAGAMORE_SPRING-22.webp",
    "sagamore-logo.jpeg",
];

const categorize = (name: string): SagamoreAssetCategory => {
    const n = name.toLowerCase();
    if (n.includes("logo")) return "logo";
    if (n.startsWith("dish")) return "dining";
    return "photography";
};

/** Every indexed Sagamore image, sorted by file name. */
export const sagamoreAssets: SagamoreAsset[] = SAGAMORE_FILES
    .map((name) => ({ name, src: `${SAGAMORE_BASE}/${name}`, category: categorize(name), isHighRes: HIGH_RES_PHOTOS.has(name) }))
    .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Images for a category. Photography returns ONLY the high-resolution shots
 * (never the compressed thumbnails), so heroes / cards / galleries stay crisp.
 */
export const sagamoreImagesByCategory = (category: SagamoreAssetCategory): SagamoreAsset[] =>
    sagamoreAssets.filter((asset) => asset.category === category && (category !== "photography" || asset.isHighRes));

/** The golf course logo URL (empty string if not present in the folder). */
export const sagamoreLogo: string = sagamoreImagesByCategory("logo")[0]?.src ?? "";
