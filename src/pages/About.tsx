import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { COMPANY, formatAddress } from "../config/company";
import { LEADER, MILESTONES, STATEMENT, STORY, TEAM } from "../config/about";
import { PageHeader } from "../components/PageHeader";
import { CircuitWatermark } from "../components/CircuitArt";
import { Eyebrow, Seo, Shot } from "../components/ui";
import { CtaBand } from "../sections/CtaBand";
import { Manifesto } from "../sections/Manifesto";

const INCORPORATED = "25 February 2026";

/** Header visual: the company's registration details as an engraved plaque. */
function RegistryPlate() {
  const lines = [
    { text: COMPANY.legalName, className: "font-serif text-2xl italic text-pearl sm:text-3xl" },
    { text: "Registered with the Corporate Affairs Commission", className: "text-sm text-sage" },
    { text: `RC ${COMPANY.rcNumber}`, className: "text-xl font-semibold tracking-[0.08em] text-gold-light" },
    { text: `D-U-N-S ${COMPANY.duns}`, className: "text-xl font-semibold tracking-[0.08em] text-gold-light" },
    { text: `Incorporated ${INCORPORATED} · Lagos, Nigeria`, className: "text-sm text-sage" },
  ];
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
      <CircuitWatermark className="absolute top-1/2 left-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 text-emerald-bright/[0.07]" />
      {/* Double gold frame that draws itself in. */}
      <svg aria-hidden="true" viewBox="0 0 500 400" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <rect className="frame-draw" x="1" y="1" width="498" height="398" rx="6" fill="none" stroke="#C9A55C" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <rect className="frame-draw" style={{ animationDelay: "0.5s" }} x="12" y="12" width="476" height="376" rx="3" fill="none" stroke="#C9A55C" strokeOpacity="0.45" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        {lines.map((line, i) => (
          <p key={line.text} className={`rise ${line.className}`} style={{ animationDelay: `${0.9 + i * 0.15}s` }}>
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Copies a value (RC, D-U-N-S) for banks and procurement forms. */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the number is still on screen to select by hand.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-emerald hover:text-emerald-deep"
    >
      {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

const RECORD: { label: string; value: string; copy?: string }[] = [
  { label: "Registered name", value: COMPANY.legalName },
  { label: "RC number", value: COMPANY.rcNumber, copy: "RC number" },
  { label: "D-U-N-S number", value: COMPANY.duns, copy: "D-U-N-S number" },
  { label: "Incorporated", value: INCORPORATED },
  { label: COMPANY.director.title, value: COMPANY.director.name },
  { label: "Registered office", value: formatAddress() },
];

export default function About() {
  return (
    <>
      <Seo
        title="About | Veridian Tech Innovations Ltd"
        description={`${COMPANY.legalName} is a Lagos software and IT supply company (RC ${COMPANY.rcNumber}), and the maker of EasyPass.`}
      />
      <PageHeader
        tone="dark"
        eyebrow="About us"
        title={
          <>
            A Lagos software company, <span className="font-serif text-[1.12em] font-normal tracking-[-0.01em] text-emerald-bright italic">built to last.</span>
          </>
        }
        visual={<RegistryPlate />}
      />

      {/* Statement and story */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="reveal grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <blockquote className="font-serif text-4xl leading-[1.15] text-ink italic sm:text-5xl">
            <span aria-hidden="true" className="mr-1 text-emerald-deep">“</span>
            {STATEMENT}
            <span aria-hidden="true" className="text-emerald-deep">”</span>
          </blockquote>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-body lg:pt-3">
            {STORY.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:py-28">
          <div className="reveal relative mx-auto w-full max-w-[420px]">
            <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[10px] border border-gold" />
            <Shot
              sizes="(min-width: 1024px) 480px, 92vw"
              src={LEADER.photo}
              alt={`${LEADER.name}, ${LEADER.title}`}
              loading="lazy"
              className="relative aspect-[4/5] w-full rounded-[10px] object-cover object-top"
            />
          </div>
          <div className="reveal flex flex-col gap-5">
            <Eyebrow>Leadership</Eyebrow>
            <h2 className="text-4xl leading-tight font-light tracking-[-0.02em] text-ink sm:text-5xl">{LEADER.name}</h2>
            <p className="font-serif text-2xl text-emerald-deep italic">{LEADER.title}</p>
            <p className="max-w-xl text-lg leading-relaxed text-body">{LEADER.bio}</p>
          </div>
        </div>
      </section>

      {/* Meet the team */}
      <section aria-labelledby="team-title" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10 lg:pb-28">
        <div className="reveal mb-12 flex flex-col gap-5">
          <Eyebrow>The team</Eyebrow>
          <h2 id="team-title" className="text-4xl leading-[1.05] font-light tracking-[-0.03em] text-ink sm:text-5xl">
            Meet the <span className="font-serif text-[1.12em] font-normal text-emerald-deep italic">team.</span>
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-body">The people who design, build and ship your project.</p>
        </div>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TEAM.map((member, i) => (
            <li key={member.name} className="reveal group flex flex-col gap-5" style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="relative">
                {/* Gold frame that slides out behind the photo on hover, echoing the leadership portrait. */}
                <div aria-hidden="true" className="absolute inset-0 rounded-[10px] border border-gold opacity-0 transition-[transform,opacity] duration-500 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:opacity-100" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-night">
                  {member.photo ? (
                    <Shot
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                      src={member.photo}
                      alt={`${member.name}, ${member.role}`}
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div role="img" aria-label={`${member.name}, ${member.role}`} className="flex size-full items-center justify-center">
                      <span aria-hidden="true" className="font-serif text-8xl text-gold italic">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink">{member.name}</h3>
                <p className="font-serif text-xl text-emerald-deep italic">{member.role}</p>
                <p className="mt-1 leading-relaxed text-body">{member.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Manifesto />

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
        <div className="reveal mb-14 flex flex-col gap-5">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="text-4xl leading-[1.05] font-light tracking-[-0.03em] text-ink sm:text-5xl">
            Milestones, <span className="font-serif text-[1.12em] font-normal text-emerald-deep italic">dated.</span>
          </h2>
        </div>
        <ol className="relative flex flex-col gap-10 pl-10 lg:pl-0">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-gold/60 lg:left-[171px]" />
          {MILESTONES.map((m, i) => (
            <li key={`${m.date}-${m.title}`} className="reveal relative grid gap-1 lg:grid-cols-[140px_1fr] lg:gap-16" style={{ transitionDelay: `${i * 80}ms` }}>
              <span aria-hidden="true" className="absolute top-1 -left-10 flex size-6 items-center justify-center rounded-full border-2 border-gold bg-pearl lg:left-[160px]">
                <span className="size-2 rounded-full bg-emerald-deep" />
              </span>
              <span className="font-serif text-2xl text-emerald-deep italic lg:text-right">{m.date}</span>
              <div className="lg:pl-4">
                <h3 className="text-xl font-medium text-ink">{m.title}</h3>
                <p className="text-body">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Company record */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div className="reveal flex flex-col gap-5">
            <Eyebrow>Company record</Eyebrow>
            <h2 className="text-4xl leading-[1.05] font-light tracking-[-0.03em] text-ink sm:text-5xl">
              Check who you&apos;re <span className="font-serif text-[1.12em] font-normal text-emerald-deep italic">working with.</span>
            </h2>
            <p className="text-lg leading-relaxed text-body">Our registered details, for banks, procurement teams and partners.</p>
          </div>
          <dl className="reveal divide-y divide-line border-y border-line">
            {RECORD.map((row) => (
              <div key={row.label} className="grid gap-1 py-5 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-6">
                <dt className="text-sm text-muted">{row.label}</dt>
                <dd className="font-medium text-ink">{row.value}</dd>
                {row.copy && (
                  <dd className="sm:justify-self-end">
                    <CopyButton value={row.value} label={row.copy} />
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
