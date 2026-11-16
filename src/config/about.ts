// Everything written for the About page, in one place for review.
//
// ⚠️ DRAFT (2026-11-11): statement, story, bio, principles, vision and mission are drafted for the
// owner's review. Milestones use only dates confirmed by the owner or by the record.

export const STATEMENT = "We build software for Nigerian businesses the way we build our own: properly, and to last.";

export const STORY = [
  "Veridian Tech Innovations Ltd is a Lagos software company, registered with the Corporate Affairs Commission under RC 9367650. We design and build websites, online stores and mobile apps for Nigerian businesses.",
  "We also build and run our own products. EasyPass manages visitors and gate access for residential estates, and RhemaVerse puts scripture on screen as it is preached. Living with our own software every day is what keeps our client work honest.",
];

export const LEADER = {
  name: "Ugochukwu Omenogor",
  // Display role. The registered title in the company record stays "Managing Director".
  title: "Managing Director · Lead Full-Stack Developer",
  photo: "/work/md-ugochukwu-omenogor.jpg",
  // DRAFT for the owner's review.
  bio: "Ugochukwu Omenogor leads Veridian Tech Innovations Ltd and its engineering. As lead full-stack developer he architects and builds the company's own products, including EasyPass, and oversees every client project.",
};

export interface TeamMember {
  name: string;
  role: string;
  /** null until a photo is supplied; the card shows a monogram instead. */
  photo: string | null;
  bio: string;
}

// DRAFT bios (2026-11-12): describe each role, with no invented employers, years or qualifications.
export const TEAM: TeamMember[] = [
  {
    name: "Samuel Nwokike",
    role: "Senior Full-Stack Developer",
    photo: "/work/team/samuel-nwokike.jpg",
    bio: "Samuel builds the systems behind our products and client sites, from databases and APIs to the screens people use, with a close eye on speed and security.",
  },
  {
    name: "Cynthia Ashionye",
    role: "UI/UX Designer",
    photo: "/work/team/cynthia-ashionye.jpg",
    bio: "Cynthia designs how our products look and feel, turning what users need into clear layouts and flows that are simple to use on a phone.",
  },
  {
    name: "Peace Omenogor",
    role: "Product / Project Manager",
    photo: "/work/team/peace-omenogor.jpg",
    bio: "Peace keeps every project on track, turning client goals into clear plans and priorities and making sure what we ship matches what was agreed.",
  },
];

// DRAFT: the lead under "How we work, in three lines."
export const PRINCIPLES_LEAD =
  "Three promises we hold ourselves to on every project, whether it's our own product or yours.";

export const PRINCIPLES = [
  {
    title: "We run what we build",
    body: "EasyPass and RhemaVerse are ours. We live with our own software every day, so we build yours to the same standard.",
  },
  {
    title: "Straight answers, early",
    body: "You hear the real cost, the real timeline and the real trade-offs before we start, not after.",
  },
  {
    title: "Built for how Nigeria works",
    body: "WhatsApp first, light on mobile data, card and transfer payments, and customers who are on their phones.",
  },
];

export const VISION = "A Nigeria where every business, however small, is properly online.";
export const MISSION =
  "To design, build and run software that Nigerian businesses can trust: honest in what it promises, dependable in how it works, and built to grow with them.";

/** Owner-confirmed dates (Feb and Jul from the record; client launches from the owner). */
export const MILESTONES = [
  { date: "Feb 2026", title: "Incorporated", body: "Registered with the Corporate Affairs Commission, RC 9367650." },
  { date: "Jul 2026", title: "EasyPass goes live", body: "Our visitor-management app launches on Google Play." },
  { date: "Oct 2026", title: "Uwaoma Energy Limited", body: "Client website launched." },
  { date: "Nov 2026", title: "Stuzans Energy Limited", body: "Client website launched." },
  { date: "Nov 2026", title: "Prinx and 3D Oilfield Services Limited", body: "Client website launching." },
];
