// The acknowledgement a visitor gets after sending an enquiry (see contact.js).
// FIXED WORDING ONLY: nothing the visitor typed may ever appear in it, not even
// their name, or the form could be used to send spam through our account.
// Company facts mirror src/config/company.ts; keep them in step.

const PHONE = "0806 504 1081";
const WHATSAPP = "https://wa.me/2348065041081";
const COMPANY = "Veridian Tech Innovations Ltd";
const ADDRESS = "7, Pius Drive, Fagbinle Estate, Isheri Ijegun, Lagos 100266";
const RC = "RC 9367650";

/** Subject, plain text and HTML for the acknowledgement. Only `service` (a known option id) varies it. */
export function receiptFor(service, origin) {
  const quote = service === "it-supply";
  const subject = quote ? "We've received your quote request" : "We've received your message";
  const lead = quote
    ? "Thank you for your quote request. It has reached our team, and we will get back to you within 24 hours with questions or a written quotation."
    : "Thank you for contacting Veridian Tech. Your message has reached our team, and we will get back to you within 24 hours.";
  const urgent = `If it is urgent, call or WhatsApp us on ${PHONE}.`;

  const text = [
    "Hello,",
    "",
    lead,
    "",
    urgent,
    "",
    "Veridian Tech",
    `${COMPANY} · ${RC}`,
    ADDRESS,
    origin,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en"><body style="margin:0;padding:0;background:#F5F7F2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7F2;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #D3E2D9;border-radius:10px;font-family:Arial,Helvetica,sans-serif;color:#0F1F17;">
<tr><td style="padding:28px 32px 20px;border-bottom:3px solid #075C33;">
<img src="${origin}/veridian-signature.png" width="56" height="64" alt="Veridian Tech" style="display:block;border:0;">
</td></tr>
<tr><td style="padding:28px 32px 8px;font-size:16px;line-height:1.6;">
<p style="margin:0 0 16px;">Hello,</p>
<p style="margin:0 0 16px;">${lead}</p>
<p style="margin:0 0 24px;">${urgent}</p>
<p style="margin:0 0 28px;"><a href="${WHATSAPP}" style="display:inline-block;background:#075C33;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:6px;">Chat with us on WhatsApp</a></p>
<p style="margin:0;">Veridian Tech</p>
</td></tr>
<tr><td style="padding:20px 32px 28px;font-size:12px;line-height:1.6;color:#5B6660;">
${COMPANY} · ${RC}<br>${ADDRESS}<br><a href="${origin}" style="color:#075C33;">${origin.replace(/^https:\/\//, "")}</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  return { subject, text, html };
}
