/**
 * Central menu data for Cousin Jacks Café.
 * ---
 * Popular pick thumbnails: paths are rooted at `public/`. Canonical filenames live in
 * `POPULAR_PHOTO_URLS` (currently flat in `public/`, not under `food/`).
 *
 * | Popular card           | Filename                    |
 * | ---------------------- | --------------------------- |
 * | Bacon & Egg Roll       | `bacon-egg-roll.png`        |
 * | Grilled Chicken        | `grilled-chicken-sandwich.png` |
 * | CJ Special Burger       | `cj-special-burger.png`     |
 * | Flat White             | add `flat-white.png` someday; meanwhile `hero-coffee.png` |
 * | Iced Latte             | `iced-latte.png`            |
 *
 * Other shoots you listed (unused in code yet): e.g. `avo-toastie.png`, `bacon-egg-wrap.png`,
 * `blat.png`, `cheeseburger.png`, `chicken-bacon-sandwich.png`, `fried-chicken-burger.png`,
 * `grilled-chicken-burger.png`, `halloumi-breakfast-wrap.png`, `ham-cheese-toastie.png`,
 * `mortadella-sandwich.png`, `reuben-sandwich.png`, `schnitzel-sandwich.png`, `veggie-sandwich.png`,
 * variants `cousin_jacks_logo_and_writing.png`, `cousin_jacks_logo_dark_small.png`,
 * `cousin_jacks_writing1.png`–`cousin_jacks_writing4.png`, etc.
 */
export type BoardMenuItem = {
  name: string;
  description: string;
  price: string;
  popular?: boolean;
};

export type PopularPickCard = BoardMenuItem & {
  /** Optional: PNG under `public/` (see `POPULAR_PHOTO_URLS`) */
  photo?: string;
};

export type BoardMenuCategory = {
  id: string;
  label: string;
  items: BoardMenuItem[];
};

export const menuCategories: BoardMenuCategory[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    items: [
      { name: "Bacon & Egg Roll", description: "", price: "$8.50", popular: true },
      { name: "Double Bacon & Egg Roll", description: "", price: "$12.50" },
      { name: "Add Cheese & Hash Brown", description: "Add-on for your roll", price: "$15.00" },
      { name: "Breakfast Wrap", description: "Bacon, scrambled egg & cheese", price: "$12.00" },
      {
        name: "Halloumi Breakfast Wrap",
        description: "Grilled halloumi, fried egg, hash brown, spinach",
        price: "$12.00",
      },
      { name: "Ham, Cheese, Tomato, Toastie", description: "", price: "$8.00" },
      { name: "Avocado Toastie", description: "", price: "$8.00" },
    ],
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    items: [
      {
        name: "Grilled Chicken Sandwich",
        description: "Grilled chicken, avocado, lettuce, cheese & mayo",
        price: "$13.50",
        popular: true,
      },
      {
        name: "Reuben Sandwich",
        description: "Corned beef, Swiss cheese, sauerkraut, gherkins, Thousand Island dressing",
        price: "$13.50",
      },
      {
        name: "Mortadella Sandwich",
        description: "Mortadella, mozzarella, basil pesto, sundried tomato",
        price: "$13.50",
      },
      {
        name: "Mediterranean Veggie Sandwich",
        description: "Grilled zucchini, roasted capsicum, eggplant, feta, basil pesto, rocket",
        price: "$13.50",
      },
      { name: "BLAT", description: "Bacon, lettuce, avocado, tomato & mayo", price: "$13.50" },
      { name: "Chicken Bacon Sandwich", description: "Lettuce, tomato & mayo", price: "$13.50" },
      { name: "Chicken Schnitzel Sandwich", description: "Lettuce, tomato & mayo", price: "$13.50" },
    ],
  },
  {
    id: "burgers",
    label: "Burgers",
    items: [
      {
        name: "Cheese Burger",
        description: "Beef patty, double cheese, tomato, pickles with special sauce",
        price: "$12.90",
      },
      {
        name: "CJ Special Burger",
        description: "Double beef, double cheese, bacon, caramelised onion, tomato, pickles, special sauce",
        price: "$16.90",
        popular: true,
      },
      {
        name: "Crispy Chicken Burger",
        description: "Fried chicken, slaw, jalapeño with chilli mayo",
        price: "$13.90",
      },
      {
        name: "Grilled Chicken Burger",
        description: "Grilled chicken, tomato, lettuce, cheese with mayo",
        price: "$12.90",
      },
      { name: "Chips & Soft Drink", description: "Add-on combo", price: "$5.00" },
    ],
  },
  {
    id: "coffee",
    label: "Coffee",
    items: [
      { name: "Espresso", description: "Small", price: "$3.50" },
      { name: "Macchiato", description: "Small", price: "$4.50" },
      { name: "Piccolo", description: "Small", price: "$4.50" },
      {
        name: "Flat White",
        description: "Small / Large / Jumbo",
        price: "$4.50 / $5.00 / $6.00",
        popular: true,
      },
      { name: "Latte", description: "Small / Large / Jumbo", price: "$4.50 / $5.00 / $6.00" },
      { name: "Cappuccino", description: "Small / Large / Jumbo", price: "$4.50 / $5.00 / $6.00" },
      { name: "Long Black", description: "Small / Large / Jumbo", price: "$4.50 / $5.00 / $6.00" },
      { name: "Mocha", description: "Small / Large / Jumbo", price: "$5.00 / $5.50 / $6.50" },
    ],
  },
  {
    id: "hot-drinks",
    label: "Hot drinks",
    items: [
      { name: "Hot Chocolate", description: "Small / Large / Jumbo", price: "$5.00 / $5.50 / $6.50" },
      { name: "Chai Latte", description: "Small / Large / Jumbo", price: "$5.00 / $5.50 / $6.50" },
      { name: "Matcha Latte", description: "Small / Large / Jumbo", price: "$6.00 / $6.50 / $7.00" },
      {
        name: "Tea",
        description: "English Breakfast, Earl Grey, Peppermint, Green Tea, Chamomile",
        price: "$5.00",
      },
      { name: "Extra Shot or Decaf", description: "", price: "$0.50" },
      { name: "Alternative Milks", description: "Soy, almond, oat, lactose free", price: "$1.00" },
      { name: "Syrup", description: "Caramel, vanilla, hazelnut", price: "$1.00" },
    ],
  },
  {
    id: "cold-drinks",
    label: "Cold drinks",
    items: [
      { name: "Iced Long Black", description: "", price: "$6.00" },
      {
        name: "Iced Latte",
        description: "",
        price: "$6.50",
        popular: true,
      },
      {
        name: "Iced Chocolate",
        description: "",
        price: "$6.50",
      },
    ],
  },
];

/** One place to match filenames under `public/` to each popular card */
export const POPULAR_PHOTO_URLS = {
  baconEggRoll: "/bacon-egg-roll.png",
  grilledChickenSandwich: "/grilled-chicken-sandwich.png",
  cjSpecialBurger: "/cj-special-burger.png",
  // Replace with `/flat-white.png` when exported; reuse hero mug until then
  flatWhite: "/hero-coffee.png",
  icedLatte: "/iced-latte.png",
} as const;

export const popularPicks: PopularPickCard[] = [
  {
    name: "Bacon & Egg Roll",
    description: "Crispy bacon, fried egg and house relish.",
    price: "$8.50",
    popular: true,
    photo: POPULAR_PHOTO_URLS.baconEggRoll,
  },
  {
    name: "Grilled Chicken Sandwich",
    description: "Grilled chicken, avocado, lettuce, cheese and mayo.",
    price: "$13.50",
    popular: true,
    photo: POPULAR_PHOTO_URLS.grilledChickenSandwich,
  },
  {
    name: "CJ Special Burger",
    description: "Double beef, bacon, caramelised onion and special sauce.",
    price: "$16.90",
    popular: true,
    photo: POPULAR_PHOTO_URLS.cjSpecialBurger,
  },
  {
    name: "Flat White",
    description: "Smooth espresso with velvety milk.",
    price: "From $4.50",
    popular: true,
    photo: POPULAR_PHOTO_URLS.flatWhite,
  },
  {
    name: "Iced Latte",
    description: "Cold, smooth and balanced.",
    price: "$6.50",
    popular: true,
    photo: POPULAR_PHOTO_URLS.icedLatte,
  },
];

/** Flattened list for JSON-LD (one row per item; `schemaPrice` is best-effort AUD) */
export function getMenuItemsForSchema(): { name: string; description: string; category: string; schemaPrice: string }[] {
  const out: { name: string; description: string; category: string; schemaPrice: string }[] = [];
  for (const section of menuCategories) {
    for (const item of section.items) {
      const match = item.price.match(/\$(\d+(?:\.\d+)?)/);
      out.push({
        name: item.name,
        description: item.description,
        category: section.label,
        schemaPrice: match ? match[1] : "",
      });
    }
  }
  return out;
}
