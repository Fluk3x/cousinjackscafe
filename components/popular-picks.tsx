"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useOrderCart } from "@/components/order-context";
import { findMenuItemById, type PopularPickHighlight } from "@/lib/menu-data";

export function PopularPicks({ items }: { items: PopularPickHighlight[] }) {
  const reduce = useReducedMotion();
  const { openCustomize } = useOrderCart();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((highlight, index) => {
        const menuItem = findMenuItemById(highlight.menuItemId);
        if (!menuItem) return null;

        const blurb = highlight.description ?? menuItem.description;
        const canCustomize = !!menuItem.customization;
        const inner = (
          <>
            <div className="relative w-full overflow-hidden rounded-[1.05rem]">
              <span className="pointer-events-none absolute left-2.5 top-2.5 z-[2] inline-flex items-center gap-1 rounded-full border border-[rgba(246,182,74,0.35)] bg-[rgba(12,10,9,0.78)] px-2.5 py-1 backdrop-blur-sm">
                <Sparkles aria-hidden className="size-3 shrink-0 text-[var(--cj-gold)]" />
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--cj-gold)]">Popular</span>
              </span>
              <PickPhoto src={highlight.photo} />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-display w-full text-balance text-[1.05rem] font-semibold leading-snug text-[var(--cj-cream)]">{menuItem.name}</h3>
            </div>
            <p className={`w-full text-balance text-sm leading-relaxed text-[var(--cj-cream)]/72 mt-3 min-h-[2.85rem]`}>{blurb}</p>
            <p className="font-display mt-3 text-xl font-semibold text-[var(--cj-orange)]">{menuItem.price}</p>
            {canCustomize ? (
              <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--cj-cream)]/45">Tap to customise</p>
            ) : null}
          </>
        );

        const cls =
          "flex w-full flex-col items-center rounded-[1.45rem] border border-[rgba(255,122,0,0.24)] bg-[rgba(8,6,5,0.82)] p-4 text-center shadow-[0_26px_64px_rgba(0,0,0,0.38)] backdrop-blur-md transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[rgba(255,122,0,0.52)] md:p-[1.1rem] outline-none ring-[var(--cj-orange)] focus-visible:-translate-y-1 focus-visible:ring-2";

        return canCustomize ? (
          <motion.button
            key={highlight.menuItemId}
            type="button"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduce ? 0.01 : 0.4, delay: reduce ? 0 : index * 0.06 }}
            className={cls}
            onClick={() => openCustomize(menuItem)}
          >
            {inner}
          </motion.button>
        ) : (
          <motion.article
            key={highlight.menuItemId}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduce ? 0.01 : 0.4, delay: reduce ? 0 : index * 0.06 }}
            className={cls}
          >
            {inner}
          </motion.article>
        );
      })}
    </div>
  );
}

function PickPhoto({ src }: { src?: string }) {
  const [ok, setOk] = useState(true);

  if (!src || !ok) {
    return <div aria-hidden className="pick-photo-shell" />;
  }

  return (
    <div className="pick-photo-shell relative">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative; heading below names the dish */}
      <img src={src} alt="" loading="lazy" decoding="async" onError={() => setOk(false)} />
    </div>
  );
}
