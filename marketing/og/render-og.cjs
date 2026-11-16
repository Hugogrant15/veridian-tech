// Renders og.html to public/og.png (1200x630), the image link previews show.
// Usage: node render-og.cjs [path/to/playwright]
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require(process.argv[2] || "playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(pathToFileURL(path.join(__dirname, "og.html")).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.querySelector(".left").scrollHeight - 630);
  const out = path.join(__dirname, "..", "..", "public", "og.png");
  await page.screenshot({ path: out });
  await browser.close();
  console.log(overflow > 0 ? `PROBLEM content overflows by ${overflow}px` : "ok", out);
  process.exit(overflow > 0 ? 1 : 0);
})();
