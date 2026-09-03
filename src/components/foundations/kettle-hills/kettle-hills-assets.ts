/**
 * Kettle Hills Golf Course brand imagery, auto-indexed from `images/kettleHills/`.
 * Mirrors the Sagamore module: drop an image into that folder and it appears
 * here automatically, served via the `kettle-hills-images` staticDirs mapping.
 *
 * Course: https://kettlehills.com/ · https://maps.app.goo.gl/vo74MPfZGDgksoeC8
 */
import { buildCourseAssets, imagesByCategory, pickLogo, type CourseAsset, type CourseAssetCategory } from "../course-images";

/** Public base path — must match the `staticDirs` mapping in .storybook/main.ts. */
const KETTLE_HILLS_BASE = "kettle-hills-images";

// Lazy glob: we only read the matched file paths (keys), never import the assets.
const modules = (import.meta as unknown as { glob: (pattern: string) => Record<string, unknown> }).glob(
    "../../../../images/kettleHills/*.{jpg,jpeg,png,webp,avif}",
);

/** Every indexed Kettle Hills image, sorted by file name. */
export const kettleHillsAssets: CourseAsset[] = buildCourseAssets(modules, KETTLE_HILLS_BASE);

/** Images for a category (photography returns the high-res shots). */
export const kettleHillsImagesByCategory = (category: CourseAssetCategory): CourseAsset[] =>
    imagesByCategory(kettleHillsAssets, category);

/** The course logo URL (empty string if not present in the folder). */
export const kettleHillsLogo: string = pickLogo(kettleHillsAssets);
