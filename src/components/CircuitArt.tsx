import { useState, type MouseEvent } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

// Original artwork echoing the logo's circuit "V": green traces from the
// left, charcoal from the right. It is decoration, not the logo itself.
const GREEN = "#11A159";
const CHARCOAL = "#414141";

interface Trace {
  d: string;
  color: string;
  delay: number;
  start: [number, number];
  end: [number, number];
}

const TRACES: Trace[] = [
  { d: "M60 120 H240 L360 240 V400", color: GREEN, delay: 0.5, start: [60, 120], end: [360, 400] },
  { d: "M60 196 H206 L304 294 V528", color: GREEN, delay: 0.65, start: [60, 196], end: [304, 528] },
  { d: "M128 300 L232 404 V600", color: GREEN, delay: 0.8, start: [128, 300], end: [232, 600] },
  { d: "M150 470 L236 556 H262", color: GREEN, delay: 0.95, start: [150, 470], end: [262, 556] },
  { d: "M604 84 H436 L384 136 V300", color: CHARCOAL, delay: 0.55, start: [604, 84], end: [384, 300] },
  { d: "M604 160 H468 L424 204 V356 L470 402", color: CHARCOAL, delay: 0.7, start: [604, 160], end: [470, 402] },
  { d: "M560 236 L472 324 V560", color: CHARCOAL, delay: 0.85, start: [560, 236], end: [472, 560] },
  { d: "M610 306 L532 384 V470", color: CHARCOAL, delay: 1, start: [610, 306], end: [532, 470] },
];

// Gold pulses that travel along a trace, then pause, then repeat.
const PULSES = [
  { trace: 0, begin: "2.2s", fill: "#E4C77E" },
  { trace: 5, begin: "3.6s", fill: "#FFFFFF" },
  { trace: 2, begin: "5s", fill: "#E4C77E" },
  { trace: 6, begin: "6.3s", fill: "#FFFFFF" },
];

const STRIPS = [
  { from: 0.46, to: 0.06, blur: 1.6 },
  { from: 0.4, to: 0.04, blur: 1.3 },
  { from: 0.34, to: 0.03, blur: 1 },
  { from: 0.26, to: 0.02, blur: 0.7 },
  { from: 0.18, to: 0, blur: 0 },
];

/** A faint, still version of the traces, used as a watermark (e.g. the About page plaque). */
export function CircuitWatermark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 640" aria-hidden="true" className={className}>
      <g fill="none" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        {TRACES.map((t) => (
          <path key={t.d} d={t.d} stroke="currentColor" />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="8">
        {TRACES.flatMap((t) => [
          <circle key={`${t.d}-s`} cx={t.start[0]} cy={t.start[1]} r="15" />,
          <circle key={`${t.d}-e`} cx={t.end[0]} cy={t.end[1]} r="15" />,
        ])}
      </g>
    </svg>
  );
}

export function CircuitArt({ interactive = true }: { interactive?: boolean }) {
  const reduced = useReducedMotion();
  const [shift, setShift] = useState(0);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const next = Math.round(((e.clientX - rect.left) / rect.width - 0.5) * 60);
    if (next !== shift) setShift(next);
  };

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[640px]"
      onMouseMove={interactive && !reduced ? onMove : undefined}
      onMouseLeave={() => setShift(0)}
    >
      <div className="pointer-events-none absolute -inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(17_161_89/0.2),rgb(17_161_89/0.07)_55%,rgb(201_165_92/0.06)_75%,transparent)]" />
      <svg viewBox="0 0 640 640" className="absolute inset-0 size-full">
        <g fill="none" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
          {TRACES.map((t) => (
            <path key={t.d} className="trace" style={{ animationDelay: `${t.delay}s` }} d={t.d} stroke={t.color} />
          ))}
        </g>
        <g fill="#F5F7F2" strokeWidth="8">
          {TRACES.flatMap((t) => [
            <circle key={`${t.d}-s`} className="node" style={{ animationDelay: `${t.delay}s` }} cx={t.start[0]} cy={t.start[1]} r="15" stroke={t.color} />,
            <circle key={`${t.d}-e`} className="node" style={{ animationDelay: `${t.delay + 1.05}s` }} cx={t.end[0]} cy={t.end[1]} r="15" stroke={t.color} />,
          ])}
        </g>
        {!reduced &&
          PULSES.map((p) => {
            const trace = TRACES[p.trace];
            if (!trace) return null;
            return (
              <g key={p.begin} opacity="0">
                <circle r="16" fill={p.fill} opacity="0.3" />
                <circle r="7" fill={p.fill} />
                <animateMotion path={trace.d} dur="4.2s" begin={p.begin} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.52;1" calcMode="linear" />
                <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.06;0.52;0.58;1" dur="4.2s" begin={p.begin} repeatCount="indefinite" />
              </g>
            );
          })}
      </svg>
      <div
        className="absolute inset-y-[3%] left-[4%] flex w-[56%] transition-transform duration-700 ease-out"
        style={{ transform: `translateX(${shift}px)` }}
      >
        {STRIPS.map((s, i) => (
          <div
            key={i}
            className="strip h-full flex-1"
            style={{
              background: `linear-gradient(90deg, rgb(255 255 255 / ${s.from}), rgb(255 255 255 / ${s.to}))`,
              backdropFilter: s.blur ? `blur(${s.blur}px) saturate(1.5)` : undefined,
              WebkitBackdropFilter: s.blur ? `blur(${s.blur}px) saturate(1.5)` : undefined,
              borderLeft: `1.5px solid ${i === STRIPS.length - 1 ? "rgb(201 165 92 / 0.55)" : "rgb(255 255 255 / 0.9)"}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
