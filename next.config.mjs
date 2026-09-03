import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
