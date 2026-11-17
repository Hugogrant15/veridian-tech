import { Link } from "react-router-dom";
import { LAPTOP_CATEGORIES, STAFF_PROFILES, SUPPLY_SERVICES, SUPPLY_STEPS } from "../config/supply";
import { PageHeader } from "../components/PageHeader";
import { Accent, ArrowIcon, SectionHeading, Seo, SplitButton } from "../components/ui";

/** Header visual: a real recommendation from the order builder, shown as a spec sheet. */
function SpecSheetCard() {
  const profile = STAFF_PROFILES.find((p) => p.id === "developers") ?? STAFF_PROFILES[0];
  if (!profile) return null;
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-[460px] rounded-[10px] border border-gold/40 bg-[#0B3A27] p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-gold-light uppercase">From the order builder</p>
      <p className="mt-3 font-serif text-3xl text-pearl italic">{profile.label}</p>
      <dl className="mt-6 flex flex-col">
        {profile.spec.map((line) => (
          <div key={line.label} className="flex justify-between gap-6 border-t border-gold/20 py-3 text-sm">
            <dt className="flex-shrink-0 text-sage">{line.label}</dt>
            <dd className="text-right text-pearl">{line.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function Supply() {
  return (
    <>
      <Seo
        title="IT Equipment Supply and Office Setup in Nigeria | Veridian Tech Innovations Ltd"
        description="Bulk laptops, workstation and workspace setup, networking, CCTV and printers for government and private-sector projects, delivered anywhere in Nigeria."
      />
      <PageHeader
        tone="dark"
        eyebrow="IT supply and setup"
        title={
          <>
            Equipment for your team, <Accent tone="dark">delivered and set up.</Accent>
          </>
        }
        sub="Laptops in bulk, workstations, networks, CCTV and printers for government and private-sector projects, anywhere in Nigeria."
        visual={<SpecSheetCard />}
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="reveal mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What we supply"
            title={
              <>
                One supplier, from the laptop <Accent>to the network.</Accent>
              </>
            }
            sub="Order one item or the whole office. Each service has its own page with what is included."
          />
          <div className="flex-shrink-0">
            <SplitButton to="/it-supply/build-your-order">Build your order</SplitButton>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SUPPLY_SERVICES.map(({ id, Icon, title, description }, i) => (
            <div key={id} className="reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
              <Link
                to={`/it-supply/${id}`}
                className="group flex h-full flex-col gap-4 rounded-[10px] border border-line bg-white/70 p-6 transition-colors hover:border-emerald sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-[10px] bg-emerald/10 text-emerald-deep">
                    <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="font-serif text-3xl text-emerald-deep italic">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[22px] leading-snug font-medium tracking-[-0.01em] text-ink">{title}</h3>
                <p className="leading-relaxed text-body">{description}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-deep">
                  See what is included <ArrowIcon size={16} />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-gold/30 bg-night py-20 text-pearl lg:py-28">
        <div aria-hidden="true" className="grain grain-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="reveal mb-14">
            <SectionHeading
              tone="dark"
              eyebrow="Laptops"
              title={
                <>
                  Every kind of laptop, <Accent tone="dark">in any brand.</Accent>
                </>
              }
              sub="Different staff need different machines. We supply all three kinds, and help you choose the specification for each group."
            />
          </div>
          <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
            {LAPTOP_CATEGORIES.map((category, i) => (
              <div key={category.id} className="reveal flex flex-col gap-3 border-t border-gold/40 pt-6" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-serif text-3xl text-gold italic">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl font-medium tracking-[-0.01em]">{category.title}</h3>
                <p className="leading-relaxed text-sage">{category.description}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-12">
            <SplitButton to="/it-supply/bulk-laptops" variant="gold">
              Recommended specifications
            </SplitButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="reveal mb-14">
          <SectionHeading
            eyebrow="How an order works"
            title={
              <>
                From your list to <Accent>your desks.</Accent>
              </>
            }
          />
        </div>
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {SUPPLY_STEPS.map((step, i) => (
            <li key={step.title} className="reveal flex flex-col gap-3 border-t border-line pt-6" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="font-serif text-4xl text-emerald-deep italic">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-xl font-medium text-ink">{step.title}</h3>
              <p className="leading-relaxed text-body">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="reveal mt-14 flex flex-col gap-4 sm:flex-row">
          <SplitButton to="/it-supply/build-your-order">Build your order</SplitButton>
          <SplitButton to="/contact?service=it-supply" variant="ink">
            Send us your own list
          </SplitButton>
        </div>
      </section>
    </>
  );
}
