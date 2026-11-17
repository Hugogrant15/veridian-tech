// IT supply and setup: the second side of the company, beside software.
// The hub page, each service page and the order builder all render from here.
//
// ⚠️ DRAFT (2026-11-17): the copy and the recommended specifications are drafted for
// the owner's review. They are promises to customers, so change them to match what is
// really delivered. Deliberately NOT claimed anywhere, because none is confirmed:
// past supply projects, authorised-partner status with any brand, warranty terms and
// government registrations. Add a claim only once it is true.
import type { LucideIcon } from "lucide-react";
import { Cctv, Laptop, MonitorSmartphone, Network, Printer } from "lucide-react";

export interface SupplyService {
  /** Also the last part of the page address: /it-supply/<id>. */
  id: string;
  Icon: LucideIcon;
  title: string;
  short: string;
  description: string;
  includes: string[];
  goodFor: string;
  seoTitle: string;
  seoDescription: string;
}

export const SUPPLY_SERVICES: SupplyService[] = [
  {
    id: "bulk-laptops",
    Icon: Laptop,
    title: "Laptops in bulk, to your specification",
    short: "Bulk laptop supply",
    description:
      "Ten laptops or a thousand. Tell us who they are for and we supply the right machine for each group of staff, in any brand you name.",
    includes: [
      "Any brand you specify: HP, Dell, Lenovo, Apple, Asus, Acer, MSI and others",
      "Business laptops, gaming laptops, and laptops for coding and cyber security",
      "One agreed specification for each group of staff, before you order",
      "A written quotation that lists every model and its full specification",
      "Delivery anywhere in Nigeria",
    ],
    goodFor: "Government projects, companies equipping their staff, schools and training programmes.",
    seoTitle: "Bulk Laptop Supply in Nigeria | Veridian Tech Innovations Ltd",
    seoDescription:
      "Bulk laptop supply for government and private-sector projects in Nigeria. Business, gaming, coding and cyber security laptops in any brand, delivered nationwide.",
  },
  {
    id: "workspace-setup",
    Icon: MonitorSmartphone,
    title: "Workspaces and workstations, ready for work",
    short: "Workspace setup",
    description:
      "A new office, a new floor or a new team. We supply the equipment and set up every desk, so your people sit down and start working.",
    includes: [
      "Each workstation set up: computer, monitor, keyboard and mouse",
      "Network points and Wi-Fi planned around where your team sits",
      "Printers connected and shared across the office",
      "Everything tested before we hand over",
      "Available anywhere in Nigeria",
    ],
    goodFor: "New offices, expanding teams, training centres and project sites.",
    seoTitle: "Office Workspace and Workstation Setup | Veridian Tech Innovations Ltd",
    seoDescription:
      "Office IT setup in Nigeria: workstations, monitors, network points, Wi-Fi and printers supplied, installed and tested for your team.",
  },
  {
    id: "networking",
    Icon: Network,
    title: "Office networks, planned and installed",
    short: "Networking",
    description:
      "Slow Wi-Fi and dropped connections cost a team hours every week. We plan the network around your floor, then supply and install it.",
    includes: [
      "Wired network points and Wi-Fi coverage planned for your space",
      "Routers, switches and access points supplied and installed",
      "Cables run, labelled and tested",
      "Separate networks for staff and guests where you need them",
    ],
    goodFor: "Offices with unreliable Wi-Fi, new premises and teams that have outgrown a single router.",
    seoTitle: "Office Network and Wi-Fi Installation | Veridian Tech Innovations Ltd",
    seoDescription:
      "Office networking in Nigeria: structured cabling, switches, routers and Wi-Fi access points planned, supplied and installed for your premises.",
  },
  {
    id: "cctv",
    Icon: Cctv,
    title: "CCTV you can check from your phone",
    short: "CCTV",
    description:
      "Cameras where they matter, footage kept for as long as you need it, and a live view on your phone or an office screen.",
    includes: [
      "Cameras placed to cover entrances and the areas you choose",
      "A recorder and storage sized for how long you keep footage",
      "Live and recorded viewing on a phone or an office screen",
      "Supplied, installed and tested",
    ],
    goodFor: "Offices, shops, warehouses, schools and estates.",
    seoTitle: "CCTV Supply and Installation in Nigeria | Veridian Tech Innovations Ltd",
    seoDescription:
      "CCTV cameras supplied and installed for offices, shops, warehouses and schools in Nigeria, with recording and viewing on your phone.",
  },
  {
    id: "printers",
    Icon: Printer,
    title: "Printers and scanners, supplied and connected",
    short: "Printers",
    description:
      "The right printer for how much your office prints, connected so everyone who needs it can use it.",
    includes: [
      "Printers, scanners and all-in-one machines matched to your print volume",
      "Connected to your network so the whole office can print",
      "Installed on your staff's computers",
      "Delivery anywhere in Nigeria",
    ],
    goodFor: "Offices, schools, clinics and any team that still runs on paper.",
    seoTitle: "Office Printer Supply and Setup | Veridian Tech Innovations Ltd",
    seoDescription:
      "Office printers, scanners and all-in-one machines supplied, networked and installed for teams across Nigeria.",
  },
];

/** The three kinds of laptop we supply (owner's list, 2026-11-17). */
export const LAPTOP_CATEGORIES = [
  {
    id: "business",
    title: "Business laptops",
    description: "Reliable everyday machines for documents, email, video calls and office systems.",
  },
  {
    id: "performance",
    title: "Gaming laptops",
    description: "Fast processors and dedicated graphics, for gaming, design and video work.",
  },
  {
    id: "technical",
    title: "Laptops for coding and cyber security",
    description: "Extra memory and storage for development tools, virtual machines and security labs.",
  },
] as const;

export type LaptopCategoryId = (typeof LAPTOP_CATEGORIES)[number]["id"];

/** One line of a specification sheet. */
export interface SpecLine {
  label: string;
  value: string;
}

/** Who the laptops are for. The order builder recommends `spec` as a starting point. */
export interface StaffProfile {
  id: string;
  label: string;
  category: LaptopCategoryId;
  usedFor: string;
  spec: SpecLine[];
}

const spec = (processor: string, memory: string, storage: string, display: string, graphics: string): SpecLine[] => [
  { label: "Processor", value: processor },
  { label: "Memory", value: memory },
  { label: "Storage", value: storage },
  { label: "Display", value: display },
  { label: "Graphics", value: graphics },
];

export const STAFF_PROFILES: StaffProfile[] = [
  {
    id: "office",
    label: "Office and admin staff",
    category: "business",
    usedFor: "Documents, email, video calls and browser-based systems.",
    spec: spec("Intel Core i5 or AMD Ryzen 5 class", "16 GB", "512 GB SSD", '14" Full HD', "Integrated"),
  },
  {
    id: "executive",
    label: "Managers and executives",
    category: "business",
    usedFor: "The same work on a lighter machine with a longer battery life.",
    spec: spec("Intel Core i7 or AMD Ryzen 7 class", "16 GB", "512 GB to 1 TB SSD", '13" to 14", thin and light', "Integrated"),
  },
  {
    id: "field",
    label: "Field and sales staff",
    category: "business",
    usedFor: "Working away from a desk all day.",
    spec: spec("Intel Core i5 or AMD Ryzen 5 class", "16 GB", "512 GB SSD", '13" to 14", light, long battery life', "Integrated"),
  },
  {
    id: "students",
    label: "Students and training labs",
    category: "business",
    usedFor: "Coursework, browsing and classroom software.",
    spec: spec("Intel Core i3 to i5 or AMD Ryzen 3 to 5 class", "8 GB to 16 GB", "256 GB to 512 GB SSD", '14" to 15.6" Full HD', "Integrated"),
  },
  {
    id: "developers",
    label: "Software developers",
    category: "technical",
    usedFor: "Code editors, local servers, containers and emulators running together.",
    spec: spec("Intel Core i7, AMD Ryzen 7 or Apple M-series class", "32 GB", "1 TB SSD", '15" to 16"', "Integrated or entry-level dedicated"),
  },
  {
    id: "security",
    label: "Cyber security and IT teams",
    category: "technical",
    usedFor: "Several virtual machines and security tools open at once.",
    spec: spec("Intel Core i7 or AMD Ryzen 7 class, with virtualisation support", "32 GB (64 GB for heavy lab work)", "1 TB SSD", '15" to 16"', "Integrated or entry-level dedicated"),
  },
  {
    id: "gaming",
    label: "Gaming and esports",
    category: "performance",
    usedFor: "Current games at high frame rates.",
    spec: spec("Intel Core i7 or AMD Ryzen 7, high-performance (H-series)", "16 GB to 32 GB", "1 TB SSD", '15.6" to 17", 144 Hz or faster', "Dedicated, NVIDIA GeForce RTX class"),
  },
  {
    id: "creative",
    label: "Design, video and media",
    category: "performance",
    usedFor: "Photo and video editing, 3D and motion graphics.",
    spec: spec("Intel Core i7 or AMD Ryzen 7, high-performance, or Apple M-series Pro class", "32 GB", "1 TB SSD", '15" to 16", colour-accurate', "Dedicated, NVIDIA GeForce RTX class"),
  },
];

export const BRANDS = ["No preference", "HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "MSI", "Other (tell us in the note)"] as const;

export const PURCHASE_TYPES = ["Direct purchase", "Tender or bid", "Not sure yet"] as const;

/** How an order runs, start to finish. */
export const SUPPLY_STEPS = [
  { title: "Tell us what you need", body: "Use the order builder or send your own list. Quantities, who the equipment is for and where it is going." },
  { title: "We confirm the specification", body: "We agree the exact models and specifications with you, so the quotation matches what arrives." },
  { title: "You get a written quotation", body: "Every item, quantity and price on one document, with delivery and setup stated." },
  { title: "We deliver and set up", body: "Delivered to your address anywhere in Nigeria, and set up where you have asked for it." },
];
