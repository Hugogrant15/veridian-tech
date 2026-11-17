import { Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { LAPTOP_CATEGORIES, STAFF_PROFILES, SUPPLY_SERVICES } from "../config/supply";
import { PageHeader } from "../components/PageHeader";
import { ArrowIcon, SectionHeading, Accent, Seo, SplitButton } from "../components/ui";
import NotFound from "./NotFound";

/** Technical reference on the laptop page: the starting specification for each kind of user. */
function SpecificationGuide() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="reveal mb-12">
          <SectionHeading
            eyebrow="Specification guide"
            title={
              <>
                The right laptop for <Accent>each job.</Accent>
              </>
            }
            sub="A starting specification for each kind of user. We confirm the exact models with you before quoting."
          />
        </div>
        <div className="flex flex-col gap-14">
          {LAPTOP_CATEGORIES.map((category) => (
            <div key={category.id} className="reveal">
              <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink">{category.title}</h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-body">{category.description}</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {STAFF_PROFILES.filter((p) => p.category === category.id).map((profile) => (
                  <div key={profile.id} className="rounded-[10px] border border-line bg-white/70 p-6">
                    <h4 className="text-lg font-semibold text-ink">{profile.label}</h4>
                    <p className="mt-1 text-sm text-muted">{profile.usedFor}</p>
                    <dl className="mt-4 flex flex-col">
                      {profile.spec.map((line) => (
                        <div key={line.label} className="flex justify-between gap-6 border-t border-line py-2.5 text-sm">
                          <dt className="flex-shrink-0 text-muted">{line.label}</dt>
                          <dd className="text-right text-ink">{line.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** One page per supply service, at /it-supply/<id>. */
export default function SupplyServicePage() {
  const { id } = useParams();
  const service = SUPPLY_SERVICES.find((s) => s.id === id);
  if (!service) return <NotFound />;

  const { Icon, title, short, description, includes, goodFor, seoTitle, seoDescription } = service;
  const isLaptops = service.id === "bulk-laptops";
  const others = SUPPLY_SERVICES.filter((s) => s.id !== service.id);

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} />
      <PageHeader eyebrow={`IT supply · ${short}`} title={title} sub={description} />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:px-10 lg:pb-28">
        <div className="reveal flex flex-col gap-8">
          <div>
            <h2 className="mb-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase">What you get</h2>
            <ul className="flex flex-col gap-4">
              {includes.map((item) => (
                <li key={item} className="flex gap-3 text-lg text-ink">
                  <Check size={20} className="mt-1 flex-shrink-0 text-emerald" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="border-l-2 border-gold pl-4 text-body">
            <span className="font-semibold text-ink">Good for: </span>
            {goodFor}
          </p>
        </div>

        <aside className="reveal flex h-fit flex-col gap-5 rounded-[10px] border border-line bg-white/70 p-6 sm:p-8">
          <span className="flex size-12 items-center justify-center rounded-[10px] bg-emerald/10 text-emerald-deep">
            <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">Get a quotation</h2>
          <p className="leading-relaxed text-body">
            {isLaptops
              ? "Pick who the laptops are for and how many. The order builder turns it into a specification sheet you can send us."
              : "Tell us what you need and where. We reply with a written quotation."}
          </p>
          {isLaptops && (
            <SplitButton to="/it-supply/build-your-order" block>
              Build your order
            </SplitButton>
          )}
          <SplitButton to="/contact?service=it-supply" variant={isLaptops ? "ink" : "emerald"} block>
            Request a quote
          </SplitButton>
        </aside>
      </section>

      {isLaptops && <SpecificationGuide />}

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <h2 className="reveal mb-8 text-xs font-semibold tracking-[0.16em] text-muted uppercase">Also from our IT supply side</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other) => (
              <li key={other.id} className="reveal">
                <Link
                  to={`/it-supply/${other.id}`}
                  className="flex h-full items-center justify-between gap-4 rounded-[10px] border border-line bg-white/70 px-5 py-4 font-medium text-ink transition-colors hover:border-emerald hover:text-emerald-deep"
                >
                  {other.short}
                  <ArrowIcon size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
