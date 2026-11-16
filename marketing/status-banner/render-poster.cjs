// Renders poster.html to four PNGs: two slides x (WhatsApp status 1080x1920, feed 1080x1350).
// Usage: node render-poster.cjs [path/to/playwright]
// Fails loudly if any slide's content overflows, or (status) leaves WhatsApp's safe zone.
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require(process.argv[2] || "playwright");

const SIZES = { status: 1920, feed: 1350 };
const SAFE = { top: 200, bottom: 1740 }; // WhatsApp draws its own UI outside this band

(async () => {
  const browser = await chromium.launch();
  let problems = 0;
  for (const [size, height] of Object.entries(SIZES)) {
    for (const slide of [1, 2]) {
      const page = await browser.newPage({ viewport: { width: 1080, height } });
      const url = pathToFileURL(path.join(__dirname, "poster.html")).href + `?slide=${slide}&size=${size}`;
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      const check = await page.evaluate(() => {
        const s = document.querySelector(".slide.on");
        const broken = [...s.querySelectorAll("img")].filter((i) => !i.naturalWidth).map((i) => i.src);
        const last = [...s.children].filter((c) => !c.classList.contains("grain")).pop().getBoundingClientRect().bottom;
        const safe = [...s.querySelectorAll("[data-safe]")].map((el) => {
          const r = el.getBoundingClientRect();
          return [Math.round(r.top), Math.round(r.bottom)];
        });
        return { overflow: s.scrollHeight - s.clientHeight, last: Math.round(last), broken, safe };
      });
      const issues = [];
      if (check.overflow > 0) issues.push(`content overflows by ${check.overflow}px`);
      if (check.broken.length) issues.push(`broken images: ${check.broken.join(", ")}`);
      if (size === "status" && check.safe.some(([t, b]) => t < SAFE.top || b > SAFE.bottom))
        issues.push(`outside WhatsApp safe zone: ${JSON.stringify(check.safe)}`);
      const out = path.join(__dirname, `veridian-${size}-${slide}.png`);
      try {
        await page.screenshot({ path: out });
      } catch {
        issues.push("could not write the file: close it if it is open in an image viewer, then re-run");
      }
      console.log(issues.length ? "PROBLEM" : "ok     ", path.basename(out), issues.join("; ") || `(last block ends at ${check.last}px of ${height})`);
      problems += issues.length;
      await page.close();
    }
  }
  await browser.close();
  process.exit(problems ? 1 : 0);
})();
