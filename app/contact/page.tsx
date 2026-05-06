import type { Metadata } from "next";
import { ContactCard } from "@/components/contact-card";
import { SectionHeading } from "@/components/section-heading";
import { cafe } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Cousin Jack's Cafe in Guildford, NSW for cafe enquiries, catering questions and menu updates.",
};

export default function ContactPage() {
  return (
    <main id="main" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-start">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 sm:p-10">
          <SectionHeading
            kicker="Contact"
            title={`Reach ${cafe.name}`}
            copy="Directions, takeaway and weekday hours. We are glad to help with catering questions too."
          />
          <div className="mt-8 grid gap-4 text-sm leading-6 text-zinc-300">
            <p><strong className="text-white">Address:</strong> {cafe.address}</p>
            <p><strong className="text-white">Phone:</strong> {cafe.phone}</p>
            <p><strong className="text-white">Email:</strong> {cafe.email}</p>
            <a className="font-black text-amber-200 hover:text-amber-100" href={cafe.googleMapsUrl} target="_blank" rel="noreferrer">Open directions</a>
          </div>
        </div>
        <ContactCard />
      </div>
    </main>
  );
}
