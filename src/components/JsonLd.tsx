// Structured data (schema.org JSON-LD) for search engines. The site-wide Organization
// block is added to every page by vite.config.js; pages add their own blocks, built
// with src/utils/schema.ts.

type Json = Record<string, unknown>;

/** Renders one or more JSON-LD blocks. `<` is escaped so text can never close the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  const json = JSON.stringify(Array.isArray(data) && data.length === 1 ? data[0] : data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
