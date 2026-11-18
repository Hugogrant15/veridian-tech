import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Briefcase,
  Cctv,
  Check,
  CheckCircle,
  Globe,
  Handshake,
  HelpCircle,
  Laptop,
  MessagesSquare,
  MonitorSmartphone,
  Network,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShoppingBag,
  Smartphone,
  Target,
} from "lucide-react";
import OPTIONS from "../config/enquiry-options.json";
import { COMPANY, PRIMARY_PHONE, WHATSAPP_URL } from "../config/company";
import { ArrowIcon, WhatsAppGlyph } from "./ui";
import { FileDrop } from "./FileDrop";

// Short, branching form built to convert. One choice on step 1; tapping it moves straight on.
// Build work: what → timing/budget → details (3 steps). IT equipment: what → which items →
// delivery → details with an optional file upload (4 steps). Consultation, partnership, careers
// or a general question go straight to details (2 steps). Option ids are shared with the Worker.

const ICONS: Record<string, LucideIcon> = {
  websites: Globe,
  ecommerce: ShoppingBag,
  "landing-pages": Target,
  "mobile-apps": Smartphone,
  redesigns: RefreshCw,
  "seo-mobile": Search,
  consultation: MessagesSquare,
  partnership: Handshake,
  careers: Briefcase,
  general: HelpCircle,
  "it-supply": Laptop,
};

const SUPPLY_ICONS: Record<string, LucideIcon> = {
  "bulk-laptops": Laptop,
  "workspace-setup": MonitorSmartphone,
  networking: Network,
  cctv: Cctv,
  printers: Printer,
  other: Plus,
};

const CONTACT_PREFS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "call", label: "Phone call" },
  { id: "email", label: "Email" },
] as const;

const BUILD_OPTIONS = OPTIONS.services.filter((s) => s.group === "build");
const OTHER_OPTIONS = OPTIONS.services.filter((s) => s.group === "other");
const BUILD_IDS = new Set(BUILD_OPTIONS.map((s) => s.id));
const SERVICE_IDS = new Set(OPTIONS.services.map((s) => s.id));

/** 1 what · 2 timing and budget · 3 details · 4 IT items · 5 delivery. The order per path is in `steps`. */
type Step = 1 | 2 | 3 | 4 | 5;
type Status = "idle" | "sending" | "sent" | "failed";
type Field = "service" | "name" | "business" | "email" | "phone" | "siteUrl" | "role" | "profileUrl" | "message" | "supplyItems" | "files" | "location" | "neededBy";
type FieldErrors = Partial<Record<Field, string>>;

interface Draft {
  service: string;
  timeline: string;
  budget: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  contactPref: string;
  siteUrl: string;
  role: string;
  profileUrl: string;
  message: string;
  /** IT supply: ticked item id → quantity as typed ("" when none). */
  supplyItems: Record<string, string>;
  location: string;
  neededBy: string;
  purchaseType: string;
}

const EMPTY: Draft = {
  service: "",
  timeline: "",
  budget: "",
  name: "",
  business: "",
  email: "",
  phone: "",
  contactPref: "whatsapp",
  siteUrl: "",
  role: "",
  profileUrl: "",
  message: "",
  supplyItems: {},
  location: "",
  neededBy: "",
  purchaseType: "",
};

// v2: one service instead of a list. A new key so drafts saved by the old form are ignored.
const DRAFT_KEY = "vt_enquiry_draft_v2";
/** Pause after a tap so the gold "selected" edge shows before the next step slides in. */
const ADVANCE_DELAY_MS = 260;
const labelOf = (list: { id: string; label: string }[], id: string) => list.find((o) => o.id === id)?.label ?? "";

/** Draft from this browser session, plus ?service= from a link elsewhere on the site. */
function initialDraft(): Draft {
  let draft = EMPTY;
  try {
    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (saved) draft = { ...EMPTY, ...(JSON.parse(saved) as Partial<Draft>) };
  } catch {
    // Storage blocked or corrupt: start fresh.
  }
  if (!SERVICE_IDS.has(draft.service)) draft = { ...draft, service: "" };
  // A link like "Introduce yourself" pre-selects its option (the visitor can still change it).
  const preset = new URLSearchParams(window.location.search).get("service");
  if (preset && SERVICE_IDS.has(preset)) draft = { ...draft, service: preset };
  return draft;
}

/** What the visitor chose, in words that fit the kind of enquiry. */
function copyFor(service: string) {
  const build = BUILD_IDS.has(service);
  const supply = service === "it-supply";
  const careers = service === "careers";
  const partnership = service === "partnership";
  let messageLabel = "Anything else we should know?";
  if (careers) messageLabel = "Introduce yourself";
  else if (partnership) messageLabel = "Tell us about the partnership";
  else if (!build && !supply) messageLabel = "What would you like to discuss?";
  return {
    build,
    supply,
    careers,
    partnership,
    messageLabel,
    messageRequired: !build && !supply,
    // One choice only, so build visitors are prompted to mention any extra needs here.
    messagePlaceholder: build ? "e.g. you also need SEO, a mobile app or hosting" : supply ? "e.g. brands, specifications, accessories" : "",
    detailsTitle: careers ? "Tell us about yourself" : "Where should we reply?",
  };
}

function whatsappText(d: Draft): string {
  const c = copyFor(d.service);
  const chosen = labelOf(OPTIONS.services, d.service);
  const lines = [
    c.careers
      ? `Hello ${COMPANY.shortName}, I'd like to introduce myself for a role.`
      : c.build
        ? `Hello ${COMPANY.shortName}, I'd like help with: ${chosen}.`
        : `Hello ${COMPANY.shortName}, I'm getting in touch about: ${chosen}.`,
  ];
  if (c.build && d.timeline) lines.push(`Timing: ${labelOf(OPTIONS.timelines, d.timeline)}`);
  if (c.build && d.budget) lines.push(`Budget: ${labelOf(OPTIONS.budgets, d.budget)}`);
  if (c.supply) {
    const needs = OPTIONS.supplyItems
      .filter((i) => i.id in d.supplyItems)
      .map((i) => (d.supplyItems[i.id] ? `${i.label} × ${d.supplyItems[i.id]}` : i.label));
    if (needs.length) lines.push(`Needs: ${needs.join(", ")}`);
    if (d.location) lines.push(`Delivery: ${d.location}`);
    if (d.neededBy) lines.push(`Needed by: ${d.neededBy}`);
    if (d.purchaseType) lines.push(`Purchase: ${labelOf(OPTIONS.purchaseTypes, d.purchaseType)}`);
  }
  if (c.careers && d.role) lines.push(`Role or skills: ${d.role}`);
  if (c.careers && d.profileUrl) lines.push(`LinkedIn or portfolio: ${d.profileUrl}`);
  if (d.siteUrl) lines.push(`Current website: ${d.siteUrl}`);
  if (d.name) lines.push(`Name: ${d.name}${d.business ? `, ${d.business}` : ""}`);
  if (d.message) lines.push("", d.message);
  return lines.join("\n");
}

const inputClass =
  "w-full rounded-md border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted/70 focus:border-emerald focus:outline-none";
const labelClass = "mb-2 block text-sm font-medium text-ink";
const optional = <span className="font-normal text-muted">(optional)</span>;

const FieldError = ({ message }: { message: string | undefined }) =>
  message ? <p className="mt-1.5 text-sm text-red-700">{message}</p> : null;

/** A radio or checkbox styled as a tappable tile (6px corners, gold edge when chosen). */
function ChoiceTile({
  type,
  name,
  checked,
  onChange,
  children,
  compact = false,
  onPointerDown,
}: {
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  compact?: boolean;
  onPointerDown?: () => void;
}) {
  return (
    <label
      onPointerDown={onPointerDown}
      className={`relative flex cursor-pointer items-center gap-3 rounded-md border bg-white transition-[border-color,box-shadow,background-color] duration-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
        compact ? "px-3.5 py-3 text-sm" : "px-4 py-4"
      } ${
        checked
          ? "border-gold bg-[#FBF8F0] shadow-[0_0_0_1px_var(--color-gold),0_12px_28px_-18px_rgb(201_165_92/0.8)]"
          : "border-line hover:border-emerald/50"
      }`}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
      {checked && !compact && (
        <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-emerald-deep text-white">
          <Check size={13} strokeWidth={3} aria-hidden="true" />
        </span>
      )}
    </label>
  );
}

const noSubscription = () => () => {};

/**
 * The prerendered page always shows an empty form, so the first browser render
 * must match it. Once React has taken the page over, the form is mounted again
 * with the visitor's saved draft and any ?service= choice.
 */
export function EnquiryForm() {
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  return <Form key={hydrated ? "live" : "prerendered"} initial={hydrated ? initialDraft() : EMPTY} />;
}

function Form({ initial }: { initial: Draft }) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fax, setFax] = useState(""); // honeypot
  // Files can't be kept in the session draft, so they live here only.
  const [files, setFiles] = useState<File[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  // Auto-advance only for a tap or click. Arrow keys also change a radio, and moving on
  // with every key press would stop keyboard users browsing the options.
  const pointerChoice = useRef(false);
  const advanceTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // Keep the unfinished draft for this browser session.
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Not saving the draft is fine.
    }
  }, [draft]);

  // On each new step: bring the form's top into view (below the sticky navbar, via scroll-mt)
  // if it has scrolled away, then move focus to the heading for keyboard and screen-reader users.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 96) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      formRef.current?.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step, status]);

  const c = copyFor(draft.service);
  // Build work has a timing/budget step; IT equipment has items and delivery; everything else
  // goes straight to details. Before a choice, show the build path: it is what most visitors take.
  const steps: Step[] = c.supply ? [1, 4, 5, 3] : c.build || !draft.service ? [1, 2, 3] : [1, 3];
  const position = steps.indexOf(step) + 1;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  // Clear a field's error as soon as the visitor starts fixing it.
  const clearError = (field: Field) =>
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      return Object.fromEntries(Object.entries(prev).filter(([key]) => key !== field)) as FieldErrors;
    });
  const onInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as keyof Omit<Draft, "service">;
    set(field, e.target.value);
    if (field === "phone") clearError("email"); // "email or phone" error clears when either is given
    if (field in errors) clearError(field as Field);
  };

  const needsUrl = OPTIONS.needsWebsiteUrl.includes(draft.service);
  const waLink = `${WHATSAPP_URL}?text=${encodeURIComponent(whatsappText(draft))}`;

  // The step after "what": timing/budget for build work, otherwise straight to details.
  const stepAfterChoice = (service: string): Step => (BUILD_IDS.has(service) ? 2 : service === "it-supply" ? 4 : 3);

  const choose = (id: string) => {
    set("service", id);
    clearError("service");
    if (!pointerChoice.current) return; // keyboard: wait for Continue
    pointerChoice.current = false;
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => setStep(stepAfterChoice(id)), ADVANCE_DELAY_MS);
  };

  const goBack = () => setStep((s) => steps[steps.indexOf(s) - 1] ?? 1);

  const next = () => {
    if (step === 1) {
      if (!draft.service) {
        setErrors({ service: "Choose an option to continue." });
        return;
      }
      setErrors({});
      setStep(stepAfterChoice(draft.service));
      return;
    }
    setErrors({});
    setStep(steps[steps.indexOf(step) + 1] ?? 3);
  };

  const toggleItem = (id: string) =>
    setDraft((d) => ({
      ...d,
      supplyItems: id in d.supplyItems ? Object.fromEntries(Object.entries(d.supplyItems).filter(([key]) => key !== id)) : { ...d.supplyItems, [id]: "" },
    }));
  const setQty = (id: string, value: string) =>
    setDraft((d) => ({ ...d, supplyItems: { ...d.supplyItems, [id]: value.replace(/\D/g, "").slice(0, 6) } }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step !== 3) {
      next();
      return;
    }
    const local: FieldErrors = {};
    if (draft.name.trim().length < 2) local.name = "Please enter your name.";
    if (!draft.email.trim() && !draft.phone.trim()) local.email = "Give us an email address or a phone number.";
    if (c.careers && draft.role.trim().length < 2) local.role = "Tell us the role or skills you're interested in.";
    if (c.messageRequired && draft.message.trim().length < 10) local.message = "Please write a few words so we know how to help.";
    if (c.supply && Object.keys(draft.supplyItems).length === 0 && files.length === 0)
      local.files = "Tick what you need on the earlier step, or attach your list here.";
    if (Object.keys(local).length) {
      setErrors(local);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const payload = JSON.stringify({
        ...draft,
        timeline: c.build ? draft.timeline : "",
        budget: c.build ? draft.budget : "",
        siteUrl: needsUrl ? draft.siteUrl : "",
        role: c.careers ? draft.role : "",
        profileUrl: c.careers ? draft.profileUrl : "",
        supplyItems: c.supply ? draft.supplyItems : {},
        location: c.supply ? draft.location : "",
        neededBy: c.supply ? draft.neededBy : "",
        purchaseType: c.supply ? draft.purchaseType : "",
        fax,
      });
      // With files, the same fields travel as "payload" in a multipart form.
      let init: RequestInit = { method: "POST", headers: { "content-type": "application/json" }, body: payload };
      if (c.supply && files.length) {
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
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {
          // Ignore.
        }
        return;
      }
      if (res.status === 422 && body.fields) {
        setErrors(body.fields);
        setStatus("idle");
        if (body.fields.service) setStep(1);
        else if (body.fields.supplyItems) setStep(4);
        return;
      }
      setStatus("failed");
    } catch {
      setStatus("failed");
    }
  };

  const card = "rounded-xl border border-line bg-white/70 p-6 shadow-[0_30px_60px_-40px_rgb(15_31_23/0.35)] sm:p-9";
  const headingClass = "text-2xl font-medium tracking-[-0.01em] text-ink outline-none sm:text-[26px]";

  if (status === "sent" || status === "failed") {
    const sent = status === "sent";
    // After a successful send, the screen follows the reply method the visitor chose;
    // only a WhatsApp preference gets the big WhatsApp button.
    const reply = { email: "by email", whatsapp: "on WhatsApp", call: "with a call" }[draft.contactPref] ?? "";
    const showWhatsAppButton = !sent || draft.contactPref === "whatsapp";
    return (
      <div ref={formRef} className={`${card} scroll-mt-28`} role={sent ? "status" : "alert"}>
        <div className="flex flex-col items-start gap-4">
          {sent ? (
            <CheckCircle className="size-11 text-emerald" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-11 text-gold" aria-hidden="true" />
          )}
          <h2 ref={headingRef} tabIndex={-1} className={headingClass}>
            {sent ? "Received. Thank you." : "Send it on WhatsApp instead"}
          </h2>
          <p className="leading-relaxed text-body">
            {sent
              ? `We'll get back to you${reply ? ` ${reply}` : ""} within 24 hours.${draft.email ? " A confirmation is on its way to your inbox." : ""}`
              : "Your message couldn't be sent from the website right now. Tap below and WhatsApp opens with everything you've told us already typed."}
          </p>
          {showWhatsAppButton && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex h-14 w-full items-center justify-center gap-3 rounded-md bg-[#25D366] px-6 font-semibold text-white transition-transform hover:brightness-105 active:scale-[0.98] sm:w-auto"
            >
              <WhatsAppGlyph className="size-5" />
              {sent ? "Continue on WhatsApp" : "Send on WhatsApp"}
            </a>
          )}
          {sent && draft.contactPref === "call" && (
            <p className="text-sm text-muted">
              Urgent? Call{" "}
              <a href={`tel:${PRIMARY_PHONE.tel}`} className="font-semibold text-emerald-deep underline">
                {PRIMARY_PHONE.display}
              </a>
              .
            </p>
          )}
          {sent && !showWhatsAppButton && draft.contactPref !== "call" && (
            <p className="text-sm text-muted">
              Urgent?{" "}
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-deep underline">
                WhatsApp us
              </a>
              .
            </p>
          )}
          {!sent && (
            <p className="text-sm text-muted">
              Or call{" "}
              <a href={`tel:${PRIMARY_PHONE.tel}`} className="font-semibold text-emerald-deep underline">
                {PRIMARY_PHONE.display}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    );
  }

  const stepTitles: Record<Step, string> = {
    1: "How can we help?",
    2: "When, and roughly what budget?",
    3: c.detailsTitle,
    4: "What do you need?",
    5: "Delivery and timing",
  };

  const tiles = (list: typeof OPTIONS.services) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {list.map((s) => {
        const Icon = ICONS[s.id] ?? HelpCircle;
        return (
          <ChoiceTile
            key={s.id}
            type="radio"
            name="service"
            checked={draft.service === s.id}
            onChange={() => choose(s.id)}
            onPointerDown={() => {
              pointerChoice.current = true;
            }}
          >
            <span className="flex flex-col items-start gap-2.5 pr-4">
              <Icon size={22} strokeWidth={1.6} className="text-emerald-deep" aria-hidden="true" />
              <span className="text-[15px] leading-snug font-medium text-ink">{s.label}</span>
            </span>
          </ChoiceTile>
        );
      })}
    </div>
  );

  return (
    <div ref={formRef} className="scroll-mt-28">
      <form onSubmit={submit} noValidate className={card}>
        {/* Progress */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            Step {position} of {steps.length}
          </p>
          {step > 1 && (
            <button type="button" onClick={goBack} className="text-sm font-medium text-emerald-deep hover:underline">
              ← Back
            </button>
          )}
        </div>
        <div aria-hidden="true" className="mb-8 flex gap-2">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < position ? "bg-gradient-to-r from-emerald-deep to-emerald" : "bg-line"}`}
            />
          ))}
        </div>

        <h2 ref={headingRef} tabIndex={-1} className={`${headingClass} mb-6`}>
          {stepTitles[step]}
        </h2>

        <div key={step} className="rise" style={{ animationDuration: "0.45s" }}>
          {step === 1 && (
            <div className="flex flex-col gap-7">
              <p className="-mt-3 text-sm text-muted">Pick the one closest to what you need.</p>
              <fieldset>
                <legend className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Build something</legend>
                {tiles(BUILD_OPTIONS)}
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Something else</legend>
                {tiles(OTHER_OPTIONS)}
              </fieldset>
              <FieldError message={errors.service} />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-8">
              <fieldset>
                <legend className={labelClass}>When would you like to start?</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {OPTIONS.timelines.map((t) => (
                    <ChoiceTile key={t.id} type="radio" name="timeline" compact checked={draft.timeline === t.id} onChange={() => set("timeline", t.id)}>
                      <span className="font-medium text-ink">{t.label}</span>
                    </ChoiceTile>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className={labelClass}>Rough budget {optional}</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {OPTIONS.budgets.map((b) => (
                    <ChoiceTile key={b.id} type="radio" name="budget" compact checked={draft.budget === b.id} onChange={() => set("budget", b.id)}>
                      <span className="font-medium text-ink">{b.label}</span>
                    </ChoiceTile>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <p className="-mt-3 text-sm text-muted">Tick all that apply. Quantities help us quote faster, but they&apos;re optional.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {OPTIONS.supplyItems.map((item) => {
                  const Icon = SUPPLY_ICONS[item.id] ?? Plus;
                  const checked = item.id in draft.supplyItems;
                  return (
                    <div key={item.id} className="flex flex-col gap-2">
                      <ChoiceTile type="checkbox" name="supplyItems" checked={checked} onChange={() => toggleItem(item.id)}>
                        <span className="flex flex-col items-start gap-2.5 pr-4">
                          <Icon size={22} strokeWidth={1.6} className="text-emerald-deep" aria-hidden="true" />
                          <span className="text-[15px] leading-snug font-medium text-ink">{item.label}</span>
                        </span>
                      </ChoiceTile>
                      {checked && item.qtyLabel && (
                        <label className="flex items-center gap-2 text-sm text-muted">
                          <span className="whitespace-nowrap">{item.qtyLabel}:</span>
                          <input
                            inputMode="numeric"
                            value={draft.supplyItems[item.id] ?? ""}
                            onChange={(e) => setQty(item.id, e.target.value)}
                            placeholder="e.g. 20"
                            aria-label={`${item.label}: ${item.qtyLabel.toLowerCase()}`}
                            className="w-full min-w-0 rounded-md border border-line bg-white px-3 py-2 text-ink focus:border-emerald focus:outline-none"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
              <FieldError message={errors.supplyItems} />
              <p className="text-sm text-muted">
                Laptops for different kinds of staff?{" "}
                <Link to="/it-supply/build-your-order" className="font-semibold text-emerald-deep underline">
                  Use the order builder
                </Link>{" "}
                for a specification per group. Or attach your own list on the last step.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="location" className={labelClass}>
                    Delivery location {optional}
                  </label>
                  <input id="location" name="location" maxLength={120} placeholder="City and state" value={draft.location} onChange={onInput} className={inputClass} />
                  <FieldError message={errors.location} />
                </div>
                <div>
                  <label htmlFor="neededBy" className={labelClass}>
                    Needed by {optional}
                  </label>
                  <input id="neededBy" name="neededBy" maxLength={80} placeholder="A date, or e.g. within 4 weeks" value={draft.neededBy} onChange={onInput} className={inputClass} />
                  <FieldError message={errors.neededBy} />
                </div>
              </div>
              <fieldset>
                <legend className={labelClass}>Type of purchase {optional}</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {OPTIONS.purchaseTypes.map((p) => (
                    <ChoiceTile key={p.id} type="radio" name="purchaseType" compact checked={draft.purchaseType === p.id} onChange={() => set("purchaseType", p.id)}>
                      <span className="font-medium text-ink">{p.label}</span>
                    </ChoiceTile>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Your name
                  </label>
                  <input id="name" name="name" autoComplete="name" maxLength={100} value={draft.name} onChange={onInput} className={inputClass} />
                  <FieldError message={errors.name} />
                </div>
                {!c.careers && (
                  <div>
                    <label htmlFor="business" className={labelClass}>
                      {c.partnership ? "Organisation" : "Business name"} {optional}
                    </label>
                    <input id="business" name="business" autoComplete="organization" maxLength={120} value={draft.business} onChange={onInput} className={inputClass} />
                    <FieldError message={errors.business} />
                  </div>
                )}
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone or WhatsApp
                  </label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={draft.phone} onChange={onInput} className={inputClass} />
                  <FieldError message={errors.phone} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={draft.email} onChange={onInput} className={inputClass} />
                  <FieldError message={errors.email} />
                </div>
              </div>
              <p className="-mt-2 text-sm text-muted">Give us either one. We&apos;ll reply on whichever you prefer:</p>
              <fieldset>
                <legend className="sr-only">How should we reply?</legend>
                <div className="grid grid-cols-3 gap-3">
                  {CONTACT_PREFS.map((p) => (
                    <ChoiceTile key={p.id} type="radio" name="contactPref" compact checked={draft.contactPref === p.id} onChange={() => set("contactPref", p.id)}>
                      <span className="font-medium text-ink">{p.label}</span>
                    </ChoiceTile>
                  ))}
                </div>
              </fieldset>
              {c.careers && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="role" className={labelClass}>
                      Role or skills you&apos;re interested in
                    </label>
                    <input id="role" name="role" maxLength={120} placeholder="e.g. Frontend developer" value={draft.role} onChange={onInput} className={inputClass} />
                    <FieldError message={errors.role} />
                  </div>
                  <div>
                    <label htmlFor="profileUrl" className={labelClass}>
                      LinkedIn or portfolio {optional}
                    </label>
                    <input id="profileUrl" name="profileUrl" inputMode="url" placeholder="e.g. linkedin.com/in/yourname" maxLength={200} value={draft.profileUrl} onChange={onInput} className={inputClass} />
                    <FieldError message={errors.profileUrl} />
                  </div>
                </div>
              )}
              {needsUrl && (
                <div>
                  <label htmlFor="siteUrl" className={labelClass}>
                    Your current website
                  </label>
                  <input id="siteUrl" name="siteUrl" inputMode="url" placeholder="e.g. mybusiness.com" maxLength={200} value={draft.siteUrl} onChange={onInput} className={inputClass} />
                  <FieldError message={errors.siteUrl} />
                </div>
              )}
              <div>
                <label htmlFor="message" className={labelClass}>
                  {c.messageLabel} {!c.messageRequired && optional}
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={c.messagePlaceholder}
                  rows={c.messageRequired ? 4 : 3}
                  maxLength={5000}
                  value={draft.message}
                  onChange={onInput}
                  className={`${inputClass} resize-none`}
                />
                <FieldError message={errors.message} />
              </div>
              {c.supply && (
                <div>
                  <p className={labelClass}>Upload your list, BOQ or RFQ {optional}</p>
                  <FileDrop
                    files={files}
                    error={errors.files}
                    onChange={(next, problem) => {
                      setFiles(next);
                      setErrors((prev) => ({ ...prev, files: problem || undefined }));
                    }}
                  />
                </div>
              )}
              {/* Honeypot: hidden from people, filled in by bots. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="fax">Fax</label>
                <input id="fax" name="fax" tabIndex={-1} autoComplete="off" value={fax} onChange={(e) => setFax(e.target.value)} />
              </div>
              <p className="text-sm text-muted">
                We use these details only to reply to you. See our{" "}
                <Link to="/privacy" className="underline hover:text-emerald-deep">
                  privacy notice
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        {/* Step 1: a tap moves on by itself, so Continue only appears once something is chosen
            (keyboard users, a pre-selected link, or coming back with Back). */}
        {(step !== 1 || draft.service) && (
          <button type="submit" disabled={status === "sending"} className="btn mt-8 w-full disabled:cursor-wait disabled:opacity-70">
            <span className="btn-label">
              <span>{step !== 3 ? "Continue" : status === "sending" ? "Sending…" : c.careers ? "Send introduction" : c.supply ? "Request a quote" : "Send"}</span>
            </span>
            <span className="btn-arrow" aria-hidden="true">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          </button>
        )}
      </form>
    </div>
  );
}
