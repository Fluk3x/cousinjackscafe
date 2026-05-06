import { Coffee } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="Cousin Jack's Cafe brand">
      <div className="grid size-11 place-items-center rounded-2xl border border-amber-300/30 bg-zinc-950 text-amber-300 shadow-[0_0_45px_rgba(245,158,11,0.28)]">
        <Coffee aria-hidden="true" className="size-5" />
      </div>
      {!compact ? (
        <div className="leading-tight">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-200">Cousin Jack's</p>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Cafe Guildford</p>
        </div>
      ) : null}
    </div>
  );
}
