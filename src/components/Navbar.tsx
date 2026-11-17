import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SplitButton } from "./ui";

export const NAV_LINKS = [
  { name: "Services", to: "/services" },
  { name: "IT Supply", to: "/it-supply" },
  { name: "Work", to: "/work" },
  { name: "Products", to: "/products" },
  { name: "About", to: "/about" },
  { name: "Careers", to: "/careers" },
  { name: "Contact", to: "/contact" },
] as const;

export function Logo({ className = "h-14" }: { className?: string }) {
  return (
    <img
      src="/veridian-signature.png"
      alt="Veridian Tech Innovations Ltd"
      width={198}
      height={226}
      className={`w-auto ${className}`}
    />
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-pearl/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-10">
        <Link to="/" onClick={close} aria-label="Veridian Tech Innovations Ltd, home">
          <Logo className="h-12 lg:h-14" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 text-[15px] font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className="navl text-ink">
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <SplitButton to="/contact" variant="ink" size="sm">
            Start a project
          </SplitButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-11 items-center justify-center rounded-md border border-line bg-white text-ink lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`grid overflow-hidden border-line transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <nav aria-label="Mobile" className="min-h-0">
          <div className="flex flex-col gap-1 px-5 py-5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={close}
                tabIndex={open ? 0 : -1}
                className={({ isActive }) =>
                  `rounded-md px-3 py-3 text-lg ${isActive ? "bg-white font-semibold text-emerald-deep" : "text-ink"}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="mt-3" onClick={close}>
              <SplitButton to="/contact" block>
                Start a project
              </SplitButton>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
