import { Link } from "react-router-dom";
import { SERVICES } from "../config/services";
import { Accent, ArrowIcon, SectionHeading, SplitButton } from "../components/ui";

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-night py-24 text-pearl lg:py-28">
      <div aria-hidden="true" className="absolute -top-64 -left-56 size-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(17_161_89/0.3),rgb(17_161_89/0.08)_60%,transparent)]" />
      <div aria-hidden="true" className="absolute -right-52 -bottom-80 size-[760px] rounded-full bg-[radial-gradient(closest-side,rgb(201_165_92/0.16),rgb(201_165_92/0.04)_60%,transparent)]" />
      <div aria-hidden="true" className="gold-rule absolute inset-x-0 top-0 h-px" />
      <div aria-hidden="true" className="grain grain-dark absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="reveal mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow="What we build"
            title={
              <>
                Everything your business needs <Accent tone="dark">online.</Accent>
              </>
            }
            sub="Websites, online stores and mobile apps for Nigerian businesses, built properly and built to last."
          />
          <div className="flex-shrink-0">
            <SplitButton to="/contact" variant="gold">
              Start a project
            </SplitButton>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SERVICES.map(({ id, Icon, title, description }, i) => (
            <div key={id} className="reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
            <Link to={`/services#${id}`} className="night-card flex h-full flex-col gap-4 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-[10px] bg-emerald-bright/10 text-emerald-bright">
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="font-serif text-3xl text-gold italic">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="text-[22px] leading-snug font-medium tracking-[-0.01em]">{title}</h3>
              <p className="leading-relaxed text-sage">{description}</p>
              <span className="more mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gold-light">
                Learn more <ArrowIcon size={16} />
              </span>
            </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
