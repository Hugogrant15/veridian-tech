/**
 * Tells Bing (and through it ChatGPT search, Yandex and others) which pages
 * changed in this deploy, using the IndexNow protocol. Google does not take
 * part in IndexNow; it finds changes through the sitemap.
 *
 * Runs in GitHub Actions on every push to `main` (.github/workflows/ci-cd.yml):
 *   node scripts/indexnow.mjs <previous-manifest.json>
 * The argument is the live site's content-manifest.json saved BEFORE the new
 * deploy landed. It is compared with the fresh build in dist/; a missing or
 * unreadable file means every page counts as changed.
 *
 * The key in src/config/site.json is public by design: public/<key>.txt proves
 * to search engines that the pings come from the site's owner.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(await readFile(join(ROOT, "src", "config", "site.json"), "utf8"));
const origin = `https://${site.domain}`;
const next = JSON.parse(await readFile(join(ROOT, "dist", "content-manifest.json"), "utf8")).pages;

let previous = {};
try {
  previous = JSON.parse(await readFile(process.argv[2], "utf8")).pages ?? {};
} catch {
  console.log("No previous manifest: treating every page as changed.");
}

const changed = Object.keys(next).filter((path) => next[path] !== previous[path]);
if (changed.length === 0) {
  console.log("No page content changed. Nothing to submit.");
  process.exit(0);
}

// Wait for Cloudflare to finish deploying, so search engines fetch the new pages, not the old ones.
const DEADLINE = Date.now() + 10 * 60 * 1000;
const same = (live) => changed.every((path) => live?.[path] === next[path]);
let deployed = false;
while (!deployed && Date.now() < DEADLINE) {
  try {
    const res = await fetch(`${origin}/content-manifest.json`, { cache: "no-store" });
    deployed = res.ok && same((await res.json()).pages);
  } catch {
    // Network blip: try again.
  }
  if (!deployed) await new Promise((r) => setTimeout(r, 20_000));
}
if (!deployed) console.log("The new deploy was not visible after 10 minutes. Submitting anyway.");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: site.domain,
    key: site.indexNowKey,
    keyLocation: `${origin}/${site.indexNowKey}.txt`,
    urlList: changed.map((path) => `${origin}${path}`),
  }),
});
console.log(`IndexNow answered ${res.status} for ${changed.length} page(s): ${changed.join(", ")}`);
// 200 and 202 both mean accepted. Anything else is a real failure worth a red build.
if (res.status !== 200 && res.status !== 202) process.exit(1);
