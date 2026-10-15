"use client";

import { useMemo, useState } from "react";
import { CategoryRail } from "@/components/kiosk/booking/step-rail";
import { MenuItemCard } from "@/components/kiosk/order/menu-item-card";
import { MENU_CATEGORIES, MENU_DESTINATIONS, MENU_ITEMS, MENU_SUBFILTERS, type MenuItem } from "@/data/menu-catalog";
import { DEMO_FAVORITE_IDS, DEMO_RECENT_IDS, menuCollection } from "@/data/menu-collections";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * The browse screen.
 *
 * Two columns, matching the tee sheet and the pro shop: at 750px that gives
 * each tile ~230px, enough for a legible photograph plus two lines. Three would
 * shrink the image below the point where one sandwich is distinguishable from
 * another, which is the whole basis of scanning a menu.
 *
 * Sub-filters above the grid are per-category — the references show beverage
 * filters (Water, Soft Drinks, Juices) which only make sense under Beverages,
 * so they are keyed by category rather than being one global set.
 */
export const MenuScreen = ({
    items = MENU_ITEMS,
    initialCategoryId = "sandwiches",
    onSelectItem,
    onCategoryChange,
    soldOutIds = [],
    favoriteIds = DEMO_FAVORITE_IDS,
    recentIds = DEMO_RECENT_IDS,
    className,
}: {
    items?: MenuItem[];
    initialCategoryId?: string;
    onSelectItem?: (item: MenuItem) => void;
    /**
     * Which category is now showing. The screen still owns the state — this
     * only lets a host remember it, so a flow that leaves for an item detail
     * and comes back lands in the category the user was browsing rather than
     * snapping to Sandwiches.
     */
    onCategoryChange?: (categoryId: string) => void;
    soldOutIds?: string[];
    favoriteIds?: string[];
    recentIds?: string[];
    className?: string;
}) => {
    const [categoryId, setCategoryId] = useState(initialCategoryId);
    const [subFilter, setSubFilter] = useState("All");

    const subFilters = MENU_SUBFILTERS[categoryId] ?? [];
    const collection = useMemo(() => menuCollection(categoryId, items, favoriteIds, recentIds), [items, categoryId, favoriteIds, recentIds]);

    return (
        <div className={cx("relative flex h-full w-full flex-col", className)}>
            <CategoryRail
                destinations={[...MENU_DESTINATIONS]}
                categories={[...MENU_CATEGORIES]}
                activeCategoryId={categoryId}
                onSelect={(id) => {
                    if ([...MENU_CATEGORIES, ...MENU_DESTINATIONS].some((c) => c.id === id)) {
                        setCategoryId(id);
                        setSubFilter("All");
                        onCategoryChange?.(id);
                    }
                }}
                logoSrc={assetUrl("screen-assets/brand/hero-logo.svg")}
                className="top-12"
            />

            <div className="flex flex-col gap-4 pt-14 pr-8 pl-[232px]">
                <h1 className="text-[44px] leading-none font-bold text-primary">{collection.title}</h1>
                <p className="text-[17px] text-tertiary">{collection.subtitle}</p>

                {subFilters.length > 0 && (
                    <div className="flex flex-wrap gap-3" role="tablist">
                        {subFilters.map((filter) => {
                            const isActive = filter === subFilter;
                            return (
                                <button
                                    key={filter}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setSubFilter(filter)}
                                    className={cx(
                                        "h-14 rounded-full px-6 text-[17px] whitespace-nowrap transition duration-100 ease-linear",
                                        isActive ? "bg-brand-solid text-white" : "bg-primary text-tertiary ring-1 ring-border-primary active:bg-secondary",
                                    )}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="mt-5 scrollbar-hide min-h-0 flex-1 overflow-y-auto pr-8 pb-8 pl-[232px]">
                {collection.groups.map((group) => (
                    <section key={group.id} aria-label={group.title ?? collection.title} className="mb-8">
                        {group.title && <h2 className="mb-4 text-2xl font-semibold text-primary">{group.title}</h2>}
                        {group.items.length === 0 ? (
                            <p className="py-8 text-[17px] text-tertiary">
                                {group.id === "favorites"
                                    ? "Tap the star on any item to save it here."
                                    : group.id === "recent"
                                      ? "Items you order will appear here."
                                      : "Nothing in this category yet."}
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {group.items.map((item) => (
                                    <MenuItemCard
                                        key={item.id}
                                        item={item}
                                        onSelect={onSelectItem}
                                        isFavorite={favoriteIds.includes(item.id)}
                                        isUnavailable={soldOutIds.includes(item.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
};
