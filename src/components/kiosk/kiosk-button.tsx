"use client";

import type { ReactNode } from "react";
import { pxToMm } from "@/kiosk/touch";
import { cx, sortCx } from "@/utils/cx";

/**
 * The screen-action button.
 *
 * An audit of the built flows found **62 buttons across 26 files** using only
 * three treatments — a green commit, a quiet outline, a red destructive — but
 * hand-rolling **thirteen different heights** and four radii between them. Two
 * Start Overs on two rails were 52 and 65 tall with different type. That is the
 * gap this closes: the treatments were already a system, the sizes were not.
 *
 * Distinct from `KioskKey`, deliberately. That component is sized off
 * `KEY_SIZES`, a scale derived from fitting ten keys across a 750px row — it
 * exists to make keyboards land edge to edge. A screen action has no row to
 * fit, so borrowing that scale means overriding the one property it exists to
 * set, which is what several call sites were already doing.
 *
 * **Every size clears the touch floor.** The smallest, `sm` at 44px, is ~16mm
 * on the reference panel against an 11mm minimum; `lg` at 65px is ~23mm against
 * the 14mm a primary action wants. `BUTTON_SIZES` is exported so a test can
 * assert that rather than trusting the comment.
 */
export type KioskButtonTone = "primary" | "quiet" | "destructive";
export type KioskButtonSize = "sm" | "md" | "lg" | "xl";

/** Height in design-canvas pixels. See the note above on why these numbers. */
export const BUTTON_SIZES = {
    /** 44px (~16mm) — inline actions inside a row, like Remove on an order line. */
    sm: 44,
    /** 52px (~19mm) — rail actions. Start Over sits here. */
    md: 52,
    /** 65px (~23mm) — the default for a screen's commit action. */
    lg: 65,
    /** 80px (~29mm) — full-screen modal actions, where nothing competes. */
    xl: 80,
} as const;

const styles = sortCx({
    base: [
        "flex shrink-0 select-none touch-manipulation items-center justify-center rounded-lg text-center",
        "transition duration-100 ease-linear",
        // No hover state: a kiosk has no cursor, so the press carries the whole
        // affordance and has to be unmistakable.
        "active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
    ].join(" "),
    tones: {
        primary: "bg-brand-solid font-bold text-white active:bg-brand-solid_hover",
        quiet: "text-tertiary ring-1 ring-border-primary ring-inset active:bg-secondary",
        destructive: "bg-error-solid font-semibold text-white active:bg-error-solid_hover",
    },
    /** Type rises with the target, so a bigger button is also a louder one. */
    text: {
        sm: "text-[15px]",
        md: "text-[18px]",
        lg: "text-[20px]",
        xl: "text-2xl",
    },
});

export const KioskButton = ({
    children,
    tone = "quiet",
    size = "lg",
    isDisabled = false,
    onPress,
    /** Fill the row. Off by default — most of these are fixed-width by design. */
    isFullWidth = false,
    label,
    className,
}: {
    children?: ReactNode;
    tone?: KioskButtonTone;
    size?: KioskButtonSize;
    isDisabled?: boolean;
    onPress?: () => void;
    isFullWidth?: boolean;
    /** Accessible name, when the visible label is not descriptive on its own. */
    label?: string;
    className?: string;
}) => (
    <button
        type="button"
        disabled={isDisabled}
        onClick={onPress}
        aria-label={label}
        style={{ height: BUTTON_SIZES[size] }}
        className={cx(styles.base, styles.tones[tone], styles.text[size], isFullWidth && "w-full", className)}
    >
        {children}
    </button>
);

/** Millimetres on the reference panel, for the touch-floor test. */
export const buttonSizeMm = (size: KioskButtonSize) => pxToMm(BUTTON_SIZES[size]);
