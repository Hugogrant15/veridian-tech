// Industry pages, at /industries/<id>. Each one exists only because we have real work
// in that industry to show (case studies from caseStudies.ts).
//
// ⚠️ DRAFT (2026-11-17) for the owner's review.

export interface Industry {
  id: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  sub: string;
  /** What buyers in this industry need from a website. */
  needs: { title: string; body: string }[];
  /** Case study ids that prove the experience. */
  caseStudies: string[];
}

export const INDUSTRIES: Industry[] = [
  {
    id: "oil-and-gas",
    name: "Oil, gas and procurement",
    seoTitle: "Websites for Oil, Gas and Procurement Companies | Veridian Tech",
    seoDescription:
      "Website design for Nigerian oil and gas, procurement and supply companies: searchable product catalogues, quote requests with BOQ uploads, and pages buyers find on Google.",
    title: "Websites for oil, gas and procurement companies.",
    sub: "We have built the websites of three procurement and supply companies serving Nigeria's oil and gas industry. Here is what we learned they need.",
    needs: [
      {
        title: "A catalogue, not a brochure",
        body: "Procurement officers search for specific items: a weld neck flange, an API 6D valve, a casing size. A page for each product line means they land on what they searched for, not on a home page.",
      },
      {
        title: "Quote requests that match how buyers work",
        body: "Buyers send lists, not single items. A quote basket, free-text lines and bill-of-quantities uploads let them send the whole requirement in one request.",
      },
      {
        title: "Credibility on the page",
        body: "Clients, partners and certifications decide whether a supplier makes the vendor list. They belong on the site, presented from the company's own documents.",
      },
      {
        title: "Links that look right when shared",
        body: "Supplier links travel through WhatsApp groups and LinkedIn. Every page needs its own title, description and preview image so the link shows what it is.",
      },
      {
        title: "Found on Google and Bing",
        body: "Pages built to finished HTML, structured data for search engines and automatic notification when pages change, so new products are found quickly.",
      },
      {
        title: "Contact from any page",
        body: "Call, WhatsApp and enquiry buttons everywhere, because a buyer with an urgent requirement will not hunt for a phone number.",
      },
    ],
    caseStudies: ["uwaoma", "stuzans", "prinx"],
  },
];
