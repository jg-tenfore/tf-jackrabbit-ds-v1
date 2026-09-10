/**
 * Story smoke test — the check that has caught every layout defect this project
 * has shipped a fix for.
 *
 * Typecheck proves a story compiles and `build-storybook` proves it bundles.
 * Neither notices that a screen overflows its canvas, that an image 404s, or
 * that a component throws once mounted — all of which have happened here, and
 * none of which a human notices browsing 445 stories.
 *
 * So this drives a real browser over every User Flows story and fails on:
 *   - a canvas that is not exactly 750x1298
 *   - any horizontal overflow, which a kiosk panel cannot scroll away
 *   - any image that resolved but has no pixels
 *   - any console error or uncaught exception
 *
 *   STORYBOOK_URL=http://localhost:6020 node scripts/smoke-stories.mjs
 *
 * In CI it runs against a built Storybook served statically, so it needs no dev
 * server. Exits non-zero on the first failing story so a PR cannot merge past it.
 */
import { chromium } from "playwright";
const BASE = process.env.STORYBOOK_URL ?? "http://localhost:6020";
const idx = await (await fetch(`${BASE}/index.json`)).json();
const ids = Object.values(idx.entries).filter(e => e.type === "story" && e.title.startsWith("User Flows/")).map(e => e.id);
const b = await chromium.launch();
const bad = [];
for (const id of ids) {
  const p = await b.newPage({ viewport: { width: 900, height: 1400 } });
  const errs = [];
  p.on("console", m => m.type() === "error" && errs.push(m.text()));
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const c = document.querySelector("[data-kiosk-canvas]");
    if (!c) return { noCanvas: true };
    return {
      w: Math.round(c.getBoundingClientRect().width),
      h: Math.round(c.getBoundingClientRect().height),
      hOver: c.scrollWidth - c.clientWidth,
      broken: [...c.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).length,
      text: c.innerText.length,
    };
  });
  const ok = !r.noCanvas && r.w === 750 && r.h === 1298 && r.hOver <= 0 && r.broken === 0 && errs.length === 0;
  if (!ok) bad.push(`${id} ${JSON.stringify(r)} errors=${errs.length} ${errs.slice(0,1)}`);
  await p.close();
}
console.log(`swept ${ids.length} flow stories`);
await b.close();

if (bad.length) {
    console.error("ISSUES:\n  " + bad.join("\n  "));
    process.exit(1);
}
console.log("ALL CLEAN — 750x1298, no overflow, no broken images, no console errors");
