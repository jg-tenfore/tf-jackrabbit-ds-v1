import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { SignedOutCard } from "@/components/kiosk/app-chrome/wallet-drawer";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { DueBar, PriceBreakdown, VenueSummary } from "@/components/kiosk/booking/booking-summary";
import { GroupSizeSelector } from "@/components/kiosk/booking/segmented-selector";
import type { TeeTimeSlot } from "@/components/kiosk/booking/slot-card";
import {
    BookingActionBar,
    BookingUpdatesToggle,
    BookingOccasionChips,
    BookingReviewSection,
    BookingVenuePolicy,
} from "@/components/kiosk/booking/booking-review-sections";
import { TeeTimeBooking } from "@/components/kiosk/booking/tee-time-booking";
import { RatePickerDialog } from "@/components/kiosk/modals/dialog-variants";
import { CheckoutMethodFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { WalletInterstitialScreen } from "@/components/kiosk/screens/wallet-interstitial-screen";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import { RATES_FOR_TIME, TEE_TIMES, VENUE } from "@/data/booking";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "User Flows/Book Tee Time",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/3-bookTeeTime\`** — booking a round from the attract loop through to the confirmation.

Stories are declared in flow order, which is the order Storybook lists them in.

The flow is **signed out end to end**. Every reference frame draws the green wallet drawer rather than the identity card, so no \`member\` is passed to \`withKioskSession\` — the drawer stays on offer right through checkout, because a golfer who scans at any point still gets the points on the round they are paying for.

Six of the eleven screens are shared with other flows and are reused verbatim rather than rebuilt: the attract screen (\`Welcome Screen\`), the "Do you want to log in?" branch (\`Auth w New User\`), the wallet interstitial (\`Interstitials\`), name entry, the checkout fork and the confirmation (\`Order Sandwich Guest\`). Restating them here is the point — the flow is a running order, and a screen missing from it is invisible if it only exists somewhere else.

The genuinely new work is the middle: the tee sheet in its two date states, the rate picker over it, and the two-part review screen.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The lorem the reference prints under Venue Policy, kept as fixture text. */
const POLICY = [
    "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    "Cras mattis consectetur purus sit amet fermentum.",
];

const OCCASIONS = ["Celebration", "Gathering", "Networking", "Reunion", "Company outing", "Tournament", "Other"];

const PRICE_LINES = [
    { label: "Reservation Fees", value: "$92.00" },
    { label: "Convenience Fee", value: "$5.00" },
    { label: "Estimate Taxes", value: "$1.71" },
    { label: "Total", value: "$55.22", isTotal: true },
];

const PRICE_FOOTNOTE = "*Morbi leo risus, porta ac consectetur ac, vestibulum at eros.";

/** The rail as every screen in this flow carries it: signed out, no order yet. */
const reviewFooter = (
    <>
        <DueBar dueNow="$20.74" dueLater="$1.71" total="$55.22" className="ml-auto w-[485px] px-0 pr-16" />
        <BookingActionBar onBack={() => {}} onBook={() => {}} />
        <GlobalNav />
    </>
);

/**
 * 1 — The attract loop.
 *
 * Where a tee-time booking starts, and the same surface every other flow starts
 * on: the hero, the three entry cards and `WelcomeNav`, where logging in,
 * ordering as a guest and joining the waitlist are three equal ways forward.
 * "Book a tee time / Plan your next" is the card this flow is entered through.
 */
export const Attract: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen courseName="The Course" onSelect={() => {}} />
        </KioskScreen>
    ),
};

/**
 * 2 — The branch point.
 *
 * No chrome at all. The question is the whole screen and it has exactly three
 * answers, so a rail offering a fourth thing to do would only be somewhere for
 * the eye to go instead of answering. "No Thanks" is what continues into the
 * tee sheet as a guest.
 */
export const DoYouWantToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <ScanPromptScreen
                courseName="Sagamore Golf Club"
                onEnterCode={() => {}}
                onDecline={() => {}}
                onHowToLogIn={() => {}}
                onStartOver={() => {}}
            />
        </KioskScreen>
    ),
};

/**
 * 3 — The wallet pitch, taken if the user asks how to log in.
 *
 * Paired with `WelcomeNav` rather than `GlobalNav`: this screen is still part
 * of the entry decision, so it keeps the three-way choice rather than the
 * in-session action rail.
 */
export const LogInBelowForEverything: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WalletInterstitialScreen />
        </KioskScreen>
    ),
};

/**
 * 4 — The tee sheet, day strip collapsed.
 *
 * The default state. A kiosk booking is overwhelmingly for today or tomorrow,
 * and the strip answers that in one tap without opening anything. The filter
 * rail is pinned off the left edge and clipped by the canvas on purpose — only
 * the inner edge of each card shows, which reads as tabs without spending the
 * horizontal room the two-column slot grid needs.
 *
 * Back is the only action here, so it takes the full width of the bar.
 */
export const BookATimeWeekView: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen
            scroll={false}
            footer={
                <>
                    <BookingActionBar backLabel="Back" onBack={() => {}} />
                    <GlobalNav />
                </>
            }
        >
            <TeeTimeBooking slots={TEE_TIMES} />
        </KioskScreen>
    ),
};

/**
 * 5 — The same sheet with the month grid open, for genuine advance booking.
 *
 * Expanded, the grid scrolls with the slots rather than staying pinned above
 * them: it is ~550px tall, and pinning it would leave the slot area a sliver of
 * clipped cards. The day heading under the grid restates which date the slots
 * belong to, which the collapsed strip carries in its weekday labels.
 */
export const BookATimeMonthView: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen
            scroll={false}
            footer={
                <>
                    <BookingActionBar backLabel="Back" onBack={() => {}} />
                    <GlobalNav />
                </>
            }
        >
            <TeeTimeBooking slots={TEE_TIMES} dateMode="month" />
        </KioskScreen>
    ),
};

/**
 * 6 — Picking a rate for the time just tapped.
 *
 * A card overlay, not a takeover: the same time is sold at several rates, so
 * the time is the filter and the rate is the actual choice — and the grid the
 * time came from is the context for it. No scrim, matching every other card
 * overlay in the references; backing out should cost nothing.
 */
export const AvailableRates: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Rates() {
        const [rate, setRate] = useState<TeeTimeSlot | null>(null);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <>
                        <BookingActionBar backLabel="Back" onBack={() => {}} />
                        <GlobalNav />
                    </>
                }
            >
                <TeeTimeBooking slots={TEE_TIMES} />
                <RatePickerDialog isOpen onOpenChange={() => {}} time="11:30 AM" rates={RATES_FOR_TIME("11:30 AM")} onConfirm={setRate} />
                {/* The confirmed rate is held so the story is a working step
                    rather than a still: tapping Confirm resolves a real value. */}
                <span className="sr-only">{rate?.rateName}</span>
            </KioskScreen>
        );
    },
};

/**
 * 7 — Review, above the fold.
 *
 * Venue facts, group size and the money, in that order: what you booked, who is
 * coming, what it costs. Group size sits between them rather than at the top
 * because it is the one thing still changeable here, and every change moves the
 * numbers directly below it.
 *
 * The rail gains two things it does not carry elsewhere — the due bar and the
 * commit pair. "Due Now" and "Due at Tee Time" are split because a golfer
 * paying a deposit needs to know what hits the card in front of them versus
 * what they will owe at the counter later.
 *
 * One screen, scrolling, rather than a pair split at the fold. The reference
 * photographs it twice because a static export cannot scroll; a story can, and
 * two stories of one screen means two places to update when a band changes.
 * Every section is here: summary, group size, price, policy, the text-updates
 * opt-in and the optional occasion.
 */
export const ReviewBooking: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Review() {
        const [groupSize, setGroupSize] = useState<number>(2);
        const [wantsUpdates, setWantsUpdates] = useState(true);
        const [occasion, setOccasion] = useState<string | null>(null);
        return (
            <KioskScreen footer={reviewFooter}>
                <div className="flex flex-col">
                    <BookingReviewSection className="border-t-0 pt-10">
                        <VenueSummary
                            venueName={VENUE.name}
                            address={VENUE.address}
                            resource="Main Course"
                            date="Thursday, January 8th, 2026"
                            startTime="3:00 PM"
                        />
                    </BookingReviewSection>

                    <BookingReviewSection>
                        <GroupSizeSelector value={groupSize} onChange={setGroupSize} max={4} />
                    </BookingReviewSection>

                    <BookingReviewSection>
                        <PriceBreakdown lines={PRICE_LINES} footnote={PRICE_FOOTNOTE} />
                    </BookingReviewSection>

                    <BookingReviewSection>
                        <BookingVenuePolicy paragraphs={POLICY} />
                    </BookingReviewSection>

                    <BookingReviewSection>
                        <BookingUpdatesToggle isSelected={wantsUpdates} onChange={setWantsUpdates} onLearnMore={() => {}} />
                    </BookingReviewSection>

                    <BookingReviewSection>
                        <BookingOccasionChips options={OCCASIONS} value={occasion} onChange={setOccasion} />
                    </BookingReviewSection>
                </div>
            </KioskScreen>
        );
    },
};

/**
 * 9 — Who the tee time is under.
 *
 * The same `EntryScreen` template as code and email entry, with a different
 * field — and with the green scan panel deliberately off. By this point the
 * user has chosen to book as a guest, and re-offering the scan reopens a
 * settled decision. The rail goes too, so the keyboard has the room it needs.
 */
export const EnterYourName: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Name() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false}>
                <EntryScreen
                    title="Enter your name"
                    subtitle="Enter your full name for your tee time."
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
 * 10 — Where to pay.
 *
 * A full-screen modal, not a card: choosing the counter ends the kiosk session,
 * so the booking behind is no longer the context for the question. Card and
 * Mobile Pay sit inside one panel with the counter offered as an alternative to
 * that whole panel — the "Or" divider makes the nesting visible rather than
 * flattening three peers.
 */
export const CheckoutMethod: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <CheckoutMethodFullScreen isOpen onOpenChange={() => {}} onBack={() => {}} onPayHere={() => {}} onPayAtCounter={() => {}} />
        </KioskScreen>
    ),
};

/**
 * 11 — The receipt, and the end of the session.
 *
 * The whole surface is the dismiss target — a user walking away gets the same
 * result from the session timeout, so there is nothing here that can be missed.
 * The rail is reduced to the "Logged out" card the reference draws: the session
 * is over, and the card reports that rather than offering anything.
 */
export const Confirmation: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
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
            <OrderSuccessfulScreen
                heading="All set! Good luck and enjoy the round"
                subtitle="The selections you have chosen will be removed."
                onDismiss={() => {}}
            />
        </KioskScreen>
    ),
};
