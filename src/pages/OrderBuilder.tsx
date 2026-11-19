import { useState, type FormEvent } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY } from "../config/company";
import { BRANDS, PURCHASE_TYPES, STAFF_PROFILES, SUPPLY_SERVICES, type StaffProfile } from "../config/supply";
import { PageHeader } from "../components/PageHeader";
import { Accent, Seo, WhatsAppGlyph } from "../components/ui";
import { FileDrop } from "../components/FileDrop";
import { DeliveryFields, type Delivery } from "../components/DeliveryFields";
import OPTIONS from "../config/enquiry-options.json";

const OPERATING_SYSTEMS = ["No preference", "Windows 11 Pro", "Windows 11 Home", "macOS", "Linux"] as const;
/** Other supply services the buyer can add to the same request. */
const ADD_ONS = SUPPLY_SERVICES.filter((s) => s.id !== "bulk-laptops");
const MAX_GROUPS = 8;
const MAX_QTY = 100_000;

interface Group {
  key: number;
  profileId: string;
  qty: number;
}

type Status = "idle" | "sending" | "sent" | "failed";
type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message" | "files" | "supplyItems", string>>;

/** The purchase type label shown here → the option id the Worker knows. */
const purchaseId = (label: string) => OPTIONS.purchaseTypes.find((p) => p.label === label)?.id ?? "";

const profileOf = (id: string): StaffProfile | undefined => STAFF_PROFILES.find((p) => p.id === id);
const FIRST_PROFILE = STAFF_PROFILES[0]?.id ?? "";

const inputClass =
  "w-full rounded-md border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted/70 focus:border-emerald focus:outline-none";
const labelClass = "mb-2 block text-sm font-medium text-ink";
const legendClass = "mb-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase";

/**
 * Order builder: the buyer says who the laptops are for and how many, and gets a
 * specification sheet to send as a quote request (through /api/contact) or on WhatsApp.
 */
export default function OrderBuilder() {
  const [groups, setGroups] = useState<Group[]>([{ key: 1, profileId: FIRST_PROFILE, qty: 10 }]);
  const [nextKey, setNextKey] = useState(2);
  const [brand, setBrand] = useState<string>(BRANDS[0]);
  const [os, setOs] = useState<string>(OPERATING_SYSTEMS[0]);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<Delivery>({ state: "", city: "", neededBy: "", neededDate: "" });
  const [purchaseType, setPurchaseType] = useState<string>(PURCHASE_TYPES[0]);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState({ name: "", business: "", email: "", phone: "" });
  const [fax, setFax] = useState(""); // honeypot
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [copied, setCopied] = useState(false);

  const total = groups.reduce((sum, g) => sum + g.qty, 0);

  // The choices beyond the laptops, as [label, value] rows for the specification sheet.
  // "No preference" and empty answers are left out.
  const place = [delivery.city.trim(), delivery.state].filter(Boolean).join(", ");
  const neededByLabel =
    delivery.neededBy === "date"
      ? delivery.neededDate &&
        new Date(`${delivery.neededDate}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
      : OPTIONS.neededBy.find((o) => o.id === delivery.neededBy)?.label;
  const orderDetails = (
    [
      ["Brand", brand === BRANDS[0] ? "" : brand],
      ["Operating system", os === OPERATING_SYSTEMS[0] ? "" : os],
      ["Also needed", ADD_ONS.filter((s) => addOns.includes(s.id)).map((s) => s.short).join(", ")],
      ["Delivery", place],
      ["Needed by", neededByLabel ?? ""],
      ["Purchase", purchaseType],
      ["Attached", files.length ? `${files.length} file${files.length === 1 ? "" : "s"}` : ""],
    ] as [string, string][]
  ).filter(([, value]) => value);

  const updateGroup = (key: number, change: Partial<Group>) =>
    setGroups((list) => list.map((g) => (g.key === key ? { ...g, ...change } : g)));
  const addGroup = () => {
    setGroups((list) => [...list, { key: nextKey, profileId: FIRST_PROFILE, qty: 1 }]);
    setNextKey((k) => k + 1);
  };
  const toggleAddOn = (id: string) => setAddOns((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  /** The specification as plain text: what is emailed, sent on WhatsApp and copied. */
  const specText = (): string => {
    const lines = ["LAPTOP ORDER SPECIFICATION", ""];
    groups.forEach((g, i) => {
      const profile = profileOf(g.profileId);
      if (!profile) return;
      lines.push(`${i + 1}. ${profile.label}: ${g.qty} unit${g.qty === 1 ? "" : "s"}`);
      profile.spec.forEach((s) => lines.push(`   ${s.label}: ${s.value}`));
      lines.push("");
    });
    lines.push(`Total laptops: ${total}`, `Brand preference: ${brand}`, `Operating system: ${os}`);
    const extras = ADD_ONS.filter((s) => addOns.includes(s.id)).map((s) => s.short);
    if (extras.length) lines.push(`Also needed: ${extras.join(", ")}`);
    const place = [delivery.city.trim(), delivery.state].filter(Boolean).join(", ");
    const when = delivery.neededBy === "date" ? delivery.neededDate : OPTIONS.neededBy.find((o) => o.id === delivery.neededBy)?.label;
    lines.push(`Delivery location: ${place || "not given"}`, `Needed by: ${when || "not given"}`, `Purchase type: ${purchaseType}`);
    if (note.trim()) lines.push("", `Note: ${note.trim()}`);
    return lines.join("\n");
  };

  const whatsappUrl = () => {
    const from = contact.name.trim() ? `\n\nFrom: ${contact.name.trim()}${contact.business.trim() ? `, ${contact.business.trim()}` : ""}` : "";
    return `https://wa.me/${COMPANY.whatsapp.wa}?text=${encodeURIComponent(`Hello Veridian, please quote for this order.\n\n${specText()}${from}`)}`;
  };

  const copySpec = async () => {
    try {
      await navigator.clipboard.writeText(specText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the specification is still on screen to select by hand.
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrors({});
    try {
      // The laptops and any add-ons as structured items, so the office email lists them;
      // the full specification travels as the message.
      const supplyItems: Record<string, string> = { "bulk-laptops": String(total) };
      for (const id of addOns) supplyItems[id] = "";
      const payload = JSON.stringify({
        service: "it-supply",
        ...contact,
        supplyItems,
        deliveryState: delivery.state,
        location: delivery.city,
        neededBy: delivery.neededBy,
        neededDate: delivery.neededDate,
        purchaseType: purchaseId(purchaseType),
        message: specText(),
        fax,
      });
      let init: RequestInit = { method: "POST", headers: { "content-type": "application/json" }, body: payload };
      if (files.length) {
        const form = new FormData();
        form.set("payload", payload);
        for (const file of files) form.append("files", file);
        init = { method: "POST", body: form };
      }
      const res = await fetch("/api/contact", init);
      const body = (await res.json().catch(() => ({}))) as { sandbox?: boolean; fields?: FieldErrors };
      // In production a sandboxed send is not delivered, so never claim success for it.
      if (res.ok && (!body.sandbox || import.meta.env.DEV)) {
        setStatus("sent");
        return;
      }
      if (res.status === 422 && body.fields) {
        setErrors(body.fields);
        setStatus("idle");
        return;
      }
      setStatus("failed");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <>
      <Seo
        title="Build Your Laptop Order | Veridian Tech Innovations Ltd"
        description="Choose who the laptops are for and how many, get a recommended specification for each group, and send it as a quote request. For bulk orders anywhere in Nigeria."
      />
      <PageHeader
        compact
        eyebrow="IT supply · Order builder"
        title={
          <>
            Build your <Accent>laptop order.</Accent>
          </>
        }
        sub="Say who the laptops are for and how many. You get a recommended specification for each group, ready to send as a quote request."
      />

      <form onSubmit={submit} noValidate className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16 lg:px-10">
        <div className="flex flex-col gap-12">
          <fieldset>
            <legend className={legendClass}>1. Who are the laptops for?</legend>
            <ul className="flex flex-col gap-4">
              {groups.map((group, i) => {
                const profile = profileOf(group.profileId);
                return (
                  <li key={group.key} className="rounded-[10px] border border-line bg-white/70 p-5">
                    <div className="grid gap-4 sm:grid-cols-[1fr_130px_auto] sm:items-end">
                      <div>
                        <label htmlFor={`profile-${group.key}`} className={labelClass}>
                          Group {i + 1}
                        </label>
                        <select
                          id={`profile-${group.key}`}
                          value={group.profileId}
                          onChange={(e) => updateGroup(group.key, { profileId: e.target.value })}
                          className={inputClass}
                        >
                          {STAFF_PROFILES.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`qty-${group.key}`} className={labelClass}>
                          Quantity
                        </label>
                        <input
                          id={`qty-${group.key}`}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={MAX_QTY}
                          value={group.qty}
                          onChange={(e) => updateGroup(group.key, { qty: Math.min(MAX_QTY, Math.max(1, Math.floor(Number(e.target.value)) || 1)) })}
                          className={inputClass}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setGroups((list) => list.filter((g) => g.key !== group.key))}
                        disabled={groups.length === 1}
                        aria-label={`Remove group ${i + 1}`}
                        className="flex size-[50px] items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                    {profile && <p className="mt-3 text-sm text-muted">{profile.usedFor}</p>}
                  </li>
                );
              })}
            </ul>
            {groups.length < MAX_GROUPS && (
              <button type="button" onClick={addGroup} className="mt-4 inline-flex items-center gap-2 font-semibold whitespace-nowrap text-emerald-deep hover:underline">
                <Plus size={18} aria-hidden="true" />
                Add another group
              </button>
            )}
          </fieldset>

          <fieldset>
            <legend className={legendClass}>2. Preferences</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="brand" className={labelClass}>
                  Brand
                </label>
                <select id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass}>
                  {BRANDS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="os" className={labelClass}>
                  Operating system
                </label>
                <select id="os" value={os} onChange={(e) => setOs(e.target.value)} className={inputClass}>
                  {OPERATING_SYSTEMS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-6 mb-3 text-sm font-medium text-ink">Do you also need any of these?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {ADD_ONS.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-md border border-line bg-white/70 px-4 py-3 text-ink has-checked:border-emerald">
                  <input type="checkbox" checked={addOns.includes(s.id)} onChange={() => toggleAddOn(s.id)} className="size-4 accent-emerald-deep" />
                  {s.short}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={legendClass}>3. Delivery</legend>
            <DeliveryFields value={delivery} onChange={setDelivery} idPrefix="order-delivery" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="purchaseType" className={labelClass}>
                  Type of purchase
                </label>
                <select id="purchaseType" value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)} className={inputClass}>
                  {PURCHASE_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="note" className={labelClass}>
                Anything else? <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                id="note"
                rows={3}
                maxLength={800}
                placeholder="Exact models, tender requirements, accessories…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="mt-5">
              <p className={labelClass}>
                Attach your own list, BOQ or RFQ <span className="font-normal text-muted">(optional)</span>
              </p>
              <FileDrop
                files={files}
                error={errors.files}
                onChange={(next, problem) => {
                  setFiles(next);
                  setErrors((prev) => ({ ...prev, files: problem || undefined }));
                }}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className={legendClass}>4. Where do we send the quotation?</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Your name
                </label>
                <input id="name" autoComplete="name" maxLength={100} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={inputClass} />
                {errors.name && <p className="mt-2 text-sm text-red-700">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="business" className={labelClass}>
                  Organisation <span className="font-normal text-muted">(optional)</span>
                </label>
                <input id="business" autoComplete="organization" maxLength={120} value={contact.business} onChange={(e) => setContact({ ...contact, business: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input id="email" type="email" autoComplete="email" maxLength={254} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputClass} />
                {errors.email && <p className="mt-2 text-sm text-red-700">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone
                </label>
                <input id="phone" type="tel" autoComplete="tel" maxLength={30} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={inputClass} />
                {errors.phone && <p className="mt-2 text-sm text-red-700">{errors.phone}</p>}
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">An email address or a phone number is enough.</p>
            {/* Honeypot: hidden from people, filled in by bots. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="fax">Fax</label>
              <input id="fax" name="fax" tabIndex={-1} autoComplete="off" value={fax} onChange={(e) => setFax(e.target.value)} />
            </div>
          </fieldset>
        </div>

        {/* The specification sheet: updates as the buyer builds, and stays in view on large screens. */}
        <aside className="rounded-[10px] border border-gold/40 bg-night p-6 text-pearl sm:p-8 lg:sticky lg:top-28">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold-light uppercase">Your specification</p>
          <p className="mt-3 font-serif text-4xl italic">
            {total.toLocaleString("en-NG")} laptop{total === 1 ? "" : "s"}
          </p>
          <ol className="mt-6 flex flex-col gap-6">
            {groups.map((group) => {
              const profile = profileOf(group.profileId);
              if (!profile) return null;
              return (
                <li key={group.key} className="border-t border-gold/25 pt-4">
                  <p className="flex justify-between gap-4 font-semibold">
                    <span>{profile.label}</span>
                    <span className="flex-shrink-0 text-gold-light">× {group.qty.toLocaleString("en-NG")}</span>
                  </p>
                  <dl className="mt-2 flex flex-col gap-1 text-sm">
                    {profile.spec.map((line) => (
                      <div key={line.label} className="flex justify-between gap-6">
                        <dt className="flex-shrink-0 text-sage">{line.label}</dt>
                        <dd className="text-right">{line.value}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ol>
          {/* Everything else picked on the left, so the sheet matches what will be sent. */}
          {orderDetails.length > 0 && (
            <div className="mt-6 border-t border-gold/25 pt-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-gold-light uppercase">Order details</p>
              <dl className="mt-3 flex flex-col gap-1.5 text-sm">
                {orderDetails.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6">
                    <dt className="flex-shrink-0 text-sage">{label}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <p className="mt-6 border-t border-gold/25 pt-4 text-sm text-sage">
            A recommended starting point. We confirm the exact models with you before quoting.
          </p>

          <div className="mt-6 flex flex-col gap-3" aria-live="polite">
            {status === "sent" ? (
              <p className="flex items-start gap-3 rounded-md border border-emerald-bright/40 bg-emerald-bright/10 p-4">
                <Check size={20} className="mt-0.5 flex-shrink-0 text-emerald-bright" aria-hidden="true" />
                <span>
                  Your request is with us. We&apos;ll get back to you within 24 hours with any questions or a written quotation.
                  {contact.email.trim() ? " A confirmation is on its way to your inbox." : ""}
                </span>
              </p>
            ) : (
              <>
                {status === "failed" && (
                  <p className="rounded-md border border-gold/40 bg-gold/10 p-4 text-sm">
                    We could not send that from here. Send it on WhatsApp below and it reaches us straight away.
                  </p>
                )}
                {errors.message && <p className="text-sm text-gold-light">{errors.message}</p>}
                <button type="submit" disabled={status === "sending"} className="btn btn-gold w-full disabled:cursor-wait disabled:opacity-70">
                  <span className="btn-label">
                    <span>{status === "sending" ? "Sending…" : "Send quote request"}</span>
                  </span>
                </button>
              </>
            )}
            {/* Once the request has gone, offering WhatsApp again would only send it twice. */}
            {status !== "sent" && (
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-md border border-pearl/25 px-6 font-semibold whitespace-nowrap text-pearl transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10"
              >
                <WhatsAppGlyph className="size-5 text-[#25D366]" />
                Send on WhatsApp
              </a>
            )}
            <button type="button" onClick={copySpec} className="inline-flex h-12 items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap text-gold-light hover:underline">
              <Copy size={16} aria-hidden="true" />
              {copied ? "Copied" : "Copy the specification"}
            </button>
          </div>
          <p className="mt-4 text-xs text-sage">
            We use your details only to reply to you. See our{" "}
            <Link to="/privacy" className="underline hover:text-pearl">
              privacy notice
            </Link>
            .
          </p>
        </aside>
      </form>
    </>
  );
}
