import type { Metadata } from "next";
import { MenuBoard } from "@/components/menu-board";
import { SectionHeading } from "@/components/section-heading";
import { cafe } from "@/lib/content";
import { menuCategories } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Menu",
  description: `${cafe.name}: breakfast rolls, toasties, sandwiches, burgers, speciality coffee and cold drinks in Guildford, NSW.`,
};

export default function MenuPage() {
  return (
    <main id="main" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="section-panel">
          <SectionHeading
            kicker="Menu"
            title="Breakfast, toasties, sandwiches, burgers, coffee and drinks in Guildford."
            copy="Same board as home: browse by category and order online when you are in a hurry."
          />
          <MenuBoard categories={menuCategories} />
        </div>
      </div>
    </main>
  );
}
