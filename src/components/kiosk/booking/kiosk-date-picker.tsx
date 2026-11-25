"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "@untitledui/icons";
import { DateCircle } from "@/components/kiosk/booking/date-circle";
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
    /**
     * How many days the collapsed strip shows. Five fits beside the expand
     * chevron inside a rail-inset column (750 - 232 rail - 32 padding); pass 6
     * only when the strip has the full canvas width.
     */
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

export const KioskDatePicker = ({ selected, onSelect, days, stripLength = 5, mode: modeProp, onModeChange, className }: KioskDatePickerProps) => {
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
                    {/* A scroller clips on every side, and the selected day draws
                        past its own box: a 2px ring, and a check badge 4px out at
                        the top right. The padding gives them room inside the
                        clip; the matching negative margin keeps the strip exactly
                        where it was. */}
                    <div className="-mx-1.5 -my-2 scrollbar-hide flex flex-1 gap-3 overflow-x-auto px-1.5 py-2">
                        {availability.slice(0, stripLength).map((day) => (
                            <DateCircle
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
/**
 * The expanded calendar: every month the bookable window touches, stacked.
 *
 * A window that runs from late November into mid-December has to show both
 * months — showing only the selected one would hide half the bookable days
 * behind a month switch the reference never draws. Days outside the window
 * stay on the grid, greyed, so each month keeps its shape. Only the first
 * month carries the Today button.
 */
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
    // Every month any offered day falls in, in order — or just the selected
    // month when the window sits inside one.
    const keys = new Set<number>([...lookup.values()].map((d) => d.date.getFullYear() * 12 + d.date.getMonth()));
    if (keys.size === 0) keys.add(selected.getFullYear() * 12 + selected.getMonth());
    const months = [...keys].sort((a, b) => a - b).map((k) => ({ year: Math.floor(k / 12), month: k % 12 }));

    return (
        <div className="flex w-full flex-col gap-10">
            {months.map(({ year, month }, i) => (
                <MonthBlock
                    key={`${year}-${month}`}
                    year={year}
                    month={month}
                    selected={selected}
                    onSelect={onSelect}
                    lookup={lookup}
                    onToday={i === 0 ? onToday : undefined}
                />
            ))}
        </div>
    );
};

const MonthBlock = ({
    year,
    month,
    selected,
    onSelect,
    lookup,
    onToday,
}: {
    year: number;
    month: number;
    selected: Date;
    onSelect: (d: Date) => void;
    lookup: Map<number, DayAvailability>;
    onToday?: () => void;
}) => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex min-h-[52px] items-center justify-between">
                <h3 className="text-3xl font-bold text-primary">
                    {MONTH[month]} {year}
                </h3>
                {/* span 0 means content-width, so it needs an explicit floor to stay a
                    pill rather than collapsing toward square. */}
                {onToday && (
                    <KioskKey size="md" variant="action" span={0} onPress={onToday} className="w-[160px]">
                        Today
                    </KioskKey>
                )}
            </div>

            <div className="grid grid-cols-7 justify-items-center gap-y-4">
                {/* Column headers. The week strip carries its weekday under each
                    circle, but a month grid cannot repeat that 31 times, so the
                    day-of-week has to be readable off the column instead. */}
                {WEEKDAY.map((name) => (
                    <span key={name} aria-hidden="true" className="pb-2 text-lg font-semibold text-secondary">
                        {name.charAt(0)}
                    </span>
                ))}

                {Array.from({ length: firstWeekday }).map((_, i) => (
                    <div key={`blank-${i}`} aria-hidden="true" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = new Date(year, month, i + 1);
                    const entry = lookup.get(startOfDay(date).getTime());
                    // Days outside the offered window render as unavailable
                    // rather than disappearing, so the month keeps its shape.
                    const day: DayAvailability = entry ?? { date, isAvailable: false };

                    return <DateCircle key={date.toISOString()} size="sm" day={day} isSelected={isSameDay(date, selected)} onSelect={() => onSelect(date)} />;
                })}
            </div>
        </div>
    );
};
