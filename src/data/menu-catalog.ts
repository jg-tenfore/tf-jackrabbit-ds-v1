import type { ProShopProduct } from "@/data/pro-shop-types";

/**
 * Rail icon path for a category or destination.
 *
 * Base-relative, like every other catalogue path — `ProductImage` and the rail
 * both resolve it through `assetUrl`, which is what makes these survive being
 * served from a Pages subpath.
 */
const icon = (name: string) => `screen-assets/store/${name}.png`;

/**
 * Food & beverage catalogue.
 *
 * Every item here has a real photograph, built from the food shots in
 * `references/pos-item-imagery` by `scripts/build-menu-images.mjs`. The
 * catalogue was previously hand-written placeholders pointing at a
 * `menu-images/` folder that did not exist; it is now shaped **by what the
 * capture actually contains**, which is why the sandwiches gave way to a hot
 * dog, a cheeseburger and a pretzel.
 *
 * It deliberately uses the same `ProShopProduct` shape as the pro-shop
 * catalogue so both feed the same card and grid components.
 *
 * `image` is optional. An item added ahead of its photography renders
 * `ProductImage`'s empty state rather than a 404 and a broken-image glyph.
 */
export interface MenuItem extends Omit<ProShopProduct, "image"> {
    /**
     * Optional here, unlike the generated pro-shop catalogue where every row is
     * derived from a photograph that exists. A menu item can legitimately be
     * added ahead of its shot, and `ProductImage` renders its own empty state
     * rather than a 404 and a broken-image glyph.
     */
    image?: string;
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
    /** Set false for an item whose photography has not landed yet. */
    hasImage = true,
): MenuItem => ({
    id,
    name,
    brand: "",
    model: name,
    packaging: "single",
    category,
    priceCents,
    calories,
    image: hasImage ? `menu-images/${id}.webp` : undefined,
});

export const MENU_ITEMS: MenuItem[] = [
    item("cheeseburger", "Cheeseburger", "sandwiches", 1499, 1000),
    item("hot-dog", "Hot Dog", "sandwiches", 899, 380),
    item("soft-pretzel", "Soft Pretzel", "sandwiches", 699, 480),

    item("potato-chips", "Potato Chips", "snacks", 299, 240),
    item("snickers", "Snickers", "snacks", 325, 250),
    item("granola-bar", "Granola Bar", "snacks", 275, 100),
    item("cookie", "Chocolate Chip Cookie", "snacks", 350, 300),
    item("fruit-cup", "Fruit Cup", "snacks", 599, 90),

    item("bottle-of-water", "Bottle of Water", "beverages", 250, 0),
    item("sports-drink", "Sports Drink", "beverages", 450, 140),
    item("soda", "Fountain Soda", "beverages", 300, 140),
    item("iced-tea", "Iced Tea", "beverages", 375, 90),
    item("coffee", "Coffee", "beverages", 325, 5),
    item("energy-drink", "Energy Drink", "beverages", 550, 210),
    item("orange-juice", "Orange Juice", "beverages", 475, 160),
    item("transfusion", "Transfusion", "beverages", 1200, 220),

    item("domestic-beer", "Domestic Beer", "beer", 700, 150),
    item("craft-beer", "Craft Beer", "beer", 900, 210),
    item("hard-seltzer", "Hard Seltzer", "beer", 800, 100),

    item("wine", "Wine", "cocktails", 1100, 125),
    item("cocktail", "Cocktail", "cocktails", 1300, 180),
    item("bloody-mary", "Bloody Mary", "cocktails", 1200, 200),
];

/**
 * Categories, in rail order.
 *
 * Golf Balls, Memberships and Clothes come from the pro-shop side of the same
 * kiosk — the references show food and merchandise in one rail, because a
 * guest buying a sandwich and a sleeve of balls is doing one shop, not two.
 */
export const MENU_CATEGORIES = [
    { id: "sandwiches", label: "Sandwiches", iconSrc: icon("sandwiches") },
    { id: "beer", label: "Beer", iconSrc: icon("beer") },
    { id: "cocktails", label: "Cocktails", iconSrc: icon("beer") },
    { id: "beverages", label: "Beverages", iconSrc: icon("beverages") },
    { id: "snacks", label: "Snacks", iconSrc: icon("sandwiches") },
    { id: "golf-balls", label: "Golf Balls", iconSrc: icon("golf-balls") },
    { id: "memberships", label: "Memberships", iconSrc: icon("memberships") },
    { id: "clothes", label: "Clothes", iconSrc: icon("clothes") },
] as const;

/** The rail's upper group — destinations rather than categories. */
export const MENU_DESTINATIONS = [
    { id: "home", label: "Home", iconSrc: icon("home") },
    { id: "deals", label: "Deals", iconSrc: icon("deals") },
    { id: "members", label: "Members", iconSrc: icon("members") },
    { id: "recent", label: "Recent & Favs", iconSrc: icon("recent") },
] as const;

/** Sub-filters offered above the grid, per category. */
export const MENU_SUBFILTERS: Record<string, string[]> = {
    sandwiches: ["All", "Hot", "Cold", "Vegetarian"],
    beverages: ["All", "Water", "Soft Drinks", "Juices", "Energy Drinks"],
    beer: ["All", "Domestic", "Craft", "Seltzer"],
    cocktails: ["All", "Wine", "Mixed"],
    snacks: ["All", "Sweet", "Savory"],
};

export const itemsInCategory = (categoryId: string) => MENU_ITEMS.filter((i) => i.category === categoryId);
