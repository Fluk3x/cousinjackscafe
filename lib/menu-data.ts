/**
 * Central menu data for Cousin Jacks Café.
 * ---
 * Every board row has stable `id` for customise + basket wiring.
 */

/** Hero chips (`/?category=&`) use `#${…}` — scroll lands at category pills below the Full menu headline. */
export const MENU_CATEGORY_ANCHOR_ID = "menu-categories";

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
  /** Sandwich toast picker (optional). */
  toastSectionTitle?: string;
  toastChoices?: RollVariantChoice[];
  /** Sauces / spreads for items where flavour is not the primary picker (sandwiches, light breakfast) */
  sauceSectionTitle?: string;
  sauceChoices?: RollVariantChoice[];
  /** Shown above other extras (single row today: chips combo). */
  comboAddOns?: RollAddOn[];
  /**
   * Rendered first in "Ingredients" above "Add extras".
   * Included in bundle sync, pricing, and line detail (e.g. toastie fillings).
   */
  ingredientAddOns?: RollAddOn[];
  milkOptions?: { id: string; label: string; priceCents: number }[];
  /** Infer primary by exact set equality of filling add-ons ↔ variant bundle; `primaryCustomFillVariantId` catches leftovers. */
  primaryInferExactFillings?: boolean;
  /** Fallback primary id when fillings do not match any named combo. */
  primaryCustomFillVariantId?: string;
  addOns?: RollAddOn[];
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
  { id: "full", label: "Full Cream", priceCents: 0 },
  { id: "skim", label: "Skim", priceCents: 0 },
  { id: "soy", label: "Soy", priceCents: 100 },
  { id: "almond", label: "Almond", priceCents: 100 },
  { id: "oat", label: "Oat", priceCents: 100 },
  { id: "lactose", label: "Lactose Free", priceCents: 100 },
];

const COFFEE_DRINK_ADDONS: RollAddOn[] = [
  { id: "extra-shot", name: "Extra Shot", priceCents: 50 },
  { id: "decaf", name: "Decaf", priceCents: 50 },
  { id: "syrup-caramel", name: "Caramel Syrup", priceCents: 100 },
  { id: "syrup-vanilla", name: "Vanilla Syrup", priceCents: 100 },
  { id: "syrup-hazelnut", name: "Hazelnut Syrup", priceCents: 100 },
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

const CHIPS_COMBO_ADDON: RollAddOn = { id: "chips-combo", name: "Chips & Soft Drink Combo", priceCents: 500 };

/** Meaty / mixed deli sandwiches — use "Bacon" when the sandwich does not already list bacon. */
function sandwichMeatSides(bacon: "Bacon" | "Extra Bacon"): RollAddOn[] {
  return [
    { id: "extra-bacon", name: bacon, priceCents: 400 },
    { id: "extra-cheese", name: "Extra Cheese", priceCents: 150 },
    { id: "avocado", name: "Avocado", priceCents: 400 },
    { id: "hash-brown", name: "Hash Brown", priceCents: 500 },
    { id: "extra-chicken", name: "Extra Chicken", priceCents: 500 },
    { id: "extra-schnitzel", name: "Extra Schnitzel", priceCents: 500 },
    { id: "halloumi", name: "Halloumi", priceCents: 450 },
  ];
}

const sandwichVegetarianSides: RollAddOn[] = [
  { id: "extra-cheese", name: "Extra Cheese", priceCents: 150 },
  { id: "avocado", name: "Avocado", priceCents: 400 },
  { id: "hash-brown", name: "Hash Brown", priceCents: 500 },
  { id: "halloumi", name: "Halloumi", priceCents: 450 },
];

const SIDES_GRILLED_CHICKEN_SW = sandwichMeatSides("Bacon");
const SIDES_REUBEN_SW = sandwichMeatSides("Bacon");
const SIDES_MORTADELLA_SW = sandwichMeatSides("Bacon");
const SIDES_MEDITERRANEAN_SW = sandwichVegetarianSides;
const SIDES_BLAT_SW = sandwichMeatSides("Extra Bacon");
const SIDES_CHICKEN_BACON_SW = sandwichMeatSides("Extra Bacon");
const SIDES_SCHNITZEL_SW = sandwichMeatSides("Bacon");

const rm: Record<string, RemovalChoice> = {
  mayo: { id: "no-mayo", name: "No Mayo" },
  cheese: { id: "no-cheese", name: "No Cheese" },
  feta: { id: "no-feta", name: "No Feta" },
  tomato: { id: "no-tomato", name: "No Tomato" },
  lettuce: { id: "no-lettuce", name: "No Lettuce" },
  pesto: { id: "no-pesto", name: "No Pesto" },
  rocket: { id: "no-rocket", name: "No Rocket" },
  pickles: { id: "no-pickles", name: "No Pickles" },
  onion: { id: "no-onion", name: "No Onion" },
  bacon: { id: "no-bacon", name: "No Bacon" },
  avocado: { id: "no-avocado", name: "No Avocado" },
  sauerkraut: { id: "no-sauerkraut", name: "No Sauerkraut" },
  thousandIsland: { id: "no-thousand-island", name: "No Thousand Island Dressing" },
  mozzarella: { id: "no-mozzarella", name: "No Mozzarella" },
  sundriedTomato: { id: "no-sundried-tomato", name: "No Sundried Tomato" },
  zucchini: { id: "no-zucchini", name: "No Zucchini" },
  capsicum: { id: "no-capsicum", name: "No Capsicum (Pepper)" },
  eggplant: { id: "no-eggplant", name: "No Eggplant" },
  mortadella: { id: "no-mortadella", name: "No Mortadella" },
  chicken: { id: "no-chicken", name: "No Chicken" },
  cornedBeef: { id: "no-corned-beef", name: "No Corned Beef" },
  beefPatty: { id: "no-beef-patty", name: "No Beef Patty" },
  specialSauce: { id: "no-special-sauce", name: "No Special Sauce" },
  slaw: { id: "no-slaw", name: "No Slaw" },
  jalapeno: { id: "no-jalapeno", name: "No Jalapeños" },
  chilliMayo: { id: "no-chilli-mayo", name: "No Chilli Mayo" },
  caramelOnion: { id: "no-caramelised-onion", name: "No Caramelised Onion" },
  scrambledEgg: { id: "no-scrambled-egg", name: "No Scrambled Egg" },
  ham: { id: "no-ham", name: "No Ham" },
  sauce: { id: "no-sauce", name: "No Sauce" },
  eggFried: { id: "no-fried-egg", name: "No Fried Egg" },
  spinach: { id: "no-spinach", name: "No Spinach" },
  hashBrown: { id: "no-hash-brown", name: "No Hash Brown" },
  halloumi: { id: "no-halloumi", name: "No Halloumi" },
  schnitzel: { id: "no-schnitzel", name: "No Schnitzel" },
};

/** Hidden primary for burgers / sandwiches / halloumi — ingredients sync as default-on bundles. */
export const STANDARD_BUILD_VARIANT_ID = "std-build";

/** Former “Remove” rows → default-on Ingredients (unchecked = hold / omit, `$0`). */
function includedIngredientsFromRemovals(cores: RemovalChoice[], variantIds: readonly string[]): RollAddOn[] {
  return cores.map((r) => ({
    id: `ing-${r.id}`,
    name: r.name.replace(/^No\s+/i, "").trim(),
    priceCents: 0,
    excludeForVariantIds: [...variantIds],
  }));
}

function burgerSides(bacon: "Bacon" | "Extra Bacon"): RollAddOn[] {
  return [
    { id: "beef-patty", name: "Extra Beef Patty", priceCents: 500 },
    { id: "chicken-protein", name: "Extra Chicken", priceCents: 500 },
    { id: "extra-bacon", name: bacon, priceCents: 400 },
    { id: "cheese", name: "Extra Cheese", priceCents: 150 },
    { id: "hash-brown", name: "Hash Brown", priceCents: 500 },
    { id: "egg", name: "Egg", priceCents: 200 },
    { id: "jalapenos", name: "Jalapeños", priceCents: 100 },
    { id: "caramel-onion", name: "Caramelised Onion", priceCents: 150 },
    { id: "pickles", name: "Extra Pickles", priceCents: 50 },
  ];
}

/** Toastie fillings — order matches modal; exact-set inference maps to named toasties. */
const TOASTIE_FILL_ADDONS: RollAddOn[] = [
  { id: "toastie-avo", name: "Avocado", priceCents: 450, excludeForVariantIds: ["avocado"] },
  { id: "toastie-tomato", name: "Tomato", priceCents: 150, excludeForVariantIds: ["cheese-tomato", "ham-cheese-tomato"] },
  { id: "toastie-ham", name: "Ham", priceCents: 250, excludeForVariantIds: ["ham-cheese", "ham-cheese-tomato"] },
  {
    id: "toastie-cheese",
    name: "Cheese",
    priceCents: 150,
    excludeForVariantIds: ["cheese", "cheese-tomato", "ham-cheese", "ham-cheese-tomato"],
  },
];

const TOASTIE_EXTRA_ADDONS: RollAddOn[] = [{ id: "toastie-extra-cheese", name: "Extra Cheese", priceCents: 150 }];

/** Halloumi wrap lists grilled halloumi + egg etc.; rashers Bacon, extra fried egg wording kept. */
const HALLUMI_WRAP_ADDONS: RollAddOn[] = [
  { id: "avocado", name: "Avocado", priceCents: 400 },
  { id: "extra-bacon", name: "Bacon", priceCents: 400 },
  { id: "extra-egg", name: "Extra Egg", priceCents: 200 },
  { id: "cheese", name: "Cheese", priceCents: 150 },
  { id: "hash-brown", name: "Hash Brown", priceCents: 500 },
];

/** Same ids as bacon & egg roll (variant sync / bundle exclusions). */
const baconEggVariantsRoll: RollVariantChoice[] = [
  { id: "standard", label: "Bacon & Egg Roll", price: "$8.50", priceCents: 850 },
  { id: "double-bacon", label: "Double Bacon & Egg Roll", price: "$12.50", priceCents: 1250 },
  { id: "cheese-hash", label: "With Cheese & Hash Brown", price: "$15.00", priceCents: 1500 },
  {
    id: "monster",
    label: "Monster Roll",
    price: "$18.90",
    priceCents: 1890,
  },
];

const baconEggVariantsWrap: RollVariantChoice[] = [
  { id: "standard", label: "Breakfast Wrap", price: "$8.50", priceCents: 850 },
  { id: "double-bacon", label: "Double Bacon Breakfast Wrap", price: "$12.50", priceCents: 1250 },
  { id: "cheese-hash", label: "With Cheese & Hash Brown", price: "$15.00", priceCents: 1500 },
  {
    id: "monster",
    label: "Monster Wrap",
    price: "$18.90",
    priceCents: 1890,
  },
];

const BACON_EGG_ROLL_ING_VARIANT_IDS = baconEggVariantsRoll.map((v) => v.id);
const BACON_EGG_WRAP_ING_VARIANT_IDS = baconEggVariantsWrap.map((v) => v.id);

const toastieVariants: RollVariantChoice[] = [
  { id: "cheese", label: "Cheese Toastie", price: "$8.00", priceCents: 800 },
  { id: "cheese-tomato", label: "Cheese & Tomato Toastie", price: "$8.00", priceCents: 800 },
  { id: "ham-cheese", label: "Ham & Cheese Toastie", price: "$8.00", priceCents: 800 },
  { id: "ham-cheese-tomato", label: "Ham, Cheese & Tomato Toastie", price: "$8.00", priceCents: 800 },
  { id: "avocado", label: "Avocado Toastie", price: "$8.00", priceCents: 800 },
  { id: "toastie-custom", label: "Custom Combination", price: "$8.00", priceCents: 800 },
];

/** Rolls + parity wraps share these rows; bundle rows follow `excludeForVariantIds`. */
const baconEggStyleAddOns: RollAddOn[] = [
  { id: "extra-bacon", name: "Extra Bacon", priceCents: 400, excludeForVariantIds: ["double-bacon", "monster"] },
  { id: "extra-egg", name: "Extra Egg", priceCents: 200, excludeForVariantIds: ["monster"] },
  { id: "cheese", name: "Cheese", priceCents: 150, excludeForVariantIds: ["cheese-hash", "monster"] },
  { id: "hash-brown", name: "Hash Brown", priceCents: 500, excludeForVariantIds: ["cheese-hash", "monster"] },
];

const SAUCE_INCLUDED = "Included";

/** Breakfast savoury picks that default open to BBQ in the customise modal. */
const breakfastSauceBbqDefault: RollVariantChoice[] = [
  { id: "sauce-bbq", label: "BBQ Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

const breakfastSauceNoDefault: RollVariantChoice[] = [
  { id: "sauce-none", label: "No Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
];

/** Toastie only — right column stays empty at $0 like milk (no "Included" wording). */
const toastieSauceChoices: RollVariantChoice[] = [
  { id: "sauce-none", label: "No Sauce", price: "", priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato Sauce", price: "", priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ Sauce", price: "", priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: "", priceCents: 0 },
];

const sandwichSauceMayoDefault: RollVariantChoice[] = [
  { id: "sauce-mayo", label: "Mayo (As Listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

/** Chicken + bacon build: BBQ reads more natural than mayo as the first tap. */
const sandwichSauceChickenBaconDefault: RollVariantChoice[] = [
  { id: "sauce-bbq", label: "BBQ Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo (As Listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

const sandwichSauceThousandIslandDefault: RollVariantChoice[] = [
  { id: "sauce-ti", label: "Thousand Island (As Listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No Dressing / Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

const sandwichSaucePestoDefault: RollVariantChoice[] = [
  { id: "sauce-pesto", label: "Basil Pesto (As Listed)", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-tomato", label: "Tomato Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-bbq", label: "BBQ Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-mayo", label: "Mayo", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-none", label: "No Sauce / Spread", price: SAUCE_INCLUDED, priceCents: 0 },
];

const burgerSauceAmount: RollVariantChoice[] = [
  { id: "sauce-amt-standard", label: "Standard Amount", price: SAUCE_INCLUDED, priceCents: 0 },
  { id: "sauce-amt-light", label: "Light On Sauce", price: SAUCE_INCLUDED, priceCents: 0 },
];

type BurgerSauceListed = "special" | "chilli-mayo" | "mayo";

function burgerSaucePrimaries(baseCents: number, priceLabel: string, listed: BurgerSauceListed): RollVariantChoice[] {
  const specialAsListed: RollVariantChoice = {
    id: "sauce-as-listed",
    label: "Special Sauce (As Listed)",
    price: priceLabel,
    priceCents: baseCents,
  };
  const asListedChilliOrMayo: RollVariantChoice =
    listed === "chilli-mayo"
      ? { id: "sauce-as-listed", label: "Chilli Mayo (As Listed)", price: priceLabel, priceCents: baseCents }
      : { id: "sauce-as-listed", label: "Mayo (As Listed)", price: priceLabel, priceCents: baseCents };

  if (listed === "special") {
    return [
      specialAsListed,
      { id: "sauce-bbq", label: "BBQ Sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-tomato", label: "Tomato Sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-mayo", label: "Mayo", price: priceLabel, priceCents: baseCents },
      { id: "sauce-none", label: "No Sauce", price: priceLabel, priceCents: baseCents },
    ];
  }

  if (listed === "chilli-mayo") {
    return [
      asListedChilliOrMayo,
      { id: "sauce-tomato", label: "Tomato Sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-bbq", label: "BBQ Sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-mayo", label: "Mayo", price: priceLabel, priceCents: baseCents },
      { id: "sauce-none", label: "No Sauce", price: priceLabel, priceCents: baseCents },
    ];
  }

  if (listed === "mayo") {
    return [
      asListedChilliOrMayo,
      { id: "sauce-tomato", label: "Tomato Sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-bbq", label: "BBQ Sauce", price: priceLabel, priceCents: baseCents },
      { id: "sauce-none", label: "No Sauce", price: priceLabel, priceCents: baseCents },
    ];
  }

  const _unexpected: never = listed;
  throw new Error(`Unhandled burger sauce preset: ${String(_unexpected)}`);
}

function burgerCustom(
  baseCents: number,
  priceLabel: string,
  listedSauce: BurgerSauceListed,
  coreIngredients: RemovalChoice[],
  burgerExtras: RollAddOn[],
): ItemCustomizationConfig {
  const sauceAsIncluded = burgerSaucePrimaries(baseCents, priceLabel, listedSauce).map((c) => ({
    ...c,
    price: SAUCE_INCLUDED,
    priceCents: 0,
  }));
  return {
    primaryChoices: [{ id: STANDARD_BUILD_VARIANT_ID, label: "As Listed", price: priceLabel, priceCents: baseCents }],
    ingredientAddOns: includedIngredientsFromRemovals(coreIngredients, [STANDARD_BUILD_VARIANT_ID]),
    secondarySectionTitle: "How Much Sauce",
    secondaryChoices: burgerSauceAmount,
    sauceSectionTitle: "Sauce",
    sauceChoices: sauceAsIncluded,
    comboAddOns: [CHIPS_COMBO_ADDON],
    addOns: burgerExtras,
  };
}

const coffeeStyle = (sizes: RollVariantChoice[]): ItemCustomizationConfig => ({
  primarySectionTitle: "Choose Size",
  primaryChoices: sizes,
  milkOptions: MILK_STANDARD,
  addOns: COFFEE_DRINK_ADDONS,
});

function sandwichCustom(
  baseCents: number,
  priceLabel: string,
  addOns: RollAddOn[],
  coreIngredients: RemovalChoice[],
  sauceChoices: RollVariantChoice[],
): ItemCustomizationConfig {
  return {
    primaryChoices: [{ id: STANDARD_BUILD_VARIANT_ID, label: "As Listed", price: priceLabel, priceCents: baseCents }],
    toastSectionTitle: "Toast Level",
    toastChoices: [
      { id: "toast-std", label: "Standard Toast", price: priceLabel, priceCents: baseCents },
      { id: "toast-crisp", label: "Extra Crispy Toast", price: priceLabel, priceCents: baseCents },
    ],
    sauceSectionTitle: "Sauce",
    sauceChoices,
    comboAddOns: [CHIPS_COMBO_ADDON],
    ingredientAddOns: includedIngredientsFromRemovals(coreIngredients, [STANDARD_BUILD_VARIANT_ID]),
    addOns,
  };
}

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
          primarySectionTitle: "Choose Version",
          primaryChoices: baconEggVariantsRoll,
          ingredientAddOns: includedIngredientsFromRemovals([rm.bacon, rm.eggFried], BACON_EGG_ROLL_ING_VARIANT_IDS),
          addOns: baconEggStyleAddOns,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceBbqDefault,
        },
      },
      {
        id: "breakfast-wrap",
        name: "Breakfast Wrap",
        description: "Bacon, scrambled egg and cheese.",
        price: "From $8.50",
        customization: {
          primarySectionTitle: "Choose Version",
          primaryChoices: baconEggVariantsWrap,
          ingredientAddOns: includedIngredientsFromRemovals(
            [rm.bacon, rm.scrambledEgg, rm.cheese],
            BACON_EGG_WRAP_ING_VARIANT_IDS,
          ),
          addOns: baconEggStyleAddOns,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceBbqDefault,
        },
      },
      {
        id: "halloumi-breakfast-wrap",
        name: "Halloumi Breakfast Wrap",
        description: "Grilled halloumi, fried egg, hash brown and spinach.",
        price: "$12.00",
        basePriceCents: 1200,
        customization: {
          primaryChoices: [{ id: STANDARD_BUILD_VARIANT_ID, label: "As Listed", price: "$12.00", priceCents: 1200 }],
          ingredientAddOns: includedIngredientsFromRemovals(
            [rm.halloumi, rm.eggFried, rm.hashBrown, rm.spinach],
            [STANDARD_BUILD_VARIANT_ID],
          ),
          addOns: HALLUMI_WRAP_ADDONS,
          sauceSectionTitle: "Sauce",
          sauceChoices: breakfastSauceBbqDefault,
        },
      },
      {
        id: "toastie",
        name: "Toasties",
        description: "Cheese; cheese & tomato; ham & cheese; ham, cheese & tomato; avocado.",
        price: "From $8.00",
        basePriceCents: 800,
        customization: {
          primarySectionTitle: "Choose Version",
          primaryChoices: toastieVariants,
          primaryInferExactFillings: true,
          primaryCustomFillVariantId: "toastie-custom",
          ingredientAddOns: TOASTIE_FILL_ADDONS,
          addOns: TOASTIE_EXTRA_ADDONS,
          toastSectionTitle: "Toast Level",
          toastChoices: [
            { id: "toast-std", label: "Standard Toast", price: "", priceCents: 0 },
            { id: "toast-crisp", label: "Extra Crispy Toast", price: "", priceCents: 0 },
          ],
          sauceSectionTitle: "Sauce",
          sauceChoices: toastieSauceChoices,
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
        description: "Grilled chicken, avocado, lettuce, cheese and mayo.",
        price: "$13.50",
        popular: true,
        basePriceCents: 1350,
        customization: sandwichCustom(1350, "$13.50", SIDES_GRILLED_CHICKEN_SW, [rm.chicken, rm.avocado, rm.lettuce, rm.cheese], sandwichSauceMayoDefault),
      },
      {
        id: "reuben-sandwich",
        name: "Reuben Sandwich",
        description: "Corned beef, Swiss cheese, sauerkraut, gherkins, Thousand Island dressing.",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          1350,
          "$13.50",
          SIDES_REUBEN_SW,
          [rm.cornedBeef, rm.cheese, rm.sauerkraut, rm.pickles],
          sandwichSauceThousandIslandDefault,
        ),
      },
      {
        id: "mortadella-sandwich",
        name: "Mortadella Sandwich",
        description: "Mortadella, mozzarella, basil pesto, sundried tomato.",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          1350,
          "$13.50",
          SIDES_MORTADELLA_SW,
          [rm.mortadella, rm.mozzarella, rm.sundriedTomato],
          sandwichSaucePestoDefault,
        ),
      },
      {
        id: "mediterranean-veggie-sandwich",
        name: "Mediterranean Veggie Sandwich",
        description: "Grilled zucchini, roasted capsicum, eggplant, feta, basil pesto, rocket.",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          1350,
          "$13.50",
          SIDES_MEDITERRANEAN_SW,
          [rm.zucchini, rm.capsicum, rm.eggplant, rm.feta, rm.rocket],
          sandwichSaucePestoDefault,
        ),
      },
      {
        id: "blat",
        name: "BLAT",
        description: "Bacon, lettuce, avocado, tomato and mayo.",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(1350, "$13.50", SIDES_BLAT_SW, [rm.bacon, rm.lettuce, rm.avocado, rm.tomato], sandwichSauceMayoDefault),
      },
      {
        id: "chicken-bacon-sandwich",
        name: "Chicken Bacon Sandwich",
        description: "Lettuce, tomato and mayo.",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          1350,
          "$13.50",
          SIDES_CHICKEN_BACON_SW,
          [rm.chicken, rm.bacon, rm.lettuce, rm.tomato],
          sandwichSauceChickenBaconDefault,
        ),
      },
      {
        id: "chicken-schnitzel-sandwich",
        name: "Chicken Schnitzel Sandwich",
        description: "Lettuce, tomato and mayo.",
        price: "$13.50",
        basePriceCents: 1350,
        customization: sandwichCustom(
          1350,
          "$13.50",
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
        description: "Beef patty, double cheese, tomato, pickles with special sauce.",
        price: "$12.90",
        basePriceCents: 1290,
        customization: burgerCustom(1290, "$12.90", "special", [rm.beefPatty, rm.cheese, rm.tomato, rm.pickles], burgerSides("Bacon")),
      },
      {
        id: "cj-special-burger",
        name: "CJ Special Burger",
        description: "Double beef, double cheese, bacon, caramelised onion, tomato, pickles, special sauce.",
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
        ], burgerSides("Extra Bacon")),
      },
      {
        id: "crispy-chicken-burger",
        name: "Crispy Chicken Burger",
        description: "Fried chicken, slaw, jalapeño with chilli mayo.",
        price: "$13.90",
        basePriceCents: 1390,
        customization: burgerCustom(1390, "$13.90", "chilli-mayo", [rm.chicken, rm.slaw, rm.jalapeno], burgerSides("Bacon")),
      },
      {
        id: "grilled-chicken-burger",
        name: "Grilled Chicken Burger",
        description: "Grilled chicken, tomato, lettuce, cheese with mayo.",
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
        description: "Small, large or jumbo.",
        price: "$4.50 / $5.00 / $6.00",
        popular: true,
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "latte",
        name: "Latte",
        description: "Small, large or jumbo.",
        price: "$4.50 / $5.00 / $6.00",
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Small, large or jumbo.",
        price: "$4.50 / $5.00 / $6.00",
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "long-black",
        name: "Long Black",
        description: "Small, large or jumbo.",
        price: "$4.50 / $5.00 / $6.00",
        customization: coffeeStyle(COFFEE_SIZES_STANDARD),
      },
      {
        id: "mocha",
        name: "Mocha",
        description: "Small, large or jumbo.",
        price: "$5.00 / $5.50 / $6.50",
        customization: coffeeStyle(MOCHA_SIZES),
      },
    ],
  },
  {
    id: "hot-drinks",
    label: "Hot Drinks",
    items: [
      {
        id: "hot-chocolate",
        name: "Hot Chocolate",
        description: "Small, large or jumbo.",
        price: "$5.00 / $5.50 / $6.50",
        customization: coffeeStyle(MOCHA_SIZES),
      },
      {
        id: "chai-latte",
        name: "Chai Latte",
        description: "Small, large or jumbo.",
        price: "$5.00 / $5.50 / $6.50",
        customization: coffeeStyle(MOCHA_SIZES),
      },
      {
        id: "matcha-latte",
        name: "Matcha Latte",
        description: "Small, large or jumbo.",
        price: "$6.00 / $6.50 / $7.00",
        customization: coffeeStyle(MATCHA_SIZES),
      },
      {
        id: "tea-pot",
        name: "Tea",
        description: "English Breakfast, Earl Grey, peppermint, green tea, chamomile.",
        price: "$5.00",
        basePriceCents: 500,
        customization: {
          milkOptions: MILK_STANDARD,
          addOns: COFFEE_DRINK_ADDONS.filter((a) => !["extra-shot", "decaf"].includes(a.id)),
        },
      },
    ],
  },
  {
    id: "cold-drinks",
    label: "Cold Drinks",
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
    description: "Crispy bacon, fried egg and sauce. Customise for monster roll, double bacon, cheese and hash.",
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
