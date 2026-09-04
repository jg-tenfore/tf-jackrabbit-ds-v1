"use client";

import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * "Item added to bag!" — the confirmation beat after adding an item.
 *
 * Full-bleed with no actions, because it is a transition rather than a
 * decision: it exists to confirm the tap landed and show the new total, then
 * get out of the way. Giving it buttons would ask the user to make a choice
 * they have already made.
 *
 * The bag and its count are the same pair used in the nav rail, so the number
 * the user sees here is the number they will see there a moment later.
 */
export const AddedToBagScreen = ({
    itemCount,
    totalCents,
    className,
}: {
    itemCount: number;
    totalCents: number;
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col items-center justify-center gap-6 px-16 text-center", className)}>
        <div className="relative">
            <img
                src={assetUrl("screen-assets/global-nav/golf-bag.svg")}
                alt=""
                aria-hidden="true"
                className="h-[210px] w-[93px] object-contain"
            />
            <span
                className="absolute top-6 left-14 flex size-[68px] items-center justify-center rounded-full bg-error-solid text-[28px] font-bold text-white"
                aria-label={`${itemCount} items in bag`}
            >
                {itemCount}
            </span>
        </div>

        <h1 className="text-[44px] leading-tight font-bold text-primary">Item added to bag!</h1>
        <p className="text-[20px] text-tertiary">Your total has been updated</p>
        <p className="text-[36px] font-bold text-primary tabular-nums">${(totalCents / 100).toFixed(2)}</p>
    </div>
);
