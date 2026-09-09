"use client";

import { CategoryRail } from "@/components/kiosk/booking/step-rail";
import { MenuItemCard } from "@/components/kiosk/order/menu-item-card";
import { ProductImage } from "@/components/kiosk/store/product-image";
import { MENU_CATEGORIES, MENU_DESTINATIONS, type MenuItem } from "@/data/menu-catalog";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * The store landing screen — what "Shop Food & Gear" opens onto.
 *
 * Distinct from `MenuScreen`, which browses one category. This one is a
 * merchandising surface: a promo, a short set of shortcuts, and one featured
 * row. It exists because the rail alone answers "where do I go" but nothing
 * answers "what is worth buying today", and a kiosk gets one screen to say so
 * before the user commits to a category.
 *
 * It reuses the same `CategoryRail` and the same `MenuItemCard` as the browse
 * screen, so the rail geometry and the tile treatment stay one set of numbers.
 * `POPULAR_MIX` deliberately draws across every category — a home grid that
 * only showed sandwiches would be a category page with a different heading.
 * The greeting is a prop rather than derived from the clock: the time of day a
 * screenshot is taken should not change what QA is diffing.
 */

export interface HomeTile {
    /** Category the tile jumps to. Not unique — two tiles may target one category. */
    categoryId: string;
    label: string;
    /** Base-relative catalogue path, resolved by `ProductImage`. */
    image?: string;
}

export interface HomePromo {
    /** Full-width banner artwork, used whole. */
    banner: string;
    /** Accessible name — the banner carries its own words as pixels. */
    alt: string;
    /** Where tapping it goes. */
    categoryId?: string;
}

/**
 * The supplied Links Drinks banner, used as one piece.
 *
 * It replaced a composed band — eyebrow, title, body, and the can in a square
 * crop — which cut the can off top and bottom, because a 504x750 pack shot does
 * not fit a 126px square. The artwork is a single composition and survives
 * being treated as one.
 */
const DEFAULT_PROMO: HomePromo = {
    banner: "screen-assets/store/promo-transfusion.png",
    alt: "Links Drinks Transfusion — ready-to-drink cocktail, for the course and beyond",
    categoryId: "alcohol",
};

/**
 * A cross-category spread for the home grid.
 *
 * Picked by hand rather than sliced off the front of `MENU_ITEMS`, which is
 * ordered by category and would have shown twenty-four sandwiches. Ordered so
 * the first row alone already spans food, drink and alcohol.
 */
export const POPULAR_MIX_IDS = [
    "cheeseburger", "domestic-beer", "bottle-of-water",
    "chicken-sandwich", "aperol-spritz", "soda",
    "french-fries", "craft-beer", "coffee",
    "soft-pretzel", "wine", "orange-juice",
    "hot-dog", "moscow-mule", "sports-drink",
    "potato-chips", "transfusion-classic", "iced-tea",
    "cookie", "old-fashioned", "energy-drink",
    "mms", "mango-margarita", "milkshake",
] as const;

const DEFAULT_TILES: HomeTile[] = [
    { categoryId: "alcohol", label: "Alcohol", image: "menu-images/domestic-beer.webp" },
    { categoryId: "sandwiches", label: "Quick Eats", image: "menu-images/mms.webp" },
    { categoryId: "sandwiches", label: "Sandwiches", image: "menu-images/chicken-sandwich.webp" },
    { categoryId: "beverages", label: "Beverages", image: "menu-images/bottle-of-water.webp" },
];

export const HomeScreen = ({
    greeting = "Good Morning.",
    subtitle = "Browse between categories below",
    promo = DEFAULT_PROMO,
    tiles = DEFAULT_TILES,
    featuredTitle,
    featuredItems = [],
    onSelectCategory,
    onSelectItem,
    className,
}: {
    greeting?: string;
    subtitle?: string;
    promo?: HomePromo | null;
    tiles?: HomeTile[];
    featuredTitle?: string;
    featuredItems?: MenuItem[];
    onSelectCategory?: (categoryId: string) => void;
    onSelectItem?: (item: MenuItem) => void;
    className?: string;
}) => (
    <div className={cx("relative flex h-full w-full flex-col", className)}>
        <CategoryRail
            destinations={[...MENU_DESTINATIONS]}
            categories={[...MENU_CATEGORIES]}
            onSelect={onSelectCategory}
            logoSrc={assetUrl("screen-assets/brand/hero-logo.svg")}
            className="top-12"
        />

        <div className="flex flex-col gap-4 pt-14 pr-8 pl-[232px]">
            <h1 className="text-[44px] leading-none font-bold text-primary">{greeting}</h1>
            <p className="text-[17px] text-tertiary">{subtitle}</p>
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-8 pb-8 pl-[232px] scrollbar-hide">
            {promo && (
                <button
                    type="button"
                    onClick={() => onSelectCategory?.(promo.categoryId ?? "deals")}
                    className="block w-full overflow-hidden rounded-2xl ring-1 ring-border-secondary transition duration-100 ease-linear active:scale-[0.99]"
                >
                    {/* Native aspect, so nothing is cut. Cropping it to the
                        150 of a tile row loses the logo off the top and the
                        can's base off the bottom — the artwork has no dead
                        margin to give. */}
                    <img src={assetUrl(promo.banner)} alt={promo.alt} className="block w-full" />
                </button>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4">
                {tiles.map((tile) => (
                    <button
                        key={tile.label}
                        type="button"
                        onClick={() => onSelectCategory?.(tile.categoryId)}
                        className="flex h-[150px] items-center gap-2 overflow-hidden rounded-2xl bg-primary p-3 text-left ring-1 ring-border-secondary transition duration-100 ease-linear active:scale-[0.98] active:bg-secondary"
                    >
                        {/* Fixed label column rather than flex-1. A category name
                            is one long word as often as not, and an unbreakable
                            word in an auto-sized column runs under the artwork
                            instead of wrapping — "Sandwiches" did exactly that. */}
                        <span className="w-[112px] shrink-0 text-[19px] leading-tight font-semibold text-primary">{tile.label}</span>
                        <ProductImage src={tile.image} alt={tile.label} className="size-[88px] shrink-0 rounded-xl bg-transparent" />
                    </button>
                ))}
            </div>

            {featuredItems.length > 0 && (
                <>
                    <h2 className="mt-8 text-[26px] leading-none font-bold text-primary">{featuredTitle ?? "Featured"}</h2>
                    {/* Three across, so a long list reads as a browsable grid
                        rather than a row that runs out of screen. The body
                        already scrolls, so length is the caller's call. */}
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {featuredItems.map((item) => (
                            <MenuItemCard key={item.id} item={item} onSelect={onSelectItem} />
                        ))}
                    </div>
                </>
            )}
        </div>
    </div>
);
