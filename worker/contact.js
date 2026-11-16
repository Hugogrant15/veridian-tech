// POST /api/contact — validates an enquiry and emails it to the office via
// Brevo. Two rules learned the hard way on another site:
//  1. Sandbox by default. Brevo accepts the send and delivers nothing unless
//     BREVO_LIVE is exactly "true". Go live only after the sending domain's
//     DKIM, SPF and DMARC verify.
//  2. Never email the visitor. A receipt to a typed-in address turns the form
//     into an open relay. The office copy carries Reply-To instead.

import OPTIONS from "../src/config/enquiry-options.json" with { type: "json" };

const LIMITS = { name: 100, business: 120, email: 254, phone: 30, siteUrl: 200, role: 120, profileUrl: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 16 * 1024;
const CONTACT_PREFS = ["whatsapp", "call", "email"];

const labelsOf = (list) => new Map(list.map((o) => [o.id, o.label]));
const SERVICE_LABELS = labelsOf(OPTIONS.services);
const BUILD_IDS = new Set(OPTIONS.services.filter((s) => s.group === "build").map((s) => s.id));
/** True when the chosen option is about building something (so timing/budget apply). */
export const isBuild = (service) => BUILD_IDS.has(service);
const TIMELINE_LABELS = labelsOf(OPTIONS.timelines);
const BUDGET_LABELS = labelsOf(OPTIONS.budgets);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

// Matching control characters is the point of these two patterns.
// All control characters, incl. CR/LF, so nothing can inject a header:
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;
// Same, but keeps tab, LF and CR so a message keeps its line breaks:
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_EXCEPT_WHITESPACE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

const clean = (value) =>
  typeof value === "string" ? value.replace(CONTROL_CHARS, " ").trim() : "";

const cleanMessage = (value) =>
  typeof value === "string" ? value.replace(CONTROL_CHARS_EXCEPT_WHITESPACE, "").trim() : "";

// Only ids from the shared option list survive; anything else is dropped.
const pick = (value, labels) => (typeof value === "string" && labels.has(value) ? value : "");

export function validate(input) {
  const data = {
    // Exactly one option; anything not on the shared list is dropped.
    service: pick(input.service, SERVICE_LABELS),
    timeline: "",
    budget: "",
    name: clean(input.name),
    business: clean(input.business),
    email: clean(input.email).toLowerCase(),
    phone: clean(input.phone),
    siteUrl: clean(input.siteUrl),
    role: clean(input.role),
    profileUrl: clean(input.profileUrl),
    contactPref: CONTACT_PREFS.includes(input.contactPref) ? input.contactPref : "",
    message: cleanMessage(input.message),
  };
  // Timing and budget only mean something for build work; drop them otherwise.
  const build = isBuild(data.service);
  if (build) {
    data.timeline = pick(input.timeline, TIMELINE_LABELS);
    data.budget = pick(input.budget, BUDGET_LABELS);
  }
  const careers = data.service === "careers";
  if (!careers) {
    data.role = "";
    data.profileUrl = "";
  }

  const errors = {};
  if (!data.service) errors.service = "Please choose an option.";
  if (careers && (data.role.length < 2 || data.role.length > LIMITS.role))
    errors.role = "Tell us the role or skills you're interested in.";
  if (data.profileUrl.length > LIMITS.profileUrl || /\s/.test(data.profileUrl))
    errors.profileUrl = "Please enter a valid link.";
  // With nothing to build, the message is the enquiry, so it is required.
  if (!build && data.service && data.message.length < 10)
    errors.message = "Please write a few words so we know how to help.";
  if (data.name.length < 2 || data.name.length > LIMITS.name) errors.name = "Please enter your name.";
  if (data.business.length > LIMITS.business) errors.business = "Please shorten your business name.";
  if (data.email && (data.email.length > LIMITS.email || !EMAIL_RE.test(data.email)))
    errors.email = "Please enter a valid email address.";
  if (data.phone && (data.phone.length > LIMITS.phone || /[^\d+\s()-]/.test(data.phone) || data.phone.replace(/\D/g, "").length < 7))
    errors.phone = "Please enter a valid phone number.";
  if (!data.email && !data.phone) errors.email = "Please give us an email address or a phone number.";
  if (data.siteUrl.length > LIMITS.siteUrl || /\s/.test(data.siteUrl)) errors.siteUrl = "Please enter a valid website address.";
  if (data.message.length > LIMITS.message) errors.message = "Please shorten your message.";
  return { data, errors };
}

/** Email subject that says at a glance what kind of enquiry this is. */
export function subjectFor(data) {
  if (data.service === "careers") return `Careers: ${data.name}`;
  if (data.service === "partnership") return `Partnership enquiry: ${data.business || data.name}`;
  const label = SERVICE_LABELS.get(data.service);
  return isBuild(data.service) ? `New enquiry: ${label}, from ${data.name}` : `${label}, from ${data.name}`;
}

/** Plain-text summary for the office inbox. */
export function summarise(data) {
  const contactPref = { whatsapp: "WhatsApp", call: "Phone call", email: "Email" }[data.contactPref];
  const lines = [`About: ${SERVICE_LABELS.get(data.service)}`];
  if (isBuild(data.service)) {
    lines.push(
      `Timing: ${TIMELINE_LABELS.get(data.timeline) || "not given"}`,
      `Budget: ${BUDGET_LABELS.get(data.budget) || "not given"}`,
    );
  }
  if (data.role) lines.push(`Role or skills: ${data.role}`);
  if (data.profileUrl) lines.push(`LinkedIn or portfolio: ${data.profileUrl}`);
  if (data.siteUrl) lines.push(`Current website: ${data.siteUrl}`);
  lines.push("", `Name: ${data.name}`);
  if (data.business) lines.push(`Business: ${data.business}`);
  lines.push(`Email: ${data.email || "not given"}`, `Phone: ${data.phone || "not given"}`);
  if (contactPref) lines.push(`Prefers: ${contactPref}`);
  if (data.message) lines.push("", data.message);
  return lines.join("\n");
}

export async function handleContact(request, env) {
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" });
  if (!(request.headers.get("content-type") || "").includes("application/json"))
    return json(415, { error: "unsupported_media_type" });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "too_large" });

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_json" });
  }
  if (!input || typeof input !== "object") return json(400, { error: "invalid_json" });

  // Honeypot: real visitors never see this field. Pretend success so bots move on.
  if (clean(input.fax)) return json(200, { ok: true });

  const { data, errors } = validate(input);
  if (Object.keys(errors).length) return json(422, { error: "invalid", fields: errors });

  if (env.CONTACT_LIMITER) {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) return json(429, { error: "rate_limited" });
  }

  if (!env.BREVO_API_KEY || !env.MAIL_FROM || !env.CONTACT_TO)
    return json(503, { error: "not_configured" });

  const live = env.BREVO_LIVE === "true";
  const headers = {
    "api-key": env.BREVO_API_KEY,
    "content-type": "application/json",
    accept: "application/json",
  };
  if (!live) headers["X-Sib-Sandbox"] = "drop";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers,
    body: JSON.stringify({
      sender: { name: "Veridian Tech website", email: env.MAIL_FROM },
      to: [{ email: env.CONTACT_TO }],
      // Reply-To only when the visitor gave an email; otherwise we reply by phone/WhatsApp.
      ...(data.email ? { replyTo: { email: data.email, name: data.name } } : {}),
      subject: subjectFor(data),
      textContent: summarise(data),
    }),
  });

  if (!res.ok) {
    console.error("Brevo send failed", res.status, await res.text());
    return json(502, { error: "send_failed" });
  }
  return json(200, { ok: true, sandbox: !live });
}
