import type { ProShopProduct } from "@/data/pro-shop-types";

/**
 * Food & beverage catalogue.
 *
 * Hand-written rather than generated, unlike the pro-shop catalogue, because
 * there is no source capture to derive it from yet. It deliberately uses the
 * same `ProShopProduct` shape so both feed the same card and grid components,
 * and so a future `build-menu-images` script can replace this file wholesale
 * the way `build-pos-images` replaces the pro-shop one.
 *
 * `image` paths point at `menu-images/` and do not exist yet — food exports are
 * still outstanding. `ProductImage` renders its own empty state for a missing
 * file rather than a broken-image glyph, so the screens are reviewable now and
 * the swap is a drop-in later.
 */
export interface MenuItem extends ProShopProduct {
    /** Shown under the name, as the references draw it. */
    calories?: number;
    /** Chosen modifiers, e.g. "No Pickles, Extra Mayo". */
    modifiers?: string[];
}

const item = (
    id: string,
    name: string,
    category: string,
    priceCents: number,
    calories: number,
    packaging: MenuItem["packaging"] = "single",
): MenuItem => ({
    id,
    name,
    brand: "",
    model: name,
    packaging,
    category,
    priceCents,
    calories,
    image: `menu-images/${id}.webp`,
});

export const MENU_ITEMS: MenuItem[] = [
    item("fried-chicken-sandwich", "Fried Chicken Sandwich", "sandwiches", 1499, 1000),
    item("turkey-club-sandwich", "Turkey Club Sandwich", "sandwiches", 1319, 1000),
    item("blt-sandwich", "BLT Sandwich", "sandwiches", 1199, 820),
    item("grilled-cheese", "Grilled Cheese", "sandwiches", 899, 640),

    item("bottle-of-water", "Bottle of Water", "beverages", 250, 0),
    item("sports-drink", "Sports Drink", "beverages", 450, 140),
    item("iced-tea", "Iced Tea", "beverages", 375, 90),
    item("transfusion", "Transfusion", "beverages", 1200, 220),

    item("domestic-beer", "Domestic Beer", "beer", 700, 150),
    item("ipa", "Local IPA", "beer", 900, 210),

    item("mms", "M & M's", "snacks", 325, 240, "single"),
    item("trail-mix", "Trail Mix", "snacks", 425, 310),
    item("beef-jerky", "Beef Jerky", "snacks", 675, 180),
];

/**
 * Categories, in rail order.
 *
 * Golf Balls, Memberships and Clothes come from the pro-shop side of the same
 * kiosk — the references show food and merchandise in one rail, because a
 * guest buying a sandwich and a sleeve of balls is doing one shop, not two.
 */
export const MENU_CATEGORIES = [
    { id: "sandwiches", label: "Sandwiches" },
    { id: "beer", label: "Beer" },
    { id: "beverages", label: "Beverages" },
    { id: "snacks", label: "Snacks" },
    { id: "golf-balls", label: "Golf Balls" },
    { id: "memberships", label: "Memberships" },
    { id: "clothes", label: "Clothes" },
] as const;

/** The rail's upper group — destinations rather than categories. */
export const MENU_DESTINATIONS = [
    { id: "home", label: "Home" },
    { id: "deals", label: "Deals" },
    { id: "members", label: "Members" },
    { id: "recent", label: "Recent & Favs" },
] as const;

/** Sub-filters offered above the grid, per category. */
export const MENU_SUBFILTERS: Record<string, string[]> = {
    sandwiches: ["All", "Hot", "Cold", "Vegetarian"],
    beverages: ["All", "Water", "Soft Drinks", "Juices", "Energy Drinks"],
    beer: ["All", "Domestic", "Craft", "Light"],
    snacks: ["All", "Sweet", "Savory"],
};

export const itemsInCategory = (categoryId: string) => MENU_ITEMS.filter((i) => i.category === categoryId);
