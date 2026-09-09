"use client";

import { Check } from "@untitledui/icons";
import { cx } from "@/utils/cx";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface DayAvailability {
    date: Date;
    /** Bookable at all. Unavailable days stay in place so the grid keeps shape. */
    isAvailable?: boolean;
    /** Something left to book — drives the dot under the numeral. */
    hasInventory?: boolean;
}

/**
 * One date in a picker: the circular target the whole booking flow turns on.
 *
 * It carries four independent signals at once, which is why it is a component
 * rather than a styled button repeated in two places:
 *
 *   available     white with a ring; unavailable is filled grey and disabled
 *   selected      brand ring plus a check badge
 *   inventory     a dot under the numeral — "bookable" and "has slots left"
 *                 are different facts, and a day can be one without the other
 *   muted         in range and bookable, but outside the month being browsed
 *
 * **Two sizes, and the reason matters.** `md` is the week strip, where five
 * circles have the row to themselves. `sm` is the month grid, where seven
 * columns share the same width — at `md` the selected badge overhangs its
 * column and collides with the next date. Sizing the circle is what fixes
 * that; shrinking the badge alone just makes it hard to see.
 */
export type DateCircleSize = "md" | "sm";

const SIZES = {
    md: { circle: "size-16 text-2xl", badge: "size-6 -top-1 -right-1", check: "size-4", dot: "bottom-2 size-1.5" },
    sm: { circle: "size-14 text-xl", badge: "size-5 -top-0.5 -right-0.5", check: "size-3", dot: "bottom-1.5 size-1.5" },
} as const;

export const DateCircle = ({
    day,
    isSelected,
    onSelect,
    size = "md",
    /** Weekday name under the circle. The week strip shows it; a month cannot repeat it 31 times. */
    showWeekday = false,
    isMuted = false,
    className,
}: {
    day: DayAvailability;
    isSelected: boolean;
    onSelect: () => void;
    size?: DateCircleSize;
    showWeekday?: boolean;
    isMuted?: boolean;
    className?: string;
}) => {
    const isAvailable = day.isAvailable !== false;
    const style = SIZES[size];

    return (
        <div className={cx("flex shrink-0 flex-col items-center gap-1", className)}>
            <button
                type="button"
                disabled={!isAvailable}
                onClick={onSelect}
                aria-pressed={isSelected}
                aria-label={day.date.toDateString() + (isAvailable ? "" : " — unavailable")}
                className={cx(
                    "relative flex items-center justify-center rounded-full font-medium transition duration-100 ease-linear",
                    style.circle,
                    isAvailable ? "bg-primary text-primary ring-1 ring-border-primary active:bg-secondary" : "cursor-not-allowed bg-secondary text-quaternary",
                    isSelected && "text-brand-secondary ring-2 ring-brand",
                    isMuted && isAvailable && "text-tertiary",
                )}
            >
                {day.date.getDate()}

                {isSelected && (
                    <span className={cx("absolute flex items-center justify-center rounded-full bg-brand-solid", style.badge)} aria-hidden="true">
                        <Check className={cx("text-white", style.check)} />
                    </span>
                )}

                {day.hasInventory && isAvailable && (
                    <span
                        className={cx("absolute rounded-full", style.dot, isSelected ? "bg-brand-solid" : "bg-fg-quaternary")}
                        aria-hidden="true"
                    />
                )}
            </button>

            {showWeekday && (
                <span className={cx("text-base", isSelected ? "font-semibold text-primary" : "text-tertiary")}>{WEEKDAY[day.date.getDay()]}</span>
            )}
        </div>
    );
};
