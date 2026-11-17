import { Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { SERVICES } from "../config/services";
import { SERVICE_DETAILS } from "../config/serviceDetails";
import { CASE_STUDIES } from "../config/caseStudies";
import { CLIENT_PROJECTS } from "../config/portfolio";
import { postBySlug } from "../content/blog";
import { PageHeader } from "../components/PageHeader";
import { Faqs } from "../components/Faqs";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs, faqSchema, serviceSchema } from "../utils/schema";
import { ArrowIcon, ArrowLink, Seo, Shot, SplitButton } from "../components/ui";
import { ProcessSection } from "../sections/ProcessSection";
import { CtaBand } from "../sections/CtaBand";
import NotFound from "./NotFound";

const eyebrowClass = "mb-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase";

/** One page per software service, at /services/<id>. */
export default function ServiceDetail() {
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id);
  const detail = id ? SERVICE_DETAILS[id] : undefined;
  if (!service || !detail) return <NotFound />;

  const path = `/services/${service.id}`;
  const examples = CASE_STUDIES.filter((c) => c.services.includes(service.id))
    .map((c) => CLIENT_PROJECTS.find((p) => p.id === c.id))
    .filter((p) => p !== undefined);
  const related = detail.related.map(postBySlug).filter((p) => p !== undefined);
  const others = SERVICES.filter((s) => s.id !== service.id);

  return (
    <>
      <Seo title={detail.seoTitle} description={detail.seoDescription} />
      <JsonLd
        data={[
          serviceSchema({ name: service.title, description: detail.seoDescription, path, serviceType: detail.serviceType }),
          faqSchema(detail.faqs),
          breadcrumbs([["Services", "/services"], [service.short, path]]),
        ]}
      />
      <PageHeader eyebrow={`Services · ${service.short}`} title={service.title} sub={service.description} />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:px-10 lg:pb-28">
        <div className="reveal flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            {detail.intro.map((para) => (
              <p key={para} className="text-lg leading-relaxed text-body">
                {para}
              </p>
            ))}
          </div>
          <div>
            <h2 className={eyebrowClass}>What you get</h2>
            <ul className="flex flex-col gap-4">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-lg text-ink">
                  <Check size={20} className="mt-1 flex-shrink-0 text-emerald" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="border-l-2 border-gold pl-4 text-body">
            <span className="font-semibold text-ink">Good for: </span>
            {service.goodFor}
          </p>
        </div>

        <aside className="reveal flex h-fit flex-col gap-5 rounded-[10px] border border-line bg-white/70 p-6 sm:p-8 lg:sticky lg:top-28">
          <span className="flex size-12 items-center justify-center rounded-[10px] bg-emerald/10 text-emerald-deep">
            <service.Icon size={24} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">Start this project</h2>
          <p className="leading-relaxed text-body">Tell us what you need. We reply with a plan, a timeline and a quote.</p>
          <SplitButton to={`/contact?service=${service.id}`} block>
            Start this project
          </SplitButton>
          <ArrowLink to="/blog/how-much-does-a-website-cost-in-nigeria">What does it cost?</ArrowLink>
        </aside>
      </section>

      {examples.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
            <h2 className={`reveal ${eyebrowClass}`}>Built by Veridian</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {examples.map((project) => (
                <Link key={project.id} to={`/work/${project.id}`} className="reveal work-card group flex flex-col gap-4 rounded-xl">
                  {project.image && (
                    <div className="overflow-hidden rounded-[10px] border border-line">
                      <Shot sizes="(min-width: 768px) 30vw, 92vw" src={project.image} alt={`The ${project.name} website`} loading="lazy" className="shot aspect-[16/10] w-full object-cover object-top" />
                    </div>
                  )}
                  <span className="font-medium text-ink">{project.name}</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-deep">
                    Read the case study <ArrowIcon size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10 lg:py-28">
          <h2 className="reveal text-3xl leading-tight font-light tracking-[-0.02em] text-ink sm:text-4xl">Questions buyers ask</h2>
          <div className="reveal">
            <Faqs faqs={detail.faqs} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
            <h2 className={`reveal ${eyebrowClass}`}>Read before you start</h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {related.map((post) => (
                <li key={post.slug} className="reveal">
                  <Link to={`/blog/${post.slug}`} className="flex h-full flex-col gap-3 rounded-[10px] border border-line bg-white/70 p-6 transition-colors hover:border-emerald">
                    <span className="text-lg font-medium text-ink">{post.title}</span>
                    <span className="mt-auto text-sm text-muted">{post.readMinutes} min read</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="border-t border-line">
        <ProcessSection timeline />
      </div>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className={`reveal ${eyebrowClass}`}>Other services</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other) => (
              <li key={other.id} className="reveal">
                <Link
                  to={`/services/${other.id}`}
                  className="flex h-full items-center justify-between gap-4 rounded-[10px] border border-line bg-white/70 px-5 py-4 font-medium text-ink transition-colors hover:border-emerald hover:text-emerald-deep"
                >
                  {other.short}
                  <ArrowIcon size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
