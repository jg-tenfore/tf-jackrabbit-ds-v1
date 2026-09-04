"use client";

import { ProductImage } from "@/components/kiosk/store/product-image";
import type { MenuItem } from "@/data/menu-catalog";
import { cx } from "@/utils/cx";

/**
 * A menu tile.
 *
 * Distinct from `ProductCard` in carrying a calorie count, which food service
 * is frequently required to display and merchandise is not. Everything else is
 * shared behaviour, so both render through `ProductImage` and both make the
 * whole tile the target rather than a button inside it.
 */
export const MenuItemCard = ({
    item,
    onSelect,
    isUnavailable = false,
    className,
}: {
    item: MenuItem;
    onSelect?: (item: MenuItem) => void;
    isUnavailable?: boolean;
    className?: string;
}) => (
    <button
        type="button"
        disabled={isUnavailable}
        onClick={() => onSelect?.(item)}
        className={cx(
            "flex flex-col overflow-hidden rounded-2xl bg-primary text-left ring-1 ring-border-secondary transition duration-100 ease-linear",
            isUnavailable ? "cursor-not-allowed opacity-50" : "active:scale-[0.98] active:bg-secondary",
            className,
        )}
    >
        <ProductImage src={item.image} alt={item.name} className="h-[150px] w-full bg-primary p-3" />

        <div className="flex flex-1 flex-col gap-0.5 p-4 pt-0">
            <span className="text-[19px] leading-tight font-semibold text-primary">{item.name}</span>
            {item.calories !== undefined && <span className="text-[13px] text-tertiary">{item.calories} cal</span>}
            <span className="mt-1 text-[19px] font-semibold text-primary tabular-nums">${(item.priceCents / 100).toFixed(2)}</span>
        </div>

        {isUnavailable && <span className="px-4 pb-3 text-[13px] font-medium text-error-primary">Sold out</span>}
    </button>
);
