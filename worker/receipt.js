// The acknowledgement a visitor gets after sending an enquiry (see contact.js).
// FIXED WORDING ONLY: nothing the visitor typed may ever appear in it, not even
// their name, or the form could be used to send spam through our account. The only
// variable parts are option LABELS from the form's fixed lists (the service they
// picked and how they want a reply), never free text.
// Company facts mirror src/config/company.ts; keep them in step.

import { COMPANY_NAME, LOGO_PATH, emailShell, esc } from "./emailLayout.js";

const PHONE = "0806 504 1081";
const WHATSAPP = "https://wa.me/2348065041081";
const ADDRESS = "7, Pius Drive, Fagbinle Estate, Isheri Ijegun, Lagos 100266";
const RC = "RC 9367650";
const REPLY_BY = { email: "by email", whatsapp: "on WhatsApp", call: "by phone" };

/**
 * Subject, plain text and HTML for the acknowledgement.
 * @param service       a known option id
 * @param serviceLabel  its label from the fixed list
 * @param contactPref   "email" | "whatsapp" | "call" | ""
 * @param origin        https://<domain>
 */
export function receiptFor(service, serviceLabel, contactPref, origin) {
  const quote = service === "it-supply";
  const how = REPLY_BY[contactPref] ? ` ${REPLY_BY[contactPref]}` : "";
  const subject = quote ? "We've received your quote request" : "We've received your message";
  const lead = quote
    ? `Thank you for your quote request. It has reached our team, and we will get back to you${how} within 24 hours with any questions or a written quotation.`
    : `Thank you for contacting ${COMPANY_NAME}. Your message has reached our team, and we will get back to you${how} within 24 hours.`;
  const urgent = `If it is urgent, call or WhatsApp us on ${PHONE}.`;
  const site = origin.replace(/^https:\/\//, "");

  const text = [
    "Hello,",
    "",
    lead,
    "",
    `You asked about: ${serviceLabel}`,
    "",
    urgent,
    "",
    COMPANY_NAME,
    `${RC} · ${ADDRESS}`,
    origin,
  ].join("\n");

  const body = `<tr><td style="padding:28px 28px 8px;font-size:16px;line-height:1.6;color:#0F1F17;">
<p style="margin:0 0 16px;">Hello,</p>
<p style="margin:0 0 18px;">${esc(lead)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="padding:12px 16px;background:#EEF3EE;border-left:3px solid #11A159;border-radius:4px;font-size:14px;color:#0F1F17;">You asked about: <strong>${esc(serviceLabel)}</strong></td></tr></table>
${
  // The big WhatsApp button only for people who chose WhatsApp; the rest get the number as a quiet link.
  contactPref === "whatsapp"
    ? `<p style="margin:0 0 22px;">${esc(urgent)}</p>
<p style="margin:0 0 26px;"><a href="${WHATSAPP}" style="display:inline-block;background:#075C33;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:6px;">Chat with us on WhatsApp</a></p>`
    : `<p style="margin:0 0 26px;">If it is urgent, call or <a href="${WHATSAPP}" style="color:#075C33;font-weight:bold;">WhatsApp</a> us on <a href="tel:+2348065041081" style="color:#075C33;font-weight:bold;">${PHONE}</a>.</p>`
}
<p style="margin:0 0 4px;">Kind regards,</p>
<p style="margin:0 0 24px;font-weight:bold;">${COMPANY_NAME}</p>
</td></tr>`;

  const html = emailShell({
    heading: quote ? "Quote request received" : "Message received",
    logo: `${origin}${LOGO_PATH}`,
    body,
    footer: `${COMPANY_NAME} · ${RC}<br>${ADDRESS}<br><a href="${origin}" style="color:#075C33;">${site}</a>`,
  });

  return { subject, text, html };
}
