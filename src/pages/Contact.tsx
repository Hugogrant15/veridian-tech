import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, WHATSAPP_URL, formatAddress } from "../config/company";
import { PageHeader } from "../components/PageHeader";
import { Accent, Seo, WhatsAppGlyph } from "../components/ui";
import { EnquiryForm } from "../components/EnquiryForm";

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact | Veridian Tech Innovations Ltd"
        description="Start a project with Veridian Tech. Fill in the form, email, call or message us on WhatsApp."
      />
      <PageHeader
        compact
        eyebrow="Contact"
        title={
          <>
            Let&apos;s get your business <Accent>properly online.</Accent>
          </>
        }
        sub="Tell us what you need. Fill in the form, email us, or message us on WhatsApp."
      />

      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-10">
        <div className="flex flex-col gap-8">
          {/* Every channel gets the same weight; none is pushed ahead of the form. */}
          <ul className="flex flex-col gap-6 text-body">
            <li className="flex gap-4">
              <Mail size={22} className="mt-0.5 flex-shrink-0 text-emerald-deep" aria-hidden="true" />
              <div>
                <h2 className="font-medium text-ink">Email</h2>
                <a href={`mailto:${COMPANY.email}`} className="break-all text-emerald-deep hover:underline">
                  {COMPANY.email}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone size={22} className="mt-0.5 flex-shrink-0 text-emerald-deep" aria-hidden="true" />
              <div>
                <h2 className="font-medium text-ink">Call us</h2>
                <p className="mb-1 text-sm text-muted">Monday to Friday, 8am to 5pm</p>
                {COMPANY.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="block text-emerald-deep hover:underline">
                    {p.display}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex gap-4">
              <WhatsAppGlyph className="mt-0.5 size-[22px] flex-shrink-0 text-emerald-deep" />
              <div>
                <h2 className="font-medium text-ink">WhatsApp</h2>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-deep hover:underline">
                  {COMPANY.whatsapp.display}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPin size={22} className="mt-0.5 flex-shrink-0 text-emerald-deep" aria-hidden="true" />
              <div>
                <h2 className="font-medium text-ink">Office</h2>
                <address className="not-italic">{formatAddress()}</address>
              </div>
            </li>
          </ul>
        </div>

        {/* Form first on phones so it is on screen sooner; desktop keeps details on the left. */}
        <div className="order-first lg:order-none">
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
