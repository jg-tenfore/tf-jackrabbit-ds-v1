"use client";

import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * "Item added to bag!" — the confirmation beat after adding an item.
 *
 * Full-bleed with no actions and no nav, because it is a transition rather than
 * a decision: it exists to confirm the tap landed and show the new total, then
 * get out of the way. Giving it buttons would ask the user to make a choice they
 * have already made, and a Start Over rail would put the one destructive control
 * on screen at the moment they are least expecting to need it.
 *
 * The bag is its own larger export rather than the rail's 50x117 mark scaled up.
 * The rail's is a glyph read at a glance; here the bag is the subject of the
 * screen and carries detail that would be noise at rail size.
 *
 * The count badge is drawn rather than baked into the artwork, because it is the
 * only dynamic thing here — and it is the same pair the nav rail shows, so the
 * number seen on this screen is the number seen there a moment later.
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
    <div className={cx("flex h-full w-full flex-col items-center justify-center px-16 text-center", className)}>
        <div className="relative">
            <img
                src={assetUrl("screen-assets/order/golf-bag-large.svg")}
                alt=""
                aria-hidden="true"
                className="h-[330px] w-[143px] object-contain"
            />
            {/* Straddles the bag's right edge rather than sitting inside it —
                the badge is an annotation *on* the bag, and tucking it within
                the silhouette reads as part of the artwork. */}
            <span
                className="absolute top-[57px] -right-[46px] flex size-[93px] items-center justify-center rounded-full bg-error-solid text-[40px] font-bold text-white tabular-nums"
                aria-label={`${itemCount} ${itemCount === 1 ? "item" : "items"} in bag`}
            >
                {itemCount}
            </span>
        </div>

        <h1 className="mt-11 text-[56px] leading-tight font-bold text-primary">Item added to bag!</h1>
        <p className="mt-4 text-[24px] text-tertiary">Your total has been updated</p>
        <p className="mt-10 text-[46px] font-bold text-primary tabular-nums">${(totalCents / 100).toFixed(2)}</p>
    </div>
);
