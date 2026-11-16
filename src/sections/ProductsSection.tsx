import { Check } from "lucide-react";
import { EASYPASS, RHEMAVERSE } from "../config/products";
import { Accent, SectionHeading, SplitButton } from "../components/ui";

const linkOnNight =
  "lnk text-pearl [background-image:linear-gradient(90deg,#3FD38A,#E4C77E)]";

function Features({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li key={f} className="flex gap-3 text-sage">
          <Check size={18} className="mt-1 flex-shrink-0 text-emerald-bright" aria-hidden="true" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProductsSection({ detailed = false, heading = true }: { detailed?: boolean; heading?: boolean }) {
  return (
    <section id="products" className="relative overflow-hidden bg-night py-24 text-pearl lg:py-28">
      <div aria-hidden="true" className="absolute -top-72 right-0 size-[820px] rounded-full bg-[radial-gradient(closest-side,rgb(17_161_89/0.25),transparent)]" />
      <div aria-hidden="true" className="gold-rule absolute inset-x-0 top-0 h-px" />
      <div aria-hidden="true" className="grain grain-dark absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {heading && (
        <div className="reveal mb-14">
          <SectionHeading
            tone="dark"
            eyebrow="Our products"
            title={
              <>
                We build our own, <Accent tone="dark">and run them.</Accent>
              </>
            }
            sub="Products Veridian designed, built and operates every day."
          />
        </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <article id="easypass" className="night-card reveal flex flex-col gap-6 p-6 sm:p-8">
            <div className="overflow-hidden rounded-[10px] border border-gold/25">
              <img
                src={EASYPASS.image}
                alt="The EasyPass website"
                loading="lazy"
                width={1440}
                height={900}
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-3xl font-light tracking-[-0.02em]">{EASYPASS.name}</h3>
              <p className="font-medium text-gold-light">{EASYPASS.tagline}</p>
              <p className="leading-relaxed text-sage">{EASYPASS.summary}</p>
            </div>
            {detailed && <Features items={EASYPASS.features} />}
            <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
              <a href={EASYPASS.url} target="_blank" rel="noopener noreferrer" className={linkOnNight}>
                Visit easypass.ng ↗
              </a>
              <a href={EASYPASS.playStoreUrl} target="_blank" rel="noopener noreferrer" className={linkOnNight}>
                Get it on Google Play ↗
              </a>
            </div>
          </article>

          <article id="rhemaverse" className="night-card reveal flex flex-col gap-6 p-6 sm:p-8" style={{ transitionDelay: "100ms" }}>
            <div className="overflow-hidden rounded-[10px] border border-gold/25">
              <img
                src={RHEMAVERSE.image}
                alt="RhemaVerse live: the sermon transcript, the verses it recognised, and the next verse queued for the screens"
                loading="lazy"
                width={1440}
                height={900}
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-3xl font-light tracking-[-0.02em]">{RHEMAVERSE.name}</h3>
              <p className="font-medium text-gold-light">{RHEMAVERSE.tagline}</p>
              <p className="leading-relaxed text-sage">{RHEMAVERSE.summary}</p>
            </div>
            {detailed && <Features items={RHEMAVERSE.features} />}
            <div className="mt-auto pt-2">
              <SplitButton to="/contact" variant="gold" size="sm">
                Request a demo
              </SplitButton>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
