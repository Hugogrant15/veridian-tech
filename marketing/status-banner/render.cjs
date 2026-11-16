// Renders services-status.html in both sizes:
//   veridian-services-status.png (1080x1920, WhatsApp status)
//   veridian-services-feed.png   (1080x1350, Instagram / Facebook / LinkedIn feed)
// Usage: node render.cjs [path/to/playwright]
// Fails if any content runs past the bottom, or (status) the WhatsApp bar leaves the safe zone.
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require(process.argv[2] || "playwright");

const SIZES = [
  { size: "status", height: 1920, out: "veridian-services-status.png" },
  { size: "feed", height: 1350, out: "veridian-services-feed.png" },
];

(async () => {
  const browser = await chromium.launch();
  let problems = 0;
  for (const { size, height, out } of SIZES) {
    const page = await browser.newPage({ viewport: { width: 1080, height } });
    await page.goto(pathToFileURL(path.join(__dirname, "services-status.html")).href + `?size=${size}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const box = (sel) => document.querySelector(sel).getBoundingClientRect();
      return { foot: Math.round(box(".foot").bottom), cta: [Math.round(box(".cta").top), Math.round(box(".cta").bottom)] };
    });
    const issues = [];
    if (r.foot > height - 20) issues.push(`footer runs off the bottom (ends at ${r.foot}px)`);
    if (size === "status" && r.cta[1] > 1740) issues.push(`WhatsApp bar outside safe zone (${r.cta})`);
    try {
      await page.screenshot({ path: path.join(__dirname, out) });
    } catch {
      issues.push("could not write the file: close it if it is open in an image viewer, then re-run");
    }
    console.log(issues.length ? "PROBLEM" : "ok     ", out, issues.join("; ") || `(footer ends at ${r.foot}px of ${height})`);
    problems += issues.length;
    await page.close();
  }
  await browser.close();
  process.exit(problems ? 1 : 0);
})();
