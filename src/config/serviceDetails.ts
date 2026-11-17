// The extra content each service gets on its own page (/services/<id>): the words
// buyers search for, a longer introduction, and the questions they ask before buying.
// The short card copy stays in services.ts.
//
// ⚠️ DRAFT (2026-11-17) for the owner's review. Timings in the answers are promises to
// customers: change them to match how projects really run. No prices are stated here;
// budgets live in the pricing guide (src/content/blog.ts).

export interface Faq {
  q: string;
  a: string;
}

export interface ServiceDetail {
  /** What a buyer types into Google. Used in the title and the schema.org serviceType. */
  serviceType: string;
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  faqs: Faq[];
  /** Blog posts that answer this service's common questions (slugs from src/content/blog.ts). */
  related: string[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  websites: {
    serviceType: "Website design and development",
    seoTitle: "Website Design Company in Lagos, Nigeria | Veridian Tech",
    seoDescription:
      "Custom business websites designed and built in Lagos for companies across Nigeria: fast on phones, found on Google, with enquiry forms and WhatsApp that reach you.",
    intro: [
      "For most customers, your website is the first proof that your business is real. They check it before they call, before they visit and before they pay. A slow or broken site, or no site at all, loses them at that moment.",
      "We design every site around your business, not a template. It loads fast on mobile data, it is written so Google can read and rank it, and every page gives visitors a clear next step: call, WhatsApp or send an enquiry.",
    ],
    faqs: [
      {
        q: "How long does it take to build a business website?",
        a: "Most business websites take two to six weeks. The biggest factors are how many pages you need and how quickly your content (text, photos, logo) is ready. We agree a date with you before work starts.",
      },
      {
        q: "Do I need to provide the content?",
        a: "You know your business best, so we start from what you have: a company profile, a brochure or your notes. We then write and shape the page copy with you, so it reads well and uses the words your customers search for.",
      },
      {
        q: "Will the website work on phones?",
        a: "Yes. Most of your visitors will be on a phone, so every page is designed and tested for small screens and slower connections first.",
      },
      {
        q: "Can I get a business email address with the website?",
        a: "Yes. We set the site up on your own domain and can set up email addresses on it, such as info@yourcompany.com.",
      },
    ],
    related: ["how-much-does-a-website-cost-in-nigeria", "how-long-does-it-take-to-build-a-website", "what-to-prepare-before-hiring-a-web-developer"],
  },
  "seo-mobile": {
    serviceType: "Search engine optimisation",
    seoTitle: "SEO Services in Nigeria: Get Found on Google | Veridian Tech",
    seoDescription:
      "SEO for Nigerian businesses: page titles and descriptions written for what customers search, Google Search Console and Business Profile set up, and mobile and speed fixes.",
    intro: [
      "A website nobody can find is a brochure in a drawer. Most people choose from the first few results on Google, and most of them are searching on a phone.",
      "We find what is stopping Google from reading and ranking your pages, fix it, and set up the tools that show you how people find you. Then we make sure the site looks right and loads fast on the phones your customers use.",
    ],
    faqs: [
      {
        q: "How long does SEO take to show results?",
        a: "Technical fixes can show within weeks, as Google re-reads your pages. Ranking for competitive searches takes longer, usually months, and depends on your competitors and how much useful content your site has.",
      },
      {
        q: "Can you guarantee the first position on Google?",
        a: "No one honestly can: Google decides the order. What we can do is remove everything that holds your site back and make each page the best answer to what your customers search for.",
      },
      {
        q: "What is a Google Business Profile, and do I need one?",
        a: "It is the listing that shows your business on Google Maps and in local searches, with your address, phone number and reviews. If customers ever search for a business like yours near them, you need one.",
      },
    ],
    related: ["why-your-website-is-not-on-google", "how-much-does-a-website-cost-in-nigeria"],
  },
  ecommerce: {
    serviceType: "E-commerce website development",
    seoTitle: "E-commerce Website Development in Nigeria | Veridian Tech",
    seoDescription:
      "Online stores for Nigerian businesses: a product catalogue, card and bank-transfer payments, order alerts and delivery fees set up your way.",
    intro: [
      "Taking orders through Instagram and WhatsApp DMs works until it doesn't: questions about price and stock at midnight, payment screenshots to check, and orders that slip through.",
      "An online store lets customers browse, order and pay at any hour. You get an alert for every order, a dashboard to manage products and stock, and delivery fees that match where you deliver.",
    ],
    faqs: [
      {
        q: "Can customers pay by card and bank transfer?",
        a: "Yes. We connect a Nigerian payment provider so customers can pay by card, bank transfer or USSD, and the money is settled to your business account.",
      },
      {
        q: "Can I add and edit products myself?",
        a: "Yes. You get a dashboard to add products, change prices and update stock without needing us.",
      },
      {
        q: "Do I still need my Instagram or WhatsApp?",
        a: "Keep them. Social media brings people in; the store is where they can see everything and pay without waiting for a reply. Your posts and chats can link straight to a product.",
      },
    ],
    related: ["does-my-business-need-a-website", "how-much-does-a-website-cost-in-nigeria"],
  },
  "landing-pages": {
    serviceType: "Landing page design",
    seoTitle: "Landing Page Design for Ad Campaigns | Veridian Tech",
    seoDescription:
      "Focused landing pages for Facebook, Instagram and Google ad campaigns in Nigeria: one offer, one clear next step, fast on mobile data.",
    intro: [
      "Sending paid ad traffic to a busy home page wastes most of the budget. Visitors arrive looking for one thing and leave when they cannot find it in a few seconds.",
      "A landing page is built around one offer and one next step. It loads fast on mobile data, it answers the questions that stop people acting, and it is set up so you can see which ads actually bring enquiries.",
    ],
    faqs: [
      {
        q: "What is the difference between a landing page and a website?",
        a: "A website introduces your whole business. A landing page does one job for one campaign: it turns the people your ad brings in into enquiries or sales.",
      },
      {
        q: "Can you see which ads bring enquiries?",
        a: "Yes. We set up tracking so you can see which ad, platform or campaign each enquiry came from, and spend more on the ones that work.",
      },
      {
        q: "How quickly can a landing page go live?",
        a: "Usually within one to two weeks once the offer and the content are agreed, so it can be ready for a launch or promotion date.",
      },
    ],
    related: ["how-much-does-a-website-cost-in-nigeria", "what-to-prepare-before-hiring-a-web-developer"],
  },
  redesigns: {
    serviceType: "Website redesign",
    seoTitle: "Website Redesign and Speed-Up in Nigeria | Veridian Tech",
    seoDescription:
      "Website redesigns for Nigerian businesses: faster loading on phones, a current design, broken links and forms fixed, without losing your Google rankings.",
    intro: [
      "A dated or slow website quietly costs you customers. Visitors on a phone wait a few seconds, then go back to the search results and choose someone else.",
      "We start by finding what is slowing the site down and where visitors give up. The redesign keeps the content and the addresses Google already ranks, so you gain a faster, modern site without starting from zero in search.",
    ],
    faqs: [
      {
        q: "Will a redesign lose my Google rankings?",
        a: "Not if it is done carefully. We keep the pages that rank, redirect any address that changes to its new home, and resubmit the site to Google after launch.",
      },
      {
        q: "Can you work on a site someone else built?",
        a: "Yes. We review what is there first and tell you plainly whether it is better to improve it or rebuild it.",
      },
      {
        q: "Can you move my site to better hosting?",
        a: "Yes. If slow or unreliable hosting is part of the problem, we move the site and its domain to hosting that suits it.",
      },
    ],
    related: ["why-your-website-is-not-on-google", "how-much-does-a-website-cost-in-nigeria"],
  },
  "mobile-apps": {
    serviceType: "Mobile app development",
    seoTitle: "Mobile App Development Company in Nigeria | Veridian Tech",
    seoDescription:
      "Android and iOS app development in Nigeria, from the makers of EasyPass: one codebase for both platforms, a web dashboard, logins, notifications and payments.",
    intro: [
      "An app earns its place when your customers or members use your service often: booking, ordering, checking in or staying in touch every week.",
      "We build Android and iOS apps from one codebase, with the web dashboard you need to run them. We know what it takes because we run our own app every day: EasyPass, the visitor management platform for residential estates.",
    ],
    faqs: [
      {
        q: "Do I need an app or a website?",
        a: "Start with a website if people mainly need to find you and get in touch. Add an app when they use your service regularly and benefit from logins, notifications or working offline.",
      },
      {
        q: "Will the app work on both Android and iPhone?",
        a: "Yes. We build both from one codebase, which keeps the cost and the time to launch down and keeps the two versions in step.",
      },
      {
        q: "What happens after launch?",
        a: "Apps need updates as phones and app store rules change. We offer support after launch, and we publish updates for you.",
      },
    ],
    related: ["how-much-does-a-website-cost-in-nigeria", "what-to-prepare-before-hiring-a-web-developer"],
  },
};
