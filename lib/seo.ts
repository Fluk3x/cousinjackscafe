import { cafe } from "@/lib/content";
import { getMenuItemsForSchema } from "@/lib/menu-data";

const menuFlat = getMenuItemsForSchema();

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: cafe.name,
  description: cafe.shortTagline,
  address: {
    "@type": "PostalAddress",
    addressLocality: cafe.suburb,
    addressRegion: cafe.region,
    postalCode: "2161",
    addressCountry: cafe.country,
  },
  areaServed: ["Guildford", "Merrylands", "Yennora", "Granville", "Western Sydney"],
  telephone: cafe.phone,
  email: cafe.email,
  url: cafe.siteUrl,
  sameAs: [cafe.instagramUrl],
  servesCuisine: ["Cafe", "Coffee", "Breakfast", "Sandwiches", "Burgers"],
  hasMenu: {
    "@type": "Menu",
    hasMenuSection: Array.from(new Set(menuFlat.map((item) => item.category))).map((category) => ({
      "@type": "MenuSection",
      name: category,
      hasMenuItem: menuFlat
        .filter((item) => item.category === category)
        .map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          offers: item.schemaPrice
            ? {
                "@type": "Offer",
                priceCurrency: "AUD",
                price: item.schemaPrice,
              }
            : undefined,
        })),
    })),
  },
};
