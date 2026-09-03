/**
 * FloGolf Lounge brand imagery, auto-indexed from `images/flogolf/`. Mirrors the
 * Sagamore module: drop an image into that folder and it appears here
 * automatically, served via the `flogolf-images` staticDirs mapping.
 *
 * Venue: https://maps.app.goo.gl/XMFfrrW3ut8vtJzT9
 */
import { buildCourseAssets, imagesByCategory, pickLogo, type CourseAsset, type CourseAssetCategory } from "../course-images";

/** Public base path — must match the `staticDirs` mapping in .storybook/main.ts. */
const FLOGOLF_BASE = "flogolf-images";

// Lazy glob: we only read the matched file paths (keys), never import the assets.
const modules = (import.meta as unknown as { glob: (pattern: string) => Record<string, unknown> }).glob(
    "../../../../images/flogolf/*.{jpg,jpeg,png,webp,avif}",
);

/** Every indexed FloGolf Lounge image, sorted by file name. */
export const flogolfAssets: CourseAsset[] = buildCourseAssets(modules, FLOGOLF_BASE);

/** Images for a category (photography returns the high-res shots). */
export const flogolfImagesByCategory = (category: CourseAssetCategory): CourseAsset[] =>
    imagesByCategory(flogolfAssets, category);

/** The venue logo URL (empty string if not present in the folder). */
export const flogolfLogo: string = pickLogo(flogolfAssets);
