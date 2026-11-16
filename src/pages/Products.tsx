import { PageHeader } from "../components/PageHeader";
import { Accent, Seo } from "../components/ui";
import { ProductsSection } from "../sections/ProductsSection";
import { CtaBand } from "../sections/CtaBand";

export default function Products() {
  return (
    <>
      <Seo
        title="Products | Veridian Tech Innovations Ltd"
        description="EasyPass, visitor management for residential estates, and RhemaVerse, live scripture display for church media teams."
      />
      <PageHeader
        eyebrow="Products"
        title={
          <>
            Software we own <Accent>and run.</Accent>
          </>
        }
        sub="Alongside client work, we build and operate our own products."
      />
      <ProductsSection detailed heading={false} />
      <CtaBand />
    </>
  );
}
