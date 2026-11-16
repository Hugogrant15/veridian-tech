import { PageHeader } from "../components/PageHeader";
import { Accent, Seo, SplitButton } from "../components/ui";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found | Veridian Tech Innovations Ltd" description="This page does not exist." noindex />
      <PageHeader
        eyebrow="404"
        title={
          <>
            This page is <Accent>not online.</Accent>
          </>
        }
        sub="The link may be old or mistyped."
      />
      <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-8 lg:px-10">
        <SplitButton to="/">Back to home</SplitButton>
      </div>
    </>
  );
}
