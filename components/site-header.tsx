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
      <div className="relative mx-auto flex min-h-[3.85rem] max-w-7xl items-center px-3 py-2.5 sm:min-h-[4rem] sm:px-6 sm:py-3 lg:py-[1.125rem] lg:px-8">
        {/* Left rail: grows with nav; keeps side space for centred logo */}
        <div className="relative z-[2] flex min-h-[3.75rem] min-w-0 flex-1 basis-0 items-center md:max-w-[min(100%,14.5rem)] lg:max-w-[min(100%,17rem)]">
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

        {/* Wordmark lane: compact Order (right) keeps clearance; width cap stays loose so the image height stays visually stable */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] flex max-w-[min(40rem,calc(100vw-6.5rem))] -translate-x-1/2 -translate-y-1/2 justify-center sm:max-w-[min(40rem,calc(100vw-9rem))] md:max-w-[min(38rem,calc(100vw-19.25rem))] lg:max-w-[min(40rem,calc(100vw-21rem))]">
          <HeaderCentreLogo className="pointer-events-auto" />
        </div>

        <div className="relative z-[2] flex min-w-0 flex-1 basis-0 items-center justify-end">
          <a
            href={cafe.orderUrl}
            className="primary-button-alt inline-flex h-8 max-w-full shrink-0 items-center justify-center gap-1 rounded-lg px-2 py-1.5 font-display text-[0.65rem] font-bold leading-none shadow-lg max-[420px]:size-9 max-[420px]:p-0 sm:h-auto sm:min-h-0 sm:gap-1.5 sm:rounded-[0.85rem] sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3"
            target="_blank"
            rel="noreferrer"
            aria-label="Order online"
          >
            <ShoppingBag aria-hidden="true" className="size-3.5 shrink-0 max-[420px]:size-4 sm:size-4" />
            <span className="max-[420px]:sr-only whitespace-nowrap sm:not-sr-only sm:inline">
              <span className="hidden sm:inline">Order online</span>
              <span className="inline sm:hidden">Order</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
