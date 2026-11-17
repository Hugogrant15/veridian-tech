import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, WHATSAPP_URL, formatAddress } from "../config/company";
import { SERVICES } from "../config/services";
import { Logo, NAV_LINKS } from "./Navbar";
import { WhatsAppGlyph } from "./ui";

const headingClass = "mb-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase";
const linkClass = "text-body transition-colors hover:text-emerald-deep";

export function Footer() {
  return (
    <footer className="relative bg-pearl">
      <div aria-hidden="true" className="gold-rule h-px" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_1.2fr] lg:px-10">
        <div className="flex flex-col gap-5">
          <Link to="/" aria-label="Veridian Tech Innovations Ltd, home" className="self-start">
            <Logo className="h-24 lg:h-28" />
          </Link>
          <p className="max-w-xs leading-relaxed text-body">
            Websites, online stores and mobile apps for Nigerian businesses, from the makers of EasyPass.
          </p>
          <dl className="space-y-1 text-sm text-muted">
            <div>
              <dt className="inline">RC </dt>
              <dd className="inline font-semibold text-ink">{COMPANY.rcNumber}</dd>
            </div>
            <div>
              <dt className="inline">D-U-N-S </dt>
              <dd className="inline font-semibold text-ink">{COMPANY.duns}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className={headingClass}>Services</h2>
          <ul className="space-y-3">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link to={`/services/${s.id}`} className={linkClass}>
                  {s.short}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/industries/oil-and-gas" className={linkClass}>
                Oil and gas websites
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>Company</h2>
          <ul className="space-y-3">
            {NAV_LINKS.filter((l) => l.to !== "/services").map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/privacy" className={linkClass}>
                Privacy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>Get in touch</h2>
          <ul className="space-y-4 text-body">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-0.5 flex-shrink-0 text-emerald-deep" aria-hidden="true" />
              <address className="not-italic">{formatAddress()}</address>
            </li>
            {COMPANY.phones.map((p) => (
              <li key={p.tel} className="flex items-center gap-3">
                <Phone size={20} className="flex-shrink-0 text-emerald-deep" aria-hidden="true" />
                <a href={`tel:${p.tel}`} className={linkClass}>
                  {p.display}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <WhatsAppGlyph className="size-5 flex-shrink-0 text-emerald-deep" />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp {COMPANY.whatsapp.display}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="flex-shrink-0 text-emerald-deep" aria-hidden="true" />
              <a href={`mailto:${COMPANY.email}`} className={`${linkClass} break-all`}>
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-line px-5 py-7 text-sm text-muted sm:px-8 lg:px-10">
        © {new Date().getFullYear()} {COMPANY.legalName} (RC {COMPANY.rcNumber}). All rights reserved.
      </div>
    </footer>
  );
}
