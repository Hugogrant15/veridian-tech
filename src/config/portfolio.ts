// Client websites we designed and built. Adding a client = adding an entry.
// Rules:
//  - url stays null until the client's site is publicly live; the card then
//    shows "Launching soon" instead of a link.
//  - image is a screenshot of the site's top screen only, saved in public/work
//    (taken from the finished build if the site is not public yet).
//  - Clients are listed independently. Never describe any two as related.

export interface ClientProject {
  id: string;
  name: string;
  sector: string;
  location: string;
  built: string[];
  url: string | null;
  image: string | null;
}

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: "uwaoma",
    name: "Uwaoma Energy Limited",
    sector: "Oil and gas materials and field services",
    location: "Port Harcourt",
    built: ["Website", "Product catalogue and search", "Quote requests"],
    url: "https://www.uwaomaenergylimited.com",
    image: "/work/uwaoma.jpg",
  },
  {
    id: "stuzans",
    name: "Stuzans Energy Limited",
    sector: "Procurement, supply and training",
    location: "Port Harcourt and Lagos",
    built: ["Website", "Product catalogue and search", "Training courses"],
    url: "https://www.stuzansenergylimited.com",
    image: "/work/stuzans.jpg",
  },
  {
    id: "prinx",
    name: "Prinx and 3D Oilfield Services Limited",
    sector: "Procurement and supply chain",
    location: "Port Harcourt",
    built: ["Website", "Product catalogue", "Search-ready pages"],
    // Not public yet: set the URL once https://www.prinx3doilfieldservicesltd.com is live.
    url: null,
    // Products page, captured from the finished local build (2026-11-09) since the site is not public
    // yet. Products, not home, so the card does not look like the Stuzans one beside it.
    image: "/work/prinx.jpg",
  },
];
