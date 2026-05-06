"use client";

import { useId, useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useOrderCart } from "@/components/order-context";
import { audFromCents } from "@/lib/menu-data";

export function MenuCartStrip() {
  const disclosureId = useId();
  const { cart, subtotalCents, removeLine } = useOrderCart();
  const [open, setOpen] = useState(false);

  if (cart.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))] px-3">
      <div className="pointer-events-auto flex w-full max-w-lg flex-col gap-3">
        <div
          id={disclosureId}
          role="region"
          aria-label="Basket contents"
          hidden={!open}
          className={
            open
              ? "max-h-[min(52vh,24rem)] overflow-y-auto rounded-2xl border border-[rgba(255,122,0,0.28)] bg-[var(--cj-charcoal)] px-4 py-3 shadow-2xl shadow-black/50"
              : "hidden"
          }
        >
          <ul className="grid list-none gap-3 p-0">
            {cart.map((line) => (
              <li key={line.id} className="rounded-xl border border-[rgba(255,243,214,0.08)] bg-black/35 px-3 py-2.5 text-left text-xs text-[var(--cj-cream)]/85">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-sm font-semibold text-[var(--cj-cream)]">{line.label}</p>
                    <p className="mt-1 leading-relaxed text-[var(--cj-cream)]/65">{line.detail}</p>
                    <p className="mt-2 font-display text-[var(--cj-orange)]">{audFromCents(line.lineTotalCents)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="shrink-0 rounded-lg border border-[rgba(255,122,0,0.35)] p-2 text-[var(--cj-gold)] transition hover:bg-[rgba(255,122,0,0.08)]"
                    aria-label={`Remove ${line.label}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[rgba(255,122,0,0.12)] pt-3 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--cj-cream)]/45">Subtotal</p>
            <p className="font-display text-xl font-semibold text-[var(--cj-gold)]">{audFromCents(subtotalCents)}</p>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={disclosureId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 rounded-full border border-[rgba(255,122,0,0.45)] bg-gradient-to-r from-[#2a1810] to-[var(--cj-charcoal)] px-6 py-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        >
          <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--cj-cream)]">
            <ShoppingBag className="size-5 shrink-0 text-[var(--cj-orange)]" aria-hidden />
            Basket · {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
          <span className="font-display text-lg font-semibold tabular-nums text-[var(--cj-orange)]">{audFromCents(subtotalCents)}</span>
        </button>
      </div>
    </div>
  );
}
