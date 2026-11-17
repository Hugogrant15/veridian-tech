import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { SERVICES, type Service } from "../config/services";
import { PageHeader } from "../components/PageHeader";
import { DeviceStack } from "../components/HeaderVisuals";
import { ServiceArt } from "../components/ServiceArt";
import { Accent, ArrowLink, Seo, SplitButton, Shot } from "../components/ui";
import { ProcessSection } from "../sections/ProcessSection";
import { CtaBand } from "../sections/CtaBand";

/** Which chapter is in view, for highlighting the index bar. */
function useActiveChapter(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A chapter counts as current while it crosses the band just below the sticky bars.
      { rootMargin: "-30% 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const CHAPTER_IDS = SERVICES.map((s) => s.id);

function ChapterVisual({ service }: { service: Service }) {
  if (!service.example) return <ServiceArt id={service.id} />;
  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_30px_60px_-36px_rgb(15_31_23/0.4)]">
        <div className="flex h-7 items-center gap-1.5 border-b border-line bg-pearl px-3">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </div>
        <Shot sizes="(min-width: 1024px) 50vw, 92vw" src={service.example.image} alt={service.example.caption} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
      </div>
      <figcaption className="text-sm text-muted">{service.example.caption}</figcaption>
    </figure>
  );
}

function Chapter({ service, index }: { service: Service; index: number }) {
  const { id, Icon, title, description, includes, goodFor } = service;
  const flip = index % 2 === 1;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-44 border-t border-line py-20 first:border-t-0 lg:scroll-mt-48 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className={`reveal flex flex-col gap-6 ${flip ? "lg:order-2" : ""}`}>
          <div className="flex items-center gap-4">
            <span className="font-serif text-6xl leading-none text-emerald-deep italic">{String(index + 1).padStart(2, "0")}</span>
            <span className="flex size-11 items-center justify-center rounded-[10px] bg-emerald/10 text-emerald-deep">
              <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
            </span>
          </div>
          <h2 id={`${id}-title`} className="text-3xl leading-tight font-light tracking-[-0.02em] text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="text-lg leading-relaxed text-body">{description}</p>
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-muted uppercase">What you get</h3>
            <ul className="flex flex-col gap-3">
              {includes.map((item) => (
                <li key={item} className="flex gap-3 text-ink">
                  <Check size={18} className="mt-1 flex-shrink-0 text-emerald" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="border-l-2 border-gold pl-4 text-body">
            <span className="font-semibold text-ink">Good for: </span>
            {goodFor}
          </p>
          <div className="pt-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <SplitButton to={`/contact?service=${id}`}>Start this project</SplitButton>
              <ArrowLink to={`/services/${id}`}>Full details and FAQs</ArrowLink>
            </div>
          </div>
        </div>
        <div className={`reveal ${flip ? "lg:order-1" : ""}`}>
          <ChapterVisual service={service} />
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  const active = useActiveChapter(CHAPTER_IDS);
  return (
    <>
      <Seo
        title="Services | Veridian Tech Innovations Ltd"
        description="Business websites, SEO and mobile-friendly sites, online stores, landing pages, redesigns and mobile apps for Nigerian businesses."
      />
      <PageHeader
        tone="dark"
        eyebrow="Services"
        title={
          <>
            Everything your business needs <Accent tone="dark">online.</Accent>
          </>
        }
        sub="We design and build websites, online stores and mobile apps for Nigerian businesses, and we are the makers of EasyPass."
        visual={<DeviceStack />}
      />

      {/* Index: sticks below the navbar and follows the chapter in view. */}
      <nav aria-label="Services on this page" className="sticky top-20 z-30 border-b border-line bg-pearl/95 backdrop-blur lg:top-24">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 [scrollbar-width:none] sm:px-8 lg:justify-between lg:px-10">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="flex-shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  active === s.id ? "bg-night font-semibold text-pearl" : "text-body hover:text-emerald-deep"
                }`}
              >
                <span className={`font-serif italic ${active === s.id ? "text-gold-light" : "text-emerald-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
                {s.short}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {SERVICES.map((service, i) => (
        <Chapter key={service.id} service={service} index={i} />
      ))}

      <div className="border-t border-line">
        <ProcessSection timeline />
      </div>
      <CtaBand />
    </>
  );
}
