"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { BoardMenuCategory } from "@/lib/menu-data";

export function MenuBoard({ categories, className = "mt-10" }: { categories: BoardMenuCategory[]; className?: string }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <div className={className}>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]" aria-label="Menu categories">
        {categories.map((cat) => {
          const isOn = cat.id === active.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className="relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors"
              style={{
                borderColor: isOn ? "transparent" : "rgba(255,122,0,0.35)",
                color: isOn ? "var(--cj-charcoal)" : "var(--cj-cream)",
              }}
            >
              {isOn ? (
                <motion.span
                  layoutId="menu-category-pill"
                  className="absolute inset-0 rounded-full bg-[var(--cj-orange)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      <motion.ul
        key={active?.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-6 grid gap-3"
      >
        {active?.items.map((item) => (
          <li
            key={item.name}
            className="menu-row-premium flex flex-col gap-2 rounded-[1.2rem] border border-[rgba(255,122,0,0.16)] bg-[rgba(0,0,0,0.3)] px-5 py-4 backdrop-blur-sm transition-[transform,border-color] hover:-translate-y-0.5 hover:border-[rgba(255,122,0,0.45)] sm:flex-row sm:items-start sm:justify-between sm:gap-6"
          >
            <div>
              <h3 className="text-[var(--cj-cream)]">{item.name}</h3>
              {item.description ? <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--cj-cream)]/70">{item.description}</p> : null}
            </div>
            <p className="shrink-0 text-right text-lg font-bold text-[var(--cj-orange)] sm:pt-0.5">{item.price}</p>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
