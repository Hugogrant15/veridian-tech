// Builders for schema.org structured data blocks, rendered with <JsonLd>.
import { COMPANY, SITE_ORIGIN } from "../config/company";

type Json = Record<string, unknown>;

const ORG_REF = { "@type": "Organization", name: COMPANY.legalName, url: SITE_ORIGIN };

/** Home → … → this page. Each crumb is [name, path]. */
export const breadcrumbs = (crumbs: [string, string][]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...crumbs].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE_ORIGIN}${path}`,
  })),
});

export const serviceSchema = (o: { name: string; description: string; path: string; serviceType: string }): Json => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: o.name,
  serviceType: o.serviceType,
  description: o.description,
  url: `${SITE_ORIGIN}${o.path}`,
  provider: ORG_REF,
  areaServed: { "@type": "Country", name: "Nigeria" },
});

export const faqSchema = (faqs: { q: string; a: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export const articleSchema = (o: { title: string; description: string; path: string; published: string; updated: string }): Json => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: o.title,
  description: o.description,
  datePublished: o.published,
  dateModified: o.updated,
  mainEntityOfPage: `${SITE_ORIGIN}${o.path}`,
  author: ORG_REF,
  publisher: { ...ORG_REF, logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/veridian-signature.png` } },
  image: `${SITE_ORIGIN}/og.png`,
});
