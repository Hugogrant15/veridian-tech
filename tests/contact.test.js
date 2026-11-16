import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { handleContact, summarise, validate } from "../worker/contact.js";

const env = { BREVO_API_KEY: "key", MAIL_FROM: "noreply@example.test", CONTACT_TO: "office@example.test" };
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

let calls;
const realFetch = globalThis.fetch;
beforeEach(() => {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return new Response("{}", { status: 201 });
  };
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("sends in sandbox mode by default", async () => {
  const res = await handleContact(post(valid), env);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, sandbox: true });
  assert.equal(calls[0].init.headers["X-Sib-Sandbox"], "drop");
});

test("only BREVO_LIVE=true turns sandbox off", async () => {
  await handleContact(post(valid), { ...env, BREVO_LIVE: "TRUE" });
  assert.equal(calls[0].init.headers["X-Sib-Sandbox"], "drop");
  await handleContact(post(valid), { ...env, BREVO_LIVE: "true" });
  assert.equal(calls[1].init.headers["X-Sib-Sandbox"], undefined);
});

test("emails only the office, never the visitor", async () => {
  await handleContact(post(valid), env);
  const { to, replyTo } = calls[0].body;
  assert.deepEqual(to, [{ email: env.CONTACT_TO }]);
  assert.equal(replyTo.email, valid.email);
});

test("subject and body summarise the enquiry with readable labels", async () => {
  await handleContact(post(valid), env);
  const { subject, textContent } = calls[0].body;
  assert.equal(subject, "New enquiry: Online store, from Ada Obi");
  assert.match(textContent, /About: Online store/);
  assert.match(textContent, /Timing: In 1 to 3 months/);
  assert.match(textContent, /Budget: ₦500k – ₦1.5m/);
  assert.match(textContent, /Prefers: WhatsApp/);
});

test("a phone number alone is enough; no Reply-To is set", async () => {
  const res = await handleContact(post({ ...valid, email: "" }), env);
  assert.equal(res.status, 200);
  assert.equal(calls[0].body.replyTo, undefined);
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
  const { subject, textContent } = calls[0].body;
  assert.equal(subject, "Careers: Tolu Ade");
  assert.match(textContent, /Role or skills: Frontend developer/);
  assert.match(textContent, /LinkedIn or portfolio: linkedin\.com\/in\/tolu/);
  assert.doesNotMatch(textContent, /Timing|Budget/);
});

test("non-build enquiries require a message", () => {
  const { errors } = validate({ service: "general", name: "Ada Obi", email: "ada@example.test", message: "" });
  assert.ok(errors.message);
  assert.deepEqual(validate({ service: "general", name: "Ada Obi", email: "ada@example.test", message: "Do you build school portals?" }).errors, {});
});

test("partnership subject uses the organisation name", async () => {
  await handleContact(post({ service: "partnership", name: "Ada Obi", business: "Acme Ltd", email: "ada@acme.test", message: "We'd like to refer clients to you." }), env);
  assert.equal(calls[0].body.subject, "Partnership enquiry: Acme Ltd");
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
