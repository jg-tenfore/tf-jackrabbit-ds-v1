import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PICKLEBALL_CONFIG, SIMULATOR_CONFIG, type ActivityConfig } from "@/components/kiosk/booking/activity-config";
import {
    ActivityBackBar,
    ActivityDayTimePicker,
    ActivityDurationList,
    ActivityResourceGrid,
    ActivityStepFrame,
    durationOptionsFor,
    type ActivityResourceOption,
} from "@/components/kiosk/booking/activity-step-screens";
import { DueBar, PriceBreakdown, VenueSummary } from "@/components/kiosk/booking/booking-summary";
import type { DayAvailability } from "@/components/kiosk/booking/kiosk-date-picker";
import { GroupSizeSelector } from "@/components/kiosk/booking/segmented-selector";
import {
    BookingActionBar,
    BookingUpdatesToggle,
    BookingOccasionChips,
    BookingReviewSection,
    BookingVenuePolicy,
} from "@/components/kiosk/booking/booking-review-sections";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { SignedOutCard } from "@/components/kiosk/app-chrome/wallet-drawer";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { CheckoutMethodFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { GET_STARTED_OPTIONS_WITH_ACTIVITIES, GetStartedScreen } from "@/components/kiosk/screens/get-started-screen";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { WalletInterstitialScreen } from "@/components/kiosk/screens/wallet-interstitial-screen";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import { ACTIVITY_START_TIMES, VENUE } from "@/data/booking";
import { MEMBERS } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "User Flows/Book Activity",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/4-bookActivity\`** — booking a pickleball court or a golf simulator bay.

This is **two sub-flows that are one flow**. Pickleball and the simulator ask the same four questions in the same order — how long, when, which court or bay, then review — and hand off to the same name / checkout / confirmation tail. So they are one \`ActivityConfig\` apart, not two screen sets: every step below renders \`ActivityStepFrame\` plus one step body from \`activity-step-screens\`, with only the config swapped. The stories are declared pickleball-first, then simulator, so the file reads as the two passes through the same machine.

The four steps are separate screens rather than a long form because each answer narrows the next: duration decides which start times fit, start time decides which bays are still free. Showing them together would show options that are about to become invalid.

Steps 1–4 and 15–17 are the shared session envelope — attract, Get Started, the wallet interstitials, name entry, checkout and the sign-off — and are the same components the welcome, interstitial and ordering flows use, unchanged. The review screen borrows \`tee-review-sections\` wholesale: venue policy, the text-updates opt-in and the occasion chips are the same three bands on a tee time as on a bay, and a second copy of them is exactly the drift this library is being restructured to remove.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Fixtures
//
// Fixed to Thursday, January 8th 2026 — the date the references are drawn on.
// A live `new Date()` would make every calendar screenshot differ from the last
// and turn the visual QA pass into noise.
// ---------------------------------------------------------------------------

const BOOKING_DATE = new Date(2026, 0, 8);

/** January 2026, bookable on weekdays from the 8th — matching the reference month grid. */
const JANUARY_2026: DayAvailability[] = Array.from({ length: 31 }, (_, i) => {
    const date = new Date(2026, 0, i + 1);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return { date, isAvailable: date.getDate() >= 8 && !isWeekend };
});

/**
 * The strip takes the head of whatever window it is given, so the week stories
 * hand it a list that already starts on the booking date. The month grid gets
 * the whole month, because it needs the days before the 8th to draw them greyed
 * rather than missing.
 */
const JANUARY_2026_FROM_THE_8TH = JANUARY_2026.slice(7);

/** Every unit is the same price and cap, so the card is comparing names and places. */
const RATE_NOTE = "$40.00 + 2.49 Fee / hr";

const unit = (maxParticipants: number) => (id: string, name: string, note: string): ActivityResourceOption => ({
    id,
    name,
    note,
    maxParticipants,
    priceCents: 4249,
    rateNote: RATE_NOTE,
});

const court = unit(4);
const bay = unit(6);

const PICKLEBALL_COURTS: ActivityResourceOption[] = [
    court("court-green", "Court Green", "By the clubhouse lawn"),
    court("racquet-yard", "The Racquet Yard", "Behind the tennis pavilion"),
    court("lakeside", "Lakeside Courts", "Along the shoreline"),
    court("pickle-lawn", "The Pickle Lawn", "Near the driving range"),
    court("north", "North Courts", "Past the tennis complex"),
];

const SIMULATOR_BAYS: ActivityResourceOption[] = [
    bay("caddy-cove", "Caddy Cove", "By the jukebox"),
    bay("slice-shack", "Slice Shack", "At the bar counter"),
    bay("hook-haven", "Hook Haven", "Next to the dartboard"),
    bay("putt-palace", "Putt Palace", "Beside the pool table"),
    bay("birdie-bar", "Birdie Bar", "Near the entrance"),
    bay("eagles-nest", "Eagle's Nest", "Close to the restrooms"),
    bay("fairway-fizz", "Fairway Fizz", "In the corner booth"),
    bay("fairway-lounge", "The Fairway Lounge", "At the window seat"),
    bay("the-birdie-bar", "The Birdie Bar", "At the window seat"),
    bay("the-slice-shack", "The Slice Shack", "At the window seat"),
];

const VENUE_POLICY = [
    "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.",
    "Cras mattis consectetur purus sit amet fermentum.",
];

const OCCASIONS = ["Celebration", "Gathering", "Networking", "Reunion", "Birthday", "Corporate outing", "Just for fun"];

/** The mid-flow footer: Back above the rail, exactly as every step draws it. */
const stepFooter = (
    <>
        <ActivityBackBar onBack={() => {}} />
        <GlobalNav />
    </>
);

/**
 * One mid-flow step, at a fixed state.
 *
 * A design reference is a single frozen step, so the stories drive the
 * stateless `ActivityStepFrame` directly rather than the `ActivityBooking`
 * driver — same components either way, but a story can pin step 3 without
 * having to answer steps 1 and 2 first.
 */
const step = (
    config: ActivityConfig,
    currentStepId: string,
    completedStepIds: string[],
    body: React.ReactNode,
    subtitle?: string,
) => (
    <KioskScreen scroll={false} footer={stepFooter}>
        <ActivityStepFrame
            config={config}
            currentStepId={currentStepId}
            completedStepIds={completedStepIds}
            subtitle={subtitle}
            showBrandCard
        >
            {body}
        </ActivityStepFrame>
    </KioskScreen>
);

// ---------------------------------------------------------------------------
// 1–4. The session envelope, shared with the welcome and interstitial flows
// ---------------------------------------------------------------------------

/** The attract loop. Booking a court starts the same way everything else does. */
export const Attract: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen onSelect={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The hub, carrying the two bookable activities.
 *
 * `GET_STARTED_OPTIONS_WITH_ACTIVITIES` is the same six-card grid the welcome
 * flow shows — Pickleball Courts and Golf Simulator Bays are two more options
 * in it, not a second screen, because the grid lays out whatever it is given.
 */
export const GetStarted: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <GetStartedScreen options={GET_STARTED_OPTIONS_WITH_ACTIVITIES} onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * "Do you want to log in?" — asked before the booking, not after.
 *
 * No chrome at all. The rail's wallet drawer would offer a third route to log
 * in beside the scan target and Enter Code, on the one screen whose entire job
 * is to make that choice feel simple.
 */
export const DoYouWantToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <ScanPromptScreen onEnterCode={() => {}} onDecline={() => {}} onHowToLogIn={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};

/** "Log in below for everything" — the case for connecting a wallet first. */
export const LogInBelowForEverything: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WalletInterstitialScreen />
        </KioskScreen>
    ),
};

// ---------------------------------------------------------------------------
// 5–8. Pickleball
// ---------------------------------------------------------------------------

/**
 * Picking a day, month view.
 *
 * The expanded state of `KioskDatePicker`. It is not the default: a kiosk
 * booking is overwhelmingly for today or tomorrow, and the collapsed strip
 * answers that in one tap. The month is here for genuine advance booking, and
 * it keeps unavailable days visible rather than removing them — absence of
 * inventory is information, and a month that changed shape as you paged it
 * would be unreadable.
 */
export const PickleballSelectDayMonth: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            PICKLEBALL_CONFIG,
            "start-time",
            ["duration"],
            <ActivityDayTimePicker
                selected={BOOKING_DATE}
                onSelect={() => {}}
                days={JANUARY_2026}
                mode="month"
                times={ACTIVITY_START_TIMES}
                onSelectTime={() => {}}
            />,
        ),
};

/** The same step collapsed: a five-day strip over the half-hour grid. */
export const PickleballSelectTime: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            PICKLEBALL_CONFIG,
            "start-time",
            ["duration"],
            <ActivityDayTimePicker
                selected={BOOKING_DATE}
                onSelect={() => {}}
                days={JANUARY_2026_FROM_THE_8TH}
                mode="week"
                times={ACTIVITY_START_TIMES}
                onSelectTime={() => {}}
            />,
        ),
};

/**
 * "How long do you want to play for?" — 30 minutes to 4 hours.
 *
 * A stacked list, not the joined `SegmentedSelector` used for group size: eight
 * segments across the content column would put every target under the kiosk
 * touch floor, and "2.5 hours court time" does not fit one anyway.
 *
 * **Copy note:** the reference says "bay time" on the pickleball screens too.
 * That is a copy-paste in the design — pickleball has no bays — so the noun
 * comes from `config.resourceNoun` instead.
 */
export const PickleballDuration: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            PICKLEBALL_CONFIG,
            "duration",
            [],
            <ActivityDurationList
                title="How long do you want to play for?"
                options={durationOptionsFor(PICKLEBALL_CONFIG)}
                onSelect={() => {}}
            />,
        ),
};

/** The courts. Two columns, because what differs between them is only the name. */
export const PickleballCourtLocation: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            PICKLEBALL_CONFIG,
            "resource",
            ["duration", "start-time"],
            <ActivityResourceGrid title="Select available court locations" resources={PICKLEBALL_COURTS} onSelect={() => {}} />,
        ),
};

// ---------------------------------------------------------------------------
// 9–12. Golf simulator — the identical four steps, one config apart
// ---------------------------------------------------------------------------

/** Same screen, same component, `SIMULATOR_CONFIG` instead. */
export const SimulatorSelectDayMonth: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            SIMULATOR_CONFIG,
            "start-time",
            ["duration"],
            <ActivityDayTimePicker
                selected={BOOKING_DATE}
                onSelect={() => {}}
                days={JANUARY_2026}
                mode="month"
                times={ACTIVITY_START_TIMES}
                onSelectTime={() => {}}
            />,
            "Indoor Golf Experience for 2 hours",
        ),
};

/** The collapsed strip and the grid, with the answers so far folded into the subtitle. */
export const SimulatorSelectTime: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            SIMULATOR_CONFIG,
            "start-time",
            ["duration"],
            <ActivityDayTimePicker
                selected={BOOKING_DATE}
                onSelect={() => {}}
                days={JANUARY_2026_FROM_THE_8TH}
                mode="week"
                times={ACTIVITY_START_TIMES}
                onSelectTime={() => {}}
            />,
            "Indoor Golf Experience for 2 hours",
        ),
};

/** The same eight durations, named "bay time" because the config says Bay. */
export const SimulatorDuration: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            SIMULATOR_CONFIG,
            "duration",
            [],
            <ActivityDurationList
                title="How long do you want to play for?"
                options={durationOptionsFor(SIMULATOR_CONFIG)}
                onSelect={() => {}}
            />,
        ),
};

/** Ten bays. The grid scrolls; the rail, title and Back bar do not move. */
export const SimulatorBayLocation: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () =>
        step(
            SIMULATOR_CONFIG,
            "resource",
            ["duration", "start-time"],
            <ActivityResourceGrid title="Select available bay locations" resources={SIMULATOR_BAYS} onSelect={() => {}} />,
            "Indoor Golf Experience for 2 hours starting at 7am",
        ),
};

// ---------------------------------------------------------------------------
// 13–14. Review
// ---------------------------------------------------------------------------

/**
 * The review screen body.
 *
 * It scrolls inside its own container rather than through `KioskScreen`, so the
 * "scrolled" story can start part-way down and prove the bands below the fold
 * are the same markup as the ones above it — which is the only thing a pair of
 * review stories is for.
 */
const ReviewBody = ({ initialScroll = 0 }: { initialScroll?: number }) => {
    const scroller = useRef<HTMLDivElement>(null);
    const [groupSize, setGroupSize] = useState(2);
    const [wantsUpdates, setWantsUpdates] = useState(true);
    const [occasion, setOccasion] = useState<string | null>(null);

    useEffect(() => {
        scroller.current?.scrollTo({ top: initialScroll });
    }, [initialScroll]);

    return (
        <div ref={scroller} className="h-full overflow-y-auto scrollbar-hide">
            <BookingReviewSection>
                <VenueSummary
                    venueName={VENUE.name}
                    address={VENUE.address}
                    resource="Caddy Cove"
                    date="Thursday, January 8th, 2026"
                    duration="2 hours"
                    startTime="3:00PM"
                />
            </BookingReviewSection>

            <BookingReviewSection>
                <GroupSizeSelector value={groupSize} onChange={setGroupSize} max={SIMULATOR_CONFIG.maxGroupSize} />
            </BookingReviewSection>

            <BookingReviewSection>
                <PriceBreakdown
                    lines={[
                        { label: "Reservation Fees", value: "$92.00" },
                        { label: "Convenience Fee", value: "$5.00" },
                        { label: "Estimate Taxes", value: "$1.71" },
                        { label: "Total", value: "$55.22", isTotal: true },
                    ]}
                    footnote="*Morbi leo risus, porta ac consectetur ac, vestibulum at eros."
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
    );
};

/**
 * Totals then commit, both pinned above the rail.
 *
 * Wrapped in an opaque band because the body scrolls behind it: `DueBar` has no
 * background of its own, and a transparent totals row over moving text is the
 * one place on this screen a number could be misread.
 */
const reviewFooter = (
    <>
        <div className="bg-primary">
            <DueBar dueNow="$20.74" dueLater="$1.71" total="$55.22" />
            <BookingActionBar onBack={() => {}} onBook={() => {}} />
        </div>
        <GlobalNav />
    </>
);

/**
 * Review, above the fold.
 *
 * The facts, the group size and the money — assembled from `booking-summary`,
 * which the tee-time review uses for the same three jobs. The due bar is pinned
 * above the commit pair so the number never scrolls away from the button that
 * charges it.
 *
 * The pickleball review is the same screen with a court name and a 4-wide group
 * selector; it is not a separate story because nothing about the composition
 * changes, which is the whole argument for one flow.
 */
export const ReviewBooking: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={reviewFooter}>
            <ReviewBody />
        </KioskScreen>
    ),
};

/**
 * The same screen scrolled to the bands below the fold.
 *
 * Venue policy, the text-updates opt-in and the occasion chips. All three are
 * imported from `booking-review-sections` unchanged — a booking is a booking, and
 * building a second set of these for activities is exactly the duplication this
 * library is being restructured to remove.
 */
export const ReviewBookingScrolled: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={reviewFooter}>
            <ReviewBody initialScroll={700} />
        </KioskScreen>
    ),
};

// ---------------------------------------------------------------------------
// 15–17. Name, checkout, sign-off
// ---------------------------------------------------------------------------

/**
 * Whose reservation this is.
 *
 * The `EntryScreen` template, unchanged from the auth and ordering flows: brand
 * mark, title, subtitle, field, keyboard, Go Back / Continue. No rail, so the
 * keyboard has the room it needs.
 *
 * **Copy note:** the reference subtitle reads "for your food order", which is
 * the sandwich flow's line left in the booking export. It is a prop, so this
 * story passes the reservation wording instead.
 */
export const EnterYourName: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Name() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false}>
                <EntryScreen
                    title="Enter your name"
                    subtitle="Enter your full name for your reservation."
                    field={<EntryTextField value={value} placeholder="Enter your Full Name" />}
                    value={value}
                    onChange={setValue}
                    onContinue={() => {}}
                    onBack={() => {}}
                />
            </KioskScreen>
        );
    },
};

/**
 * Where to pay.
 *
 * The full-screen modal from the ordering flow, unchanged — paying is the same
 * question whether you are buying a sandwich or two hours in a bay, and the
 * reference draws it covering the review screen rather than adapting to it.
 */
export const CheckoutMethod: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={reviewFooter}>
            <ReviewBody />
            <CheckoutMethodFullScreen isOpen onOpenChange={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The last screen of the session.
 *
 * The rail is down to its sign-off state: no Start Over, no drawer, just the
 * "Logged out" tick. Everything the rail spends a session offering is moot once
 * the booking is made, and leaving Start Over on it would invite a tap that
 * does nothing.
 */
export const Confirmation: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen
            scroll={false}
            footer={
                <div className="relative h-[110px] w-full bg-primary">
                    <div className="absolute right-16 bottom-0">
                        <SignedOutCard />
                    </div>
                </div>
            }
        >
            <OrderSuccessfulScreen onDismiss={() => {}} />
        </KioskScreen>
    ),
};
