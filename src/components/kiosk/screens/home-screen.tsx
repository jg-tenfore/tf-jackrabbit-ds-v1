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
    eyebrow?: string;
    title: string;
    body?: string;
    image?: string;
}

const DEFAULT_PROMO: HomePromo = {
    eyebrow: "Links Drinks",
    title: "Transfusion",
    body: "Ready-to-drink cocktail, for the course and beyond.",
    image: "menu-images/transfusion-classic.webp",
};

const DEFAULT_TILES: HomeTile[] = [
    { categoryId: "beer", label: "Beers", image: "menu-images/domestic-beer.webp" },
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
                    onClick={() => onSelectCategory?.("deals")}
                    className="flex h-[150px] w-full items-center gap-4 overflow-hidden rounded-2xl bg-secondary px-5 text-left ring-1 ring-border-secondary transition duration-100 ease-linear active:bg-secondary_hover"
                >
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                        {promo.eyebrow && <span className="text-[13px] font-semibold tracking-wide text-brand-secondary uppercase">{promo.eyebrow}</span>}
                        <span className="text-[26px] leading-tight font-bold text-primary">{promo.title}</span>
                        {promo.body && <span className="text-[15px] leading-snug text-tertiary">{promo.body}</span>}
                    </span>
                    <ProductImage src={promo.image} alt={promo.title} className="h-[126px] w-[126px] shrink-0 rounded-xl bg-transparent" />
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
