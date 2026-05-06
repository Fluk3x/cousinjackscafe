"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MapPin, Coffee, Croissant, Sandwich, Beef, CupSoda } from "lucide-react";
import { cafe } from "@/lib/content";

const chips = [
  { label: "Fresh coffee", icon: Coffee },
  { label: "Breakfast rolls", icon: Croissant },
  { label: "Toasted sandwiches", icon: Sandwich },
  { label: "Burgers", icon: Beef },
  { label: "Cold drinks", icon: CupSoda },
] as const;

export function AnimatedHero() {
  const reduce = useReducedMotion();

  return (
    <section id="home" className="relative isolate overflow-hidden border-b border-[rgba(255,122,0,0.1)]">
      <div className="hero-glow-layer absolute inset-0 -z-[2]" />
      <div className="cj-board-vignette absolute inset-0 -z-[1] opacity-[0.45]" aria-hidden />
      <div aria-hidden className="cj-texture-overlay pointer-events-none absolute inset-0 -z-[1] opacity-[0.42]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-16 lg:px-8 lg:py-16">
        <div className="flex flex-col text-center lg:items-start lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.05 : 0.45 }}
            className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.38em] text-[rgba(246,182,74,0.95)] md:text-[0.72rem]"
          >
            Guildford local café
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.05 : 0.52, delay: reduce ? 0 : 0.04 }}
            className="font-display text-balance text-[2.65rem] font-semibold leading-[1.06] tracking-tight text-[var(--cj-cream)] sm:text-6xl xl:text-[4.05rem]"
          >
            Cousin Jacks Café
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.05 : 0.52, delay: reduce ? 0 : 0.1 }}
            className="mx-auto mt-6 max-w-xl font-display text-lg leading-snug text-[#e8cf9e] lg:mx-0 lg:max-w-2xl lg:text-2xl"
          >
            Fresh coffee, breakfast rolls, toasted sandwiches, burgers and café favourites in Guildford.
          </motion.p>

          <motion.span
            initial={{ opacity: 0, scaleX: 0.25 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: reduce ? 0.05 : 0.52, delay: reduce ? 0 : 0.14 }}
            className="mx-auto mt-8 h-[3px] w-28 origin-center rounded-full bg-gradient-to-r from-transparent via-[var(--cj-orange)] to-transparent lg:mx-0"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.05 : 0.45, delay: reduce ? 0 : 0.18 }}
            className="mx-auto mt-8 flex w-full flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:mx-0 lg:items-start lg:justify-start"
          >
            <a href="#full-menu" className="primary-button shrink-0">
              View Menu <ArrowRight aria-hidden size={18} />
            </a>
            <a href={cafe.googleMapsUrl} target="_blank" rel="noreferrer" className="secondary-button shrink-0">
              <MapPin aria-hidden size={18} /> Get Directions
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.05 : 0.52, delay: reduce ? 0 : 0.26 }}
            className="mx-auto mt-11 flex flex-wrap justify-center gap-2.5 lg:mx-0 lg:justify-start"
          >
            {chips.map(({ label, icon: Icon }) => (
              <span key={label} className="feature-chip-premium">
                <Icon size={17} aria-hidden /> {label}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: reduce ? 0 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0.06 : 0.72, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.06 }}
          className="relative mx-auto hidden min-h-[22rem] w-full max-w-xl md:block lg:max-w-none lg:justify-self-end"
        >
          <div
            aria-hidden
            className="relative mx-auto aspect-[520/414] overflow-hidden rounded-[2rem] border border-[rgba(255,122,0,0.16)] bg-black shadow-[0_28px_64px_rgba(0,0,0,0.45)]"
          >
            <HeroCoffeeArt />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- faint watermark on main page only */}
          <img
            aria-hidden
            src="/cousin_jacks_logo.png"
            alt=""
            width={200}
            height={240}
            className="pointer-events-none absolute -bottom-10 right-[4%] w-[clamp(112px,19vw,164px)] select-none opacity-[0.12]"
          />
        </motion.div>
      </div>
    </section>
  );
}

function HeroCoffeeArt() {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    /* eslint-disable-next-line @next/next/no-img-element -- optional hero asset */
    return <img src="/hero-coffee.png" alt="" className="h-full min-h-[20rem] w-full object-cover object-[52%_45%]" onError={() => setFailed(true)} />;
  }

  return (
    <div
      aria-hidden
      className="flex h-full min-h-[20rem] w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_40%_40%,rgba(255,122,0,0.15),transparent_45%),rgba(23,18,15,1)] px-10 text-center"
    >
      <Coffee size={54} strokeWidth={1} className="text-[rgba(246,182,74,0.35)]" />
      <span className="sr-only">Hero image placeholder.</span>
    </div>
  );
}
