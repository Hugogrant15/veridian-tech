import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { COMPANY, SITE_ORIGIN } from "./src/config/company.ts";

// Organization details for search engines, built from the same facts the pages show.
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.legalName,
  alternateName: COMPANY.shortName,
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/veridian-signature.png`,
  email: COMPANY.email,
  telephone: COMPANY.phones[0].tel,
  foundingDate: COMPANY.incorporated,
  duns: COMPANY.duns,
  identifier: { "@type": "PropertyValue", propertyID: "CAC RC", value: COMPANY.rcNumber },
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.street,
    addressLocality: `${COMPANY.address.locality}, ${COMPANY.address.city}`,
    postalCode: COMPANY.address.postalCode,
    addressCountry: "NG",
  },
};

// Absolute URLs in index.html (link previews read these without running any JS),
// plus robots.txt, all from src/config so the domain lives in one place. sitemap.xml is
// written by scripts/prerender.mjs, which knows every page.
function seoFiles() {
  const origin = SITE_ORIGIN;
  return {
    name: "veridian-seo-files",
    transformIndexHtml(html) {
      return html
        .replaceAll("%SITE_ORIGIN%", origin)
        .replace("</head>", `    <script type="application/ld+json">${JSON.stringify(organization)}</script>\n  </head>`);
    },
    // Build only: generateBundle never runs in dev.
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  // The build-time server bundle (entry-server.tsx) carries its own React and router,
  // so it never ends up with two copies of React.
  ssr: { noExternal: true },
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
});
