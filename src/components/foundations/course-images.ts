/**
 * Shared factory for golf-course brand imagery. Each course (Sagamore, Kettle
 * Hills, FloGolf Lounge) keeps a thin module that calls Vite's `import.meta.glob`
 * with its own literal folder pattern, then hands the matched paths here to be
 * indexed identically.
 *
 * The glob is only used to DISCOVER file names; each image is served via the
 * Storybook `staticDirs` mapping (a stable absolute URL that works in dev,
 * static builds, and the sandboxed preview iframe) — never bundled.
 */

export type CourseAssetCategory = "logo" | "dining" | "photography";

export interface CourseAsset {
    /** File name including extension, e.g. "kettle-homegolf-scaled-1.webp". */
    name: string;
    /** Resolved URL — drop straight into an <img src> or CSS background. */
    src: string;
    /** Loose grouping derived from the file name. */
    category: CourseAssetCategory;
    /** True for ≥1024px-wide source images (use these for heroes, cards, galleries). */
    isHighRes: boolean;
}

/** The shape returned by `import.meta.glob`. */
export type GlobModules = Record<string, unknown>;

const categorize = (name: string): CourseAssetCategory => {
    const n = name.toLowerCase();
    if (n.includes("logo")) return "logo";
    if (n.startsWith("dish")) return "dining";
    return "photography";
};

/** Heuristic high-res flag: a ≥1024px dimension in the name, or a "scaled" source. */
const detectHighRes = (name: string): boolean => {
    const match = name.match(/(\d{3,4})x(\d{3,4})/);
    if (match && Number(match[1]) >= 1024) return true;
    return /scaled/i.test(name);
};

/** Index a glob result into sorted course assets served from `base` (the staticDirs path). */
export const buildCourseAssets = (modules: GlobModules, base: string): CourseAsset[] =>
    Object.keys(modules)
        .map((path) => {
            const name = path.split("/").pop() ?? path;
            return { name, src: `${base}/${name}`, category: categorize(name), isHighRes: detectHighRes(name) };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Images for a category. Photography prefers the high-resolution shots (never the
 * compressed thumbnails); if a course has no high-res photo it falls back to all
 * of its photography so small libraries still render.
 */
export const imagesByCategory = (assets: CourseAsset[], category: CourseAssetCategory): CourseAsset[] => {
    if (category !== "photography") return assets.filter((asset) => asset.category === category);
    const photos = assets.filter((asset) => asset.category === "photography");
    const highRes = photos.filter((asset) => asset.isHighRes);
    return highRes.length ? highRes : photos;
};

/** The course logo URL (empty string if none present in the folder). */
export const pickLogo = (assets: CourseAsset[]): string => assets.find((asset) => asset.category === "logo")?.src ?? "";
