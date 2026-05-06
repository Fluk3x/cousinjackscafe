import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div className="max-w-lg">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">404</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-white">This page wandered off for coffee.</h1>
        <p className="mt-4 text-zinc-400">Head back home and choose a fresh path.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-amber-300 px-6 py-4 text-sm font-black text-zinc-950">Back home</Link>
      </div>
    </main>
  );
}
