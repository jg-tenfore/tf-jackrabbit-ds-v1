import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Lint config.
 *
 * Deliberately narrow. Most of `src/components/base`, `foundations` and
 * `shared-assets` is the Untitled UI library ported verbatim from Buck — it is
 * upstream code we do not author, so linting it would produce a wall of
 * findings nobody will action and would drown the ones that matter. Those paths
 * are ignored; everything written for this kiosk is linted.
 *
 * Rules are correctness-focused rather than stylistic. Prettier already owns
 * formatting, so there is nothing here about quotes, semicolons or spacing.
 */
export default tseslint.config(
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            // `next build` static export, and the combined Pages upload built
            // from it — generated, and gitignored for the same reason.
            "out/**",
            "site/**",
            "storybook-static/**",
            "screenshots/**",
            "public/**",
            "references/**",
            // Ported upstream library — not ours to lint.
            "src/components/base/**",
            "src/components/foundations/**",
            "src/components/shared-assets/**",
            "src/components/application/**",
            "src/components/marketing/**",
            "src/components/booking/**",
            "src/utils/countries.tsx",
            "src/utils/timezones.tsx",
            // Generated.
            "src/data/pro-shop-catalog.ts",
        ],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { "react-hooks": reactHooks },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // Unused vars are a real signal, but an `_`-prefixed one is an
            // explicit "I know, it is part of the signature".
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            // `any` is worth flagging but not worth failing a build over while
            // the library is still moving.
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },

    // Node scripts: no browser globals, and console output is the point.
    {
        files: ["scripts/**/*.mjs", "*.config.{mjs,ts}", ".storybook/**/*.{ts,tsx}"],
        // Browser globals too: the Playwright scripts pass functions to
        // `page.evaluate`, whose bodies are serialised and run in the page.
        // They read as Node code and execute as browser code.
        languageOptions: { globals: { ...globals.node, ...globals.browser } },
        rules: { "no-console": "off" },
    },

    ...storybook.configs["flat/recommended"],
);
