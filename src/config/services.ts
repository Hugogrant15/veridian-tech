// The services we sell, in the order a growing business usually needs them.
// Home, the Services page and the footer all render this list.
//
// ⚠️ DRAFT (2026-11-11): `includes` and `goodFor` are drafted for the owner's review.
// They are promises to customers, so change them to match what is really delivered.
import type { LucideIcon } from "lucide-react";
import { Globe, Search, ShoppingBag, Target, RefreshCw, Smartphone } from "lucide-react";

/** A real project to show beside a service. Only ever a genuine Veridian build. */
export interface ServiceExample {
  image: string;
  caption: string;
}

export interface Service {
  id: string;
  Icon: LucideIcon;
  title: string;
  short: string;
  description: string;
  includes: string[];
  goodFor: string;
  /** null = no real example yet; the page shows a labelled illustration instead. */
  example: ServiceExample | null;
}

export const SERVICES: Service[] = [
  {
    id: "websites",
    Icon: Globe,
    title: "A website that earns trust",
    short: "Business websites",
    description:
      "Your business, properly online. A custom site that makes customers trust you before they ever call.",
    includes: [
      "A custom design for your brand, not a template",
      "Looks right and works fast on phones",
      "WhatsApp, call and enquiry forms that reach you",
      "Set up on your own domain, with business email",
      "Pages written so Google can find them",
    ],
    goodFor: "Service businesses, professionals and companies that need to look established online.",
    example: { image: "/work/uwaoma.jpg", caption: "Built by Veridian: Uwaoma Energy Limited" },
  },
  {
    id: "seo-mobile",
    Icon: Search,
    title: "Get found on Google, look right on phones",
    short: "SEO and mobile-friendly sites",
    description:
      "Most of your customers are on their phones. We make sure your site looks right there and shows up when they search.",
    includes: [
      "A check of how your site loads and looks on phones",
      "Page titles and descriptions written for what customers search",
      "Google Search Console set up and your pages submitted",
      "Google Business Profile set up or tidied",
      "Fixes for anything stopping Google reading your pages",
    ],
    goodFor: "Businesses with a website that customers can't find, or that breaks on a phone.",
    example: { image: "/work/prinx.jpg", caption: "Built by Veridian: search-ready pages for Prinx and 3D" },
  },
  {
    id: "ecommerce",
    Icon: ShoppingBag,
    title: "An online store that takes payment",
    short: "Online stores",
    description:
      "Let customers browse, order and pay by card or transfer at any hour, without a DM back-and-forth.",
    includes: [
      "A product catalogue with photos, prices and stock",
      "Card and bank-transfer payments",
      "Order alerts to you by email or WhatsApp",
      "Delivery areas and fees set up your way",
      "A simple dashboard to manage products and orders",
    ],
    goodFor: "Shops, food vendors, fashion brands, and anyone taking orders through Instagram or WhatsApp DMs.",
    example: null,
  },
  {
    id: "landing-pages",
    Icon: Target,
    title: "Landing pages that turn clicks into customers",
    short: "Landing pages",
    description:
      "One focused page per campaign, built so the people your ads bring in actually get in touch.",
    includes: [
      "One page built around one offer",
      "A clear next step: WhatsApp, call or a short form",
      "Fast on mobile data",
      "Ready for Facebook, Instagram and Google ads",
      "Set up so you can see which ads bring enquiries",
    ],
    goodFor: "Product launches, events, promotions and paid ad campaigns.",
    example: null,
  },
  {
    id: "redesigns",
    Icon: RefreshCw,
    title: "Give your old website a second life",
    short: "Redesigns and speed-ups",
    description:
      "We redesign slow, dated sites so they load fast, look current and stop losing visitors.",
    includes: [
      "A review of what is slowing you down or losing visitors",
      "A new design that keeps your content and your Google rankings",
      "Faster loading, especially on phones",
      "Broken links and forms fixed",
      "A move to reliable hosting if you need one",
    ],
    goodFor: "Businesses whose site looks dated, loads slowly or has stopped bringing enquiries.",
    example: null,
  },
  {
    id: "mobile-apps",
    Icon: Smartphone,
    title: "Mobile apps built to grow with you",
    short: "Mobile apps",
    description:
      "Fast Android and iOS apps that keep up as your users multiply. We build and run our own: EasyPass.",
    includes: [
      "Android and iOS apps from one codebase",
      "A web dashboard to manage your users and content",
      "Logins, notifications and payments",
      "Published to the app stores for you",
      "Updates and support after launch",
    ],
    goodFor: "Businesses and communities whose customers or members use a service every day.",
    example: { image: "/work/easypass.jpg", caption: "Built and run by Veridian: EasyPass, live on Google Play" },
  },
];
