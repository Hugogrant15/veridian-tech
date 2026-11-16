// Single source of truth for company facts shown anywhere on the site.
// Every value here is real and verifiable. Leave a field null rather than
// inventing one: each place that renders it checks for null first.
import site from "./site.json";

export interface Phone {
  display: string;
  tel: string;
}

export const PRIMARY_PHONE: Phone = { display: "0806 504 1081", tel: "+2348065041081" };

export const COMPANY = {
  legalName: "Veridian Tech Innovations Ltd",
  shortName: "Veridian Tech",
  rcNumber: "9367650",
  duns: "352292647",
  incorporated: "2026-02-25",

  director: {
    name: "Ugochukwu Omenogor",
    title: "Managing Director",
  },

  address: {
    street: "7, Pius Drive, Fagbinle Estate",
    locality: "Isheri Ijegun",
    city: "Lagos",
    postalCode: "100266",
    country: "Nigeria",
  },

  phones: [PRIMARY_PHONE, { display: "0904 325 2415", tel: "+2349043252415" }] satisfies Phone[],

  // wa.me takes the number in international form, digits only.
  whatsapp: { display: "0806 504 1081", wa: "2348065041081" },

  // Company Gmail until the domain mailbox exists. veridiantech.com belongs to
  // someone else: never put an address on it here.
  email: "contact.veridiantech@gmail.com",
} as const;

export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsapp.wa}`;

// The bare domain is canonical (www redirects to it). Build every absolute URL from this.
export const SITE_DOMAIN = site.domain;
export const SITE_ORIGIN = `https://${site.domain}`;

export const formatAddress = (): string => {
  const a = COMPANY.address;
  return `${a.street}, ${a.locality}, ${a.city} ${a.postalCode}, ${a.country}`;
};
