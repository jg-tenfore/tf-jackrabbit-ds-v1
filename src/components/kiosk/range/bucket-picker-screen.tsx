"use client";

import { BrandMark } from "@/components/kiosk/brand-mark";
import { MenuItemCard } from "@/components/kiosk/order/menu-item-card";
import type { RangeBucket, RangeExtra } from "@/data/range-catalog";
import { cx } from "@/utils/cx";

/**
 * "Grab a bucket of balls" — the range's items as a grid of product cards.
 *
 * The same `MenuItemCard` the food menu uses, three across, rather than a
 * bespoke picker: a range sells more than three sizes over time (a jumbo
 * bucket, a token, a rental club), and a grid takes another card without a
 * redesign. Tapping a card opens the same item detail sheet as a bottle of
 * water — photo, price, quantity, Add — so buying balls asks nothing new of
 * anyone who has bought food here.
 *
 * Each card says "About 80 balls" where food says calories: a machine
 * dispenses by weight, so promising an exact number would be wrong at the
 * range. A sold-out size stays in the grid, dimmed and unpressable, exactly as
 * a sold-out sandwich does.
 */
export const BucketPickerScreen = ({
    items,
    onSelect,
    soldOutIds = [],
    className,
}: {
    /** Buckets, and whatever else the range sells — any count; the grid wraps. */
    items: (RangeBucket | RangeExtra)[];
    onSelect: (item: RangeBucket | RangeExtra) => void;
    soldOutIds?: string[];
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col", className)}>
        <div className="flex flex-col items-center px-10 pt-12 text-center">
            <BrandMark />
            <h1 className="mt-5 text-[44px] leading-tight font-bold text-balance text-primary">Grab a bucket of balls</h1>
            <p className="mt-3 max-w-[560px] text-[20px] text-tertiary">
                Each bucket gets its own ball code. We send it to you by text and email as soon as you pay.
            </p>
        </div>

        <div className="mt-8 scrollbar-hide min-h-0 flex-1 overflow-y-auto px-12 pb-8">
            <div className="grid grid-cols-3 gap-4">
                {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} isUnavailable={soldOutIds.includes(item.id)} onSelect={() => onSelect(item)} />
                ))}
            </div>
        </div>
    </div>
);
