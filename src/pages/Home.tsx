import { Seo } from "../components/ui";
import { Hero } from "../sections/Hero";
import { ServicesSection } from "../sections/ServicesSection";
import { SupplyBand } from "../sections/SupplyBand";
import { WorkSection } from "../sections/WorkSection";
import { ProductsSection } from "../sections/ProductsSection";
import { ProcessSection } from "../sections/ProcessSection";
import { CtaBand } from "../sections/CtaBand";

export default function Home() {
  return (
    <>
      <Seo
        title="Veridian Tech Innovations Ltd | Websites, apps and IT supply"
        description="Veridian Tech Innovations Ltd (RC 9367650) builds websites, online stores and mobile apps, and supplies IT equipment across Nigeria. The maker of EasyPass."
      />
      <Hero />
      <ServicesSection />
      <SupplyBand />
      <WorkSection />
      <ProductsSection />
      <ProcessSection />
      <CtaBand />
    </>
  );
}
