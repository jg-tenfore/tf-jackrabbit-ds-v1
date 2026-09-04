"use client";

import { ProductImage } from "@/components/kiosk/store/product-image";
import type { ProShopProduct } from "@/data/pro-shop-types";
import { cx } from "@/utils/cx";

/** How a unit is sold, as the shopper would say it. */
const PACKAGING_LABEL: Record<ProShopProduct["packaging"], string> = {
    box: "Dozen",
    sleeve: "Sleeve of 3",
    single: "Single ball",
    bucket: "Range bucket",
};

/**
 * A pro shop / menu tile.
 *
 * The image gets the majority of the tile because on a shop grid the photograph
 * is the thing being scanned — a shopper recognises a Pro V1 box long before
 * they read "Titleist Pro V1". Text is support, so it takes the smaller share.
 *
 * The whole tile is the target, not a button inside it, which is what gets the
 * touch area up past the kiosk floor without the layout having to make room for
 * a separate control.
 */
export const ProductCard = ({
    product,
    onSelect,
    isUnavailable = false,
    className,
}: {
    product: ProShopProduct;
    onSelect?: (product: ProShopProduct) => void;
    isUnavailable?: boolean;
    className?: string;
}) => (
    <button
        type="button"
        disabled={isUnavailable}
        onClick={() => onSelect?.(product)}
        className={cx(
            "flex flex-col overflow-hidden rounded-2xl bg-primary text-left ring-1 ring-border-secondary transition duration-100 ease-linear",
            isUnavailable ? "cursor-not-allowed opacity-50" : "active:scale-[0.98] active:bg-secondary",
            className,
        )}
    >
        <ProductImage src={product.image} alt={product.name} className="h-44 w-full bg-secondary p-3" />

        <div className="flex flex-1 flex-col gap-1 p-4">
            <span className="text-lg leading-tight font-semibold text-primary">{product.name}</span>
            <span className="text-sm text-tertiary">{PACKAGING_LABEL[product.packaging]}</span>
            <span className="mt-auto pt-2 text-xl font-bold text-primary tabular-nums">${(product.priceCents / 100).toFixed(2)}</span>
        </div>

        {isUnavailable && <span className="px-4 pb-3 text-sm font-medium text-error-primary">Out of stock</span>}
    </button>
);
