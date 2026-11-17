import { Link, useParams } from "react-router-dom";
import { INDUSTRIES } from "../config/industries";
import { caseStudy } from "../config/caseStudies";
import { PageHeader } from "../components/PageHeader";
import { PortfolioWall } from "../components/HeaderVisuals";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs, serviceSchema } from "../utils/schema";
import { ArrowIcon, SectionHeading, Seo, Shot, SplitButton } from "../components/ui";
import { CtaBand } from "../sections/CtaBand";
import NotFound from "./NotFound";

/** One page per industry we have real work in, at /industries/<id>. */
export default function IndustryPage() {
  const { id } = useParams();
  const industry = INDUSTRIES.find((i) => i.id === id);
  if (!industry) return <NotFound />;

  const path = `/industries/${industry.id}`;
  const studies = industry.caseStudies.map(caseStudy).filter((s) => s !== undefined);

  return (
    <>
      <Seo title={industry.seoTitle} description={industry.seoDescription} />
      <JsonLd
        data={[
          serviceSchema({ name: industry.title, description: industry.seoDescription, path, serviceType: "Website design and development" }),
          breadcrumbs([[industry.name, path]]),
        ]}
      />
      <PageHeader tone="dark" eyebrow={`Industries · ${industry.name}`} title={industry.title} sub={industry.sub} visual={<PortfolioWall />} />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="reveal mb-14">
          <SectionHeading eyebrow="What buyers in this industry need" title="Six things every supplier website should do." />
        </div>
        <ol className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {industry.needs.map((need, i) => (
            <li key={need.title} className="reveal flex flex-col gap-3 border-t border-line pt-6" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
              <span className="font-serif text-4xl text-emerald-deep italic">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-xl font-medium text-ink">{need.title}</h3>
              <p className="leading-relaxed text-body">{need.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="reveal mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Our work in this industry" title="Websites we have built." />
            <div className="flex-shrink-0">
              <SplitButton to="/contact?service=websites">Talk to us about yours</SplitButton>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {studies.map((s) => (
              <Link key={s.id} to={`/work/${s.id}`} className="reveal work-card group flex flex-col gap-4 rounded-xl">
                {s.project.image && (
                  <div className="overflow-hidden rounded-[10px] border border-line">
                    <Shot sizes="(min-width: 768px) 30vw, 92vw" src={s.project.image} alt={`The ${s.project.name} website`} loading="lazy" className="shot aspect-[16/10] w-full object-cover object-top" />
                  </div>
                )}
                <h3 className="text-xl font-medium text-ink">{s.project.name}</h3>
                <p className="text-body">{s.summary}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-deep">
                  Read the case study <ArrowIcon size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
