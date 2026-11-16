// Visuals for the dark page headers. Both use only real Veridian work.
import type { CSSProperties } from "react";

const WALL_COLUMNS = [
  { speed: "70s", offset: "0%", images: ["/work/uwaoma.jpg", "/work/rhemaverse.jpg", "/work/prinx.jpg"] },
  { speed: "55s", offset: "-18%", images: ["/work/stuzans.jpg", "/work/easypass.jpg", "/work/uwaoma.jpg"] },
  { speed: "80s", offset: "-9%", images: ["/work/prinx.jpg", "/work/stuzans.jpg", "/work/rhemaverse.jpg"] },
];

/** Work header: three tilted columns of real screenshots drifting upward (pauses on hover). */
export function PortfolioWall() {
  return (
    <div
      aria-hidden="true"
      className="wall pointer-events-auto absolute inset-0 overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent),linear-gradient(to_right,transparent,black_14%)] lg:right-[-6%] lg:left-auto lg:w-[54%]"
    >
      <div className="flex h-[150%] gap-5 [transform:perspective(1800px)_rotateX(16deg)_rotateZ(-9deg)_translateY(-12%)]">
        {WALL_COLUMNS.map((col, c) => (
          <div key={c} className="flex-1" style={{ marginTop: col.offset }}>
            <div className="wall-col flex flex-col gap-5" style={{ "--wall-speed": col.speed } as CSSProperties}>
              {/* The list is doubled so the drift loops without a jump. */}
              {[...col.images, ...col.images].map((src, i) => (
                <div key={i} className="overflow-hidden rounded-[8px] border border-gold/40 bg-white">
                  <img src={src} alt="" loading="lazy" width={1440} height={900} className="aspect-[16/10] w-full object-cover object-top" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCREENS = [
  { desktop: "/work/uwaoma.jpg", phone: "/work/uwaoma-m.jpg", delay: "0s" },
  { desktop: "/work/stuzans.jpg", phone: "/work/stuzans-m.jpg", delay: "-8s" },
  { desktop: "/work/prinx.jpg", phone: "/work/prinx-m.jpg", delay: "-4s" },
];

const CHIPS = [
  { label: "Mobile-friendly", className: "left-[-4%] top-[16%]", delay: "0s" },
  { label: "Search-ready", className: "right-[-2%] top-[4%]", delay: "-2s" },
  { label: "Enquiry forms", className: "left-[8%] bottom-[6%]", delay: "-4s" },
];

/** Services header: a browser and a phone showing the same real client site, taking turns. */
export function DeviceStack() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
      {/* Browser */}
      <div className="absolute top-[6%] left-0 w-[86%] overflow-hidden rounded-[10px] border border-gold/40 bg-[#0B3A27] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
        <div className="flex h-7 items-center gap-1.5 border-b border-gold/20 px-3">
          <span className="size-2 rounded-full bg-pearl/30" />
          <span className="size-2 rounded-full bg-pearl/30" />
          <span className="size-2 rounded-full bg-pearl/30" />
        </div>
        <div className="relative aspect-[16/10]">
          {SCREENS.map((s) => (
            <img key={s.desktop} src={s.desktop} alt="" width={1440} height={900} className="xfade absolute inset-0 size-full object-cover object-top" style={{ animationDelay: s.delay }} />
          ))}
        </div>
      </div>
      {/* Phone */}
      <div className="absolute right-0 bottom-0 w-[30%] rounded-[22px] border border-gold/50 bg-[#03140D] p-[5px] shadow-[0_40px_70px_-25px_rgb(0_0_0/0.7)]">
        <div className="relative aspect-[390/844] overflow-hidden rounded-[17px]">
          {SCREENS.map((s) => (
            <img key={s.phone} src={s.phone} alt="" width={780} height={1688} className="xfade absolute inset-0 size-full object-cover object-top" style={{ animationDelay: s.delay }} />
          ))}
        </div>
      </div>
      {/* Labels */}
      {CHIPS.map((chip) => (
        <span
          key={chip.label}
          className={`float-chip absolute rounded-md border border-gold/50 bg-night px-3 py-1.5 text-xs font-semibold tracking-wide text-gold-light ${chip.className}`}
          style={{ animationDelay: chip.delay }}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}
