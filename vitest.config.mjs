import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Unit tests for the logic that has behaviour worth pinning down.
 *
 * Deliberately not testing rendered markup. Layout is verified visually by
 * `npm run shoot`, which catches the things that actually break here — a price
 * colliding with a meta line, a label wrapping and breaking a fixed row height.
 * A snapshot assertion on class strings would pass through every one of those
 * while making refactors expensive, so it would cost more than it caught.
 *
 * What is tested is the arithmetic and parsing: touch-target maths, phone
 * formatting, email domain completion, keyboard layout geometry, asset URL
 * resolution. These have real edge cases and no visual signal when they break.
 */
export default defineConfig({
    plugins: [react()],
    // Native tsconfig path resolution, so the `@/` alias works without a plugin.
    resolve: { tsconfigPaths: true },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
