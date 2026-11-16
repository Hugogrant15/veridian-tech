import type { ReactNode } from "react";
import { BadgeCheck, IdCard, MapPin, Smartphone } from "lucide-react";
import { COMPANY } from "../config/company";
import { CircuitArt } from "../components/CircuitArt";
import { ArrowLink, Eyebrow, SplitButton } from "../components/ui";

// The pen path goes round twice; the second pass is offset so it reads as a scribble.
const LOOP_PATH =
  "M44 94 C30 42 182 12 320 14 C470 16 592 42 586 88 C580 134 440 154 300 152 C158 150 20 134 18 92 C16 50 150 24 312 22 C462 20 600 50 594 96 C588 140 430 160 290 156 C170 152 60 142 50 110";

function Credential({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-[15px] text-ink">
      <span className="text-emerald-deep">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="grain grain-light absolute inset-0" />
      {/* Text is top-aligned beside the full-size art, so the buttons stay above the fold on laptops. */}
      <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-5 pt-8 pb-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-10 lg:pt-4 lg:pb-6">
        <div className="flex flex-col gap-7 lg:pt-12">
          <div className="rise" style={{ animationDelay: "0.05s" }}>
            <Eyebrow>{COMPANY.legalName} · Lagos</Eyebrow>
          </div>
          <h1 className="text-[44px] leading-[0.98] font-light tracking-[-0.035em] text-ink sm:text-6xl xl:text-[80px]">
            <span className="rise block" style={{ animationDelay: "0.15s" }}>
              Your business,
            </span>
            <span className="rise block" style={{ animationDelay: "0.3s" }}>
              <span className="relative inline-block">
                <span className="shine inline-block pr-2 pb-1.5 font-serif text-[1.1em] font-normal tracking-[-0.01em] whitespace-nowrap italic">
                  properly online.
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute top-[-14%] left-[-5%] h-[132%] w-[110%] overflow-visible"
                >
                  <path
                    className="loop"
                    d={LOOP_PATH}
                    fill="none"
                    stroke="#11A159"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </span>
          </h1>
          <p
            className="rise max-w-[540px] text-lg leading-relaxed text-body sm:text-[19px]"
            style={{ animationDelay: "0.45s" }}
          >
            We design and build websites, online stores and mobile apps for Nigerian businesses, and we are the
            makers of EasyPass.
          </p>
          <div
            className="rise mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
            style={{ animationDelay: "0.6s" }}
          >
            <SplitButton to="/contact">Start a project</SplitButton>
            <ArrowLink to="/products" className="self-center text-ink sm:self-auto">
              See EasyPass
            </ArrowLink>
          </div>
        </div>

        <div className="lg:-mr-10">
          <div className="mx-auto hidden w-full max-w-[500px] lg:block">
            <CircuitArt />
          </div>
          <div className="mx-auto max-w-[360px] lg:hidden">
            <CircuitArt interactive={false} />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="relative flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:gap-14">
          <div aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-gold/60 via-gold/15 to-transparent" />
          <span className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Registered &amp; verifiable</span>
          <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:flex lg:gap-12">
            <Credential icon={<BadgeCheck size={20} aria-hidden="true" />}>
              <span className="text-muted">CAC</span> <strong className="font-semibold">RC {COMPANY.rcNumber}</strong>
            </Credential>
            <Credential icon={<IdCard size={20} aria-hidden="true" />}>
              <span className="text-muted">D-U-N-S</span> <strong className="font-semibold">{COMPANY.duns}</strong>
            </Credential>
            <Credential icon={<Smartphone size={20} aria-hidden="true" />}>
              <strong className="font-semibold">EasyPass</strong> <span className="text-muted">on Google Play</span>
            </Credential>
            <Credential icon={<MapPin size={20} aria-hidden="true" />}>
              <span className="text-muted">HQ</span> <strong className="font-semibold">Lagos, Nigeria</strong>
            </Credential>
          </div>
        </div>
      </div>
    </section>
  );
}
