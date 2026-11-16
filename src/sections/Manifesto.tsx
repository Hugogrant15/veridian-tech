import { useEffect, useRef, useState } from "react";
import { MISSION, PRINCIPLES, PRINCIPLES_LEAD, VISION } from "../config/about";
import { CircuitWatermark } from "../components/CircuitArt";
import { Eyebrow } from "../components/ui";
import { useReducedMotion } from "../hooks/useReducedMotion";

// About page: principles as editorial rows beside a sticky intro, then the vision as a
// full-width statement whose words light up as it scrolls through. Solid night green, no gradients.

/** Index of the principle row currently crossing the middle of the screen. */
function useActiveRow(count: number) {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.current.slice(0, count).forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, [count]);
  return { active, rows };
}

/**
 * 0 → 1 as an element scrolls up through the screen: 0 when its top reaches `start` (fraction of the
 * screen height from the top), 1 once it has risen to `end` and its full height has passed that line.
 */
function useScrollProgress(start: number, end: number, reduced: boolean) {
  const ref = useRef<HTMLDivElement & HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (reduced) return; // shown fully lit; see the return value below
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * start - rect.top) / (vh * (start - end) + rect.height);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update); // first measurement on the next frame
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [start, end, reduced]);
  return { ref, progress: reduced ? 1 : progress };
}

/** Words that light up one by one: the first `lit` are full strength, the rest dim. */
function LitWords({ words, lit }: { words: string[]; lit: number }) {
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className={`transition-opacity duration-500 ${i < lit ? "opacity-100" : "opacity-20"}`}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/** One principle row: the numeral brightens, then the title and description light up word by word. */
function PrincipleText({ title, body, reduced }: { title: string; body: string; reduced: boolean }) {
  const { ref, progress } = useScrollProgress(0.85, 0.4, reduced);
  const titleWords = title.split(" ");
  const bodyWords = body.split(" ");
  const lit = Math.round(progress * (titleWords.length + bodyWords.length));
  return (
    <div ref={ref} className="flex flex-col gap-3 sm:pt-3 lg:pt-6">
      <h3 className="text-2xl leading-tight font-light tracking-[-0.02em] sm:text-3xl lg:text-4xl">
        <LitWords words={titleWords} lit={lit} />
      </h3>
      <p className="max-w-xl text-lg leading-relaxed text-sage">
        <LitWords words={bodyWords} lit={lit - titleWords.length} />
      </p>
    </div>
  );
}

const VISION_WORDS = VISION.split(" ");

export function Manifesto() {
  const reduced = useReducedMotion();
  const { active, rows } = useActiveRow(PRINCIPLES.length);
  const { ref: visionRef, progress: visionProgress } = useScrollProgress(0.85, 0.35, reduced);
  const visionLit = Math.round(visionProgress * VISION_WORDS.length);

  return (
    <section aria-labelledby="manifesto-title" className="relative overflow-hidden border-y border-gold/30 bg-night text-pearl">
      <div aria-hidden="true" className="grain grain-dark absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        {/* Principles */}
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="flex flex-col gap-6 lg:sticky lg:top-36 lg:self-start">
            <Eyebrow tone="dark">What we stand for</Eyebrow>
            <h2 id="manifesto-title" className="text-4xl leading-[1.05] font-light tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              How we work, <span className="font-serif text-[1.12em] font-normal text-emerald-bright italic">in three lines.</span>
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-sage">{PRINCIPLES_LEAD}</p>
            {/* Progress: the line for the principle in view lights up. */}
            <ol aria-hidden="true" className="mt-2 hidden flex-col gap-3 lg:flex">
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} className="flex items-center gap-4 text-sm">
                  <span className={`h-px transition-all duration-500 ${active === i ? "w-12 bg-gold" : "w-6 bg-gold/35"}`} />
                  <span className={`transition-colors duration-500 ${active === i ? "text-pearl" : "text-sage/60"}`}>{p.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <ol className="flex flex-col">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                data-index={i}
                className="reveal relative grid gap-4 py-12 first:pt-0 last:pb-0 sm:grid-cols-[auto_1fr] sm:gap-10 lg:py-16"
              >
                <span aria-hidden="true" className="numeral-outline font-serif text-[88px] leading-[0.85] italic lg:text-[140px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <PrincipleText title={p.title} body={p.body} reduced={reduced} />
                {i < PRINCIPLES.length - 1 && <span aria-hidden="true" className="hairline absolute right-0 bottom-0 left-0 h-px bg-gold/50" />}
              </li>
            ))}
          </ol>
        </div>

        {/* Vision and mission */}
        <div className="relative mt-16 border-t border-gold/25 pt-16 text-center lg:mt-20 lg:pt-20">
          <CircuitWatermark className="pointer-events-none absolute top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 text-emerald-bright/[0.05] lg:size-[680px]" />
          <h3 className="relative mb-8 text-xs font-semibold tracking-[0.18em] text-gold-light uppercase">Our vision</h3>
          <p ref={visionRef} className="relative mx-auto max-w-5xl font-serif text-4xl leading-[1.15] italic sm:text-5xl lg:text-[64px]">
            <span aria-hidden="true" className="text-gold">“</span>
            <LitWords words={VISION_WORDS} lit={visionLit} />
            <span aria-hidden="true" className="text-gold">”</span>
          </p>
          <span aria-hidden="true" className="relative mx-auto my-12 block h-px w-16 bg-gold" />
          <h3 className="relative mb-5 text-xs font-semibold tracking-[0.18em] text-gold-light uppercase">Our mission</h3>
          <p className="relative mx-auto max-w-3xl text-xl leading-relaxed text-sage">{MISSION}</p>
        </div>
      </div>
    </section>
  );
}
