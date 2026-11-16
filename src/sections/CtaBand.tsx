import { COMPANY, WHATSAPP_URL } from "../config/company";
import { Accent, SplitButton, WhatsAppGlyph } from "../components/ui";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-night py-20 text-pearl lg:py-24">
      <div aria-hidden="true" className="absolute -bottom-72 -left-40 size-[760px] rounded-full bg-[radial-gradient(closest-side,rgb(17_161_89/0.3),transparent)]" />
      <div aria-hidden="true" className="absolute -top-60 -right-40 size-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(201_165_92/0.18),transparent)]" />
      <div aria-hidden="true" className="gold-rule absolute inset-x-0 top-0 h-px" />
      <div aria-hidden="true" className="grain grain-dark absolute inset-0" />

      <div className="reveal relative mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <h2 className="max-w-2xl text-4xl leading-[1.05] font-light tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          Ready to get your business <Accent tone="dark">properly online?</Accent>
        </h2>
        <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row sm:items-center">
          <SplitButton to="/contact" variant="gold">
            Start a project
          </SplitButton>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-md border border-pearl/25 px-6 font-semibold text-pearl transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10"
          >
            <WhatsAppGlyph className="size-5 text-[#25D366]" />
            WhatsApp {COMPANY.whatsapp.display}
          </a>
        </div>
      </div>
    </section>
  );
}
