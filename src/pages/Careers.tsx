import { Briefcase } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Accent, Seo, SplitButton } from "../components/ui";

export default function Careers() {
  return (
    <>
      <Seo
        title="Careers | Veridian Tech Innovations Ltd"
        description="Open roles at Veridian Tech Innovations Ltd, Lagos."
      />
      <PageHeader
        eyebrow="Careers"
        title={
          <>
            Build things that <Accent>people use.</Accent>
          </>
        }
        sub="We make software for real businesses and run our own products every day."
      />
      <section className="mx-auto max-w-3xl px-5 pb-28 sm:px-8">
        <div className="reveal flex flex-col items-center gap-4 rounded-xl border border-line bg-white/70 p-10 text-center">
          <Briefcase className="size-10 text-muted" strokeWidth={1.6} aria-hidden="true" />
          <h2 className="text-2xl font-medium text-ink">No open roles right now</h2>
          <p className="max-w-md leading-relaxed text-body">
            When we hire, the role will be listed here. In the meantime, you&apos;re welcome to introduce yourself.
          </p>
          <div className="mt-2">
            <SplitButton to="/contact?service=careers">Introduce yourself</SplitButton>
          </div>
        </div>
      </section>
    </>
  );
}
