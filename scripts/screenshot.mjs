/**
 * Visual QA harness.
 *
 * Storybook building and `tsc` passing prove a component compiles, not that it
 * looks right. This script drives a real browser over the kiosk stories and
 * writes PNGs, so layout defects that type-checking cannot see — a price
 * colliding with a meta line, a step label wrapping and breaking a fixed row
 * height, a day strip clipped behind its own expand control — are caught before
 * anything gets built on top of them.
 *
 * Requires the dev server: `npm run storybook` (port 6020).
 *
 *   node scripts/screenshot.mjs [outDir] [--all]
 *
 * By default it shoots the curated list below. `--all` shoots every story under
 * "Kiosk Core", which is slower but catches regressions in surfaces the curated
 * list has stopped covering.
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.STORYBOOK_URL ?? "http://localhost:6020";
const outDir = process.argv[2]?.startsWith("--") ? "screenshots" : (process.argv[2] ?? "screenshots");
const shootAll = process.argv.includes("--all");

/** The surfaces whose geometry is easiest to get wrong and costliest to miss. */
const CURATED = [
    ["kiosk-core-booking-tee-time--book-a-time", "tee-time"],
    ["kiosk-core-booking-activity--simulator-start-time", "sim-start-time"],
    ["kiosk-core-booking-activity--simulator-bay-location", "sim-bay"],
    ["kiosk-core-booking-date-picker--week-strip", "date-week"],
    ["kiosk-core-booking-date-picker--month-grid", "date-month"],
    ["kiosk-core-keyboard-keyboard-field--email", "keyboard-email"],
    ["kiosk-core-modals--rate-picker", "modal-rate"],
    ["kiosk-core-modals--checkout-method", "modal-checkout"],
    ["kiosk-core-authentication-scan-prompt--default", "scan-prompt"],
];

const targets = shootAll
    ? Object.values(await (await fetch(`${BASE}/index.json`)).json().then((j) => j.entries))
          .filter((e) => e.type === "story" && e.title.startsWith("Kiosk Core"))
          .map((e) => [e.id, e.id])
    : CURATED;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

for (const [id, name] of targets) {
    await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, { waitUntil: "networkidle" });
    // Let fonts and any entrance animation settle, or the shot catches a
    // mid-transition frame and every diff looks like a regression.
    await page.waitForTimeout(900);
    // Prefer the kiosk canvas so shots are exactly 750x1298 and directly
    // comparable to the design exports in references/flows.
    const frame = await page.$("[data-kiosk-frame]");
    await (frame ?? page).screenshot({ path: `${outDir}/${name}.png` });
    console.log(`  ${name}${frame ? "" : "  (no kiosk frame — full page)"}`);
}

await browser.close();

if (errors.length) {
    console.log("\nRUNTIME ERRORS:");
    [...new Set(errors)].slice(0, 20).forEach((e) => console.log("  " + e.slice(0, 300)));
    process.exitCode = 1;
} else {
    console.log("\nno runtime errors");
}
