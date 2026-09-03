/**
 * Activity booking configuration.
 *
 * The simulator and pickleball flows are the same flow: pick a duration, pick a
 * start time, pick a bay or court, review. They differ only in wording and in
 * which durations are offered. Encoding that as config rather than two
 * component trees means a fix to the time grid lands on every activity at once,
 * and a third activity (range bays, lessons) costs a config object rather than
 * a copy of the flow.
 */

export interface ActivityConfig {
    id: string;
    title: string;
    subtitle: string;
    /** What a bookable unit is called here — "Bay", "Court", "Lane". */
    resourceNoun: string;
    /** Bookable durations in hours. */
    durations: number[];
    defaultDuration: number;
    /** Named units a guest chooses between. */
    resources: { id: string; name: string; note?: string; isAvailable?: boolean }[];
    /** Hourly rate in cents, before fees. */
    hourlyRateCents: number;
    maxGroupSize: number;
}

export const SIMULATOR_CONFIG: ActivityConfig = {
    id: "golf-simulator",
    title: "Golf Simulator Bays",
    subtitle: "Indoor Golf Experience",
    resourceNoun: "Bay",
    durations: [1, 2, 3],
    defaultDuration: 2,
    resources: [
        { id: "bay-1", name: "Caddy Cove", note: "Trackman 4" },
        { id: "bay-2", name: "The Bunker", note: "Trackman 4" },
        { id: "bay-3", name: "Fairway Lounge", note: "Full swing" },
        { id: "bay-4", name: "The Turn", note: "Full swing", isAvailable: false },
    ],
    hourlyRateCents: 4600,
    maxGroupSize: 6,
};

export const PICKLEBALL_CONFIG: ActivityConfig = {
    id: "pickleball",
    title: "Pickle Ball Court",
    subtitle: "Book a court, grab a paddle",
    resourceNoun: "Court",
    durations: [1, 2],
    defaultDuration: 1,
    resources: [
        { id: "court-1", name: "Court 1", note: "Outdoor" },
        { id: "court-2", name: "Court 2", note: "Outdoor" },
        { id: "court-3", name: "Court 3", note: "Covered" },
    ],
    hourlyRateCents: 2400,
    maxGroupSize: 4,
};

export const ACTIVITY_CONFIGS = {
    simulator: SIMULATOR_CONFIG,
    pickleball: PICKLEBALL_CONFIG,
} as const;

/** The four steps every activity booking walks, in order. */
export const ACTIVITY_STEPS = [
    { id: "duration", label: "Duration" },
    { id: "start-time", label: "Start time" },
    { id: "resource", label: "Bay location" },
    { id: "review", label: "Review" },
] as const;

/** Step list with the resource step named for this activity. */
export const stepsFor = (config: ActivityConfig) =>
    ACTIVITY_STEPS.map((step) => (step.id === "resource" ? { id: step.id, label: `${config.resourceNoun} location` } : { id: step.id, label: step.label }));
