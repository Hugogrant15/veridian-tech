// One case study per client website, at /work/<id>. The card details (name, sector,
// screenshot, live address) come from portfolio.ts; this file adds the story.
//
// Rules (owner, 2026-11-16): only facts that are public on the client's own live site,
// or are plainly true of what we built. No traffic, sales or ranking figures, no
// testimonials, and never repeat a client's certifications or permits as our claim.
// Clients are independent of each other: never describe any two as related.
// Page counts are the number of pages in each site's live sitemap on 2026-11-16.
//
// ⚠️ DRAFT (2026-11-17) for the owner's review.
import { CLIENT_PROJECTS, type ClientProject } from "./portfolio";

export interface CaseStudy {
  id: string;
  launched: string;
  /** One line under the title. */
  summary: string;
  needed: string[];
  built: { title: string; body: string }[];
  /** Short facts shown as a row of figures. */
  facts: { value: string; label: string }[];
  /** The services this project is an example of (ids from services.ts). */
  services: string[];
}

const STUDIES: CaseStudy[] = [
  {
    id: "uwaoma",
    launched: "October 2026",
    summary: "A product catalogue and quote requests for an oil and gas materials supplier in Port Harcourt.",
    needed: [
      "Show buyers the full range of materials and services, product by product, not as a single brochure page.",
      "Let a procurement officer collect the items they need and send one quote request.",
      "Be found by buyers searching for specific materials, and look right when a link is shared on WhatsApp or LinkedIn.",
    ],
    built: [
      { title: "A catalogue buyers can search", body: "Product categories, each with its own page for every product line, so a buyer lands on exactly what they searched for." },
      { title: "A quote basket", body: "Buyers add products as they browse and send one request for the whole list." },
      { title: "Pages search engines can read", body: "Every page is built to finished HTML with its own title, description and link preview, and search engines are told automatically when pages change." },
      { title: "Enquiries that reach the team", body: "Contact and quote forms delivered to the company inbox, protected against spam." },
    ],
    facts: [
      { value: "66", label: "pages in its sitemap" },
      { value: "Every page", label: "readable without JavaScript" },
      { value: "Oct 2026", label: "launched" },
    ],
    services: ["websites", "seo-mobile"],
  },
  {
    id: "stuzans",
    launched: "November 2026",
    summary: "A searchable product catalogue, training courses and quote requests for a procurement and supply company.",
    needed: [
      "Present two sides of the business, procurement and supply, and a training arm, without either getting lost.",
      "Help buyers find a product fast in a large catalogue.",
      "Turn visits into quotation requests and course enquiries.",
    ],
    built: [
      { title: "Search across the whole catalogue", body: "A site-wide product search, so a buyer can type what they need and go straight to it." },
      { title: "A page for every product and course", body: "Product and training pages, each with its own title and description for search engines." },
      { title: "Quotation and enquiry forms", body: "Forms for quotations, enquiries and the newsletter, delivered to the company inbox." },
      { title: "Clients, partners and certifications", body: "Pages that present the company's track record from its own documents." },
    ],
    facts: [
      { value: "89", label: "pages in its sitemap" },
      { value: "Site-wide", label: "product search" },
      { value: "Nov 2026", label: "launched" },
    ],
    services: ["websites", "seo-mobile"],
  },
  {
    id: "prinx",
    launched: "November 2026",
    summary: "A 23-line product catalogue with quote requests and bill-of-quantities uploads for an oilfield supply company.",
    needed: [
      "Show a wide range of oilfield materials, from pipes and valves to marine chemicals, in a way buyers can navigate.",
      "Accept real procurement requests, including a buyer's own bill of quantities.",
      "Make it easy to call or WhatsApp from any page.",
    ],
    built: [
      { title: "A 23-line product catalogue", body: "23 product lines and 70 product types, each with its own page." },
      { title: "Request a quote, with BOQ upload", body: "Buyers collect products as they browse, add their own lines or upload a bill of quantities, and send one request." },
      { title: "Contact on every page", body: "A guided contact form, plus WhatsApp and call buttons on every page." },
      { title: "Search-ready from launch", body: "Every page is built to finished HTML with its own title, description and sharing image, and search engines are told about changes on every deploy." },
    ],
    facts: [
      { value: "111", label: "pages in its sitemap" },
      { value: "23 / 70", label: "product lines / types" },
      { value: "Nov 2026", label: "launched" },
    ],
    services: ["websites", "seo-mobile"],
  },
];

export const CASE_STUDIES = STUDIES.filter((s) => CLIENT_PROJECTS.some((p) => p.id === s.id));

/** The case study with its portfolio card details, or undefined for an unknown id. */
export function caseStudy(id: string | undefined): (CaseStudy & { project: ClientProject }) | undefined {
  const study = CASE_STUDIES.find((s) => s.id === id);
  const project = CLIENT_PROJECTS.find((p) => p.id === id);
  return study && project ? { ...study, project } : undefined;
}
