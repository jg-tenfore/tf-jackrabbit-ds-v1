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
 */
export const assetUrl = (relativePath: string): string => {
    const clean = relativePath.replace(/^\/+/, "");

    // Guard for non-Vite contexts (a Next route, a node script, a test) where
    // import.meta.env is undefined — fall back to a root-relative URL.
    const base =
        typeof import.meta !== "undefined" && (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL
            ? (import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL
            : "/";

    return `${base.replace(/\/+$/, "")}/${clean}`;
};
