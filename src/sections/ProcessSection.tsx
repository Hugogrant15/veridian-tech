import { BadgeCheck, MessageCircle, Rocket } from "lucide-react";
import { COMPANY } from "../config/company";
import { Accent, SectionHeading } from "../components/ui";

const STEPS = [
  {
    title: "Talk",
    body: "Tell us about your business on WhatsApp, a call or the form. We ask questions until we understand what you need.",
  },
  {
    title: "Plan",
    body: "You get a clear proposal: what we will build, what it costs and what we need from you.",
  },
  {
    title: "Build",
    body: "We design and build it, and show you progress along the way, so there are no surprises.",
  },
  {
    title: "Launch and support",
    body: "We put it live, connect your domain and email, and stay on hand when you need changes.",
  },
];

const REASONS = [
  {
    Icon: BadgeCheck,
    title: "Registered and verifiable",
    body: `CAC RC ${COMPANY.rcNumber} and D-U-N-S ${COMPANY.duns}. You can check who you are working with.`,
  },
  {
    Icon: Rocket,
    title: "We run our own products",
    body: "EasyPass is live on Google Play. We build for clients the way we build for ourselves.",
  },
  {
    Icon: MessageCircle,
    title: "Lagos-based, on WhatsApp",
    body: "Talk directly to the people building your project, in your time zone.",
  },
];

/** `timeline`: the four steps as a connected line with gold nodes (used on the Services page). */
export function ProcessSection({ timeline = false }: { timeline?: boolean }) {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="reveal mb-14">
          <SectionHeading
            eyebrow="How we work"
            title={
              <>
                Simple steps, <Accent>no surprises.</Accent>
              </>
            }
          />
        </div>

        {timeline ? (
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {/* The connecting line: vertical on phones, horizontal on desktop. */}
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-gold/60 lg:top-[11px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
            {STEPS.map((step, i) => (
              <li key={step.title} className="reveal relative flex flex-col gap-3 pl-12 lg:pt-12 lg:pl-0" style={{ transitionDelay: `${i * 90}ms` }}>
                <span aria-hidden="true" className="absolute top-0 left-0 flex size-6 items-center justify-center rounded-full border-2 border-gold bg-pearl">
                  <span className="size-2 rounded-full bg-emerald-deep" />
                </span>
                <span className="font-serif text-4xl text-emerald-deep italic">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-medium text-ink">{step.title}</h3>
                <p className="leading-relaxed text-body">{step.body}</p>
              </li>
            ))}
          </ol>
        ) : (
        <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="reveal flex flex-col gap-4 bg-pearl p-7 sm:p-8" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="font-serif text-5xl text-emerald-deep italic">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-xl font-medium text-ink">{step.title}</h3>
              <p className="leading-relaxed text-body">{step.body}</p>
            </li>
          ))}
        </ol>
        )}

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {REASONS.map(({ Icon, title, body }, i) => (
            <div key={title} className="reveal flex flex-col gap-3" style={{ transitionDelay: `${i * 90}ms` }}>
              <Icon size={26} strokeWidth={1.6} className="text-emerald-deep" aria-hidden="true" />
              <h3 className="text-lg font-medium text-ink">{title}</h3>
              <p className="leading-relaxed text-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
