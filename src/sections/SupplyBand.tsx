import { Link } from "react-router-dom";
import { SUPPLY_SERVICES } from "../config/supply";
import { Accent, ArrowIcon, SectionHeading, SplitButton } from "../components/ui";

/** Home: the company's second side, IT supply and setup, with a link to each service. */
export function SupplyBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div className="reveal flex flex-col gap-8">
          <SectionHeading
            eyebrow="IT supply and setup"
            title={
              <>
                Equipment for your team, <Accent>delivered and set up.</Accent>
              </>
            }
            sub="Beyond software: laptops in bulk, workstations, networks, CCTV and printers for government and private-sector projects, anywhere in Nigeria."
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <SplitButton to="/it-supply/build-your-order">Build your order</SplitButton>
            <SplitButton to="/it-supply" variant="ink">
              See IT supply
            </SplitButton>
          </div>
        </div>
        <ul className="reveal flex flex-col">
          {SUPPLY_SERVICES.map(({ id, Icon, short }) => (
            <li key={id} className="border-t border-line last:border-b">
              <Link to={`/it-supply/${id}`} className="group flex items-center gap-5 py-5 text-xl font-medium text-ink transition-colors hover:text-emerald-deep">
                <span className="flex size-11 flex-shrink-0 items-center justify-center rounded-[10px] bg-emerald/10 text-emerald-deep">
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                </span>
                {short}
                <span className="ml-auto text-muted transition-transform group-hover:translate-x-1 group-hover:text-emerald-deep">
                  <ArrowIcon size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
