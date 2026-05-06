import { MapPin, Phone } from "lucide-react";
import { AnimatedHero } from "@/components/animated-hero";
import { SimpleSiteContact } from "@/components/simple-site-contact";
import { PopularPicks } from "@/components/popular-picks";
import { MenuBoard } from "@/components/menu-board";
import { SectionHeading } from "@/components/section-heading";
import { cafe } from "@/lib/content";
import { menuCategories, popularPicks } from "@/lib/menu-data";
import { localBusinessJsonLd } from "@/lib/seo";

export default function Home() {
  const telHref = `tel:${cafe.phone.replace(/\s+/g, "")}`;

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <AnimatedHero />

      <section id="popular" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align="center"
            kicker="Popular picks"
            title="Crowd favourites locals order again and again."
          />
          <div className="mt-14">
            <PopularPicks items={popularPicks} />
          </div>
        </div>
      </section>

      <section id="full-menu" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="section-panel">
            <SectionHeading
              align="center"
              kicker="Full menu"
              title="Breakfast, sandwiches, burgers, coffee and drinks, all in one place."
            />
            <MenuBoard categories={menuCategories} className="mt-7" />
          </div>
        </div>
      </section>

      <section id="visit" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.88fr]">
          <div
            className="rounded-[2.25rem] border border-[rgba(255,122,0,0.14)] p-6 shadow-2xl shadow-black/30 sm:p-10"
            style={{
              background: `radial-gradient(circle at 18% 12%, rgba(255,122,0,0.09), transparent 35%), linear-gradient(150deg, var(--cj-brown), var(--cj-charcoal))`,
            }}
          >
            <SectionHeading
              align="center"
              title="Find us in Guildford"
              copy="Drop in for coffee, breakfast, sandwiches and burgers. Good food, strong coffee and friendly local service."
            />
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <a
                href={cafe.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--cj-orange)] px-6 py-4 text-sm font-bold text-[var(--cj-charcoal)] transition hover:brightness-110 sm:flex-none sm:min-w-[200px]"
              >
                <MapPin aria-hidden="true" className="mr-2 size-4" />
                Open in Google Maps
              </a>
              <a
                href={telHref}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[rgba(255,122,0,0.35)] px-6 py-4 text-sm font-bold text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/70 hover:text-[var(--cj-gold)] sm:flex-none sm:min-w-[200px]"
              >
                <Phone aria-hidden="true" className="mr-2 size-4" />
                Call café
              </a>
            </div>
          </div>
          <aside className="rounded-[2.25rem] border border-[rgba(255,122,0,0.12)] bg-[rgba(248,245,239,0.04)] p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--cj-cream)]">Trading hours</h2>
            <div className="mt-6 grid gap-2.5">
              {cafe.hours.map((row) => (
                <div
                  key={row.day}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[rgba(255,243,214,0.06)] bg-[var(--cj-charcoal)]/80 px-4 py-3"
                >
                  <span className="font-semibold text-[var(--cj-cream)]/90">{row.day}</span>
                  <span className="text-sm font-bold text-[var(--cj-gold)]">{row.time}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-7xl rounded-[2.5rem] border border-[rgba(255,122,0,0.2)] px-6 py-16 text-center sm:px-12 sm:py-20"
          style={{
            background: `radial-gradient(ellipse 70% 80% at 50% 120%, rgba(255,122,0,0.18), transparent 55%), var(--cj-brown)`,
          }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--cj-gold)]">Hungry now?</p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-[var(--cj-cream)] sm:text-5xl">
            Order ahead or drop in for coffee, breakfast and lunch in Guildford.
          </h2>
          <div className="mx-auto mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={cafe.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center rounded-full bg-[var(--cj-orange)] px-8 py-4 text-sm font-bold text-[var(--cj-charcoal)] shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition hover:brightness-110"
            >
              Order online
            </a>
            <a
              href="/#full-menu"
              className="inline-flex justify-center rounded-full border border-[rgba(255,243,214,0.25)] px-8 py-4 text-sm font-bold text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/50"
            >
              View menu
            </a>
          </div>
        </div>
      </section>

      <SimpleSiteContact />
    </main>
  );
}
