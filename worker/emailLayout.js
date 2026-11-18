// Shared frame for the emails the site sends: the office enquiry (office.js) and
// the visitor's acknowledgement (receipt.js). Tables and inline styles only, because
// Gmail strips <style> and Outlook renders through Word.

export const COMPANY_NAME = "Veridian Tech Innovations Ltd";
export const LOGO_PATH = "/veridian-signature.png"; // 198×226, served by the site

/** Escapes text for HTML. Use on everything a visitor typed. */
export const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Header with the logo and the company name, an emerald bar, the body rows, and a footer. */
export function emailShell({ heading, logo, body, footer }) {
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:0;background:#F5F7F2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7F2;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #D3E2D9;border-radius:10px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#0F1F17;">
<tr><td style="padding:22px 28px;border-bottom:4px solid #075C33;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle;padding-right:16px;"><img src="${logo}" width="49" height="56" alt="Veridian" style="display:block;border:0;"></td>
<td style="vertical-align:middle;">
<p style="margin:0;font-size:17px;font-weight:bold;letter-spacing:.04em;color:#062B1C;">${COMPANY_NAME.toUpperCase()}</p>
<p style="margin:3px 0 0;font-size:14px;color:#11A159;font-weight:bold;">${heading}</p>
</td></tr></table>
</td></tr>
${body}
<tr><td style="padding:18px 28px 22px;background:#F5F7F2;font-size:12px;line-height:1.6;color:#5B6660;">${footer}</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
