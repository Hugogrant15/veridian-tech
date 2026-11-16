// Products Veridian owns and runs (as opposed to client work).

export const EASYPASS = {
  name: "EasyPass",
  tagline: "Visitor management for residential estates",
  url: "https://www.easypass.ng",
  contactUrl: "https://www.easypass.ng/contact",
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.veridiantechinnovations.easypass",
  image: "/work/easypass.jpg",
  summary:
    "Residents invite guests from their phone, guards verify them at the gate in seconds, and the estate office sees every entry and exit.",
  features: [
    "One-time, multi-day and event invites, by QR code or six-digit code",
    "Signed passes the guard app verifies offline, even with the network down",
    "Panic alerts and a complete entry and exit audit trail",
    "Estate chat, marketplace, service requests and household management",
  ],
} as const;

// Describe RhemaVerse without naming any church or customer.
export const RHEMAVERSE = {
  name: "RhemaVerse",
  tagline: "Live scripture display for church media teams",
  // The operator console mid-sermon: live transcript, verses it recognised, verse queued in preview.
  // Captured from the real app (2026-11-11); shows no church or customer branding.
  image: "/work/rhemaverse.jpg",
  summary:
    "RhemaVerse listens to the sermon as it is preached, recognises Bible references as they are spoken, and puts the verse on the screens and the livestream automatically.",
  features: [
    "Hears scripture references in real time, no operator typing",
    "Sends verses to projectors, LED screens and live-stream overlays",
    "Several Bible translations, switchable on the fly",
    "A studio console for the media team to stay in control",
  ],
} as const;
