"use client";

import type { FC, ReactNode } from "react";
import { KEY_SIZES, type KeySize } from "@/kiosk/touch";
import { cx, sortCx } from "@/utils/cx";

export type KeyVariant = "character" | "action" | "primary" | "destructive";

const styles = sortCx({
    base: [
        // `select-none` and `touch-manipulation` together kill the 300ms tap
        // delay and the text-selection flash that make a web keyboard feel
        // unresponsive next to a native one.
        "flex min-w-0 shrink-0 select-none touch-manipulation items-center justify-center rounded-lg text-center font-medium",
        "transition duration-75 ease-linear",
        // No hover state: there is no cursor on a kiosk, so the press state
        // carries the entire affordance and must be unmistakable.
        "active:scale-[0.96]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
    ].join(" "),
    variants: {
        character: "bg-primary text-primary ring-1 ring-border-primary ring-inset active:bg-brand-solid active:text-white active:ring-brand",
        action: "bg-secondary text-secondary ring-1 ring-border-primary ring-inset active:bg-tertiary active:text-primary",
        primary: "bg-brand-solid text-white active:bg-brand-solid_hover",
        destructive: "bg-error-solid text-white active:bg-error-solid_hover",
    },
    /** Type scale rises with key size so the glyph stays legible at arm's length. */
    text: {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
        xl: "text-3xl",
    },
});

export interface KioskKeyProps {
    children?: ReactNode;
    /** Icon rendered instead of children — for Delete, Shift, and friends. */
    icon?: FC<{ className?: string }>;
    size?: KeySize;
    variant?: KeyVariant;
    /**
     * Relative width within its row. 1 is a standard key; 1.5 gives Shift and
     * Delete the extra real estate their higher miss-cost justifies.
     */
    span?: number;
    /** Latched state, for a held Shift or Caps. */
    isActive?: boolean;
    isDisabled?: boolean;
    onPress?: () => void;
    /** Accessible name when the visible glyph is not descriptive (icons, symbols). */
    label?: string;
    className?: string;
}

/**
 * The atomic key — the unit of button real estate on this kiosk.
 *
 * Every touchable cell in a keyboard or keypad is one of these, so target
 * sizing is decided in exactly one place. Height comes from the `KEY_SIZES`
 * scale in `touch.ts`, which is derived from row arithmetic against the 750px
 * canvas rather than chosen by eye: `md` (64px) is precisely the widest key
 * that fits a 10-column QWERTY row edge to edge.
 *
 * Width is proportional (`flex-grow`), not fixed, so a row always consumes the
 * full canvas width — leftover horizontal space is wasted target area.
 */
export const KioskKey = ({
    children,
    icon: Icon,
    size = "md",
    variant = "character",
    span = 1,
    isActive = false,
    isDisabled = false,
    onPress,
    label,
    className,
}: KioskKeyProps) => (
    <button
        type="button"
        disabled={isDisabled}
        onClick={onPress}
        aria-label={label}
        aria-pressed={isActive ? true : undefined}
        // flexBasis:0 with a proportional grow makes span a true ratio, so a
        // 1.5-span key is exactly 1.5x a standard key at any row width.
        //
        // span={0} opts out of flex sizing entirely, for keys placed outside a
        // key row (modal footers, standalone actions) where width comes from a
        // class. Applying basis:0 there let the default flex-shrink collapse the
        // button to min-content, wrapping its label one character per line.
        style={
            span === 0
                ? { height: KEY_SIZES[size] }
                : { height: KEY_SIZES[size], flexGrow: span, flexBasis: 0 }
        }
        className={cx(
            styles.base,
            styles.variants[variant],
            styles.text[size],
            // A latched key inverts rather than tinting — at arm's length a
            // subtle tint is invisible, so the state has to be unmissable.
            isActive && "bg-brand-solid text-white ring-brand",
            className,
        )}
    >
        {Icon ? <IconGlyph Icon={Icon} size={size} /> : children}
    </button>
);

/** Icons scale with the key so they never look lost inside a large target. */
const IconGlyph = ({ Icon, size }: { Icon: FC<{ className?: string }>; size: KeySize }) => (
    <Icon className={cx(size === "sm" ? "size-5" : size === "md" ? "size-6" : size === "lg" ? "size-7" : "size-8")} />
);
