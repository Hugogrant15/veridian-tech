// Blog posts, at /blog/<slug>. Each answers a question buyers search for and ends
// with a link to the matching service.
//
// Writing rules: plain English, real facts only, no invented statistics, clients or
// case results. Prices appear only in the pricing guide, as the budget bands the
// owner approved for publication (2026-11-16; the same bands as the enquiry form).
//
// ⚠️ DRAFT (2026-11-17): every post is drafted for the owner's review before it is
// promoted. The project-to-budget mapping in the pricing guide especially.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; text: string };

export interface Post {
  slug: string;
  title: string;
  /** Shorter title for search results when `title` is too long (keep under about 60 characters). */
  seoTitle?: string;
  description: string;
  /** ISO dates. */
  published: string;
  updated: string;
  readMinutes: number;
  topic: "Websites" | "Search" | "IT supply";
  body: Block[];
  /** Where the post sends a reader who is ready: a service page or the order builder. */
  next: { label: string; to: string };
}

export const POSTS: Post[] = [
  {
    slug: "how-much-does-a-website-cost-in-nigeria",
    title: "How much does a website cost in Nigeria?",
    description:
      "What decides the price of a website in Nigeria, the budget bands we work in for each kind of project, and the yearly costs to plan for after launch.",
    published: "2026-11-17",
    updated: "2026-11-17",
    readMinutes: 6,
    topic: "Websites",
    body: [
      { type: "p", text: "It is the first question almost every business asks, and the honest answer is that it depends on what the website has to do. A one-page site for an ad campaign and an online store with hundreds of products are different jobs. This guide explains what drives the price, the budget bands we work in, and the costs that continue after launch, so you can plan before you ask anyone for a quote." },
      { type: "h2", text: "What decides the price" },
      { type: "list", items: [
        "Number of pages. Each page has to be planned, designed, written and tested. A five-page site and a fifty-page catalogue are very different amounts of work.",
        "Custom design or template. A design made for your brand takes longer than filling in a template, and it is what makes you look different from competitors using the same template.",
        "Features. Enquiry forms and WhatsApp buttons are simple. Online payments, product search, customer accounts, booking systems and dashboards each add real work.",
        "Content. If your text and photos are ready, the project moves faster. If they have to be written or produced, that is part of the job.",
        "Search engine work. A site built so Google can read every page properly takes more care than one that only looks good.",
      ] },
      { type: "h2", text: "The budget bands we work in" },
      { type: "p", text: "These are the bands on our own enquiry form. Where a project lands depends on the points above, so treat this as a guide, not a price list." },
      { type: "table", head: ["Budget", "What it usually covers"], rows: [
        ["Under ₦500k", "A landing page for a campaign, or a small site of a few pages with an enquiry form and WhatsApp button."],
        ["₦500k to ₦1.5m", "A custom business website: several pages designed for your brand, enquiry forms, set up for Google, on your own domain."],
        ["₦1.5m to ₦5m", "An online store with payments, or a large site such as a product catalogue with search and quote requests."],
        ["₦5m and above", "Mobile apps, web platforms with user accounts and dashboards, and systems built around how your business runs."],
      ] },
      { type: "note", text: "Not sure which band fits? Tell us what the site needs to do, and we will tell you where it lands before any work starts." },
      { type: "h2", text: "Costs after launch" },
      { type: "p", text: "A website has a few running costs. Plan for them from the start so nothing expires by surprise." },
      { type: "list", items: [
        "Domain name: a yearly fee to keep your address, such as yourcompany.com.",
        "Hosting: where the site lives. Some sites run on low-cost hosting; sites with payments or heavy traffic need more.",
        "Business email: addresses on your own domain, usually charged per mailbox.",
        "Updates and support: changes to content, new pages, and keeping forms and plugins working.",
      ] },
      { type: "h2", text: "How to get an accurate quote" },
      { type: "p", text: "The more a developer knows, the more accurate the quote. Before you ask, write down what the site is for, the pages you think you need, the features that matter, and a few sites you like. Our guide to preparing for a web project has a full checklist." },
      { type: "h2", text: "Be careful with very cheap quotes" },
      { type: "p", text: "A very low price usually means a template with your logo on it, no search engine work, and nobody to call when something breaks. Ask what is included: who owns the domain, whether the site is built for phones, whether it is set up for Google, and what happens after launch." },
    ],
    next: { label: "Tell us what you need", to: "/contact?service=websites" },
  },
  {
    slug: "does-my-business-need-a-website",
    title: "Does my business need a website if I already sell on Instagram and WhatsApp?",
    seoTitle: "Do I Need a Website If I Sell on Instagram?",
    description:
      "Instagram and WhatsApp are great for reaching customers. Here is what a website adds, and how to tell whether your business is ready for one.",
    published: "2026-11-17",
    updated: "2026-11-17",
    readMinutes: 4,
    topic: "Websites",
    body: [
      { type: "p", text: "Many Nigerian businesses grow on Instagram and WhatsApp alone, and that is a good start. Social media is where customers discover you. But there are things it cannot do, and they start to matter as the business grows." },
      { type: "h2", text: "What a website gives you that social media cannot" },
      { type: "list", items: [
        "You own it. An account can be restricted or hacked, and the platform can change its rules. Your website and domain are yours.",
        "Google can find it. People search for products and services on Google. A website can appear in those results; an Instagram post rarely does.",
        "Trust for bigger customers. Companies, government buyers and partners check for a proper website and business email before they deal with you.",
        "Everything in one place. Prices, products, delivery areas and answers to common questions, available at any hour without waiting for a reply.",
        "Payments without screenshots. An online store takes payment directly, so there is no need to check transfer receipts by hand.",
      ] },
      { type: "h2", text: "Signs you are ready for a website" },
      { type: "list", items: [
        "You answer the same questions about price, location and delivery many times a day.",
        "You want to sell to companies or apply for contracts.",
        "Customers ask whether you are a registered business.",
        "You are spending on ads and want somewhere better than a profile to send people.",
      ] },
      { type: "h2", text: "Keep both" },
      { type: "p", text: "A website does not replace your social media. Keep posting, and link each post and chat to the right page on your site, where customers can see everything and act without waiting." },
    ],
    next: { label: "See our website service", to: "/services/websites" },
  },
  {
    slug: "how-long-does-it-take-to-build-a-website",
    title: "How long does it take to build a website?",
    description:
      "The stages of a website project, what speeds it up or slows it down, and typical timings for landing pages, business sites, online stores and apps.",
    published: "2026-11-17",
    updated: "2026-11-17",
    readMinutes: 4,
    topic: "Websites",
    body: [
      { type: "p", text: "Most delays on website projects have nothing to do with the code. They come from waiting: for content, for photos, for decisions. Knowing the stages helps you plan a launch date you can trust." },
      { type: "h2", text: "The stages of a project" },
      { type: "list", ordered: true, items: [
        "Brief: agreeing what the site is for, who it is for and what it must include.",
        "Structure and content: the list of pages and the words and photos on each.",
        "Design: how the pages look, starting with the home page.",
        "Build: turning the design into a working site, including forms and any payments.",
        "Testing: on phones, tablets and computers, and on slower connections.",
        "Launch: connecting your domain, submitting the site to Google, and checking every form reaches you.",
      ] },
      { type: "h2", text: "Typical timings" },
      { type: "table", head: ["Project", "Typical time"], rows: [
        ["Landing page", "1 to 2 weeks"],
        ["Business website", "2 to 6 weeks"],
        ["Online store or large catalogue", "4 to 10 weeks"],
        ["Mobile app or web platform", "2 months and up"],
      ] },
      { type: "p", text: "These assume content is ready and feedback comes back within a few days. We agree a launch date with you before work starts." },
      { type: "h2", text: "How to keep your project on schedule" },
      { type: "list", items: [
        "Gather your logo, photos and company details before the project starts.",
        "Name one person on your side who can approve designs and content.",
        "Reply to questions and review rounds quickly.",
        "Save new ideas for after launch rather than adding them midway.",
      ] },
    ],
    next: { label: "Start a project", to: "/contact?service=websites" },
  },
  {
    slug: "what-to-prepare-before-hiring-a-web-developer",
    title: "What to prepare before hiring a web developer",
    description:
      "A checklist of what to have ready before you contact a web developer, so you get an accurate quote and a website that does what you need.",
    published: "2026-11-17",
    updated: "2026-11-17",
    readMinutes: 4,
    topic: "Websites",
    body: [
      { type: "p", text: "A clear brief gets you a more accurate quote, a faster project and a site that does its job. You do not need technical knowledge. Answer these questions in plain words and any good developer can work from them." },
      { type: "h2", text: "Your checklist" },
      { type: "list", items: [
        "The goal: what should a visitor do on the site? Call, send an enquiry, buy, book, or download something?",
        "The audience: who are your customers, and what do they need to know before they contact you?",
        "The pages: a rough list, for example Home, About, Services, Products, Contact.",
        "The features: forms, WhatsApp button, payments, product search, customer accounts, booking.",
        "Your brand: logo files, colours, and any brand guidelines you have.",
        "Content: company profile, service descriptions, product details, and good photos of your work, team or premises.",
        "Examples: two or three websites you like, and what you like about each.",
        "Domain and email: whether you already own a domain, and who has the login.",
        "Budget and deadline: a range and a date, so the proposal fits what is realistic.",
      ] },
      { type: "h2", text: "Questions to ask the developer" },
      { type: "list", items: [
        "Will I own the domain and the website when it is finished?",
        "Is the site designed for phones first?",
        "Is it set up so Google can find and read every page?",
        "Who do I call when something needs changing after launch?",
        "Can I see websites you have built that are live now?",
      ] },
    ],
    next: { label: "Send us your brief", to: "/contact?service=websites" },
  },
  {
    slug: "why-your-website-is-not-on-google",
    title: "Why your website is not showing on Google",
    description:
      "The common reasons a business website does not appear on Google, how to check each one, and what to fix first.",
    published: "2026-11-17",
    updated: "2026-11-17",
    readMinutes: 5,
    topic: "Search",
    body: [
      { type: "p", text: "You search for your business and the website is nowhere. It is a common problem, and the cause is usually one of a handful of things. Here is how to check them in order." },
      { type: "h2", text: "1. Google does not know the site exists yet" },
      { type: "p", text: "New sites can take days or weeks to appear. Set up Google Search Console, a free tool from Google, and submit your sitemap: the list of your pages. It also shows which pages Google has found and any problems it hit." },
      { type: "h2", text: "2. The site is blocked from search engines" },
      { type: "p", text: "Some sites are launched with a setting that asks search engines to stay away, left over from when they were being built. Search Console will show if pages are marked 'noindex' or blocked by the site's robots file." },
      { type: "h2", text: "3. The pages are empty until JavaScript runs" },
      { type: "p", text: "Many modern sites load their content with JavaScript. Google can usually handle that, but Bing, AI assistants and link previews on WhatsApp and LinkedIn often see a blank page. Building each page to finished HTML fixes this." },
      { type: "h2", text: "4. Every page has the same title" },
      { type: "p", text: "The title is the blue headline in search results. If every page has the same title, or just your company name, Google has little to go on. Each page needs its own title and description that match what customers search for." },
      { type: "h2", text: "5. It is too slow or broken on phones" },
      { type: "p", text: "Google ranks sites by how they work on phones. A site that is slow on mobile data or hard to use on a small screen will struggle, however good it looks on a computer." },
      { type: "h2", text: "6. You have no Google Business Profile" },
      { type: "p", text: "For searches like 'printer supplier near me', Google shows a map with businesses first. A Google Business Profile with your address, phone number and opening hours puts you on that map." },
      { type: "h2", text: "7. The content does not answer the search" },
      { type: "p", text: "If customers search for 'office laptops in bulk' and your site only says 'IT solutions', Google has no reason to match them. Use the words your customers use, on pages that answer their question." },
    ],
    next: { label: "See our SEO service", to: "/services/seo-mobile" },
  },
  {
    slug: "how-to-write-a-laptop-specification-for-a-bulk-purchase",
    title: "How to write a laptop specification for a bulk purchase or tender",
    seoTitle: "How to Write a Laptop Specification for a Tender",
    description:
      "A practical guide to specifying laptops for staff, schools and government projects: processor, memory, storage, display, operating system and the details that prevent disputes.",
    published: "2026-11-17",
    updated: "2026-11-17",
    readMinutes: 6,
    topic: "IT supply",
    body: [
      { type: "p", text: "A vague specification is the most common cause of problems on bulk laptop orders. 'Core i5 laptop' can describe a fast new machine or a slow old one. A clear specification gets you comparable quotes, the machines you expected, and no arguments at delivery." },
      { type: "h2", text: "Start with who will use them" },
      { type: "p", text: "Group your users by what they do, not by job title. Office work, software development, design and field work need different machines. Buying one model for everyone either wastes money on the office staff or slows down the technical team." },
      { type: "h2", text: "The parts of a specification" },
      { type: "table", head: ["Item", "What to state", "Example"], rows: [
        ["Processor", "Brand and class, and generation where it matters", "Intel Core i5 or AMD Ryzen 5 class, current generation"],
        ["Memory (RAM)", "Amount, and whether it can be upgraded", "16 GB"],
        ["Storage", "Size and type. Insist on SSD", "512 GB SSD"],
        ["Display", "Size and resolution", '14" Full HD (1920 × 1080)'],
        ["Graphics", "Integrated, or a named dedicated class for design and gaming", "Integrated"],
        ["Operating system", "Edition, and whether it must be licensed", "Windows 11 Pro, licensed"],
        ["Ports and connectivity", "What your users plug in", "USB-C, HDMI, Wi-Fi 6"],
        ["Battery and weight", "For staff who travel", "Light, all-day battery"],
      ] },
      { type: "h2", text: "Typical specifications by kind of user" },
      { type: "list", items: [
        "Office and admin staff: Core i5 or Ryzen 5 class, 16 GB memory, 512 GB SSD, 14-inch Full HD.",
        "Software developers: Core i7, Ryzen 7 or Apple M-series class, 32 GB memory, 1 TB SSD.",
        "Cyber security teams: Core i7 or Ryzen 7 class with virtualisation support, 32 GB memory or more, 1 TB SSD.",
        "Design and video: high-performance processor, 32 GB memory, 1 TB SSD, colour-accurate display and dedicated graphics.",
        "Students and training labs: Core i3 to i5 or Ryzen 3 to 5 class, 8 to 16 GB memory, SSD storage.",
      ] },
      { type: "h2", text: "Details that prevent disputes" },
      { type: "list", items: [
        "Condition: state 'brand new, sealed in the original packaging' if that is what you require.",
        "Warranty: the length, and whether it is the manufacturer's warranty.",
        "Accessories: chargers, bags, mice and docking stations, listed per unit.",
        "Setup: whether machines should arrive with software installed, accounts created or asset tags applied.",
        "Delivery: the address, and whether delivery is to one site or several.",
        "Equivalents: if you name a model, say whether an equal or better specification is acceptable. It widens the field of suppliers.",
      ] },
      { type: "h2", text: "Turn it into a quote request" },
      { type: "p", text: "Our order builder does the first draft for you: choose who the laptops are for and how many, and it produces a specification for each group that you can send to us or use in your own tender documents." },
    ],
    next: { label: "Open the order builder", to: "/it-supply/build-your-order" },
  },
];

export const postBySlug = (slug: string | undefined): Post | undefined => POSTS.find((p) => p.slug === slug);

/** "17 November 2026". Fixed to UTC so the prerendered page and the browser agree. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
