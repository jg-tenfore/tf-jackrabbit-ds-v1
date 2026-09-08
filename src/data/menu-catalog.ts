import type { ProShopProduct } from "@/data/pro-shop-types";

/**
 * Rail icon path for a category or destination.
 *
 * Base-relative, like every other catalogue path — the rail resolves it through
 * `assetUrl`, which is what makes these survive being served from a Pages
 * subpath.
 */
const icon = (name: string) => `screen-assets/store/${name}.png`;

/**
 * Food & beverage catalogue.
 *
 * Every item has a real photograph on a **white ground**, built by
 * `scripts/build-menu-images.mjs` from `references/food-imagery`,
 * `references/cocktails` and the food shots in `references/pos-item-imagery`.
 * The white ground is enforced in the build rather than trusted: these sit on
 * white cards, and a cut-out on grey reads as broken rather than as a
 * photograph — invisible in a contact sheet, obvious on a 750px panel.
 *
 * The catalogue is shaped by what the captures actually contain rather than by
 * a wishlist, which is why there is a quesadilla and no BLT.
 *
 * It uses the same `ProShopProduct` shape as the pro-shop catalogue so both
 * feed the same card and grid components.
 */
export interface MenuItem extends Omit<ProShopProduct, "image"> {
    /**
     * Optional, unlike the generated pro-shop catalogue where every row is
     * derived from a photograph that exists. An item can be added ahead of its
     * shot, and `ProductImage` renders its own empty state rather than a 404.
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
    // Hot food
    item("cheeseburger", "Cheeseburger", "sandwiches", 1499, 1000),
    item("chicken-sandwich", "Chicken Sandwich", "sandwiches", 1399, 890),
    item("pulled-pork-sandwich", "Pulled Pork Sandwich", "sandwiches", 1449, 950),
    item("hot-dog", "Hot Dog", "sandwiches", 899, 380),
    item("grilled-cheese", "Grilled Cheese", "sandwiches", 999, 640),
    item("quesadilla", "Chicken Quesadilla", "sandwiches", 1299, 780),
    item("french-fries", "French Fries", "sandwiches", 599, 420),
    item("soft-pretzel", "Soft Pretzel", "sandwiches", 699, 480),

    // Snacks, folded into the same rail row
    item("potato-chips", "Cape Cod Chips", "sandwiches", 299, 240),
    item("kettle-chips", "Utz Kettle Chips", "sandwiches", 299, 250),
    item("pretzel-crisps", "Pretzel Crisps", "sandwiches", 349, 220),
    item("popcorn", "SkinnyPop Popcorn", "sandwiches", 299, 150),
    item("takis", "Takis", "sandwiches", 325, 280),
    item("hummus", "Hummus Cup", "sandwiches", 599, 310),
    item("mms", "M&M's", "sandwiches", 325, 240),
    item("snickers", "Snickers", "sandwiches", 325, 250),
    item("chocolate-bar", "Hershey's Bar", "sandwiches", 275, 220),
    item("peanut-butter-cups", "Reese's Sticks", "sandwiches", 275, 220),
    item("granola-bar", "Granola Bar", "sandwiches", 275, 100),
    item("cookie", "Chocolate Chip Cookie", "sandwiches", 350, 300),
    item("fruit-cup", "Fruit Cup", "sandwiches", 599, 90),

    // Beverages
    item("bottle-of-water", "Bottle of Water", "beverages", 250, 0),
    item("soda", "Fountain Soda", "beverages", 300, 140),
    item("lemon-lime-soda", "Lemon-Lime Soda", "beverages", 300, 140),
    item("sports-drink", "Sports Drink", "beverages", 450, 140),
    item("iced-tea", "Iced Tea", "beverages", 375, 90),
    item("coffee", "Coffee", "beverages", 325, 5),
    item("energy-drink", "Energy Drink", "beverages", 550, 210),
    item("orange-juice", "Orange Juice", "beverages", 475, 160),
    item("milkshake", "Milkshake", "beverages", 699, 550),
    item("transfusion", "Transfusion", "beverages", 1200, 220),

    // Beer, wine and cocktails share a rail row; the sub-filters separate them
    item("domestic-beer", "Domestic Beer", "beer", 700, 150),
    item("craft-beer", "Craft Beer", "beer", 900, 210),
    item("hard-seltzer", "Hard Seltzer", "beer", 800, 100),
    item("wine", "Wine", "beer", 1100, 125),
    item("aperol-spritz", "Aperol Spritz", "beer", 1300, 180),
    item("old-fashioned", "Old Fashioned", "beer", 1400, 200),
    item("negroni", "Negroni", "beer", 1400, 210),
    item("whiskey-sour", "Whiskey Sour", "beer", 1300, 190),
    item("moscow-mule", "Moscow Mule", "beer", 1300, 180),
    item("gin-and-tonic", "Gin & Tonic", "beer", 1200, 170),
    item("vodka-tonic", "Vodka Tonic", "beer", 1200, 170),
    item("cosmopolitan", "Cosmopolitan", "beer", 1300, 200),
    item("mango-margarita", "Mango Margarita", "beer", 1400, 260),
    item("paloma", "Paloma", "beer", 1300, 190),
    item("cape-codder", "Cape Codder", "beer", 1200, 170),
    item("mimosa", "Mimosa", "beer", 1100, 130),
    item("strawberry-daiquiri", "Strawberry Daiquiri", "beer", 1400, 300),
    item("lemon-drop-martini", "Lemon Drop Martini", "beer", 1400, 220),
    item("bloody-mary", "Bloody Mary", "beer", 1200, 200),
];

/**
 * Categories, in rail order — the six the reference rail draws.
 *
 * Snacks and cocktails are folded into Sandwiches and Beer rather than given
 * rows of their own. The rail is the one piece of chrome a standing user scans
 * top to bottom before touching anything, so it is worth keeping short; the
 * sub-filters above the grid are where those items get separated again.
 *
 * Golf Balls, Memberships and Clothes come from the pro-shop side of the same
 * kiosk — the references show food and merchandise in one rail, because a guest
 * buying a sandwich and a sleeve of balls is doing one shop, not two.
 */
export const MENU_CATEGORIES = [
    { id: "sandwiches", label: "Sandwiches", iconSrc: icon("sandwiches") },
    { id: "beer", label: "Beer", iconSrc: icon("beer") },
    { id: "beverages", label: "Beverages", iconSrc: icon("beverages") },
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
    sandwiches: ["All", "Hot", "Snacks", "Sweet"],
    beverages: ["All", "Water", "Soft Drinks", "Juices", "Energy Drinks"],
    beer: ["All", "Domestic", "Craft", "Seltzer", "Wine", "Cocktails"],
};

export const itemsInCategory = (categoryId: string) => MENU_ITEMS.filter((i) => i.category === categoryId);
