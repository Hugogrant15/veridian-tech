import { Phone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { COMPANY, PRIMARY_PHONE, WHATSAPP_URL } from "../config/company";
import { WhatsAppGlyph } from "./ui";

// WhatsApp floats on every page. The call button floats on the home page,
// on phones only (lg:hidden), where tapping a number places a call.
export function FloatingContact() {
  const { pathname } = useLocation();

  return (
    <div className="fixed right-4 bottom-5 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {pathname === "/" && (
        <a
          href={`tel:${PRIMARY_PHONE.tel}`}
          aria-label={`Call us on ${PRIMARY_PHONE.display}`}
          className="flex size-14 items-center justify-center rounded-full bg-ink text-gold-light shadow-[0_10px_24px_rgb(15_31_23/0.22)] transition-transform active:scale-95 lg:hidden"
        >
          <Phone className="size-6" aria-hidden="true" />
        </a>
      )}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with us on WhatsApp (${COMPANY.whatsapp.display})`}
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgb(15_31_23/0.2)] transition-transform hover:scale-105 active:scale-95"
      >
        <WhatsAppGlyph />
      </a>
    </div>
  );
}
