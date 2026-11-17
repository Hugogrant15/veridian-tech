import { ArrowUpRight, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { caseStudy, CASE_STUDIES } from "../config/caseStudies";
import { CLIENT_PROJECTS } from "../config/portfolio";
import { SERVICES } from "../config/services";
import { INDUSTRIES } from "../config/industries";
import { PageHeader } from "../components/PageHeader";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../utils/schema";
import { ArrowIcon, ArrowLink, BrowserFrame, Seo, Shot } from "../components/ui";
import { CtaBand } from "../sections/CtaBand";
import NotFound from "./NotFound";

const eyebrowClass = "mb-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase";

/** One case study per client website, at /work/<id>. */
export default function CaseStudyPage() {
  const { id } = useParams();
  const study = caseStudy(id);
  if (!study) return <NotFound />;

  const { project } = study;
  const path = `/work/${study.id}`;
  const services = SERVICES.filter((s) => study.services.includes(s.id));
  const industry = INDUSTRIES.find((i) => i.caseStudies.includes(study.id));
  const others = CASE_STUDIES.filter((c) => c.id !== study.id)
    .map((c) => CLIENT_PROJECTS.find((p) => p.id === c.id))
    .filter((p) => p !== undefined);

  return (
    <>
      <Seo
        title={`Case study: ${project.name} | Veridian Tech`}
        description={`How Veridian Tech designed and built the ${project.name} website: ${study.summary.charAt(0).toLowerCase()}${study.summary.slice(1)}`}
      />
      <JsonLd data={breadcrumbs([["Work", "/work"], [project.name, path]])} />
      <PageHeader eyebrow={`Case study · ${project.sector}`} title={project.name} sub={study.summary} />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="reveal">
          <BrowserFrame label={project.url ? new URL(project.url).host : "Launching soon"}>
            {project.image && (
              <Shot sizes="(min-width: 1280px) 1200px, 92vw" src={project.image} alt={`The ${project.name} website`} className="absolute inset-0 size-full object-cover object-top" />
            )}
          </BrowserFrame>
        </div>
        <dl className="reveal mt-10 grid gap-6 border-y border-line py-8 sm:grid-cols-3">
          {study.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-muted">{fact.label}</dt>
              <dd className="font-serif text-4xl text-emerald-deep italic">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10 lg:pb-28">
        <div className="reveal flex flex-col gap-6">
          <h2 className={eyebrowClass}>What they needed</h2>
          <ul className="flex flex-col gap-4">
            {study.needed.map((need) => (
              <li key={need} className="flex gap-3 text-ink">
                <Check size={20} className="mt-0.5 flex-shrink-0 text-emerald" aria-hidden="true" />
                <span>{need}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 flex flex-col gap-3 border-l-2 border-gold pl-4 text-body">
            <div>
              <dt className="inline font-semibold text-ink">Location: </dt>
              <dd className="inline">{project.location}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-ink">Launched: </dt>
              <dd className="inline">{study.launched}</dd>
            </div>
          </dl>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-emerald-deep hover:underline">
              Visit the live site <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="reveal">
          <h2 className={eyebrowClass}>What we built</h2>
          <ol className="flex flex-col">
            {study.built.map((item, i) => (
              <li key={item.title} className="grid grid-cols-[3.5rem_1fr] gap-2 border-t border-line py-6 last:border-b">
                <span className="font-serif text-3xl text-emerald-deep italic">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-medium text-ink">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-16 sm:px-8 lg:flex-row lg:justify-between lg:px-10">
          <div className="reveal">
            <h2 className={eyebrowClass}>Services in this project</h2>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.id}>
                  <ArrowLink to={`/services/${s.id}`}>{s.short}</ArrowLink>
                </li>
              ))}
              {industry && (
                <li>
                  <ArrowLink to={`/industries/${industry.id}`}>Websites for {industry.name.toLowerCase()} companies</ArrowLink>
                </li>
              )}
            </ul>
          </div>
          {others.length > 0 && (
            <div className="reveal">
              <h2 className={eyebrowClass}>More case studies</h2>
              <ul className="flex flex-col gap-3">
                {others.map((p) => (
                  <li key={p.id}>
                    <Link to={`/work/${p.id}`} className="inline-flex items-center gap-2 font-medium text-ink hover:text-emerald-deep">
                      {p.name} <ArrowIcon size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
