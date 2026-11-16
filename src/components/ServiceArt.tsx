// Labelled illustrations for services with no real Veridian example yet.
// Generic on purpose: never styled to look like a real client's site.
import type { ReactElement } from "react";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";

const frame = "relative aspect-[16/11] overflow-hidden rounded-[10px] border border-line bg-white p-5 sm:p-7";
const bar = (w: string, tone = "bg-[#E4EBE6]") => <span className={`block h-2.5 rounded-sm ${tone}`} style={{ width: w }} />;

function StoreArt() {
  const items = [
    { tone: "bg-[#DCEBE2]", price: "₦12,500" },
    { tone: "bg-[#EFE6D2]", price: "₦8,000" },
    { tone: "bg-[#E2E8EF]", price: "₦17,000" },
    { tone: "bg-[#EADFE0]", price: "₦6,500" },
  ];
  return (
    <div className={frame}>
      <div className="grid h-full grid-cols-[1.4fr_1fr] gap-4">
        <div className="grid grid-cols-2 gap-3">
          {items.map((it) => (
            <div key={it.price} className="flex flex-col gap-1.5">
              <span className={`block flex-1 rounded-md ${it.tone}`} />
              {bar("70%")}
              <span className="text-xs font-semibold text-ink">{it.price}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-md border border-line p-3.5">
          <span className="flex items-center gap-2 text-xs font-semibold text-ink">
            <ShoppingBag size={14} aria-hidden="true" /> Your order
          </span>
          {bar("90%")}
          {bar("75%")}
          <span className="mt-auto flex justify-between text-xs text-muted">
            Total <strong className="text-ink">₦37,500</strong>
          </span>
          <span className="rounded-md bg-emerald-deep py-2 text-center text-xs font-semibold text-white">Pay by card or transfer</span>
        </div>
      </div>
    </div>
  );
}

function LandingArt() {
  return (
    <div className={frame}>
      <div className="flex h-full items-center gap-5">
        <div className="flex flex-1 flex-col gap-3">
          {bar("85%", "bg-ink/80")}
          {bar("65%", "bg-ink/80")}
          {bar("90%")}
          {bar("70%")}
          <span className="mt-2 inline-flex w-max items-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-xs font-semibold text-white">
            Chat on WhatsApp <ArrowRight size={13} aria-hidden="true" />
          </span>
        </div>
        <ol className="flex flex-col items-center gap-2 text-[11px] font-semibold text-muted">
          {["Your ad", "This page", "An enquiry"].map((step, i) => (
            <li key={step} className="flex flex-col items-center gap-2">
              {i > 0 && <span className="h-5 w-px bg-gold" />}
              <span className={`rounded-md border px-3 py-1.5 ${i === 2 ? "border-emerald-deep bg-emerald-deep text-white" : "border-line bg-pearl"}`}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function RedesignArt() {
  return (
    <div className={`${frame} grid grid-cols-2 gap-4`}>
      <div className="flex flex-col gap-2.5 rounded-md bg-[#EEEEEC] p-3.5 opacity-80">
        <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">Before</span>
        <span className="block h-10 rounded-sm bg-[#D9D9D6]" />
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="block h-6 rounded-sm bg-[#D9D9D6]" />
          ))}
        </div>
        {bar("95%", "bg-[#D9D9D6]")}
        {bar("80%", "bg-[#D9D9D6]")}
        {bar("90%", "bg-[#D9D9D6]")}
      </div>
      <div className="flex flex-col gap-3 rounded-md border border-gold/50 p-3.5">
        <span className="text-[11px] font-semibold tracking-wide text-emerald-deep uppercase">After</span>
        {bar("80%", "bg-ink/80")}
        {bar("60%", "bg-ink/80")}
        {bar("70%")}
        <span className="mt-auto inline-flex w-max items-center gap-1.5 rounded-md bg-emerald-deep px-3 py-1.5 text-[11px] font-semibold text-white">
          <Check size={12} aria-hidden="true" /> Get a quote
        </span>
      </div>
    </div>
  );
}

const ART: Record<string, () => ReactElement> = {
  ecommerce: StoreArt,
  "landing-pages": LandingArt,
  redesigns: RedesignArt,
};

export function ServiceArt({ id }: { id: string }) {
  const Art = ART[id];
  if (!Art) return null;
  return (
    <figure className="flex flex-col gap-3">
      <div aria-hidden="true">
        <Art />
      </div>
      <figcaption className="text-sm text-muted">Illustration</figcaption>
    </figure>
  );
}
