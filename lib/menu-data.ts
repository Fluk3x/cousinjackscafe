/**
 * Central menu data for Cousin Jacks Café.
 * ---
 * Every board row has stable `id` for customise + basket wiring.
 */

export type RollVariantChoice = {
  id: string;
  label: string;
  /** Optional second line in the customise modal (e.g. what’s in a bundle) */
  detail?: string;
  price: string;
  priceCents: number;
};

export type RollAddOn = {
  id: string;
  name: string;
  priceCents: number;
  excludeForVariantIds?: string[];
};

export type RemovalChoice = {
  id: string;
  name: string;
};

export type ItemCustomizationConfig = {
  /** Radio group replacing base price (sizes, roll versions, burger sauce flavour, …) */
  primarySectionTitle?: string;
  primaryChoices?: RollVariantChoice[];
  /** Second radio group at the same base price (e.g. burger sauce amount) */
  secondarySectionTitle?: string;
  secondaryChoices?: RollVariantChoice[];
  /** Sandwich toast picker - rendered last in the customise modal below Remove (optional). */
  toastSectionTitle?: string;
  toastChoices?: RollVariantChoice[];
  /** Sauces / spreads for items where flavour is not the primary picker (sandwiches, light breakfast) */
  sauceSectionTitle?: string;
  sauceChoices?: RollVariantChoice[];
  /** Shown above other extras (single row today: chips combo). */
  comboAddOns?: RollAddOn[];
  milkOptions?: { id: string; label: string; priceCents: number }[];
  addOns?: RollAddOn[];
  removals?: RemovalChoice[];
};

export type BoardMenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  popular?: boolean;
  /** Fallback when primaryChoices omitted or unused */
  basePriceCents?: number;
  customization?: ItemCustomizationConfig;
  upgradeNote?: string;
};

export type PopularPickHighlight = {
  menuItemId: string;
  photo?: string;
  /** Overrides menu description copy on cards */
  description?: string;
};

export type BoardMenuCategory = {
  id: string;
  label: string;
  items: BoardMenuItem[];
  footnote?: string;
};

/* --- Shared presets (draft café pricing) --- */

const MILK_STANDARD: NonNullable<ItemCustomizationConfig["milkOptions"]> = [
  { id: "full", label: "Full cream", priceCents: 0 },
  { id: "skim", label: "Skim", priceCents: 0 },
  { id: "soy", label: "Soy", priceCents: 100 },
  { id: "almond", label: "Almond", priceCents: 100 },
  { id: "oat", label: "Oat", priceCents: 100 },
  { id: "lactose", label: "Lactose free", priceCents: 100 },
];

const COFFEE_DRINK_ADDONS: RollAddOn[] = [
  { id: "extra-shot", name: "Extra shot", priceCents: 50 },
  { id: "decaf", name: "Decaf", priceCents: 50 },
  { id: "syrup-caramel", name: "Caramel syrup", priceCents: 100 },
  { id: "syrup-vanilla", name: "Vanilla syrup", priceCents: 100 },
  { id: "syrup-hazelnut", name: "Hazelnut syrup", priceCents: 100 },
];

const COFFEE_SIZES_STANDARD: RollVariantChoice[] = [
  { id: "s", label: "Small", price: "$4.50", priceCents: 450 },
  { id: "l", label: "Large", price: "$5.00", priceCents: 500 },
  { id: "j", label: "Jumbo", price: "$6.00", priceCents: 600 },
];

const MOCHA_SIZES: RollVariantChoice[] = [
  { id: "s", label: "Small", price: "$5.00", priceCents: 500 },
  { id: "l", label: "Large", price: "$5.50", priceCents: 550 },
  { id: "j", label: "Jumbo", price: "$6.50", priceCents: 650 },
];

const MATCHA_SIZES: RollVariantChoice[] = [
  { id: "s", label: "Small", price: "$6.00", priceCents: 600 },
  { id: "l", label: "Large", price: "$6.50", priceCents: 650 },
  { id: "j", label: "Jumbo", price: "$7.00", priceCents: 700 },
];

const CHIPS_COMBO_ADDON: RollAddOn = { id: "chips-combo", name: "Chips & soft drink combo", priceCents: 500 };

/** Meaty / mixed deli sandwiches — use "Bacon" when the sandwich does not already list bacon. */
function sandwichMeatSides(bacon: "Bacon" | "Extra bacon"): RollAddOn[] {
  return [
    { id: "extra-bacon", name: bacon, priceCents: 400 },
    { id: "extra-cheese", name: "Extra cheese", priceCents: 150 },
    { id: "avocado", name: "Avocado", priceCents: 400 },
    { id: "hash-brown", name: "Hash brown", priceCents: 500 },
    { id: "extra-chicken", name: "Extra chicken", priceCents: 500 },
    { id: "extra-schnitzel", name: "Extra schnitzel", priceCents: 500 },
    { id: "halloumi", name: "Halloumi", priceCents: 450 },
  ];
}

const sandwichVegetarianSides: RollAddOn[] = [
  { id: "extra-cheese", name: "Extra cheese", priceCents: 150 },
  { id: "avocado", name: "Avocado", priceCents: 400 },
  { id: "hash-brown", name: "Hash brown", priceCents: 500 },
  { id: "halloumi", name: "Halloumi", priceCents: 450 },
];

const SIDES_GRILLED_CHICKEN_SW = sandwichMeatSides("Bacon");
const SIDES_REUBEN_SW = sandwichMeatSides("Bacon");
const SIDES_MORTADELLA_SW = sandwichMeatSides("Bacon");
const SIDES_MEDITERRANEAN_SW = sandwichVegetarianSides;
const SIDES_BLAT_SW = sandwichMeatSides("Extra bacon");
const SIDES_CHICKEN_BACON_SW = sandwichMeatSides("Extra bacon");
const SIDES_SCHNITZEL_SW = sandwichMeatSides("Bacon");

const rm: Record<string, RemovalChoice> = {
  mayo: { id: "no-mayo", name: "No mayo" },
  cheese: { id: "no-cheese", name: "No cheese" },
  feta: { id: "no-feta", name: "No feta" },
  tomato: { id: "no-tomato", name: "No tomato" },
  lettuce: { id: "no-lettuce", name: "No lettuce" },
  pesto: { id: "no-pesto", name: "No pesto" },
  rocket: { id: "no-rocket", name: "No rocket" },
  pickles: { id: "no-pickles", name: "No pickles" },
  onion: { id: "no-onion", name: "No onion" },
  bacon: { id: "no-bacon", name: "No bacon" },
  avocado: { id: "no-avocado", name: "No avocado" },
  sauerkraut: { id: "no-sauerkraut", name: "No sauerkraut" },
  thousandIsland: { id: "no-thousand-island", name: "No Thousand Island dressing" },
  mozzarella: { id: "no-mozzarella", name: "No mozzarella" },
  sundriedTomato: { id: "no-sundried-tomato", name: "No sundried tomato" },
  zucchini: { id: "no-zucchini", name: "No zucchini" },
  capsicum: { id: "no-capsicum", name: "No capsicum (pepper)" },
  eggplant: { id: "no-eggplant", name: "No eggplant" },
  mortadella: { id: "no-mortadella", name: "No mortadella" },
  chicken: { id: "no-chicken", name: "No chicken" },
  cornedBeef: { id: "no-corned-beef", name: "No corned beef" },
  beefPatty: { id: "no-beef-patty", name: "No beef patty" },
  specialSauce: { id: "no-special-sauce", name: "No special sauce" },
  slaw: { id: "no-slaw", name: "No slaw" },
  jalapeno: { id: "no-jalapeno", name: "No jalapeños" },
  chilliMayo: { id: "no-chilli-mayo", name: "No chilli mayo" },
  caramelOnion: { id: "no-caramelised-onion", name: "No caramelised onion" },
  scrambledEgg: { id: "no-scrambled-egg", name: "No scrambled egg" },
  ham: { id: "no-ham", name: "No ham" },
  sauce: { id: "no-sauce", name: "No sauce" },
  eggFried: { id: "no-fried-egg", name: "No fried egg" },
  spinach: { id: "no-spinach", name: "No spinach" },
  hashBrown: { id: "no-hash-brown", name: "No hash brown" },
  halloumi: { id: "no-halloumi", name: "No halloumi" },
  schnitzel: { id: "no-schnitzel", name: "No schnitzel" },
};

function burgerSides(bacon: "Bacon" | "Extra bacon"): RollAddOn[] {
  return [
    { id: "beef-patty", name: "Extra beef patty", priceCents: 500 },
    { id: "chicken-protein", name: "Extra chicken", priceCents: 500 },
    { id: "extra-bacon", name: bacon, priceCents: 400 },
    { id: "cheese", name: "Extra cheese", priceCents: 150 },
    { id: "hash-brown", name: "Hash brown", priceCents: 500 },
    { id: "egg", name: "Egg", priceCents: 200 },
    { id: "jalapenos", name: "Jalapeños", priceCents: 100 },
    { id: "caramel-onion", name: "Caramelised onion", priceCents: 150 },
    { id: "pickles", name: "Extra pickles", priceCents: 50 },
  ];
}

/** Plain toastie: optional rasher Bacon; Egg row when sandwich has none; Extra cheese atop listed ham and cheese slices. */
const HAM_CHEESE_TOASTIE_ADDONS: RollAddOn[] = [
  { id: "extra-bacon", name: "Bacon", priceCents: 400 },
  { id: "extra-egg", name: "Egg", priceCents: 200 },
  { id: "cheese", name: "Extra cheese", priceCents: 150 },
  { id: "hash-brown", name: "Hash brown", priceCents: 500 },
];

/** Avocado-only toastie. */
const AVOCADO_TOASTIE_ADDONS: RollAddOn[] = [
  { id: "extra-bacon", name: "Bacon", priceCents: 400 },
  { id: "extra-egg", name: "Egg", priceCents: 200 },
  { id: "cheese", name: "Cheese", priceCents: 150 },
  { id: "hash-brown", name: "Hash brown", priceCents: 500 },
];

/** Halloumi wrap lists grilled halloumi + egg etc.; rashers Bacon, extra fried egg wording kept. */
const HALLUMI_WRAP_ADDONS: RollAddOn[] = [
  { id: "avocado", name: "Avocado", priceCents: 400 },
  { id: "extra-bacon", name: "Bacon", priceCents: 400 },
  { id: "extra-egg", name: "Extra egg", priceCents: 200 },
  { id: "cheese", name: "Cheese", priceCents: 150 },
  { id: "hash-brown", name: "Hash brown", priceCents: 500 },
];

/** Same ids as bacon & egg roll (variant sync / bundle exclusions). */
const baconEggVariantsRoll: RollVariantChoice[] = [
  { id: "standard", label: "Bacon & Egg Roll", price: "$8.50", priceCents: 850 },
  { id: "double-bacon", label: "Double Bacon & Egg Roll", price: "$12.50", priceCents: 1250 },
  { id: "cheese-hash", label: "With cheese & hash brown", price: "$15.00", priceCents: 1500 },
  {
    id: "monster",
    label: "Monster roll (loaded)",
    detail: "Double bacon, extra egg, cheese & hash brown",
    price: "$18.90",
    priceCents: 1890,
  },
];

const baconEggVariantsWrap: RollVariantChoice[] = [
  { id: "standard", label: "Breakfast wrap", price: "$8.50", priceCents: 850 },
  { id: "double-bacon", label: "Double bacon breakfast wrap", price: "$12.50", priceCents: 1250 },
  { id: "cheese-hash", label: "With cheese & hash brown", price: "$15.00", priceCents: 1500 },
  {
    id: "monster",
    label: "Monster wrap (loaded)",
    detail: "Double bacon, extra egg, cheese & hash brown",
    price: "$18.90",
    priceCents: 1890,
  },
];

/** Rolls + parity wraps share these rows; bundle rows ($0 “In bundle”) follow `excludeForVariantIds`. */
const baconEggStyleAddOns: RollAddOn[] = [
  { id: "extra-bacon", name: "Extra bacon", priceCents: 400, excludeForVariantIds: ["double-bacon", "monster"] },
  { id: "extra-egg", name: "Extra egg", priceCents: 200, excludeForVariantIds: ["monster"] },
  { id: "cheese", name: "Cheese", priceCents: 150, excludeForVariantIds: ["cheese-hash", "monster"] },
  { id: "hash-brown", name: "Hash brown", priceCents: 500, excludeForVariantIds: ["cheese-hash", "monster"] },
];

const SAUCE_INCLUDED = "Included";

/** Breakfast savoury picks that default open to BBQ in the customise modal. */
const breakfastSauceBbqDefault: RollVariantChoice[] = [
  { id: "sauce-bbq", label: "BBQ sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

const breakfastSauceNoDefault: RollVariantChoice[] = [
  { id: "sauce-none", label: "No sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
];

const sandwichSauceMayoDefault: RollVariantChoice[] = [
  { id: "sauce-mayo", label: "Mayo (as listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

/** Chicken + bacon build: BBQ reads more natural than mayo as the first tap. */
const sandwichSauceChickenBaconDefault: RollVariantChoice[] = [
  { id: "sauce-bbq", label: "BBQ sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo (as listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

const sandwichSauceThousandIslandDefault: RollVariantChoice[] = [
  { id: "sauce-ti", label: "Thousand Island (as listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No dressing / sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

const sandwichSaucePestoDefault: RollVariantChoice[] = [
  { id: "sauce-pesto", label: "Basil pesto (as listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No sauce / spread", price: SAUCE_INCLUDED, priceCents: 0 },
];

const burgerSauceAmount: RollVariantChoice[] = [
  { id: "sauce-amt-standard", label: "Standard amount", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-amt-light", label: "Light on sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

type BurgerSauceListed = "special" | "chilli-mayo" | "mayo";

function burgerSaucePrimaries(baseCents: number, priceLabel: string, listed: BurgerSauceListed): RollVariantChoice[] {
  const specialAsListed: RollVariantChoice = {
    id: "sauce-as-listed",
    label: "Special sauce (as listed)",
    price: priceLabel,
    priceCents: baseCents,
  };
  const asListedChilliOrMayo: RollVariantChoice =
    listed === "chilli-mayo"
      ? { id: "sauce-as-listed", label: "Chilli mayo (as listed)", price: priceLabel, priceCents: baseCents }
      : { id: "sauce-as-listed", label: "Mayo (as listed)", price: priceLabel, priceCents: baseCents };

  if (listed === "special") {
    return [
      specialAsListed,
      { id: "sauce-bbq", label: "BBQ sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-tomato", label: "Tomato sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-mayo", label: "Mayo", price: priceLabel, priceCents: baseCents },
      { id: "sauce-none", label: "No sauce", price: priceLabel, priceCents: baseCents },
    ];
  }

  if (listed === "chilli-mayo") {
    return [
      asListedChilliOrMayo,
      { id: "sauce-tomato", label: "Tomato sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-bbq", label: "BBQ sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-mayo", label: "Mayo", price: priceLabel, priceCents: baseCents },
      { id: "sauce-none", label: "No sauce", price: priceLabel, priceCents: baseCents },
    ];
  }

  if (listed === "mayo") {
    return [
      asListedChilliOrMayo,
      { id: "sauce-tomato", label: "Tomato sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-bbq", label: "BBQ sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-none", label: "No sauce", price: priceLabel, priceCents: baseCents },
    ];
  }

  const _unexpected: never = listed;
  throw new Error(`Unhandled burger sauce preset: ${String(_unexpected)}`);
}

function burgerCustom(
  baseCents: number,
  priceLabel: string,
  listedSauce: BurgerSauceListed,
  removals: RemovalChoice[],
  burgerExtras: RollAddOn[],
): ItemCustomizationConfig {
  const sauceAsIncluded = burgerSaucePrimaries(baseCents, priceLabel, listedSauce).map((c) => ({
    ...c,
    price: SAUCE_INCLUDED,
    priceCents: 0,
  }));
  return {
    secondarySectionTitle: "How much sauce",
    secondaryChoices: burgerSauceAmount,
    sauceSectionTitle: "Sauce",
    sauceChoices: sauceAsIncluded,
    comboAddOns: [CHIPS_COMBO_ADDON],
    addOns: burgerExtras,
    removals,
  };
}

const coffeeStyle = (sizes: RollVariantChoice[]): ItemCustomizationConfig => ({
  primarySectionTitle: "Choose size",
  primaryChoices: sizes,
  milkOptions: MILK_STANDARD,
  addOns: COFFEE_DRINK_ADDONS,
});

const sandwichCustom = (addOns: RollAddOn[], removals: RemovalChoice[], sauceChoices: RollVariantChoice[]): ItemCustomizationConfig => ({
  toastSectionTitle: "Toast level",
  toastChoices: [
    { id: "toast-std", label: "Standard toast", price: "$13.50", priceCents: 1350 },
    { id: "toast-crisp", label: "Extra crispy toast", price: "$13.50", priceCents: 1350 },
  ],
  sauceSectionTitle: "Sauce",
  sauceChoices,
  comboAddOns: [CHIPS_COMBO_ADDON],
  addOns,
  removals,
});

export const menuCategories: BoardMenuCategory[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    items: [
      {
        id: "bacon-egg-roll",
        name: "Bacon & Egg Roll",
        description: "Crispy bacon, fried egg and sauce.",
        price: "From $8.50",
        popular: true,
        customization: {
          primarySectionTitle: "Choose version",
          primaryChoices: baconEggVariantsRoll,
          addOns: baconEggStyleAddOns,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceBbqDefault,
          removals: [rm.bacon, rm.eggFried],
        },
      },
      {
        id: "breakfast-wrap",
        name: "Breakfast Wrap",
        description: "Bacon, scrambled egg and cheese.",
        price: "From $8.50",
        customization: {
          primarySectionTitle: "Choose version",
          primaryChoices: baconEggVariantsWrap,
          addOns: baconEggStyleAddOns,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceBbqDefault,
          removals: [rm.bacon, rm.scrambledEgg, rm.cheese],
        },
      },
      {
        id: "halloumi-breakfast-wrap",
        name: "Halloumi Breakfast Wrap",
        description: "Grilled halloumi, fried egg, hash brown and spinach.",
        price: "$12.00",
        basePriceCents: 1200,
        customization: {
          addOns: HALLUMI_WRAP_ADDONS,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceBbqDefault,
          removals: [rm.halloumi, rm.eggFried, rm.hashBrown, rm.spinach],
        },
      },
      {
        id: "ham-cheese-toastie",
        name: "Ham, Cheese & Tomato Toastie",
        description: "",
        price: "$8.00",
        basePriceCents: 800,
        customization: {
          addOns: HAM_CHEESE_TOASTIE_ADDONS,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceNoDefault,
          removals: [rm.ham, rm.cheese, rm.tomato],
        },
      },
      {
        id: "avocado-toastie",
        name: "Avocado Toastie",
        description: "",
        price: "$8.00",
        basePriceCents: 800,
        customization: {
          addOns: AVOCADO_TOASTIE_ADDONS,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceNoDefault,
          removals: [rm.avocado],
        },
      },
    ],
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    items: [
      {
        id: "grilled-chicken-sandwich",
        name: "Grilled Chicken Sandwich",
        description: "Grilled chicken, avocado, lettuce, cheese & mayo",
        price: "$13.50",
        popular: true,
        basePriceCents: 1350,
        customization: sandwichCustom(
          SIDES_GRILLED_CHICKEN_SW,
          [rm.chicken, rm.avocado, rm.lettuce, rm.cheese],
          sandwichSauceMayoDefault,
        ),
      },
      {
        id: "reuben-sandwich",
        name: "Reuben Sandwich",
        description: "Corned beef, Swiss cheese, sauerkraut, gherkins, Thousand Island dressing",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          SIDES_REUBEN_SW,
          [rm.cornedBeef, rm.cheese, rm.sauerkraut, rm.pickles],
          sandwichSauceThousandIslandDefault,
        ),
      },
      {
        id: "mortadella-sandwich",
        name: "Mortadella Sandwich",
        description: "Mortadella, mozzarella, basil pesto, sundried tomato",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          SIDES_MORTADELLA_SW,
          [rm.mortadella, rm.mozzarella, rm.sundriedTomato],
          sandwichSaucePestoDefault,
        ),
      },
      {
        id: "mediterranean-veggie-sandwich",
        name: "Mediterranean Veggie Sandwich",
        description: "Grilled zucchini, roasted capsicum, eggplant, feta, basil pesto, rocket",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          SIDES_MEDITERRANEAN_SW,
          [rm.zucchini, rm.capsicum, rm.eggplant, rm.feta, rm.rocket],
          sandwichSaucePestoDefault,
        ),
      },
      {
        id: "blat",
        name: "BLAT",
        description: "Bacon, lettuce, avocado, tomato & mayo",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          SIDES_BLAT_SW,
          [rm.bacon, rm.lettuce, rm.avocado, rm.tomato],
          sandwichSauceMayoDefault,
        ),
      },
      {
        id: "chicken-bacon-sandwich",
        name: "Chicken Bacon Sandwich",
        description: "Lettuce, tomato & mayo",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          SIDES_CHICKEN_BACON_SW,
          [rm.chicken, rm.bacon, rm.lettuce, rm.tomato],
          sandwichSauceChickenBaconDefault,
        ),
      },
      {
        id: "chicken-schnitzel-sandwich",
        name: "Chicken Schnitzel Sandwich",
        description: "Lettuce, tomato & mayo",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          SIDES_SCHNITZEL_SW,
          [rm.schnitzel, rm.lettuce, rm.tomato],
          sandwichSauceMayoDefault,
        ),
      },
    ],
  },
  {
    id: "burgers",
    label: "Burgers",
    items: [
      {
        id: "cheese-burger",
        name: "Cheese Burger",
        description: "Beef patty, double cheese, tomato, pickles with special sauce",
        price: "$12.90",
        basePriceCents: 1290,
        customization: burgerCustom(1290, "$12.90", "special", [
          rm.beefPatty,
          rm.cheese,
          rm.tomato,
          rm.pickles,
        ], burgerSides("Bacon")),
      },
      {
        id: "cj-special-burger",
        name: "CJ Special Burger",
        description: "Double beef, double cheese, bacon, caramelised onion, tomato, pickles, special sauce",
        price: "$16.90",
        popular: true,
        basePriceCents: 1690,
        customization: burgerCustom(1690, "$16.90", "special", [
          rm.beefPatty,
          rm.cheese,
          rm.bacon,
          rm.caramelOnion,
          rm.tomato,
          rm.pickles,
        ], burgerSides("Extra bacon")),
      },
      {
        id: "crispy-chicken-burger",
        name: "Crispy Chicken Burger",
        description: "Fried chicken, slaw, jalapeño with chilli mayo",
        price: "$13.90",
        basePriceCents: 1390,
        customization: burgerCustom(1390, "$13.90", "chilli-mayo", [rm.chicken, rm.slaw, rm.jalapeno], burgerSides("Bacon")),
      },
      {
        id: "grilled-chicken-burger",
        name: "Grilled Chicken Burger",
        description: "Grilled chicken, tomato, lettuce, cheese with mayo",
        price: "$12.90",
        basePriceCents: 1290,
        customization: burgerCustom(1290, "$12.90", "mayo", [rm.chicken, rm.tomato, rm.lettuce, rm.cheese], burgerSides("Bacon")),
      },
    ],
  },
  {
    id: "coffee",
    label: "Coffee",
    items: [
      {
        id: "espresso",
        name: "Espresso",
        description: "Small",
        price: "$3.50",
        customization: {
          primarySectionTitle: "Size",
          primaryChoices: [{ id: "sm", label: "Small", price: "$3.50", priceCents: 350 }],
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS,
        },
      },
      {
        id: "macchiato",
        name: "Macchiato",
        description: "Small",
        price: "$4.50",
        customization: {
          primarySectionTitle: "Size",
          primaryChoices: [{ id: "sm", label: "Small", price: "$4.50", priceCents: 450 }],
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS,
        },
      },
      {
        id: "piccolo",
        name: "Piccolo",
        description: "Small",
        price: "$4.50",
        customization: {
          primarySectionTitle: "Size",
          primaryChoices: [{ id: "sm", label: "Small", price: "$4.50", priceCents: 450 }],
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS,
        },
      },
      {
        id: "flat-white",
        name: "Flat White",
        description: "Small / Large / Jumbo",
        price: "$4.50 / $5.00 / $6.00",
        popular: true,
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "latte",
        name: "Latte",
        description: "Small / Large / Jumbo",
        price: "$4.50 / $5.00 / $6.00",
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Small / Large / Jumbo",
        price: "$4.50 / $5.00 / $6.00",
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "long-black",
        name: "Long Black",
        description: "Small / Large / Jumbo",
        price: "$4.50 / $5.00 / $6.00",
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "mocha",
        name: "Mocha",
        description: "Small / Large / Jumbo",
        price: "$5.00 / $5.50 / $6.50",
        customization: coffeeStyle(MOCHA_SIZES),
      },
    ],
  },
  {
    id: "hot-drinks",
    label: "Hot drinks",
    items: [
      {
        id: "hot-chocolate",
        name: "Hot Chocolate",
        description: "Small / Large / Jumbo",
        price: "$5.00 / $5.50 / $6.50",
        customization: coffeeStyle(MOCHA_SIZES),
      },
      {
        id: "chai-latte",
        name: "Chai Latte",
        description: "Small / Large / Jumbo",
        price: "$5.00 / $5.50 / $6.50",
        customization: coffeeStyle(MOCHA_SIZES),
      },
      {
        id: "matcha-latte",
        name: "Matcha Latte",
        description: "Small / Large / Jumbo",
        price: "$6.00 / $6.50 / $7.00",
        customization: coffeeStyle(MATCHA_SIZES),
      },
      {
        id: "tea-pot",
        name: "Tea",
        description: "English Breakfast, Earl Grey, Peppermint, Green Tea, Chamomile",
        price: "$5.00",
        basePriceCents: 500,
        customization: {
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS.filter((a) => !["extra-shot", "decaf"].includes(a.id)),
        },
      },
      { id: "extra-shot-menu", name: "Extra Shot or Decaf", description: "Per drink", price: "$0.50" },
      { id: "alt-milk-menu", name: "Alternative Milks", description: "Soy, almond, oat, lactose free", price: "$1.00" },
      { id: "syrup-menu", name: "Syrup", description: "Caramel, vanilla, hazelnut", price: "$1.00" },
    ],
  },
  {
    id: "cold-drinks",
    label: "Cold drinks",
    items: [
      {
        id: "iced-long-black",
        name: "Iced Long Black",
        description: "",
        price: "$6.00",
        basePriceCents: 600,
        customization: {
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS,
        },
      },
      {
        id: "iced-latte",
        name: "Iced Latte",
        description: "",
        price: "$6.50",
        popular: true,
        basePriceCents: 650,
        customization: {
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS,
        },
      },
      {
        id: "iced-chocolate",
        name: "Iced Chocolate",
        description: "",
        price: "$6.50",
        basePriceCents: 650,
        customization: {
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS.filter((a) => a.id !== "decaf"),
        },
      },
    ],
  },
];

/** One place to match filenames under `public/` */
export const POPULAR_PHOTO_URLS = {
  baconEggRoll: "/bacon-egg-roll.png",
  grilledChickenSandwich: "/grilled-chicken-sandwich.png",
  cjSpecialBurger: "/cj-special-burger.png",
  flatWhite: "/hero-coffee.png",
  icedLatte: "/iced-latte.png",
} as const;

export const popularPicks: PopularPickHighlight[] = [
  {
    menuItemId: "bacon-egg-roll",
    photo: POPULAR_PHOTO_URLS.baconEggRoll,
    description: "Crispy bacon, fried egg and sauce. Customise for Monster, double bacon, cheese & hash.",
  },
  {
    menuItemId: "grilled-chicken-sandwich",
    photo: POPULAR_PHOTO_URLS.grilledChickenSandwich,
    description: "Grilled chicken, avocado, lettuce, cheese and mayo.",
  },
  {
    menuItemId: "cj-special-burger",
    photo: POPULAR_PHOTO_URLS.cjSpecialBurger,
    description: "Double beef, bacon, caramelised onion and special sauce.",
  },
  {
    menuItemId: "flat-white",
    photo: POPULAR_PHOTO_URLS.flatWhite,
    description: "Smooth espresso with velvety milk.",
  },
  {
    menuItemId: "iced-latte",
    photo: POPULAR_PHOTO_URLS.icedLatte,
    description: "Cold, smooth and balanced.",
  },
];

export const MENU_ITEMS_BY_ID: Record<string, BoardMenuItem> = Object.fromEntries(
  menuCategories.flatMap((c) => c.items.map((i) => [i.id, i] as const)),
);

export function findMenuItemById(id: string): BoardMenuItem | undefined {
  return MENU_ITEMS_BY_ID[id];
}

/** @deprecated alias for tooling; canonical type is PopularPickHighlight */
export type PopularPickCard = PopularPickHighlight;

/** Format cents as AUD for display (e.g. modal totals). */
export function audFromCents(cents: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

/** Flattened list for JSON-LD (best-effort AUD) */
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
