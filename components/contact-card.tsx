"use client";

import { useMemo, useState } from "react";
import { Mail, MessageSquareText, Send } from "lucide-react";
import { cafe } from "@/lib/content";

export function ContactCard() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Website enquiry from ${name || "a customer"}`);
    const body = encodeURIComponent(message || `Hi ${cafe.name}, I'd like to ask about catering or an order.`);
    return `mailto:${cafe.email}?subject=${subject}&body=${body}`;
  }, [name, message]);

  return (
    <div className="rounded-[2rem] border border-[rgba(255,122,0,0.12)] bg-[rgba(248,245,239,0.04)] p-5 shadow-2xl shadow-black/30 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-[var(--cj-orange)] text-[var(--cj-charcoal)]">
          <MessageSquareText aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-[var(--cj-cream)]">Send us a note</h2>
          <p className="text-sm text-[var(--cj-cream)]/65">Opens your email app with your message filled in.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-[var(--cj-cream)]/90">
          Your name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-2xl border border-[rgba(255,122,0,0.2)] bg-[var(--cj-charcoal)] px-4 py-3 text-[var(--cj-soft)] outline-none ring-[var(--cj-orange)]/25 transition focus:border-[var(--cj-orange)]/50 focus:ring-4"
            placeholder="Name"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--cj-cream)]/90">
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            placeholder={`Hi ${cafe.name}, I wanted to ask about…`}
            className="resize-none rounded-2xl border border-[rgba(255,122,0,0.2)] bg-[var(--cj-charcoal)] px-4 py-3 text-[var(--cj-soft)] outline-none ring-[var(--cj-orange)]/25 transition focus:border-[var(--cj-orange)]/50 focus:ring-4"
          />
        </label>
        <a
          href={mailto}
          className="inline-flex items-center justify-center rounded-full bg-[var(--cj-orange)] px-6 py-4 text-sm font-bold text-[var(--cj-charcoal)] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <Send aria-hidden="true" className="mr-2 size-4" />
          Open email
        </a>
      </div>
      <div className="mt-6 rounded-3xl border border-[rgba(255,122,0,0.1)] bg-[var(--cj-charcoal)]/90 p-4 text-sm leading-6 text-[var(--cj-cream)]/60">
        <p className="font-bold text-[var(--cj-cream)]">Prefer to reach out directly?</p>
        <p className="mt-2 flex items-center gap-2">
          <Mail aria-hidden="true" className="size-4 text-[var(--cj-gold)]" /> {cafe.email}
        </p>
      </div>
    </div>
  );
}
