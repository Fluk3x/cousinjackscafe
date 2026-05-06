import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { HeaderCentreLogo } from "@/components/header-centre-logo";
import { cafe } from "@/lib/content";

const navItems = [
  { href: "/#full-menu", label: "Menu" },
  { href: "/#visit", label: "Visit" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="cj-header sticky top-0 z-[80] border-b border-[rgba(255,122,0,0.18)] bg-black">
      <div className="relative mx-auto flex min-h-[3.25rem] max-w-7xl items-center px-4 py-3 sm:min-h-[3.5rem] sm:px-6 lg:py-[1.125rem] lg:px-8">
        {/* Left rail — grows with nav; keeps side space for centred logo */}
        <div className="relative z-[2] flex min-h-[3rem] min-w-0 flex-1 basis-0 items-center md:max-w-[min(100%,14.5rem)] lg:max-w-[min(100%,17rem)]">
          <nav className="hidden min-w-0 items-center gap-5 md:flex lg:gap-9" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-muted font-display text-[0.95rem] font-semibold whitespace-nowrap transition hover:text-[var(--cj-orange)] lg:text-[1rem]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Wordmark centred in viewport; capped so nav + Order never clip it */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] flex max-w-[min(32rem,calc(100vw-10.75rem))] -translate-x-1/2 -translate-y-1/2 justify-center sm:max-w-[min(33rem,calc(100vw-12rem))] md:max-w-[min(35rem,calc(100vw-19.25rem))] lg:max-w-[min(36rem,calc(100vw-21rem))]">
          <HeaderCentreLogo className="pointer-events-auto" />
        </div>

        <div className="relative z-[2] flex min-w-0 flex-1 basis-0 items-center justify-end">
          <a
            href={cafe.orderUrl}
            className="primary-button-alt inline-flex max-w-full shrink-0 items-center px-4 py-2.5 font-display text-sm sm:px-5 lg:px-6 lg:py-3"
            target="_blank"
            rel="noreferrer"
          >
            <ShoppingBag aria-hidden="true" className="mr-1.5 size-4 shrink-0 sm:mr-2" />
            <span className="hidden whitespace-nowrap sm:inline">Order online</span>
            <span className="whitespace-nowrap sm:hidden">Order</span>
          </a>
        </div>
      </div>
    </header>
  );
}
