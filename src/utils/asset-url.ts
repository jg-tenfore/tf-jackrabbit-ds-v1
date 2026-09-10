/**
 * Resolves a repo-relative asset path against the deploy base.
 *
 * This exists because the same build is served from two different roots:
 * GitHub Pages serves this project from `/tf-jackrabbit-ds-v1/`, while the dev
 * server and Netlify serve from `/`. A hard-coded `/pos-images/foo.webp` works
 * locally and 404s on Pages — a class of bug that only shows up after deploy,
 * which is the worst time to find it.
 *
 * So catalog data stores paths *without* a leading slash
 * (`pos-images/pro-shop/x.webp`) and every consumer runs them through here.
 *
 * Vite injects `import.meta.env.BASE_URL`, which is `/` in dev and
 * `/tf-jackrabbit-ds-v1/` in the Pages production build — see the `base` set in
 * `.storybook/main.ts`.
 *
 * Next has no such variable, so the prototype passes its own base through
 * `NEXT_PUBLIC_ASSET_BASE` (set from `basePath` in `next.config.mjs`). Without
 * it this fell back to `/` and every image in the deployed prototype resolved
 * against the domain root — exactly the after-deploy failure described above,
 * reintroduced by the fallback meant to be harmless.
 *
 * Vite is checked first because Storybook is the only context where both could
 * be defined, and there the Vite value is the correct one.
 */
export const assetUrl = (relativePath: string): string => {
    const clean = relativePath.replace(/^\/+/, "");

    const viteBase = typeof import.meta !== "undefined" ? (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL : undefined;

    // Next inlines this at build time. Empty string is a legitimate value (a
    // site served from the root), so only `undefined` falls through.
    const nextBase = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_ASSET_BASE : undefined;

    const base = viteBase ?? nextBase ?? "/";

    return `${base.replace(/\/+$/, "")}/${clean}`;
};
