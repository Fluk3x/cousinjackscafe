"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useOrderCart } from "@/components/order-context";
import { MENU_CATEGORY_ANCHOR_ID, type BoardMenuCategory } from "@/lib/menu-data";

/** Mouse / pen drag-to-scroll — touch keeps native horizontal swipe (scrollbar stays hidden via CSS). */
function useHorizontalPointerDrag(scrollRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const DOWN_THRESHOLD = 4;
    let ptrId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let dragMoved = false;

    const blockStrayClick = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      window.removeEventListener("click", blockStrayClick, true);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      /* Bubbled events from category buttons would otherwise capture the pointer and block clicks. */
      if (target.closest("button, a, input, select, textarea, label, [role='button']")) return;

      ptrId = e.pointerId;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      dragMoved = false;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        ptrId = null;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (ptrId === null || e.pointerId !== ptrId) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > DOWN_THRESHOLD) dragMoved = true;
      el.scrollLeft = startScroll - dx;
    };

    const endPointer = (e: PointerEvent) => {
      if (ptrId === null || e.pointerId !== ptrId) return;
      ptrId = null;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }
      if (dragMoved) window.addEventListener("click", blockStrayClick, true);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointercancel", endPointer);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endPointer);
      el.removeEventListener("pointercancel", endPointer);
      window.removeEventListener("click", blockStrayClick, true);
    };
  }, [scrollRef]);
}

function MenuBoardInner({ categories, className = "mt-10" }: { categories: BoardMenuCategory[]; className?: string }) {
  const categoryStripRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement | null>(null);
  const searchParams = useSearchParams();
  const requestedCategoryId = searchParams.get("category");
  const [activeId, setActiveId] = useState(() => {
    if (requestedCategoryId && categories.some((c) => c.id === requestedCategoryId)) {
      return requestedCategoryId;
    }
    return categories[0]?.id ?? "";
  });
  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  const { openCustomize } = useOrderCart();

  /** Deep-link `?category=…` (home or /menu): open that tab when arriving or query changes */
  useLayoutEffect(() => {
    if (!requestedCategoryId) return;
    if (categories.some((c) => c.id === requestedCategoryId)) setActiveId(requestedCategoryId);
  }, [requestedCategoryId, categories]);

  /** Hero / easter-egg chips (`?category=`): scroll to category strip (below “Full menu” title). Main nav still uses `#full-menu`. */
  useLayoutEffect(() => {
    if (!requestedCategoryId) return;
    const anchor = document.getElementById(MENU_CATEGORY_ANCHOR_ID);
    if (!anchor) return;
    anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [requestedCategoryId]);

  /** Centre the active pill inside the strip only — avoids `scrollIntoView` moving the whole page vertically. */
  useLayoutEffect(() => {
    const strip = categoryStripRef.current;
    const pill = activePillRef.current;
    if (!strip || !pill) return;
    const pillRect = pill.getBoundingClientRect();
    const stripRect = strip.getBoundingClientRect();
    const delta = pillRect.left + pillRect.width / 2 - (stripRect.left + stripRect.width / 2);
    if (Math.abs(delta) < 0.5) return;
    strip.scrollBy({ left: delta, behavior: "auto" });
  }, [activeId]);

  useHorizontalPointerDrag(categoryStripRef);

  return (
    <div id={MENU_CATEGORY_ANCHOR_ID} className={`scroll-mt-[6.25rem] sm:scroll-mt-[6.75rem] ${className ?? ""}`}>
      <div
        ref={categoryStripRef}
        className="cj-menu-category-scroll -mx-1 w-full cursor-grab snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-px-6 px-2 pb-3 active:cursor-grabbing touch-pan-x select-none sm:scroll-px-4 sm:px-1"
        aria-label="Menu categories"
      >
        {/*
          Avoid flex + justify-center on the scroll host: it pins overflow content to the left on many
          engines. Inner w-max + lg:mx-auto centres the pill row when it fits; when wider than the
          viewport, margins collapse and the strip scrolls from the start on small screens.
        */}
        <div
          role="presentation"
          className="mx-0 flex w-max max-w-none flex-nowrap gap-2.5 px-3 sm:gap-3 sm:px-4 lg:mx-auto"
        >
          {categories.map((cat) => {
            const isOn = cat.id === active.id;
            return (
              <button
                key={cat.id}
                ref={isOn ? activePillRef : undefined}
                type="button"
                onClick={() => setActiveId(cat.id)}
                className="relative min-h-[2.75rem] shrink-0 snap-center rounded-full border px-4 py-2 text-[0.8125rem] font-bold transition-colors max-[420px]:px-3.5 max-[420px]:py-2 sm:min-h-0 sm:px-5 sm:py-2.5 sm:text-sm"
                style={{
                  borderColor: isOn ? "transparent" : "rgba(255,122,0,0.35)",
                  color: isOn ? "var(--cj-charcoal)" : "var(--cj-cream)",
                }}
              >
                {isOn ? (
                  <motion.span
                    layoutId="menu-category-pill"
                    className="pointer-events-none absolute inset-0 rounded-full bg-[var(--cj-orange)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul
        key={active?.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-6 grid list-none gap-3 p-0"
      >
        {active?.items.map((item) => {
          const actionable = !!item.customization;
          if (actionable) {
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openCustomize(item)}
                  className="menu-row-premium flex w-full cursor-pointer flex-col gap-2.5 rounded-[1.2rem] border border-[rgba(255,122,0,0.16)] bg-[rgba(0,0,0,0.35)] px-5 py-4 text-left backdrop-blur-sm transition-[transform,border-color] hover:-translate-y-0.5 hover:border-[rgba(255,122,0,0.45)] sm:gap-3"
                  aria-haspopup="dialog"
                >
                  <div className="flex w-full flex-row items-start justify-between gap-3">
                    <h3 className="min-w-0 flex-1 text-balance font-display text-[clamp(1rem,3.8vw,1.2rem)] font-semibold leading-snug text-[var(--cj-cream)] sm:text-[1.125rem]">
                      {item.name}
                    </h3>
                    <p className="shrink-0 whitespace-nowrap font-display text-[clamp(1rem,3.6vw,1.25rem)] font-bold leading-none text-[var(--cj-orange)]">
                      {item.price}
                    </p>
                  </div>
                  {item.description ? (
                    <p className="w-full text-sm leading-relaxed text-[var(--cj-cream)]/70">{item.description}</p>
                  ) : null}
                  {item.upgradeNote ? (
                    <p className="w-full text-xs font-medium leading-relaxed text-[var(--cj-gold)]/90">{item.upgradeNote}</p>
                  ) : null}
                  <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--cj-cream)]/45 sm:text-left">
                    Tap to customise
                  </p>
                </button>
              </li>
            );
          }
          return (
            <li
              key={item.id}
              className="menu-row-premium flex flex-col gap-2.5 rounded-[1.2rem] border border-[rgba(255,122,0,0.16)] bg-[rgba(0,0,0,0.35)] px-5 py-4 backdrop-blur-sm sm:gap-3"
            >
              <div className="flex w-full flex-row items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 text-balance font-display text-[clamp(1rem,3.8vw,1.2rem)] font-semibold leading-snug text-[var(--cj-cream)] sm:text-[1.125rem]">
                  {item.name}
                </h3>
                <p className="shrink-0 whitespace-nowrap font-display text-[clamp(1rem,3.6vw,1.25rem)] font-bold leading-none text-[var(--cj-orange)]">{item.price}</p>
              </div>
              {item.description ? <p className="w-full text-sm leading-relaxed text-[var(--cj-cream)]/70">{item.description}</p> : null}
            </li>
          );
        })}
      </motion.ul>

      {active?.footnote ? (
        <p className="mt-5 border-t border-[rgba(255,122,0,0.08)] pt-5 text-sm leading-relaxed text-[var(--cj-cream)]/60">{active.footnote}</p>
      ) : null}
    </div>
  );
}

function MenuBoardFallback({ className = "mt-10" }: { className?: string }) {
  return <div className={`${className} min-h-[240px] rounded-[1.2rem] bg-[rgba(0,0,0,0.12)] animate-pulse`} aria-busy />;
}

export function MenuBoard({ categories, className }: { categories: BoardMenuCategory[]; className?: string }) {
  return (
    <Suspense fallback={<MenuBoardFallback className={className} />}>
      <MenuBoardInner categories={categories} className={className} />
    </Suspense>
  );
}
