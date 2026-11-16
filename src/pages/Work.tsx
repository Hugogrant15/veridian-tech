import { PageHeader } from "../components/PageHeader";
import { PortfolioWall } from "../components/HeaderVisuals";
import { Accent, Seo } from "../components/ui";
import { WorkSection } from "../sections/WorkSection";
import { ProductsSection } from "../sections/ProductsSection";
import { CtaBand } from "../sections/CtaBand";

export default function Work() {
  return (
    <>
      <Seo
        title="Our work | Veridian Tech Innovations Ltd"
        description="Client websites designed and built by Veridian Tech, and the products we run ourselves."
      />
      <PageHeader
        tone="dark"
        visual={<PortfolioWall />}
        eyebrow="Our work"
        title={
          <>
            Websites we have <Accent tone="dark">shipped.</Accent>
          </>
        }
        sub="Every project below is a real business we designed and built for. Click through to see each one live."
      />
      <WorkSection showAllLink={false} heading={false} />
      <ProductsSection />
      <CtaBand />
    </>
  );
}
