import type { ReactNode } from "react";
import { SectionHeading } from "./ui";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  /** Less padding, for pages whose content (e.g. a form) should start above the fold. */
  compact?: boolean;
  /** "dark": solid night-emerald band with no gradients, for pages with a header visual. */
  tone?: "light" | "dark";
  /** Shown on the right on large screens (dark tone only). */
  visual?: ReactNode;
}

/**
 * Top of every inner page, with one H1. The top padding leaves room for the
 * floating navigation bar, which sits over this section (Navbar.tsx).
 */
export function PageHeader({ eyebrow, title, sub, compact = false, tone = "light", visual }: PageHeaderProps) {
  if (tone === "dark") {
    return (
      <section className="relative overflow-hidden border-b border-gold/30 bg-night text-pearl">
        <div aria-hidden="true" className="grain grain-dark absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pt-28 pb-16 sm:px-8 lg:min-h-[600px] lg:grid-cols-[1fr_1fr] lg:px-10 lg:pt-36 lg:pb-20">
          <div className="rise relative z-10 lg:max-w-[540px]">
            <SectionHeading as="h1" tone="dark" eyebrow={eyebrow} title={title} sub={sub} />
          </div>
          {visual && <div className="relative min-h-[320px] lg:static lg:min-h-0">{visual}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute -top-40 -right-40 size-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(17_161_89/0.16),rgb(201_165_92/0.05)_70%,transparent)]" />
      <div aria-hidden="true" className="grain grain-light absolute inset-0" />
      <div
        className={`rise relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 ${
          compact ? "pt-28 pb-8 lg:pt-32 lg:pb-10" : "pt-32 pb-14 lg:pt-40 lg:pb-16"
        }`}
      >
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} sub={sub} />
      </div>
    </section>
  );
}
