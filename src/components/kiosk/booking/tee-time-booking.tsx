"use client";

import { useMemo, useState } from "react";
import { KioskDatePicker } from "@/components/kiosk/booking/kiosk-date-picker";
import { FilterRail } from "@/components/kiosk/booking/step-rail";
import { SlotCard, type TeeTimeSlot } from "@/components/kiosk/booking/slot-card";
import { RatePickerModal } from "@/components/kiosk/modals/modal-variants";
import { RATES_FOR_TIME } from "@/data/booking";
import { cx } from "@/utils/cx";

/**
 * The tee sheet.
 *
 * Slots are a two-column grid rather than a single list: at a 6-minute cadence
 * a morning holds ~90 tee times, and one column would make the page a mile
 * long. Two columns halve the scroll while keeping each card wide enough for
 * rate, time and price to sit on two readable lines.
 *
 * Tapping a slot opens the rate picker rather than booking directly — the same
 * time is sold at several rates, so the time is the filter and the rate is the
 * actual choice.
 */

const HOLE_FILTERS = [
    { id: "18", label: "18 holes" },
    { id: "9", label: "9 Holes" },
];

const TIME_FILTERS = [
    { id: "all", label: "All Times" },
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
    { id: "evening", label: "Evening" },
    { id: "twilight", label: "Twilight" },
];

/** Parse "6:06 AM" to minutes from midnight, for the time-of-day filters. */
const toMinutes = (time: string) => {
    const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return 0;
    const [, h, m, period] = match;
    const hour = Number(h) % 12 + (period.toUpperCase() === "PM" ? 12 : 0);
    return hour * 60 + Number(m);
};

const IN_WINDOW: Record<string, (minutes: number) => boolean> = {
    all: () => true,
    morning: (m) => m < 12 * 60,
    afternoon: (m) => m >= 12 * 60 && m < 17 * 60,
    evening: (m) => m >= 17 * 60 && m < 19 * 60,
    twilight: (m) => m >= 19 * 60,
};

export const TeeTimeBooking = ({ slots, className }: { slots: TeeTimeSlot[]; className?: string }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filters, setFilters] = useState<Record<string, string>>({ holes: "18", time: "all" });
    const [openSlot, setOpenSlot] = useState<TeeTimeSlot | null>(null);

    const visible = useMemo(
        () =>
            slots.filter((slot) => {
                if (filters.holes === "9" && slot.holes !== 9) return false;
                if (filters.holes === "18" && slot.holes !== 18) return false;
                return IN_WINDOW[filters.time]?.(toMinutes(slot.time)) ?? true;
            }),
        [slots, filters],
    );

    return (
        <div className={cx("relative flex h-full w-full flex-col", className)}>
            <FilterRail
                groups={[
                    { id: "holes", options: HOLE_FILTERS },
                    { id: "time", options: TIME_FILTERS },
                ]}
                values={filters}
                onChange={(groupId, optionId) => setFilters((prev) => ({ ...prev, [groupId]: optionId }))}
                className="top-56"
            />

            <div className="flex flex-col gap-6 pt-14 pr-8 pl-[232px]">
                <header className="flex flex-col gap-2">
                    <h1 className="text-5xl font-bold text-primary">Book a time</h1>
                    <p className="text-lg text-tertiary">Browse tee times and book today or in advance</p>
                </header>

                <KioskDatePicker selected={selectedDate} onSelect={setSelectedDate} />
            </div>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-8 pb-8 pl-[232px] scrollbar-hide">
                {visible.length === 0 ? (
                    <p className="py-16 text-center text-lg text-tertiary">No tee times match these filters.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {visible.map((slot) => (
                            <SlotCard key={slot.id} slot={slot} onSelect={() => setOpenSlot(slot)} />
                        ))}
                    </div>
                )}
            </div>

            {openSlot && (
                <RatePickerModal
                    isOpen={Boolean(openSlot)}
                    onOpenChange={(open) => !open && setOpenSlot(null)}
                    time={openSlot.time}
                    rates={RATES_FOR_TIME(openSlot.time)}
                    onConfirm={() => setOpenSlot(null)}
                />
            )}
        </div>
    );
};
