import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
// The prototype ships as a static export to GitHub Pages, served from
// /tf-jackrabbit-ds-v1/prototype/ alongside Storybook at the root. PROTOTYPE_BASE
// is set by the deploy workflow; local `next dev` leaves it unset and serves
// from / so nothing has to be prefixed by hand while developing.
const base = process.env.PROTOTYPE_BASE ?? "";

const nextConfig = {
    output: "export",
    basePath: base,
    // Trailing slashes so Pages resolves /prototype/ to its index.html without
    // a redirect it cannot perform.
    trailingSlash: true,
    images: { unoptimized: true },
    // Pin the workspace root to THIS project. Without it, Next detects the
    // stray ~/package-lock.json and infers the home dir as the root, which can
    // mislocate public/ and node_modules.
    turbopack: {
        root: fileURLToPath(new URL(".", import.meta.url)),
    },
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
};

export default nextConfig;
