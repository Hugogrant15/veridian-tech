// Every indexable page on the site, in sitemap order. The build prerenders each one
// (scripts/prerender.mjs) and lists it in sitemap.xml, so a new service, case study,
// industry page or blog post is picked up from its content file with no other change.
import site from "./site.json";
import { SERVICES } from "./services";
import { SUPPLY_SERVICES } from "./supply";
import { CASE_STUDIES } from "./caseStudies";
import { INDUSTRIES } from "./industries";
import { POSTS } from "../content/blog";

export function allRoutes(): string[] {
  const [home, ...rest] = site.routes;
  return [
    home ?? "/",
    ...rest,
    ...SERVICES.map((s) => `/services/${s.id}`),
    ...SUPPLY_SERVICES.map((s) => `/it-supply/${s.id}`),
    ...CASE_STUDIES.map((c) => `/work/${c.id}`),
    ...INDUSTRIES.map((i) => `/industries/${i.id}`),
    "/blog",
    ...POSTS.map((p) => `/blog/${p.slug}`),
  ];
}
