"use client";

import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { type ActivityConfig, PICKLEBALL_CONFIG, SIMULATOR_CONFIG } from "@/components/kiosk/booking/activity-config";
import {
    ActivityBackBar,
    ActivityDayTimePicker,
    ActivityDurationList,
    ActivityResourceGrid,
    type ActivityResourceOption,
    ActivityStepFrame,
    durationLabel,
    durationOptionsFor,
} from "@/components/kiosk/booking/activity-step-screens";
import {
    BookingActionBar,
    BookingOccasionChips,
    BookingReviewSection,
    BookingUpdatesToggle,
    BookingVenuePolicy,
} from "@/components/kiosk/booking/booking-review-sections";
import { DueBar, PriceBreakdown, VenueSummary } from "@/components/kiosk/booking/booking-summary";
import { GroupSizeSelector } from "@/components/kiosk/booking/segmented-selector";
import type { TeeTimeSlot } from "@/components/kiosk/booking/slot-card";
import type { BookingStep } from "@/components/kiosk/booking/step-rail";
import { TeeTimeBooking } from "@/components/kiosk/booking/tee-time-booking";
import { KioskButton } from "@/components/kiosk/kiosk-button";
import { TEE_TIMES, VENUE, centsToUsd } from "@/data/booking";
import { COURSES } from "@/data/sagamore";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { useNavigation } from "@/prototype/navigation";
import { type BookingDraft, usePrototype } from "@/prototype/prototype-state";
import { registerSessionReset, useEndSession } from "@/prototype/session-lifecycle";

/**
 * The booking flow — one set of screens serving a tee time, a simulator bay and
 * a pickleball court.
 *
 * Simulator and pickleball are the same four questions in the same order and
 * differ only by `ActivityConfig`, exactly as `activity-config.ts` argues. Tee
 * time is a genuinely different first screen (a filtered tee sheet with a rate
 * picker over it) but the same last two, so it joins the flow at the resource
 * step rather than forking it: `TEE_TIME_CONFIG` below is the third config, not
 * a third screen set.
 *
 * Every step writes what was chosen into the session's `BookingDraft`, so the
 * review screen reports the real date, the real start time, the real duration
 * and the real resource — and `confirmBooking()` pushes a priced line into the
 * same cart a sandwich lands in.
 */

export type BookingKind = BookingDraft["kind"];

// ---------------------------------------------------------------------------
// Which activity is being booked
// ---------------------------------------------------------------------------

/**
 * The parts of the choice `BookingDraft` has no field for.
 *
 * The draft holds what the *review screen* has to display. This holds what the
 * remaining steps need to keep computing it: which activity we are in, the tee
 * rate that was confirmed (its per-player price is what group size multiplies),
 * and the duration in hours (the label alone would have to be re-parsed).
 *
 * It is a context because the shell owns the screen switch — a step cannot pass
 * a prop to the step after it. `useBookingActivity` falls back to a module-level
 * store when no provider is mounted, so a shell that forgets to wrap gets a
 * working prototype rather than a thrown error on the first booking tap.
 */
export interface BookingChoice {
    activity: BookingKind;
    /** Tee time only — the rate confirmed in the rate picker. */
    teeRate: TeeTimeSlot | null;
    /** Simulator and pickleball only. */
    durationHours: number | null;
}

interface BookingActivityValue extends BookingChoice {
    setActivity: (kind: BookingKind) => void;
    setTeeRate: (rate: TeeTimeSlot | null) => void;
    setDurationHours: (hours: number | null) => void;
    /** Start Over. Clears the choice without touching the cart. */
    reset: () => void;
}

const EMPTY_CHOICE: BookingChoice = { activity: "tee-time", teeRate: null, durationHours: null };

const BookingActivityContext = createContext<BookingActivityValue | null>(null);

export const BookingActivityProvider = ({ children }: { children: ReactNode }) => {
    const [choice, setChoice] = useState<BookingChoice>(EMPTY_CHOICE);

    // Stable, so it can be registered once rather than re-registered on every
    // change to the choice it resets.
    const reset = useCallback(() => setChoice(EMPTY_CHOICE), []);

    // Which activity is being booked is transient, but it still cannot outlive
    // the session: left alone, the next customer starts inside the last one's
    // flow. Registering here means no screen has to remember to clear it.
    useEffect(() => registerSessionReset(reset), [reset]);

    const value = useMemo<BookingActivityValue>(
        () => ({
            ...choice,
            setActivity: (activity) => setChoice((prev) => ({ ...prev, activity })),
            setTeeRate: (teeRate) => setChoice((prev) => ({ ...prev, teeRate })),
            setDurationHours: (durationHours) => setChoice((prev) => ({ ...prev, durationHours })),
            reset,
        }),
        [choice, reset],
    );

    return <BookingActivityContext.Provider value={value}>{children}</BookingActivityContext.Provider>;
};

// The fallback store. Module state rather than a default context value, because
// a default object would be frozen at import and setters on it would silently
// do nothing — the one failure mode worse than throwing.
let fallbackChoice: BookingChoice = EMPTY_CHOICE;
const fallbackListeners = new Set<() => void>();
const subscribeFallback = (listener: () => void) => {
    fallbackListeners.add(listener);
    return () => fallbackListeners.delete(listener);
};
const setFallbackChoice = (next: Partial<BookingChoice>) => {
    fallbackChoice = { ...fallbackChoice, ...next };
    fallbackListeners.forEach((listener) => listener());
};

export const useBookingActivity = (): BookingActivityValue => {
    const provided = useContext(BookingActivityContext);
    const choice = useSyncExternalStore(
        subscribeFallback,
        () => fallbackChoice,
        () => fallbackChoice,
    );

    const fallback = useMemo<BookingActivityValue>(
        () => ({
            ...choice,
            setActivity: (activity) => setFallbackChoice({ activity }),
            setTeeRate: (teeRate) => setFallbackChoice({ teeRate }),
            setDurationHours: (durationHours) => setFallbackChoice({ durationHours }),
            reset: () => setFallbackChoice(EMPTY_CHOICE),
        }),
        [choice],
    );

    return provided ?? fallback;
};

// ---------------------------------------------------------------------------
// Configs
// ---------------------------------------------------------------------------

/**
 * The tee sheet as an `ActivityConfig`.
 *
 * A tee time has no hourly rate and no duration list, so those fields are inert
 * here — but the resource and review steps are driven entirely by the config,
 * and describing a course as one more bookable unit is what lets those two
 * screens serve all three activities instead of two of them.
 */
const TEE_TIME_CONFIG: ActivityConfig = {
    id: "tee-time",
    title: "Book a tee time",
    subtitle: "Browse tee times and book today or in advance",
    resourceNoun: "Course",
    durations: [],
    defaultDuration: 0,
    resources: COURSES.map((course) => ({
        id: course.id,
        name: course.name,
        note: `${course.holes} holes · par ${course.par}`,
    })),
    hourlyRateCents: 0,
    maxGroupSize: 4,
};

const CONFIGS: Record<BookingKind, ActivityConfig> = {
    "tee-time": TEE_TIME_CONFIG,
    simulator: SIMULATOR_CONFIG,
    pickleball: PICKLEBALL_CONFIG,
};

export const configFor = (kind: BookingKind) => CONFIGS[kind];

/**
 * The rail, in the order the prototype actually walks.
 *
 * When comes before how long: a kiosk booking starts from "is there anything at
 * four?", and a duration chosen against no visible inventory is a guess. Tee
 * time drops the duration row entirely — a round is as long as it is.
 */
const stepsForKind = (kind: BookingKind): BookingStep[] =>
    kind === "tee-time"
        ? [
              { id: "start-time", label: "Tee time" },
              { id: "resource", label: "Course" },
              { id: "review", label: "Review" },
          ]
        : [
              { id: "start-time", label: "Start time" },
              { id: "duration", label: "Duration" },
              { id: "resource", label: `${CONFIGS[kind].resourceNoun} location` },
              { id: "review", label: "Review" },
          ];

// ---------------------------------------------------------------------------
// Money
//
// The draft carries the *pre-tax* total, because the cart applies the same
// 8.25% to every line it holds. Showing tax on the review screen and then
// having the order screen add it again to a tax-inclusive number is the one
// arithmetic error a stakeholder will always catch.
// ---------------------------------------------------------------------------

const CONVENIENCE_FEE_CENTS = 500;
const TAX_RATE = 0.0825;

/** Per-player for a tee time; per bay or court for an activity. */
const reservationCents = (kind: BookingKind, groupSize: number, choice: BookingChoice) => {
    if (kind === "tee-time") return (choice.teeRate?.priceCents ?? 0) * groupSize;
    const config = CONFIGS[kind];
    return Math.round(config.hourlyRateCents * (choice.durationHours ?? config.defaultDuration));
};

/** What the draft's `priceCents` must be for a given group size. */
const preTaxCents = (kind: BookingKind, groupSize: number, choice: BookingChoice) => reservationCents(kind, groupSize, choice) + CONVENIENCE_FEE_CENTS;

const priceLinesFor = (draft: BookingDraft, choice: BookingChoice) => {
    const reservation = reservationCents(draft.kind, draft.groupSize, choice);
    const preTax = reservation + CONVENIENCE_FEE_CENTS;
    const tax = Math.round(preTax * TAX_RATE);
    return {
        totalCents: preTax + tax,
        lines: [
            { label: "Reservation Fees", value: centsToUsd(reservation) },
            { label: "Convenience Fee", value: centsToUsd(CONVENIENCE_FEE_CENTS) },
            { label: "Estimate Taxes", value: centsToUsd(tax) },
            { label: "Total", value: centsToUsd(preTax + tax), isTotal: true },
        ],
    };
};

// ---------------------------------------------------------------------------
// Shared wiring
// ---------------------------------------------------------------------------

/**
 * `GlobalNav` bound to the session.
 *
 * The rail's cart, its View My Order and its Start Over are the same three
 * wires on every screen that carries it, and they are wires rather than markup
 * — so this lives here and the envelope screens import it, rather than each
 * screen repeating the bindings and drifting on one of them.
 */
export const PrototypeGlobalNav = ({ isPromptExpanded, className }: { isPromptExpanded?: boolean; className?: string }) => {
    const { itemCount, totalCents } = usePrototype();
    const { go } = useNavigation();
    const endSession = useEndSession();

    return (
        <GlobalNav
            cartCount={itemCount}
            cartTotal={totalCents / 100}
            hasOrder={itemCount > 0}
            isPromptExpanded={isPromptExpanded}
            className={className}
            onViewOrder={() => go("order-review")}
            onHowToLogIn={() => go("how-to-log-in")}
            onStartOver={endSession}
        />
    );
};

/** A fresh draft. Group size 2 is the modal booking, and the references draw it. */
export const startBookingDraft = (kind: BookingKind): BookingDraft => ({
    kind,
    resourceLabel: "",
    date: new Date(),
    startTime: "",
    groupSize: 2,
    priceCents: 0,
});

const formatDate = (date: Date) => date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

/**
 * What a booking screen shows when there is no draft to show.
 *
 * Reachable only by landing on a booking screen out of order, which a kiosk
 * cannot do but a developer with a deep link can. It offers the one thing that
 * is certainly correct rather than rendering an empty summary.
 */
const NoBookingScreen = () => {
    const endSession = useEndSession();

    return (
        <KioskScreen scroll={false} footer={<PrototypeGlobalNav />}>
            <div className="flex h-full flex-col items-center justify-center gap-6 px-16 text-center">
                <h1 className="text-4xl font-bold text-primary">No booking in progress</h1>
                <p className="text-xl text-tertiary">Start again to choose a tee time, a bay or a court.</p>
                <KioskButton tone="primary" onPress={endSession}>
                    Start Over
                </KioskButton>
            </div>
        </KioskScreen>
    );
};

// ---------------------------------------------------------------------------
// Step 1 — when
// ---------------------------------------------------------------------------

/**
 * Pick a day and a start time.
 *
 * Two shapes, because the inventory genuinely differs. A tee sheet is a filtered
 * list of *priced* slots at a 6-minute cadence, and the same time is sold at
 * several rates — so it is `TeeTimeBooking`, and confirming a rate is what
 * carries the answer forward. An activity prices by duration, so its grid is
 * bare half-hour cells and one tap is the whole answer.
 */
export const BookingWhenRoute = () => {
    const { activity, setTeeRate } = useBookingActivity();
    const { booking, setBooking } = usePrototype();
    const { go, goBack, canGoBack } = useNavigation();

    const draft = booking ?? startBookingDraft(activity);
    const config = CONFIGS[activity];

    const [date, setDate] = useState<Date>(draft.date);
    const [mode, setMode] = useState<"week" | "month">("week");

    const back = () => (canGoBack ? goBack() : undefined);

    if (activity === "tee-time") {
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <>
                        <BookingActionBar backLabel="Back" onBack={back} />
                        <PrototypeGlobalNav />
                    </>
                }
            >
                <TeeTimeBooking
                    slots={TEE_TIMES}
                    onSelectSlot={(rate, selectedDate) => {
                        setTeeRate(rate);
                        setBooking({ ...draft, date: selectedDate, startTime: rate.time });
                        go("booking-resource");
                    }}
                />
            </KioskScreen>
        );
    }

    return (
        <KioskScreen
            scroll={false}
            footer={
                <>
                    <ActivityBackBar onBack={back} />
                    <PrototypeGlobalNav />
                </>
            }
        >
            <ActivityStepFrame config={config} steps={stepsForKind(activity)} currentStepId="start-time" showBrandCard>
                <ActivityDayTimePicker
                    selected={date}
                    onSelect={(next) => {
                        setDate(next);
                        setBooking({ ...draft, date: next });
                    }}
                    mode={mode}
                    onModeChange={setMode}
                    times={ACTIVITY_TIMES}
                    selectedTime={draft.startTime || null}
                    onSelectTime={(time) => {
                        setBooking({ ...draft, date, startTime: time });
                        go("booking-duration");
                    }}
                />
            </ActivityStepFrame>
        </KioskScreen>
    );
};

/**
 * The half-hour grid, trimmed to a plausible booking window.
 *
 * `ACTIVITY_START_TIMES` runs 6:00 AM to 10:00 PM — 33 cells, which is right for
 * a fixture and long for a demo. Nine hours of it still scrolls and still
 * proves the grid scrolls.
 */
const ACTIVITY_TIMES = Array.from({ length: 18 }, (_, i) => {
    const minutes = 8 * 60 + i * 30;
    const hour24 = Math.floor(minutes / 60);
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12}:${String(minutes % 60).padStart(2, "0")} ${hour24 >= 12 ? "PM" : "AM"}`;
});

// ---------------------------------------------------------------------------
// Step 2 — how long (activities only)
// ---------------------------------------------------------------------------

/**
 * How long the bay or court is held.
 *
 * The durations come from the config rather than the generic half-hour ladder:
 * a simulator sells 1, 2 or 3 hours and a court sells 1 or 2, and offering
 * eight options the venue does not sell makes the price on the next screen a
 * fiction.
 */
export const BookingDurationRoute = () => {
    const { activity, durationHours, setDurationHours } = useBookingActivity();
    const { booking, setBooking } = usePrototype();
    const { go, goBack, canGoBack } = useNavigation();

    if (!booking || booking.kind === "tee-time") return <NoBookingScreen />;

    const config = CONFIGS[booking.kind];

    return (
        <KioskScreen
            scroll={false}
            footer={
                <>
                    <ActivityBackBar onBack={() => canGoBack && goBack()} />
                    <PrototypeGlobalNav />
                </>
            }
        >
            <ActivityStepFrame
                config={config}
                steps={stepsForKind(activity)}
                currentStepId="duration"
                completedStepIds={["start-time"]}
                subtitle={`${config.subtitle} starting at ${booking.startTime}`}
                showBrandCard
            >
                <ActivityDurationList
                    title="How long do you want to play for?"
                    options={durationOptionsFor(config, config.durations)}
                    value={durationHours}
                    onSelect={(hours) => {
                        setDurationHours(hours);
                        setBooking({ ...booking, durationLabel: durationLabel(hours, config) });
                        go("booking-resource");
                    }}
                />
            </ActivityStepFrame>
        </KioskScreen>
    );
};

// ---------------------------------------------------------------------------
// Step 3 — which bay, court or course
// ---------------------------------------------------------------------------

/**
 * The bookable units, priced.
 *
 * Price is derived, not fixture text: a bay card shows the hourly rate times the
 * duration just chosen, and a course card shows the confirmed tee rate. The
 * cards are what commit the price into the draft, so the review screen cannot
 * disagree with the card that was pressed.
 */
export const BookingResourceRoute = () => {
    const choice = useBookingActivity();
    const { booking, setBooking } = usePrototype();
    const { go, goBack, canGoBack } = useNavigation();

    if (!booking) return <NoBookingScreen />;

    const kind = booking.kind;
    const config = CONFIGS[kind];
    const isTeeTime = kind === "tee-time";
    // A course card prices *per player*, because that is what its rate note
    // says and what the rate picker quoted; a bay card prices the whole bay for
    // the duration chosen. Showing a group total against "per player" was the
    // one number on this screen that read as wrong.
    const cardPriceCents = isTeeTime ? (choice.teeRate?.priceCents ?? 0) : reservationCents(kind, booking.groupSize, choice);

    const resources: ActivityResourceOption[] = config.resources.map((resource) => ({
        id: resource.id,
        name: resource.name,
        note: resource.note,
        maxParticipants: config.maxGroupSize,
        priceCents: cardPriceCents,
        rateNote: isTeeTime ? `${choice.teeRate?.rateName ?? "Green fee"} · per player` : `${centsToUsd(config.hourlyRateCents)} / hr`,
        isAvailable: resource.isAvailable,
    }));

    return (
        <KioskScreen
            scroll={false}
            footer={
                <>
                    <ActivityBackBar onBack={() => canGoBack && goBack()} />
                    <PrototypeGlobalNav />
                </>
            }
        >
            <ActivityStepFrame
                config={config}
                steps={stepsForKind(kind)}
                currentStepId="resource"
                completedStepIds={isTeeTime ? ["start-time"] : ["start-time", "duration"]}
                subtitle={
                    isTeeTime
                        ? `${choice.teeRate?.rateName ?? "Tee time"} at ${booking.startTime}`
                        : `${booking.durationLabel ?? config.subtitle} starting at ${booking.startTime}`
                }
                showBrandCard
            >
                <ActivityResourceGrid
                    title={isTeeTime ? "Select your course" : `Select available ${config.resourceNoun.toLowerCase()} locations`}
                    resources={resources}
                    selectedId={config.resources.find((resource) => resource.name === booking.resourceLabel)?.id ?? null}
                    onSelect={(id) => {
                        const picked = config.resources.find((resource) => resource.id === id);
                        setBooking({
                            ...booking,
                            resourceLabel: picked?.name ?? booking.resourceLabel,
                            priceCents: preTaxCents(kind, booking.groupSize, choice),
                        });
                        go("booking-review");
                    }}
                />
            </ActivityStepFrame>
        </KioskScreen>
    );
};

// ---------------------------------------------------------------------------
// Step 4 — review
// ---------------------------------------------------------------------------

/** Fixture prose. The venue's own words, so it stays a prop rather than markup. */
const VENUE_POLICY = [
    "Reservations are held for fifteen minutes past the start time. Arrive at the pro shop ten minutes early to check in, collect your cart and settle any balance due.",
    "Cancellations made more than 24 hours ahead are refunded in full. Inside 24 hours the reservation fee is retained; the convenience fee is never refunded.",
];

const OCCASIONS = ["Celebration", "Gathering", "Networking", "Reunion", "Birthday", "Corporate outing", "Just for fun"];

/**
 * Confirm and price it.
 *
 * Every value on this screen comes from the draft rather than a fixture, which
 * is the whole point of the three steps before it. Group size is the one thing
 * still changeable here, so it sits directly above the money it moves — and on
 * a tee time it really does move it, because the rate is per player.
 *
 * Book Now commits the draft into the cart and hands off to the order review,
 * where a booking is one more line beside a sandwich.
 */
export const BookingReviewRoute = () => {
    const choice = useBookingActivity();
    const { booking, setBooking, confirmBooking } = usePrototype();
    const { go, goBack, canGoBack } = useNavigation();

    const [wantsUpdates, setWantsUpdates] = useState(true);
    const [occasion, setOccasion] = useState<string | null>(null);

    if (!booking) return <NoBookingScreen />;

    const config = CONFIGS[booking.kind];
    const { lines, totalCents } = priceLinesFor(booking, choice);

    return (
        <KioskScreen
            footer={
                <>
                    {/* Opaque, because the body scrolls behind it: `DueBar` has
                        no background of its own and a total over moving text is
                        the one number on this screen that could be misread. */}
                    <div className="bg-primary">
                        <DueBar dueNow={centsToUsd(totalCents)} total={centsToUsd(totalCents)} />
                        <BookingActionBar
                            onBack={() => canGoBack && goBack()}
                            onBook={() => {
                                confirmBooking();
                                go("order-review");
                            }}
                            isBookDisabled={!booking.resourceLabel}
                        />
                    </div>
                    <PrototypeGlobalNav />
                </>
            }
        >
            <div className="flex flex-col">
                <BookingReviewSection className="border-t-0 pt-10">
                    <VenueSummary
                        venueName={VENUE.name}
                        address={VENUE.address}
                        resource={booking.resourceLabel}
                        date={formatDate(booking.date)}
                        duration={booking.durationLabel}
                        startTime={booking.startTime}
                    />
                </BookingReviewSection>

                <BookingReviewSection>
                    <GroupSizeSelector
                        value={booking.groupSize}
                        max={config.maxGroupSize}
                        onChange={(groupSize) => setBooking({ ...booking, groupSize, priceCents: preTaxCents(booking.kind, groupSize, choice) })}
                    />
                </BookingReviewSection>

                <BookingReviewSection>
                    <PriceBreakdown
                        lines={lines}
                        footnote={
                            booking.kind === "tee-time"
                                ? "*Reservation fees are charged per player. Cart fees are settled at the pro shop."
                                : `*${config.resourceNoun} time is charged for the whole ${config.resourceNoun.toLowerCase()}, however many of you play.`
                        }
                    />
                </BookingReviewSection>

                <BookingReviewSection>
                    <BookingVenuePolicy paragraphs={VENUE_POLICY} />
                </BookingReviewSection>

                <BookingReviewSection>
                    <BookingUpdatesToggle isSelected={wantsUpdates} onChange={setWantsUpdates} />
                </BookingReviewSection>

                <BookingReviewSection>
                    <BookingOccasionChips options={OCCASIONS} value={occasion} onChange={setOccasion} />
                </BookingReviewSection>
            </div>
        </KioskScreen>
    );
};
