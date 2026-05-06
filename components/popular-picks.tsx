"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import type { PopularPickCard } from "@/lib/menu-data";

export function PopularPicks({ items }: { items: PopularPickCard[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item, index) => (
        <motion.article
          key={item.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: reduce ? 0.01 : 0.4, delay: reduce ? 0 : index * 0.06 }}
          className="flex flex-col rounded-[1.45rem] border border-[rgba(255,122,0,0.24)] bg-[rgba(8,6,5,0.82)] p-4 shadow-[0_26px_64px_rgba(0,0,0,0.38)] backdrop-blur-md transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[rgba(255,122,0,0.52)] md:p-[1.1rem]"
        >
          <div className="relative">
            <PickPhoto src={item.photo} />
          </div>
          <h3 className="font-display mt-4 text-[1.05rem] font-semibold text-[var(--cj-cream)]">{item.name}</h3>
          {item.popular ? (
            <p className="mt-2 inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--cj-gold)]">
              <Sparkles aria-hidden="true" className="size-3 shrink-0" />
              Popular
            </p>
          ) : null}
          <p className={`text-sm leading-relaxed text-[var(--cj-cream)]/72 ${item.popular ? "mt-2" : "mt-3"} min-h-[2.85rem]`}>
            {item.description}
          </p>
          <p className="font-display mt-3 text-xl font-semibold text-[var(--cj-orange)]">{item.price}</p>
        </motion.article>
      ))}
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
