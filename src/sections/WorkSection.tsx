import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { CASE_STUDIES } from "../config/caseStudies";
import { CLIENT_PROJECTS, type ClientProject } from "../config/portfolio";
import { Accent, ArrowIcon, ArrowLink, BrowserFrame, SectionHeading, Shot } from "../components/ui";

const hostOf = (url: string) => new URL(url).host;

function ProjectCard({ project, index }: { project: ClientProject; index: number }) {
  const hasStudy = CASE_STUDIES.some((c) => c.id === project.id);
  const body = (
    <>
      <BrowserFrame label={project.url ? hostOf(project.url) : "Launching soon"}>
        {project.image ? (
          <Shot
            sizes="(min-width: 1024px) 50vw, 92vw"
            src={project.image}
            alt={`The ${project.name} website`}
            loading="lazy"
            className="shot absolute inset-0 size-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 bg-night p-6">
            <div aria-hidden="true" className="absolute -top-20 -right-16 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(17_161_89/0.35),transparent)]" />
            <span className="relative font-serif text-3xl leading-tight text-pearl italic">{project.name}</span>
          </div>
        )}
      </BrowserFrame>
      <div className="flex flex-col gap-2 pt-5">
        <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{project.name}</h3>
        <p className="text-sm text-muted">
          {project.sector} · {project.location}
        </p>
        <p className="text-[15px] text-body">{project.built.join(" · ")}</p>
        {hasStudy ? (
          <span className="mt-1 inline-flex items-center gap-1.5 text-[15px] font-semibold text-emerald-deep">
            Read the case study <ArrowIcon size={17} />
          </span>
        ) : (
          <span className="mt-1 inline-flex items-center gap-1.5 text-[15px] font-medium text-muted">
            <Clock size={16} aria-hidden="true" /> Launching soon
          </span>
        )}
      </div>
    </>
  );

  return (
    <div className="reveal" style={{ transitionDelay: `${index * 90}ms` }}>
      {hasStudy ? (
        // The case study links on to the live site.
        <Link to={`/work/${project.id}`} aria-label={`${project.name}: read the case study`} className="work-card block rounded-xl">
          {body}
        </Link>
      ) : (
        <div className="work-card rounded-xl">{body}</div>
      )}
    </div>
  );
}

/** On the Work page the page header already says "Our work", so `heading={false}` skips the repeat. */
export function WorkSection({ showAllLink = true, heading = true }: { showAllLink?: boolean; heading?: boolean }) {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {heading && (
        <div className="reveal mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our work"
            title={
              <>
                Real businesses, <Accent>properly online.</Accent>
              </>
            }
            sub="Client websites we have designed and built."
          />
          {showAllLink && (
            <ArrowLink to="/work" className="flex-shrink-0 text-ink">
              See all our work
            </ArrowLink>
          )}
        </div>
        )}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {CLIENT_PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
