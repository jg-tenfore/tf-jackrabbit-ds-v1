"use client";

import { useState } from "react";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    root: "flex w-full gap-2 overflow-x-auto scrollbar-hide",
    chip: {
        base: "group flex min-w-14 shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 outline-brand transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
        unselected: "bg-primary text-secondary ring-1 ring-secondary ring-inset hover:bg-secondary_hover",
        selected: "bg-brand-solid text-white ring-1 ring-transparent ring-inset hover:bg-brand-solid_hover",
    },
    weekday: {
        base: "text-xs font-medium uppercase",
        unselected: "text-tertiary",
        selected: "text-white/70",
    },
    day: "text-md font-semibold",
    todayDot: {
        base: "mt-0.5 size-1 rounded-full",
        unselected: "bg-brand-solid",
        selected: "bg-white",
    },
});

/** Strips the time portion so two dates can be compared by calendar day. */
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

export interface DateSelectorProps {
    /** Number of selectable date chips to render. */
    days?: number;
    /** The first date in the strip. Defaults to today. */
    startDate?: Date;
    /** Controlled selected date. */
    value?: Date;
    /** Uncontrolled initial selected date. */
    defaultValue?: Date;
    /** Called with the chosen date whenever the selection changes. */
    onChange?: (date: Date) => void;
    /** Accessible label for the date strip. */
    "aria-label"?: string;
    className?: string;
}

/**
 * A horizontal strip of selectable date chips for picking a tee-time day,
 * styled after the OpenTable/Resy date row. Each chip shows the weekday and
 * day number, and the current day is marked with a dot. Defaults to a 7-day
 * week. Works in both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue`) modes.
 */
export const DateSelector = ({
    days = 7,
    startDate = new Date(),
    value,
    defaultValue,
    onChange,
    "aria-label": ariaLabel = "Select a tee-time date",
    className,
}: DateSelectorProps) => {
    const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);

    const isControlled = value !== undefined;
    const selectedDate = isControlled ? value : internalValue;

    const today = new Date();
    const base = startOfDay(startDate);

    const dates = Array.from({ length: days }, (_, index) => {
        const date = new Date(base);
        date.setDate(base.getDate() + index);
        return date;
    });

    const handleSelect = (date: Date) => {
        if (!isControlled) {
            setInternalValue(date);
        }
        onChange?.(date);
    };

    return (
        <div role="group" aria-label={ariaLabel} className={cx(styles.root, className)}>
            {dates.map((date) => {
                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                const isToday = isSameDay(date, today);

                const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
                const dayNumber = date.toLocaleDateString("en-US", { day: "numeric" });

                return (
                    <button
                        key={date.toISOString()}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        onClick={() => handleSelect(date)}
                        className={cx(styles.chip.base, isSelected ? styles.chip.selected : styles.chip.unselected)}
                    >
                        <span className={cx(styles.weekday.base, isSelected ? styles.weekday.selected : styles.weekday.unselected)}>{weekday}</span>
                        <span className={styles.day}>{dayNumber}</span>
                        {isToday && <span className={cx(styles.todayDot.base, isSelected ? styles.todayDot.selected : styles.todayDot.unselected)} />}
                    </button>
                );
            })}
        </div>
    );
};
