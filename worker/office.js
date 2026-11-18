// The enquiry email the office (info@) receives, as branded HTML. The plain-text
// copy is summarise() in contact.js.
// Everything the visitor typed is escaped before it goes into the HTML, so an
// enquiry can never inject links, images or formatting into our inbox.

import { COMPANY_NAME, LOGO_PATH, emailShell, esc } from "./emailLayout.js";

const PREFS = { whatsapp: "WhatsApp", call: "Phone call", email: "Email" };

/** Digits for wa.me: a Nigerian number written 0806… becomes 234806…. */
export function whatsappNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

const button = (href, label, primary) =>
  `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none;${
    primary ? "background:#075C33;color:#ffffff;" : "background:#EEF3EE;color:#075C33;border:1px solid #CBD5CE;"
  }">${label}</a>`;

const row = (label, value) =>
  `<tr><td style="padding:6px 16px 6px 0;font-size:13px;color:#5B6660;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:15px;color:#0F1F17;">${value}</td></tr>`;

/**
 * @param data     the validated enquiry (contact.js validate())
 * @param labels   { service, timeline, budget }: option labels from the fixed lists
 * @param subject  the email subject, reused for "Reply by email"
 * @param origin   https://<domain>
 * @param now      when it arrived
 */
export function officeEmailHtml(data, labels, subject, origin, now = new Date()) {
  const when = now.toLocaleString("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
  const pref = PREFS[data.contactPref];

  // What they want, at a glance.
  const wants = [`<p style="margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5B6660;font-weight:bold;">Enquiry about</p>`,
    `<p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#075C33;">${esc(labels.service)}</p>`];
  const facts = [];
  if (labels.needs) facts.push(row("Needs", `<strong>${esc(labels.needs)}</strong>`));
  if (data.location) facts.push(row("Delivery", esc(data.location)));
  if (data.neededBy) facts.push(row("Needed by", esc(data.neededBy)));
  if (labels.purchase) {
    const tender = data.purchaseType === "tender";
    facts.push(row("Purchase", tender ? `<span style="display:inline-block;padding:3px 10px;border-radius:4px;background:#C9A55C;color:#062B1C;font-size:13px;font-weight:bold;">${esc(labels.purchase)}</span>` : esc(labels.purchase)));
  }
  if (labels.files?.length) facts.push(row("Attached", labels.files.map((name) => `📎 ${esc(name)}`).join("<br>")));
  if (labels.timeline) facts.push(row("Timing", esc(labels.timeline)));
  if (labels.budget) facts.push(row("Budget", esc(labels.budget)));
  if (data.role) facts.push(row("Role or skills", esc(data.role)));
  if (data.profileUrl) facts.push(row("Profile", esc(data.profileUrl)));
  if (data.siteUrl) facts.push(row("Current website", esc(data.siteUrl)));

  // Who they are, with every way to reach them that they gave.
  const who = [row("Name", `<strong>${esc(data.name)}</strong>`)];
  if (data.business) who.push(row("Business", esc(data.business)));
  if (data.email) who.push(row("Email", `<a href="mailto:${esc(data.email)}" style="color:#075C33;">${esc(data.email)}</a>`));
  if (data.phone) who.push(row("Phone", `<a href="tel:${esc(data.phone.replace(/[^\d+]/g, ""))}" style="color:#075C33;">${esc(data.phone)}</a>`));
  if (pref) who.push(row("Prefers", `<span style="display:inline-block;padding:3px 10px;border-radius:4px;background:#11A159;color:#ffffff;font-size:13px;font-weight:bold;">${pref}</span>`));

  // One-tap replies; the preferred method is the solid button.
  const actions = [];
  if (data.email) actions.push(button(`mailto:${data.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`, "Reply by email", data.contactPref === "email"));
  if (data.phone) {
    actions.push(button(`https://wa.me/${whatsappNumber(data.phone)}`, "WhatsApp them", data.contactPref === "whatsapp"));
    actions.push(button(`tel:${data.phone.replace(/[^\d+]/g, "")}`, "Call them", data.contactPref === "call"));
  }

  const section = (content, last = false) => `<tr><td style="padding:22px 28px;${last ? "" : "border-bottom:1px solid #E3EAE5;"}">${content}</td></tr>`;
  const body = [
    section(wants.join("") + (facts.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">${facts.join("")}</table>` : "")),
    section(`<table role="presentation" cellpadding="0" cellspacing="0">${who.join("")}</table>`),
    data.message
      ? section(`<p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5B6660;font-weight:bold;">Message</p><p style="margin:0;font-size:15px;line-height:1.6;color:#0F1F17;white-space:pre-wrap;border-left:3px solid #C9A55C;padding-left:14px;">${esc(data.message)}</p>`)
      : "",
    actions.length ? section(actions.join(""), true) : "",
  ].join("");

  return emailShell({
    heading: data.service === "it-supply" ? "New quote request" : "New website enquiry",
    logo: `${origin}${LOGO_PATH}`,
    body,
    footer: `Sent from the contact form on <a href="${origin}" style="color:#075C33;">${origin.replace(/^https:\/\//, "")}</a> · ${esc(when)} (Lagos)<br>${COMPANY_NAME}`,
  });
}
