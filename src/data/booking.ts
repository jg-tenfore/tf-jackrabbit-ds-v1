import type { TeeTimeSlot } from "@/components/kiosk/booking/slot-card";

/** The venue every booking fixture belongs to. */
export const VENUE = {
    name: "The Course at Sagamore",
    address: "1287 Main St, Lynnfield, MA 01940",
} as const;

/**
 * Tee sheet fixtures on a 6-minute interval — the real cadence a course runs,
 * which is what makes the grid long enough to exercise scrolling and the
 * time-of-day filters.
 */
const RATES = [
    { rateName: "18 Holes", priceCents: 12000, holes: 18 as const, transport: "cart" as const },
    { rateName: "Walking", priceCents: 6500, holes: 18 as const, transport: "walking" as const },
    { rateName: "9 Holes", priceCents: 4600, holes: 9 as const, transport: "cart" as const },
    { rateName: "Walking", priceCents: 2300, holes: 9 as const, transport: "walking" as const },
];

const formatTime = (minutesFromMidnight: number) => {
    const h24 = Math.floor(minutesFromMidnight / 60);
    const m = minutesFromMidnight % 60;
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

/** Tee times every 6 minutes from 5:54 AM, matching the references. */
export const TEE_TIMES: TeeTimeSlot[] = Array.from({ length: 90 }, (_, i) => {
    const minutes = 5 * 60 + 54 + i * 6;
    return {
        id: `tee-${i}`,
        time: formatTime(minutes),
        ...RATES[0],
        players: [2, 4] as [number, number],
        // A scattering of taken slots, so the grid is not uniformly available.
        isAvailable: i % 13 !== 5,
    };
});

/** Every rate offered at a given time — the rate picker modal's contents. */
export const RATES_FOR_TIME = (time: string): TeeTimeSlot[] =>
    RATES.map((rate, i) => ({
        id: `rate-${i}`,
        time,
        ...rate,
        players: [2, 4] as [number, number],
        isAvailable: true,
    }));

/** Half-hour start times, 6:00 AM to 10:00 PM — the activity grid. */
export const ACTIVITY_START_TIMES = Array.from({ length: 33 }, (_, i) => formatTime(6 * 60 + i * 30));

export const centsToUsd = (cents: number) =>
    (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
