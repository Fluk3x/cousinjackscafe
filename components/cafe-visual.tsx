export function CafeVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.22),transparent_26%),linear-gradient(145deg,#171717,#09090b)] p-5 shadow-2xl">
      <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">Fresh cabinet</p>
            <p className="mt-2 text-3xl font-black text-white">Coffee + pastry</p>
          </div>
          <div className="rounded-full border border-amber-300/30 px-3 py-1 text-xs font-black text-amber-200">Guildford</div>
        </div>

        <div className="grid gap-4">
          <div className="relative h-36 overflow-hidden rounded-[2rem] bg-gradient-to-br from-yellow-950 via-amber-700 to-orange-950 shadow-inner">
            <div className="absolute left-8 top-8 h-20 w-40 rotate-[-8deg] rounded-[50%_50%_45%_45%] border border-amber-100/30 bg-amber-300 shadow-[inset_0_-18px_30px_rgba(120,53,15,0.38)]" />
            <div className="absolute left-14 top-9 h-16 w-32 rotate-[-8deg] rounded-[50%] border-t-2 border-dashed border-yellow-950/30" />
            <div className="absolute bottom-5 right-6 rounded-full bg-zinc-950/70 px-4 py-2 text-sm font-black text-amber-100 backdrop-blur">Signature pasty</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="mx-auto h-20 w-20 rounded-b-[2rem] rounded-t-sm bg-gradient-to-b from-zinc-100 to-zinc-300 shadow-lg">
                <div className="h-4 rounded-t-sm bg-amber-800" />
                <div className="mx-auto mt-3 h-8 w-12 rounded-full bg-white/80" />
              </div>
              <p className="mt-4 text-center text-sm font-black text-white">Flat white</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="mx-auto h-20 w-12 rounded-b-2xl rounded-t-md border border-amber-200/40 bg-gradient-to-b from-yellow-200/80 via-orange-200 to-amber-700 shadow-lg" />
              <p className="mt-4 text-center text-sm font-black text-white">Iced latte</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            ["7am", "early starts"],
            ["2161", "local"],
            ["fast", "takeaway"],
          ].map(([stat, label]) => (
            <div key={stat} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-lg font-black text-amber-200">{stat}</p>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
