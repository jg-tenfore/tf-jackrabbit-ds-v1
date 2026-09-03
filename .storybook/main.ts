import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@chromatic-com/storybook", "@storybook/addon-a11y", "@storybook/addon-docs"],
    framework: "@storybook/nextjs-vite",
    staticDirs: [
        "../public",
        // Reference exports served at a stable URL so stories can overlay a
        // design against the built component for pixel QA.
        { from: "../references/flows", to: "/reference-flows" },
    ],
    // GitHub Pages serves from a repo subpath; Netlify serves from the domain
    // root (and sets NETLIFY=true during builds). Dev always stays at root.
    viteFinal: async (viteConfig, { configType }) => {
        if (configType === "PRODUCTION" && !process.env.NETLIFY) {
            viteConfig.base = "/tf-jackrabbit-ds-v1/";
        }
        return viteConfig;
    },
};

export default config;
