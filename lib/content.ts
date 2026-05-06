export const cafe = {
  name: "Cousin Jacks Café",
  legalName: "Cousin Jacks Café Guildford",
  suburb: "Guildford",
  region: "NSW",
  country: "Australia",
  tagline: "Fresh coffee, breakfast rolls, toasted sandwiches, burgers and café favourites in Guildford.",
  shortTagline: "Cousin Jacks Café in Guildford, NSW — coffee, breakfast rolls, toasties, sandwiches, burgers and lunch.",
  phone: "+61 000 000 000",
  email: "hello@cousinjacks.cafe",
  address: "Guildford, NSW 2161",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cousin%20Jacks%20Cafe%20Guildford%20NSW",
  instagramUrl: "https://www.instagram.com/cousinjackspastyco/",
  orderUrl: "https://www.ubereats.com/au/search?q=Cousin%20Jacks%20Pasty%20Co",
  siteUrl: "https://cousinjacks.cafe",
  hours: [
    { day: "Monday", time: "7:00 am - 3:00 pm" },
    { day: "Tuesday", time: "7:00 am - 3:00 pm" },
    { day: "Wednesday", time: "7:00 am - 3:00 pm" },
    { day: "Thursday", time: "7:00 am - 3:00 pm" },
    { day: "Friday", time: "7:00 am - 3:00 pm" },
    { day: "Saturday", time: "8:00 am - 2:00 pm" },
    { day: "Sunday", time: "Check Google before visiting" },
  ],
};

/** Homepage: show Email café only after the address is final and live. */
export const siteContact = {
  publishEmailLink: false,
} as const;
