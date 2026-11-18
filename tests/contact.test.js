import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { handleContact, summarise, validate } from "../worker/contact.js";
import { whatsappNumber } from "../worker/office.js";

const env = { MAILJET_API_KEY: "key", MAILJET_SECRET_KEY: "secret", MAIL_FROM: "noreply@example.test", CONTACT_TO: "office@example.test" };
const valid = {
  service: "ecommerce",
  timeline: "1-3-months",
  budget: "500k-1.5m",
  name: "Ada Obi",
  business: "Ada's Kitchen",
  email: "ada@example.test",
  phone: "0806 000 0000",
  contactPref: "whatsapp",
  message: "We sell food trays and want to take orders online.",
};

const post = (body, headers = {}) =>
  new Request("https://site.test/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

// calls: Mailjet sends only. dns: MX lookups. hasMx decides what the MX lookup answers.
let calls;
let dns;
let hasMx;
const realFetch = globalThis.fetch;
beforeEach(() => {
  calls = [];
  dns = [];
  hasMx = true;
  globalThis.fetch = async (url, init) => {
    if (String(url).startsWith("https://cloudflare-dns.com/")) {
      dns.push(String(url));
      return Response.json(hasMx ? { Status: 0, Answer: [{ type: 15, data: "10 mx.example.test." }] } : { Status: 0 });
    }
    const body = JSON.parse(init.body);
    calls.push({ url, init, body, msg: body.Messages[0] });
    return new Response("{}", { status: 200 });
  };
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("sends in sandbox mode by default, office copy and receipt alike", async () => {
  const res = await handleContact(post(valid), env);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, sandbox: true, receipt: "sent" });
  assert.equal(calls.length, 2);
  assert.ok(calls.every((c) => c.body.SandboxMode === true));
  assert.equal(calls[0].url, "https://api.mailjet.com/v3.1/send");
  assert.equal(calls[0].init.headers.authorization, `Basic ${btoa("key:secret")}`);
});

test("only MAIL_LIVE=true turns sandbox off", async () => {
  await handleContact(post(valid), { ...env, MAIL_LIVE: "TRUE" });
  assert.equal(calls[0].body.SandboxMode, true);
  await handleContact(post(valid), { ...env, MAIL_LIVE: "true" });
  assert.equal(calls[2].body.SandboxMode, false);
});

test("the office copy goes to the office, with the visitor as Reply-To", async () => {
  await handleContact(post(valid), env);
  const { To, ReplyTo } = calls[0].msg;
  assert.deepEqual(To, [{ Email: env.CONTACT_TO }]);
  assert.equal(ReplyTo.Email, valid.email);
});

test("the receipt goes to the visitor, replies to the office, and repeats nothing they typed", async () => {
  const hostile = { ...valid, name: "Buy cheap pills at spam.example", business: "spam.example", message: "Visit spam.example now for a prize" };
  await handleContact(post(hostile), env);
  const receipt = calls[1].msg;
  assert.deepEqual(receipt.To, [{ Email: valid.email }]);
  assert.equal(receipt.ReplyTo.Email, env.CONTACT_TO);
  assert.equal(receipt.To[0].Name, undefined);
  for (const part of [receipt.Subject, receipt.TextPart, receipt.HTMLPart]) assert.doesNotMatch(part, /spam.example|pills|prize/);
  assert.match(receipt.TextPart, /within 24 hours/);
});

test("quote requests get quote wording", async () => {
  await handleContact(post({ service: "it-supply", name: "Ada Obi", email: "ada@example.test", supplyItems: { "bulk-laptops": "40" } }), env);
  assert.equal(calls[1].msg.Subject, "We've received your quote request");
});

test("no receipt without an email address", async () => {
  const res = await handleContact(post({ ...valid, email: "" }), env);
  assert.equal((await res.json()).receipt, "skipped");
  assert.equal(calls.length, 1);
  assert.equal(dns.length, 0);
});

test("no receipt to a domain that cannot receive email", async () => {
  hasMx = false;
  const res = await handleContact(post(valid), env);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).receipt, "no_mx");
  assert.equal(calls.length, 1);
});

test("receipts are rate limited per address", async () => {
  const keys = [];
  const limiter = { limit: async ({ key }) => (keys.push(key), { success: false }) };
  const res = await handleContact(post(valid), { ...env, RECEIPT_LIMITER: limiter });
  assert.equal((await res.json()).receipt, "rate_limited");
  assert.deepEqual(keys, [valid.email]);
  assert.equal(calls.length, 1);
});

test("a failed receipt never fails the enquiry", async () => {
  let n = 0;
  globalThis.fetch = async (url) => {
    if (String(url).startsWith("https://cloudflare-dns.com/")) return Response.json({ Answer: [{ type: 15 }] });
    n += 1;
    return new Response("{}", { status: n === 1 ? 200 : 400 });
  };
  const original = console.error;
  console.error = () => {};
  const res = await handleContact(post(valid), env);
  console.error = original;
  assert.equal(res.status, 200);
  assert.equal((await res.json()).receipt, "failed");
});

test("subject and body summarise the enquiry with readable labels", async () => {
  await handleContact(post(valid), env);
  const { Subject, TextPart } = calls[0].msg;
  assert.equal(Subject, "New enquiry: Online store, from Ada Obi");
  assert.match(TextPart, /About: Online store/);
  assert.match(TextPart, /Timing: In 1 to 3 months/);
  assert.match(TextPart, /Budget: ₦500k – ₦1.5m/);
  assert.match(TextPart, /Prefers: WhatsApp/);
});

test("a phone number alone is enough; no Reply-To is set", async () => {
  const res = await handleContact(post({ ...valid, email: "" }), env);
  assert.equal(res.status, 200);
  assert.equal(calls[0].msg.ReplyTo, undefined);
});

test("needs an email or a phone number", () => {
  const { errors } = validate({ ...valid, email: "", phone: "" });
  assert.ok(errors.email);
});

test("drops unknown options instead of trusting them", () => {
  const { data, errors } = validate({ ...valid, service: "<script>", timeline: "tomorrow", budget: 5 });
  assert.equal(data.service, "");
  assert.ok(errors.service);
  assert.equal(validate({ ...valid, timeline: "tomorrow" }).data.timeline, "");
});

test("accepts exactly one option, never a list", () => {
  const { data, errors } = validate({ ...valid, service: ["ecommerce", "careers"] });
  assert.equal(data.service, "");
  assert.ok(errors.service);
});

test("requires a known option", async () => {
  const res = await handleContact(post({ ...valid, service: "hacking" }), env);
  assert.equal(res.status, 422);
  assert.ok((await res.json()).fields.service);
  assert.equal(calls.length, 0);
});

test("careers: needs a role, gets its own subject, and drops timing and budget", async () => {
  const careers = { service: "careers", name: "Tolu Ade", phone: "0806 111 2222", message: "Frontend developer, 3 years of React.", timeline: "asap", budget: "5m-plus" };
  assert.ok(validate(careers).errors.role);
  const res = await handleContact(post({ ...careers, role: "Frontend developer", profileUrl: "linkedin.com/in/tolu" }), env);
  assert.equal(res.status, 200);
  const { Subject, TextPart } = calls[0].msg;
  assert.equal(Subject, "Careers: Tolu Ade");
  assert.match(TextPart, /Role or skills: Frontend developer/);
  assert.match(TextPart, /LinkedIn or portfolio: linkedin\.com\/in\/tolu/);
  assert.doesNotMatch(TextPart, /Timing|Budget/);
});

test("non-build enquiries require a message", () => {
  const { errors } = validate({ service: "general", name: "Ada Obi", email: "ada@example.test", message: "" });
  assert.ok(errors.message);
  assert.deepEqual(validate({ service: "general", name: "Ada Obi", email: "ada@example.test", message: "Do you build school portals?" }).errors, {});
});

test("partnership subject uses the organisation name", async () => {
  await handleContact(post({ service: "partnership", name: "Ada Obi", business: "Acme Ltd", email: "ada@acme.test", message: "We'd like to refer clients to you." }), env);
  assert.equal(calls[0].msg.Subject, "Partnership enquiry: Acme Ltd");
});

test("role fields are ignored unless Careers is chosen", () => {
  const { data } = validate({ ...valid, role: "Designer", profileUrl: "x.com/me" });
  assert.equal(data.role, "");
  assert.equal(data.profileUrl, "");
});

test("budget and timing are optional", () => {
  const { errors } = validate({ ...valid, timeline: "", budget: "" });
  assert.deepEqual(errors, {});
  assert.match(summarise(validate({ ...valid, budget: "" }).data), /Budget: not given/);
});

test("honeypot pretends success and sends nothing", async () => {
  const res = await handleContact(post({ ...valid, fax: "spam.example" }), env);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("strips line breaks from the name so headers cannot be injected", () => {
  const { data } = validate({ ...valid, name: "Ada\r\nBcc: x@evil.test" });
  assert.ok(!/[\r\n]/.test(data.name));
});

test("returns 503 when mail is not configured", async () => {
  const res = await handleContact(post(valid), {});
  assert.equal(res.status, 503);
  assert.equal(calls.length, 0);
});

test("respects the rate limiter", async () => {
  const limiter = { limit: async () => ({ success: false }) };
  const res = await handleContact(post(valid), { ...env, CONTACT_LIMITER: limiter });
  assert.equal(res.status, 429);
  assert.equal(calls.length, 0);
});

test("rejects non-POST, non-JSON and oversized bodies", async () => {
  assert.equal((await handleContact(new Request("https://site.test/api/contact"), env)).status, 405);
  assert.equal((await handleContact(post("x", { "content-type": "text/plain" }), env)).status, 415);
  assert.equal((await handleContact(post("{", {}), env)).status, 400);
  assert.equal((await handleContact(post("x".repeat(17000)), env)).status, 413);
});

test("reports a provider failure as 502", async () => {
  globalThis.fetch = async () => new Response("bad", { status: 400 });
  const original = console.error;
  console.error = () => {};
  const res = await handleContact(post(valid), env);
  console.error = original;
  assert.equal(res.status, 502);
});

test("both emails come from the full company name", async () => {
  await handleContact(post(valid), env);
  assert.equal(calls[0].msg.From.Name, "Veridian Tech Innovations Ltd");
  assert.equal(calls[1].msg.From.Name, "Veridian Tech Innovations Ltd");
  assert.equal(calls[1].msg.ReplyTo.Name, "Veridian Tech Innovations Ltd");
});

test("the office email escapes everything the visitor typed", async () => {
  const hostile = { ...valid, name: "<b>Ada</b>", business: '"><img src=x onerror=alert(1)>', message: "<script>alert(1)</script> & more" };
  await handleContact(post(hostile), env);
  const html = calls[0].msg.HTMLPart;
  assert.doesNotMatch(html, /<script>|<img src=x|<b>Ada/);
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt; &amp; more"));
  assert.ok(html.includes("&lt;b&gt;Ada&lt;/b&gt;"));
});

test("the office email has one-tap replies, the preferred one first in weight", async () => {
  await handleContact(post({ ...valid, contactPref: "email" }), env);
  const html = calls[0].msg.HTMLPart;
  assert.ok(html.includes('href="mailto:ada@example.test?subject=Re%3A%20New%20enquiry'));
  assert.ok(html.includes('href="https://wa.me/2348060000000"'));
  assert.ok(html.includes('href="tel:08060000000"'));
  assert.match(html, /Prefers<\/td><td[^>]*><span[^>]*>Email</);
});

test("the receipt names the chosen service and reply method from the fixed lists", async () => {
  await handleContact(post({ ...valid, contactPref: "email" }), env);
  const { TextPart, HTMLPart } = calls[1].msg;
  assert.match(TextPart, /You asked about: Online store/);
  assert.match(TextPart, /get back to you by email within 24 hours/);
  assert.match(HTMLPart, /Veridian Tech Innovations Ltd/);
});

test("WhatsApp links use the international form of Nigerian numbers", () => {
  assert.equal(whatsappNumber("0806 504 1081"), "2348065041081");
  assert.equal(whatsappNumber("+234 806 504 1081"), "2348065041081");
});

// ---------- IT supply quote requests with attachments ----------

const supply = { service: "it-supply", name: "Ada Obi", business: "Acme Ltd", email: "ada@example.test", supplyItems: { "bulk-laptops": "40", cctv: "8", networking: "", nonsense: "5" }, location: "Abuja, FCT", neededBy: "within 4 weeks", purchaseType: "tender" };
const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a]);
const upload = (fields, files) => {
  const form = new FormData();
  form.set("payload", JSON.stringify(fields));
  for (const f of files) form.append("files", f);
  return new Request("https://site.test/api/contact", { method: "POST", body: form });
};

test("supply requests keep known items with quantities and drop the rest", () => {
  const { data, errors } = validate(supply);
  assert.deepEqual(errors, {});
  assert.deepEqual(data.supplyItems, [{ id: "bulk-laptops", qty: 40 }, { id: "cctv", qty: 8 }, { id: "networking", qty: 0 }]);
  assert.equal(data.purchaseType, "tender");
});

test("a supply request needs ticked items or an attached list, but no message", () => {
  assert.ok(validate({ ...supply, supplyItems: {} }).errors.supplyItems);
  assert.deepEqual(validate({ ...supply, supplyItems: {} }, { hasFiles: true }).errors, {});
});

test("the supply office email lists what they need, delivery, the tender flag and the files", async () => {
  const res = await handleContact(upload(supply, [new File([PDF], "Our BOQ <final>.pdf", { type: "application/pdf" })]), env);
  assert.equal(res.status, 200);
  const office = calls[0].msg;
  assert.equal(office.Subject, "Quote request: IT equipment, from Acme Ltd");
  assert.match(office.TextPart, /Needs: Laptops in bulk × 40 laptops · CCTV × 8 cameras · Networking and Wi-Fi/);
  assert.match(office.HTMLPart, /Tender or bid/);
  assert.equal(office.Attachments.length, 1);
  assert.equal(office.Attachments[0].Filename, "Our BOQ _final_.pdf");
  assert.equal(office.Attachments[0].ContentType, "application/pdf");
  assert.equal(atob(office.Attachments[0].Base64Content).slice(0, 4), "%PDF");
});

test("attachments never go to the visitor's acknowledgement", async () => {
  await handleContact(upload(supply, [new File([PDF], "list.pdf")]), env);
  assert.equal(calls[1].msg.Attachments, undefined);
});

test("a renamed program is rejected, whatever its name", async () => {
  const exe = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]);
  const res = await handleContact(upload(supply, [new File([exe], "invoice.pdf")]), env);
  assert.equal(res.status, 422);
  assert.match((await res.json()).fields.files, /not a real PDF/);
  assert.equal(calls.length, 0);
});

test("only the allowed file types, at most three files, within the size limits", async () => {
  const tooMany = await handleContact(upload(supply, [1, 2, 3, 4].map((i) => new File([PDF], `${i}.pdf`))), env);
  assert.match((await tooMany.json()).fields.files, /up to 3 files/);
  const wrongType = await handleContact(upload(supply, [new File(["x"], "run.exe")]), env);
  assert.match((await wrongType.json()).fields.files, /PDF, Excel, Word, CSV, JPG or PNG/);
  const big = new Uint8Array(8 * 1024 * 1024 + 1);
  big.set(PDF);
  const tooBig = await handleContact(upload(supply, [new File([big], "big.pdf")]), env);
  assert.match((await tooBig.json()).fields.files, /8 MB or smaller/);
  const six = new Uint8Array(6 * 1024 * 1024);
  six.set(PDF);
  const tooMuch = await handleContact(upload(supply, [new File([six], "a.pdf"), new File([six], "b.pdf")]), env);
  assert.match((await tooMuch.json()).fields.files, /10 MB or less/);
  assert.equal(calls.length, 0);
});

test("files are refused on anything but an IT supply request", async () => {
  const res = await handleContact(upload(valid, [new File([PDF], "list.pdf")]), env);
  assert.equal(res.status, 422);
  assert.match((await res.json()).fields.files, /only for IT equipment/);
});
