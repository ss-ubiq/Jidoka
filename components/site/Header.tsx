"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { ProductsMegaMenu, LinkGridMenu } from "./ProductsMegaMenu";
import { LinkButton } from "@/components/ui/Button";
import { mainNav, solutionsMenu, engineeringMenu, primaryActions } from "@/lib/site";
import { cn } from "@/lib/utils";

const menusWithPanels = new Set(["Products", "Solutions", "Engineering"]);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reading-progress hairline under the header — updates a CSS var directly
  // (no re-renders) via rAF.
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        progressRef.current?.style.setProperty("--scroll-progress", p.toFixed(4));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setOpenMenu(null), setMobileOpen(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || openMenu
          ? "border-border bg-bg/85 backdrop-blur-xl"
          : "border-transparent bg-bg"
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex" aria-label="Primary">
            {mainNav.map((item) => {
              const hasPanel = menusWithPanels.has(item.label);
              const active = pathname.startsWith(item.href) && item.href !== "/";
              return (
                <div key={item.label} onMouseEnter={() => setOpenMenu(hasPanel ? item.label : null)}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                      active || openMenu === item.label ? "text-fg" : "text-fg-subtle hover:text-fg"
                    )}
                    aria-expanded={hasPanel ? openMenu === item.label : undefined}
                  >
                    {item.label}
                    {hasPanel && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-muted transition-transform",
                          openMenu === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/search"
              aria-label="Search products, part numbers, applications"
              className="grid h-10 w-10 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" />
            </Link>
            <LinkButton href={primaryActions.quote.href} size="sm" className="hidden sm:inline-flex">
              {primaryActions.quote.label}
            </LinkButton>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-md text-fg lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Reading-progress hairline */}
      <div
        ref={progressRef}
        aria-hidden
        className="scroll-progress absolute inset-x-0 bottom-[-1px] h-[2px] bg-accent"
      />

      {/* Desktop mega-menu panel */}
      {openMenu && menusWithPanels.has(openMenu) && (
        <div
          className="absolute inset-x-0 top-full hidden animate-fade-in-fast border-b border-border bg-bg/95 shadow-card-lg backdrop-blur-xl lg:block"
          onMouseEnter={() => setOpenMenu(openMenu)}
        >
          <div className="container-page py-7">
            {openMenu === "Products" && <ProductsMegaMenu onNavigate={() => setOpenMenu(null)} />}
            {openMenu === "Solutions" && <LinkGridMenu items={solutionsMenu} onNavigate={() => setOpenMenu(null)} />}
            {openMenu === "Engineering" && <LinkGridMenu items={engineeringMenu} onNavigate={() => setOpenMenu(null)} />}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="lg:hidden">
      <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg animate-fade-in-fast">
        <div className="container-page space-y-1 py-4">
          {mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="block rounded-md px-3 py-3 text-base font-medium text-fg hover:bg-surface-2"
            >
              {item.label}
            </Link>
          ))}
          <div className="hairline my-3" />
          <div className="grid grid-cols-1 gap-2 pb-2">
            <LinkButton href={primaryActions.quote.href} onClick={onClose} className="w-full">
              {primaryActions.quote.label}
            </LinkButton>
            <LinkButton href={primaryActions.requirement.href} onClick={onClose} variant="secondary" className="w-full">
              {primaryActions.requirement.label}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
