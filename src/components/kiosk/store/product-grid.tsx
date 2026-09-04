"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/kiosk/store/product-card";
import type { ProShopProduct } from "@/data/pro-shop-types";
import { cx } from "@/utils/cx";

/**
 * The shop grid, with a category rail.
 *
 * Two columns at 750px, matching the tee sheet: it gives each tile ~340px, which
 * is enough for a legible pack shot plus two lines of text. Three columns would
 * shrink the photograph below the point where one white box is distinguishable
 * from another, which is the whole basis of scanning a shop grid.
 */
export const ProductGrid = ({
    products,
    categories,
    onSelect,
    unavailableIds = [],
    className,
}: {
    products: ProShopProduct[];
    categories?: readonly { id: string; label: string }[];
    onSelect?: (product: ProShopProduct) => void;
    /** Ids to render as out of stock — the edge case worth designing for. */
    unavailableIds?: string[];
    className?: string;
}) => {
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const visible = useMemo(
        () => (activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory)),
        [products, activeCategory],
    );

    const tabs = categories ? [{ id: "all", label: "All" }, ...categories] : [];

    return (
        <div className={cx("flex h-full flex-col gap-5", className)}>
            {tabs.length > 0 && (
                <div className="flex shrink-0 gap-3 overflow-x-auto px-8 scrollbar-hide" role="tablist">
                    {tabs.map((tab) => {
                        const isActive = tab.id === activeCategory;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveCategory(tab.id)}
                                className={cx(
                                    "h-16 shrink-0 rounded-xl px-7 text-lg font-medium whitespace-nowrap transition duration-100 ease-linear",
                                    isActive ? "bg-brand-solid text-white" : "bg-primary text-primary ring-1 ring-border-primary active:bg-secondary",
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
                {visible.length === 0 ? (
                    <p className="py-16 text-center text-lg text-tertiary">Nothing in this category yet.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {visible.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onSelect={onSelect}
                                isUnavailable={unavailableIds.includes(product.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
