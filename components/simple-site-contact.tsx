import { Mail, Phone } from "lucide-react";
import { cafe, siteContact } from "@/lib/content";

export function SimpleSiteContact() {
  const telHref = `tel:${cafe.phone.replace(/\s+/g, "")}`;

  return (
    <section id="contact" className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[rgba(255,122,0,0.12)] bg-[rgba(248,245,239,0.04)] p-8 text-center shadow-xl shadow-black/25 sm:p-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--cj-cream)] sm:text-3xl">Questions or catering enquiries?</h2>
        <p className="mx-auto mt-4 max-w-md text-[var(--cj-cream)]/75">
          {siteContact.publishEmailLink ? <>Call us or email the café.</> : <>Call us at the café.</>}
        </p>
        <div className="mx-auto mt-8 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
          <a
            href={telHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--cj-orange)] px-7 py-3.5 text-sm font-bold text-[var(--cj-charcoal)] transition hover:brightness-110"
          >
            <Phone aria-hidden className="size-4 shrink-0" />
            Call café
          </a>
          {siteContact.publishEmailLink ? (
            <a
              href={`mailto:${cafe.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,243,214,0.25)] px-7 py-3.5 text-sm font-bold text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/50"
            >
              <Mail aria-hidden className="size-4 shrink-0 text-[var(--cj-gold)]" />
              Email café
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
