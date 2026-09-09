"use client";

import { BrandMark } from "@/components/kiosk/brand-mark";
import { cx } from "@/utils/cx";

/**
 * "Please follow the payment instructions displayed on the integrated terminal."
 *
 * The hand-off screen: the card reader beside the kiosk has taken over, and
 * this panel's only job for the next twenty seconds is to point at it.
 *
 * So it is **deliberately empty below the sentence**. There is no spinner, no
 * progress bar and no button, because every one of those would draw the eye
 * back to the screen the user is supposed to stop looking at. A spinner in
 * particular would imply this panel is doing the work and is worth waiting on,
 * when the thing that needs attention is a separate piece of hardware.
 *
 * The rail stays as it was on the order review — same totals, same buttons, in
 * the same places. Payment is not committed until the terminal says so, and a
 * user who changes their mind mid-tap needs Start Over exactly where it has
 * been all session.
 */
export const FollowInstructionsScreen = ({
    heading = "Please follow the payment instructions displayed on the integrated terminal",
    className,
}: {
    heading?: string;
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col items-center pt-[68px] text-center", className)}>
        <BrandMark />

        {/* The measure is the max-width itself, with no padding inside it —
            padding here eats the very width being set and pushes the sentence
            onto an extra line. */}
        <h1 className="mt-14 max-w-[600px] text-[52px] leading-[1.25] font-bold text-balance text-primary">{heading}</h1>
    </div>
);
