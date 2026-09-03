/**
 * Sagamore Golf Club — fictional reference data for the design system.
 *
 * Every story and sample screen draws from this file so the whole environment
 * reads like one coherent product. Sagamore is a mid-Atlantic parkland course:
 * an 18-hole championship layout plus a 9-hole executive course. Nothing here
 * is real.
 */

export type RateType = "standard" | "twilight" | "member" | "replay";
export type Holes = 9 | 18;
export type BookingStatus = "available" | "limited" | "full" | "maintenance";

export interface Course {
    id: string;
    name: string;
    holes: Holes;
    par: number;
    yardage: number;
    description: string;
}

export interface TeeTime {
    id: string;
    courseId: string;
    /** 24h time, course local. */
    time: string;
    /** Display label, e.g. "7:10 AM". */
    label: string;
    holes: Holes;
    rate: RateType;
    /** Price per player in whole USD. */
    price: number;
    /** Open slots in the group (max 4). */
    spotsLeft: number;
    status: BookingStatus;
    cartIncluded: boolean;
}

export interface Golfer {
    id: string;
    name: string;
    initials: string;
    handicap: number;
    membership: "member" | "guest";
}

export const SAGAMORE = {
    name: "Sagamore Golf Club",
    tagline: "Parkland golf since 1924",
    location: "Owings Mills, MD",
    phone: "(410) 555-0192",
} as const;

export const COURSES: Course[] = [
    {
        id: "championship",
        name: "The Championship",
        holes: 18,
        par: 72,
        yardage: 6841,
        description: "Sagamore’s flagship 18 — tree-lined fairways, a Redan 7th, and a closing stretch along Gwynns Run.",
    },
    {
        id: "executive",
        name: "The Executive",
        holes: 9,
        par: 34,
        yardage: 2710,
        description: "A walkable 9-hole loop, ideal for a quick round after work or first lessons on the par 3s.",
    },
];

export const RATE_LABELS: Record<RateType, string> = {
    standard: "Standard",
    twilight: "Twilight rate",
    member: "Members only",
    replay: "Replay rate",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
    available: "Available",
    limited: "Limited",
    full: "Fully booked",
    maintenance: "Maintenance",
};

export const TEE_TIMES: TeeTime[] = [
    { id: "tt-0710", courseId: "championship", time: "07:10", label: "7:10 AM", holes: 18, rate: "member", price: 0, spotsLeft: 3, status: "available", cartIncluded: true },
    { id: "tt-0740", courseId: "championship", time: "07:40", label: "7:40 AM", holes: 18, rate: "standard", price: 89, spotsLeft: 1, status: "limited", cartIncluded: true },
    { id: "tt-0820", courseId: "championship", time: "08:20", label: "8:20 AM", holes: 18, rate: "standard", price: 89, spotsLeft: 0, status: "full", cartIncluded: true },
    { id: "tt-0915", courseId: "executive", time: "09:15", label: "9:15 AM", holes: 9, rate: "standard", price: 42, spotsLeft: 4, status: "available", cartIncluded: false },
    { id: "tt-1600", courseId: "championship", time: "16:00", label: "4:00 PM", holes: 18, rate: "twilight", price: 55, spotsLeft: 2, status: "available", cartIncluded: true },
    { id: "tt-1730", courseId: "championship", time: "17:30", label: "5:30 PM", holes: 9, rate: "replay", price: 30, spotsLeft: 0, status: "maintenance", cartIncluded: false },
];

export const GOLFERS: Golfer[] = [
    { id: "g-1", name: "Marcus Avery", initials: "MA", handicap: 8.4, membership: "member" },
    { id: "g-2", name: "Priya Raghavan", initials: "PR", handicap: 14.1, membership: "member" },
    { id: "g-3", name: "Dale Whitmore", initials: "DW", handicap: 22.7, membership: "guest" },
    { id: "g-4", name: "Sofia Mendes", initials: "SM", handicap: 5.2, membership: "guest" },
];

/** Formats a per-player price, with member rounds reading "Included". */
export function formatPrice(price: number): string {
    return price === 0 ? "Included" : `$${price}`;
}

export function courseById(id: string): Course | undefined {
    return COURSES.find((c) => c.id === id);
}
