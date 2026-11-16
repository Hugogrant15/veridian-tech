// Small shared building blocks: buttons, links, eyebrows, headings, frames.
import type { ComponentProps, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE_ORIGIN } from "../config/company";
import imageManifest from "../config/image-manifest.json";
import { ArrowUpRight } from "lucide-react";

export const ArrowIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

type ButtonVariant = "emerald" | "ink" | "gold";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  emerald: "",
  ink: "btn-ink",
  gold: "btn-gold",
};

interface SplitButtonProps {
  children: ReactNode;
  /** Internal route. */
  to?: string;
  /** External URL; opens in a new tab. */
  href?: string;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  block?: boolean;
}

/** Label plus arrow box. Hover sweeps the label and swaps the arrow. */
export function SplitButton({
  children,
  to,
  href,
  variant = "emerald",
  size = "md",
  block = false,
}: SplitButtonProps) {
  const className = [
    "btn",
    VARIANT_CLASS[variant],
    size === "sm" ? "btn-sm" : "",
    block ? "flex w-full" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const arrow = size === "sm" ? 16 : 20;
  const inner = (
    <>
      <span className="btn-label">
        <span>{children}</span>
      </span>
      <span className="btn-arrow" aria-hidden="true">
        <ArrowIcon size={arrow} />
        <ArrowIcon size={arrow} />
      </span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}

interface ArrowLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  className?: string;
}

/** Text link whose underline draws in on hover. External links get ↗. */
export function ArrowLink({ children, to, href, className = "" }: ArrowLinkProps) {
  const cls = `lnk ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
        <ArrowIcon size={18} />
      </Link>
    );
  }
  return (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}

/** Small uppercase label with a gold rule in front. */
export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <div
      className={`flex items-center gap-3.5 text-xs font-semibold tracking-[0.16em] uppercase sm:text-[13px] ${
        tone === "dark" ? "text-gold-light" : "text-muted"
      }`}
    >
      <span aria-hidden="true" className="h-[1.5px] w-9 bg-gold" />
      {children}
    </div>
  );
}

/** Italic serif accent used inside headings. */
export function Accent({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`font-serif text-[1.12em] font-normal italic tracking-[-0.01em] ${
        tone === "dark" ? "text-emerald-bright" : "text-emerald-deep"
      }`}
    >
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  tone?: "light" | "dark";
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, sub, tone = "light", as = "h2" }: SectionHeadingProps) {
  const Heading = as;
  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <Heading
        className={`text-4xl leading-[1.04] font-light tracking-[-0.03em] sm:text-5xl lg:text-6xl ${
          tone === "dark" ? "text-pearl" : "text-ink"
        }`}
      >
        {title}
      </Heading>
      {sub && (
        <p className={`text-lg leading-relaxed ${tone === "dark" ? "text-sage" : "text-body"}`}>{sub}</p>
      )}
    </div>
  );
}

/** A minimal browser window around a screenshot or visual. */
export function BrowserFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="frame overflow-hidden rounded-[10px] border border-line bg-white">
      <div className="flex h-8 items-center gap-1.5 border-b border-line bg-pearl px-3.5">
        <span className="size-2.5 rounded-full bg-[#E6A19A]" />
        <span className="size-2.5 rounded-full bg-[#E9CF8A]" />
        <span className="size-2.5 rounded-full bg-[#9FD3AE]" />
        {label && <span className="ml-3 truncate text-[11px] text-muted">{label}</span>}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">{children}</div>
    </div>
  );
}

export const WhatsAppGlyph = ({ className = "size-7" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Everything a page puts in <head>: title, description, canonical and the
 * link-preview tags. React 19 hoists these into <head>; the build-time
 * prerender (scripts/prerender.mjs) bakes the same tags into each page's HTML.
 * The canonical drops any query string, so /contact?service=x counts as /contact.
 * `noindex` is for pages that must never be indexed (the 404).
 */
export function Seo({ title, description, noindex = false }: { title: string; description: string; noindex?: boolean }) {
  const { pathname } = useLocation();
  const url = `${SITE_ORIGIN}${pathname}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {!noindex && <meta property="og:url" content={url} />}
    </>
  );
}

const IMAGES: Record<string, { width: number; height: number; widths: number[] }> = imageManifest;

/**
 * A photo or screenshot from public/work. The browser picks the smallest WebP
 * copy that fits `sizes` (made by `npm run images`); the original is the fallback.
 */
export function Shot({ src, sizes, alt, ...rest }: Omit<ComponentProps<"img">, "srcSet" | "width" | "height"> & { src: string; sizes: string; alt: string }) {
  const image = IMAGES[src];
  const base = src.replace(/\.\w+$/, "");
  return (
    <img
      src={src}
      srcSet={image?.widths.map((w) => `${base}-${w}.webp ${w}w`).join(", ")}
      sizes={image ? sizes : undefined}
      width={image?.width}
      height={image?.height}
      alt={alt}
      {...rest}
    />
  );
}
