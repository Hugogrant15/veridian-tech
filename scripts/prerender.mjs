/**
 * The last build step: turns the app into one finished HTML file per page.
 *
 * Search engines that do not run JavaScript (Bing, AI assistants) and link
 * previews (WhatsApp, LinkedIn) read only the HTML a server sends. So for every
 * route in allRoutes() (src/config/routes.ts) this renders the page with React (the server
 * bundle in dist-server/) and writes it into dist/ with that page's own title,
 * description, canonical and preview tags. The browser then takes the page
 * over in place (hydrateRoot in src/main.tsx).
 *
 * Also writes sitemap.xml, a noindex 404.html, which Cloudflare serves with a real 404
 * status, and content-manifest.json (a hash per page), which
 * scripts/indexnow.mjs uses to tell search engines which pages changed.
 *
 * Any page that comes out wrong stops the build.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const { render, site, allRoutes } = await import(pathToFileURL(join(ROOT, "dist-server", "entry-server.js")).href);

const template = await readFile(join(DIST, "index.html"), "utf8");
const SEO_BLOCK = /<!-- seo:[\s\S]*?<!-- \/seo -->/;
const ROOT_DIV = '<div id="root"></div>';
if (!SEO_BLOCK.test(template)) throw new Error("index.html has lost its <!-- seo --> block.");
if (!template.includes(ROOT_DIV)) throw new Error("index.html has lost its empty #root.");

// React puts the tags a page hoists into <head> (title, meta, link) at the very start of the render.
const HEAD_TAGS = /^(?:<title>[^<]*<\/title>|<meta [^>]*>|<link [^>]*>)+/;
const count = (html, re) => (html.match(re) ?? []).length;

/** Every image, font, script and stylesheet the page loads from this site. */
function localFiles(html) {
  const urls = [...html.matchAll(/(?:src|href|srcSet)="([^"]+)"/g)].flatMap((m) => m[1].split(", ").map((part) => part.trim().split(" ")[0]));
  return [...new Set(urls.filter((url) => url.startsWith("/") && /\.\w{2,5}$/.test(url)))];
}

function pageHtml(path, { notFound = false } = {}) {
  const rendered = render(path);
  const head = rendered.match(HEAD_TAGS)?.[0] ?? "";
  const body = rendered.slice(head.length);
  const html = template.replace(SEO_BLOCK, head).replace(ROOT_DIV, `<div id="root">${body}</div>`);

  const problems = [
    count(html, /<title>/g) !== 1 && "exactly one title",
    count(html, /<meta name="description"/g) !== 1 && "exactly one description",
    count(html, /<link rel="canonical"/g) !== (notFound ? 0 : 1) && (notFound ? "no canonical" : "exactly one canonical"),
    count(html, /<meta property="og:title"/g) !== 1 && "exactly one og:title",
    count(html, /<h1/g) !== 1 && "exactly one main heading",
    notFound !== /<meta name="robots" content="noindex"/.test(html) && (notFound ? "a noindex tag" : "no noindex tag"),
  ].filter(Boolean);
  if (problems.length) throw new Error(`${path}: expected ${problems.join(", ")}.`);
  const missing = localFiles(html).filter((file) => !existsSync(join(DIST, file)));
  if (missing.length) {
    throw new Error(`${path}: loads files that are not in the build: ${missing.join(", ")}. New image? Run "npm run images".`);
  }
  if (!notFound && !html.includes(`<link rel="canonical" href="https://${site.domain}${path}"`)) {
    throw new Error(`${path}: the canonical does not point at this page. Is the route missing from App.tsx?`);
  }
  return html;
}

// "/" -> index.html, "/about" -> about.html. Cloudflare serves about.html at /about.
const fileFor = (path) => join(DIST, path === "/" ? "index.html" : `${path.slice(1)}.html`);

const routes = allRoutes();
const pages = {};
for (const path of routes) {
  const html = pageHtml(path);
  await mkdir(dirname(fileFor(path)), { recursive: true });
  await writeFile(fileFor(path), html);
  // Hash without the asset file names, so a code-only rebuild does not count as a content change.
  pages[path] = createHash("sha256").update(html.replace(/\/assets\/[^"']+/g, "")).digest("hex").slice(0, 16);
}
await writeFile(join(DIST, "404.html"), pageHtml("/__not-found__", { notFound: true }));
await writeFile(join(DIST, "content-manifest.json"), JSON.stringify({ pages }, null, 2));

const origin = `https://${site.domain}`;
const urls = routes.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n");
await writeFile(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

console.log(`Prerendered ${routes.length} pages, 404.html and sitemap.xml.`);
