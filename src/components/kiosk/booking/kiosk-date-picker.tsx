"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "@untitledui/icons";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { cx } from "@/utils/cx";

/**
 * The kiosk date picker.
 *
 * Every booking surface — tee time, simulator, pickleball — opens on the same
 * question ("which day?"), so this is one component rather than a per-flow
 * calendar. It has exactly two states, matching the references:
 *
 *   week  — a horizontal strip of the next N days. The default, because a kiosk
 *           booking is overwhelmingly for today or tomorrow, and a strip answers
 *           that in one tap without opening anything.
 *   month — the full grid, for genuine advance booking.
 *
 * It deliberately does not use the ported `Components/Forms/Date Picker`: that
 * is a desktop popover built for a cursor, with day cells far below the kiosk
 * touch floor. Here the day cells are `KioskKey`-sized circles.
 */

export interface DayAvailability {
    date: Date;
    /** Unavailable days stay visible but unpressable — absence is information. */
    isAvailable?: boolean;
    /** Shows the dot under the numeral, marking days that have open inventory. */
    hasInventory?: boolean;
}

interface KioskDatePickerProps {
    selected: Date;
    onSelect: (date: Date) => void;
    /** Days to offer. Defaults to the next 14 from today, all available. */
    days?: DayAvailability[];
    /** How many days the collapsed strip shows before the expand affordance. */
    stripLength?: number;
    mode?: "week" | "month";
    onModeChange?: (mode: "week" | "month") => void;
    className?: string;
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Default window: the next 14 days, every day bookable. */
const defaultDays = (from: Date, count: number): DayAvailability[] =>
    Array.from({ length: count }, (_, i) => ({ date: addDays(from, i), isAvailable: true, hasInventory: true }));

export const KioskDatePicker = ({ selected, onSelect, days, stripLength = 6, mode: modeProp, onModeChange, className }: KioskDatePickerProps) => {
    const [internalMode, setInternalMode] = useState<"week" | "month">("week");
    const mode = modeProp ?? internalMode;

    const setMode = (next: "week" | "month") => {
        setInternalMode(next);
        onModeChange?.(next);
    };

    const availability = useMemo(() => days ?? defaultDays(new Date(), 14), [days]);
    const lookup = useMemo(() => new Map(availability.map((d) => [startOfDay(d.date).getTime(), d])), [availability]);

    return (
        <div className={cx("flex w-full flex-col gap-5", className)}>
            {mode === "month" ? (
                <MonthGrid selected={selected} onSelect={onSelect} lookup={lookup} onToday={() => onSelect(new Date())} />
            ) : (
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 gap-3 overflow-x-auto scrollbar-hide">
                        {availability.slice(0, stripLength).map((day) => (
                            <DayCircle
                                key={day.date.toISOString()}
                                day={day}
                                isSelected={isSameDay(day.date, selected)}
                                onSelect={() => onSelect(day.date)}
                                showWeekday
                            />
                        ))}
                    </div>

                    <ExpandToggle mode={mode} onPress={() => setMode("month")} />
                </div>
            )}

            {mode === "month" && (
                <div className="flex justify-center">
                    <ExpandToggle mode={mode} onPress={() => setMode("week")} />
                </div>
            )}
        </div>
    );
};

const ExpandToggle = ({ mode, onPress }: { mode: "week" | "month"; onPress: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        aria-label={mode === "week" ? "Show full month" : "Show week"}
        aria-expanded={mode === "month"}
        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary ring-1 ring-border-primary transition duration-100 ease-linear active:bg-secondary"
    >
        {mode === "week" ? <ChevronDown className="size-6 text-fg-secondary" /> : <ChevronUp className="size-6 text-fg-secondary" />}
    </button>
);

/**
 * A single day cell.
 *
 * Selection is carried by a ring plus a check badge rather than a fill, because
 * the unavailable state already owns "filled grey" — two states competing for
 * fill would be ambiguous at arm's length.
 */
const DayCircle = ({
    day,
    isSelected,
    onSelect,
    showWeekday = false,
    isMuted = false,
}: {
    day: DayAvailability;
    isSelected: boolean;
    onSelect: () => void;
    showWeekday?: boolean;
    isMuted?: boolean;
}) => {
    const isAvailable = day.isAvailable !== false;

    return (
        <div className="flex shrink-0 flex-col items-center gap-1">
            <button
                type="button"
                disabled={!isAvailable}
                onClick={onSelect}
                aria-pressed={isSelected}
                aria-label={day.date.toDateString() + (isAvailable ? "" : " — unavailable")}
                className={cx(
                    "relative flex size-16 items-center justify-center rounded-full text-2xl font-medium transition duration-100 ease-linear",
                    isAvailable
                        ? "bg-primary text-primary ring-1 ring-border-primary active:bg-secondary"
                        : "cursor-not-allowed bg-secondary text-quaternary",
                    isSelected && "text-brand-secondary ring-2 ring-brand",
                    isMuted && isAvailable && "text-tertiary",
                )}
            >
                {day.date.getDate()}

                {isSelected && (
                    <span
                        className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-brand-solid"
                        aria-hidden="true"
                    >
                        <Check className="size-4 text-white" />
                    </span>
                )}

                {day.hasInventory && isAvailable && (
                    <span className={cx("absolute bottom-2 size-1.5 rounded-full", isSelected ? "bg-brand-solid" : "bg-fg-quaternary")} aria-hidden="true" />
                )}
            </button>

            {showWeekday && (
                <span className={cx("text-base", isSelected ? "font-semibold text-primary" : "text-tertiary")}>
                    {WEEKDAY[day.date.getDay()]}
                </span>
            )}
        </div>
    );
};

/** Full month grid, with leading blanks so weekdays line up in columns. */
const MonthGrid = ({
    selected,
    onSelect,
    lookup,
    onToday,
}: {
    selected: Date;
    onSelect: (d: Date) => void;
    lookup: Map<number, DayAvailability>;
    onToday: () => void;
}) => {
    const year = selected.getFullYear();
    const month = selected.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-primary">
                    {MONTH[month]} {year}
                </h3>
                <KioskKey size="md" variant="action" span={0} onPress={onToday} className="px-8">
                    Today
                </KioskKey>
            </div>

            <div className="grid grid-cols-7 gap-y-4 justify-items-center">
                {Array.from({ length: firstWeekday }).map((_, i) => (
                    <div key={`blank-${i}`} aria-hidden="true" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = new Date(year, month, i + 1);
                    const entry = lookup.get(startOfDay(date).getTime());
                    // Days outside the offered window render as unavailable
                    // rather than disappearing, so the month keeps its shape.
                    const day: DayAvailability = entry ?? { date, isAvailable: false };

                    return <DayCircle key={date.toISOString()} day={day} isSelected={isSameDay(date, selected)} onSelect={() => onSelect(date)} />;
                })}
            </div>
        </div>
    );
};
