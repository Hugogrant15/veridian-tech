import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Laptop, Menu, X, type LucideIcon } from "lucide-react";
import { Building2, Briefcase, Package } from "lucide-react";
import { SERVICES } from "../config/services";
import { SUPPLY_SERVICES } from "../config/supply";

interface NavItem {
  name: string;
  to: string;
  Icon?: LucideIcon;
  note?: string;
}

interface NavGroup {
  name: string;
  /** The overview page, linked at the foot of the dropdown. */
  to: string;
  allLabel: string;
  items: NavItem[];
}

const short = (text: string) => text.split(/(?<=[.:])\s/)[0] ?? text;

/** The header: three dropdowns and three plain links. */
const NAV: (NavGroup | NavItem)[] = [
  {
    name: "Services",
    to: "/services",
    allLabel: "All services",
    items: SERVICES.map((s) => ({ name: s.short, to: `/services/${s.id}`, Icon: s.Icon, note: short(s.description) })),
  },
  {
    name: "IT Supply",
    to: "/it-supply",
    allLabel: "All IT supply",
    items: [
      ...SUPPLY_SERVICES.map((s) => ({ name: s.short, to: `/it-supply/${s.id}`, Icon: s.Icon, note: short(s.description) })),
      { name: "Build your order", to: "/it-supply/build-your-order", Icon: Laptop, note: "A laptop specification for each group of staff." },
    ],
  },
  { name: "Work", to: "/work" },
  {
    name: "Company",
    to: "/about",
    allLabel: "About Veridian",
    items: [
      { name: "About", to: "/about", Icon: Building2, note: "Who we are, the team and the company record." },
      { name: "Products", to: "/products", Icon: Package, note: "EasyPass and RhemaVerse, the software we run." },
      { name: "Careers", to: "/careers", Icon: Briefcase, note: "Work with us." },
    ],
  },
  { name: "Blog", to: "/blog" },
  { name: "Contact", to: "/contact" },
];

const isGroup = (entry: NavGroup | NavItem): entry is NavGroup => "items" in entry;

/** Flat list of the main pages, for the footer. */
export const NAV_LINKS = [
  { name: "IT Supply", to: "/it-supply" },
  { name: "Work", to: "/work" },
  { name: "Products", to: "/products" },
  { name: "About", to: "/about" },
  { name: "Blog", to: "/blog" },
  { name: "Careers", to: "/careers" },
  { name: "Contact", to: "/contact" },
] as const;

/** The full logo (V mark over the wordmark), used as supplied. */
export function Logo({ className = "h-14" }: { className?: string }) {
  return <img src="/veridian-signature.png" alt="Veridian Tech Innovations Ltd" width={198} height={226} className={`w-auto ${className}`} />;
}

/** Header brand: the V mark cropped from the logo, beside the company name. */
function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/veridian-mark.png" alt="" width={175} height={149} className="h-8 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Veridian Tech</span>
        <span className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-muted uppercase">Innovations Ltd</span>
      </span>
    </span>
  );
}

/** The highlighted call to action: a bright pill with the arrow in a dark circle. */
function CtaPill({ onClick, className = "" }: { onClick?: () => void; className?: string }) {
  return (
    <Link
      to="/contact"
      onClick={onClick}
      className={`group inline-flex items-center gap-3 rounded-full bg-emerald-bright py-1.5 pr-1.5 pl-5 text-[15px] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-[#5BE09D] ${className}`}
    >
      Start a project
      <span className="flex size-9 items-center justify-center rounded-full bg-ink text-pearl transition-transform group-hover:rotate-45" aria-hidden="true">
        <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}

function DropdownPanel({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
  const wide = group.items.length > 3;
  return (
    <div className={`rounded-3xl border border-line bg-white p-3 shadow-[0_24px_60px_-20px_rgb(6_43_28/0.35)] ${wide ? "w-[640px]" : "w-[360px]"}`}>
      <ul className={`grid gap-1 ${wide ? "grid-cols-2" : ""}`}>
        {group.items.map(({ name, to, Icon, note }) => (
          <li key={to}>
            <Link to={to} onClick={onNavigate} className="flex gap-3 rounded-2xl p-3 transition-colors hover:bg-pearl focus-visible:bg-pearl">
              {Icon && (
                <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald-deep">
                  <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                </span>
              )}
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-ink">{name}</span>
                {note && <span className="text-[13px] leading-snug text-muted">{note}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={group.to}
        onClick={onNavigate}
        className="mt-2 flex items-center justify-between rounded-2xl bg-pearl px-4 py-3 text-sm font-semibold text-emerald-deep transition-colors hover:bg-emerald/10"
      >
        {group.allLabel}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

/** One dropdown: opens on hover (with a short grace period) and on click or keyboard; Esc closes it. */
function Dropdown({ group, open, onOpen, onClose, active }: { group: NavGroup; open: boolean; onOpen: () => void; onClose: () => void; active: boolean }) {
  const timer = useRef<number>(undefined);
  const enter = () => {
    window.clearTimeout(timer.current);
    onOpen();
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(onClose, 160);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const id = `menu-${group.name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <li className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? onClose() : onOpen())}
        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:bg-pearl ${active ? "text-emerald-deep" : "text-ink"}`}
      >
        {group.name}
        <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={id} className={`absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4 ${open ? "block" : "hidden"}`}>
        <DropdownPanel group={group} onNavigate={onClose} />
      </div>
    </li>
  );
}

function MobileSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <p className="mb-2 px-3 text-xs font-semibold tracking-[0.16em] text-muted uppercase">{title}</p>
      {children}
    </div>
  );
}

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  // Solid bar with a stronger shadow once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc closes any open menu; a click outside the header closes it too.
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu, mobileOpen]);

  const groupActive = (group: NavGroup) => group.items.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`)) || pathname === group.to;

  return (
    <header ref={headerRef} className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full pr-2 pl-5 transition-[background-color,box-shadow] duration-300 ${
          scrolled || mobileOpen ? "bg-white shadow-[0_12px_40px_-12px_rgb(6_43_28/0.35)]" : "bg-white/90 shadow-[0_8px_30px_-14px_rgb(6_43_28/0.3)] backdrop-blur-md"
        } ring-1 ring-black/5`}
      >
        <Link to="/" onClick={closeAll} aria-label="Veridian Tech Innovations Ltd, home" className="flex-shrink-0">
          <Brand />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((entry) =>
              isGroup(entry) ? (
                <Dropdown
                  key={entry.name}
                  group={entry}
                  open={openMenu === entry.name}
                  onOpen={() => setOpenMenu(entry.name)}
                  onClose={() => setOpenMenu((m) => (m === entry.name ? null : m))}
                  active={groupActive(entry)}
                />
              ) : (
                <li key={entry.to}>
                  <NavLink
                    to={entry.to}
                    className={({ isActive }) =>
                      `block rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:bg-pearl ${isActive ? "text-emerald-deep" : "text-ink"}`
                    }
                  >
                    {entry.name}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <CtaPill />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex size-12 items-center justify-center rounded-full bg-ink text-pearl lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Phones and tablets: the menu opens as a card under the bar. */}
      <div
        id="mobile-menu"
        className={`pointer-events-auto mx-auto mt-2 max-w-7xl overflow-y-auto rounded-3xl bg-white p-4 shadow-[0_24px_60px_-20px_rgb(6_43_28/0.4)] ring-1 ring-black/5 lg:hidden ${
          mobileOpen ? "block max-h-[calc(100dvh-6rem)]" : "hidden"
        }`}
      >
        <nav aria-label="Mobile">
          {NAV.map((entry) =>
            isGroup(entry) ? (
              <MobileSection key={entry.name} title={entry.name}>
                <ul className="flex flex-col">
                  {entry.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={closeAll}
                        className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[16px] ${isActive ? "bg-pearl font-semibold text-emerald-deep" : "text-ink"}`}
                      >
                        {item.Icon && <item.Icon size={18} strokeWidth={1.7} className="text-emerald-deep" aria-hidden="true" />}
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </MobileSection>
            ) : null,
          )}
          <MobileSection title="More">
            <ul className="flex flex-col">
              {NAV.filter((e): e is NavItem => !isGroup(e)).map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeAll}
                    className={({ isActive }) => `block rounded-2xl px-3 py-2.5 text-[16px] ${isActive ? "bg-pearl font-semibold text-emerald-deep" : "text-ink"}`}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </MobileSection>
          <div className="pt-2">
            <CtaPill onClick={closeAll} className="w-full justify-between" />
          </div>
        </nav>
      </div>
    </header>
  );
}
