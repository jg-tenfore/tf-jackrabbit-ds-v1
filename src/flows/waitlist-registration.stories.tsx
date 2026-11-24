import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { SignedOutCard } from "@/components/kiosk/app-chrome/wallet-drawer";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { BookingActionBar, StepFooter } from "@/components/kiosk/booking/booking-review-sections";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { DEFAULT_STANDBY_COLUMNS, StandbyBoardScreen } from "@/components/kiosk/screens/standby-board-screen";
import { WaitlistGroupSizeScreen } from "@/components/kiosk/waitlist/group-size-screen";
import { PlaceInLine } from "@/components/kiosk/waitlist/place-in-line";
import { nextPlaceInLine, useLiveStandby } from "@/components/kiosk/waitlist/use-live-standby";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";
import { assetUrl } from "@/utils/asset-url";

const meta = {
    title: "User Flows/Waitlist Reg",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/5-WaitlistRegistration\`** — joining the standby list and watching it.

The board is the one screen in this kiosk nobody is standing at. It is read from across the pro shop by people waiting for their name, so it inverts the usual hierarchy: no controls in the body, and three columns in the order a party moves through them — **Received**, **Up Next** (the parties the starter is lining up) and **Ready**.

Each row shows the **party size** (from the Group Size step) and, in the waiting column, the **place in line**, so someone glancing up can tell how far back they are and how many players are ahead of them.

The board's footer is the **welcome screen's own action bar** — Log In, Start Order, Join Waitlist — not the in-flow Start Over / Log In. Nobody "started" anything at a wall board, and the obvious next step for someone reading it is to join the list, so the board doubles as the home screen. The taller bar also ends the card just below the names instead of leaving it half empty.

**Standby Board — Home Button** is the simpler alternative: no footer, the card ends in one Back to Home action, and the photo takes the room the footer gave back.

**Standby Board** runs live: every few seconds a party joins, one tees off, or one moves up a column. Arrivals and departures fade, the rest of the column glides to close the gap, and place numbers update with it. **Standby Board Quiet** is a still frame.

Names are **first name plus last initial**. That is what makes a public board acceptable at all — a full name on a screen anyone can photograph is a different thing — so the shape is enforced in the component's fixture rather than left to whatever the booking system returns.

**Copy note:** the reference reads "Recieved" and "Players current in Standby". Both are corrected here; they are props, so either can be set back.

The **participant detail** screens are one \`EntryScreen\` four times over — first name, last name, phone, email — differing only in field, keyboard layout and placeholder. The avatar between subtitle and field is a new \`illustration\` slot on that template rather than a fourth copy of the screen.

**Group Size** collects the party size the board displays (1–8+), with Transportation and Subcourse. **Added to Waitlist** is the sign-off: it shows the guest their place in line and party size, the same two numbers the board shows beside their name.

The rest of this flow's reference screens (course and time-window pick, notifications, checkout, subcourse picker) are not built yet.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The standby board, as it sits on the wall between check-ins — live. Parties
 * join, move up and tee off on a loop so the fade and glide can be judged.
 */
export const StandbyBoard: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function LiveBoard() {
        const columns = useLiveStandby();
        return (
            <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
                <StandbyBoardScreen columns={columns} />
            </KioskScreen>
        );
    },
};

/**
 * The same live board with no footer at all: the card runs to the bottom of the
 * screen and ends in a single Back to Home action, for a board that should be
 * read rather than operated. Without a footer to make room for, the photo gets
 * the space: the tall hero shows about half the screen.
 */
export const StandbyBoardHomeButton: Story = {
    name: "Standby Board — Home Button",
    decorators: [withKioskSession(), withKioskFrame()],
    render: function LiveBoardHome() {
        const columns = useLiveStandby();
        return (
            <KioskScreen scroll={false}>
                <StandbyBoardScreen columns={columns} onHome={() => {}} hero="tall" />
            </KioskScreen>
        );
    },
};

/** A quiet afternoon — the board has to read as calm, not broken, when short. */
export const StandbyBoardQuiet: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <StandbyBoardScreen
                columns={[
                    { ...DEFAULT_STANDBY_COLUMNS[0], entries: [{ name: "Liam S.", partySize: 2 }] },
                    { ...DEFAULT_STANDBY_COLUMNS[1], entries: [] },
                    { ...DEFAULT_STANDBY_COLUMNS[2], entries: [] },
                ]}
            />
        </KioskScreen>
    ),
};

// ---------------------------------------------------------------------------
// Group size — where the board's party size comes from
// ---------------------------------------------------------------------------

/**
 * Group Size, Transportation and Subcourse for the waitlist entry.
 *
 * Group Size is where the board's "4 players" comes from, so it runs 1–8 with
 * the last segment open-ended ("8+"), matching what the board can display.
 * Continue stays disabled until a subcourse is chosen, as in the references;
 * the Select Subcourse picker is not built yet, so its button stands in by
 * choosing "Main Course Only".
 */
export const GroupSize: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function GroupSizeStep() {
        const [groupSize, setGroupSize] = useState<number | null>(2);
        const [transport, setTransport] = useState<"walking" | "cart" | null>("cart");
        const [subcourse, setSubcourse] = useState<string | null>(null);
        return (
            <KioskScreen
                footer={
                    <StepFooter>
                        <BookingActionBar onBack={() => {}} onBook={() => {}} bookLabel="Continue" isBookDisabled={!groupSize || !transport || !subcourse} />
                        <GlobalNav />
                    </StepFooter>
                }
            >
                <WaitlistGroupSizeScreen
                    groupSize={groupSize}
                    onGroupSizeChange={setGroupSize}
                    transport={transport}
                    onTransportChange={setTransport}
                    subcourse={subcourse}
                    onSelectSubcourse={() => setSubcourse("Main Course Only")}
                />
            </KioskScreen>
        );
    },
};

// ---------------------------------------------------------------------------
// Participant details — one template, four fields
// ---------------------------------------------------------------------------

const Avatar = () => (
    <img src={assetUrl("screen-assets/waitlist/participant-avatar.svg")} alt="" aria-hidden="true" className="h-[82px] w-[64px] object-contain" />
);

/**
 * A participant-detail screen.
 *
 * All four are the same `EntryScreen` with a different field and keyboard, so
 * they are one render function rather than four near-identical story bodies —
 * the differences are arguments, and writing them out four times is how the
 * four stop agreeing.
 */
const detailStory = (title: string, placeholder: string, layout: "qwerty" | "numeric" | "email" = "qwerty"): Story => ({
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Detail() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false} footer={<GlobalNav />}>
                <EntryScreen
                    title={title}
                    subtitle="Please enter details of participant #1"
                    illustration={<Avatar />}
                    field={<EntryTextField value={value} placeholder={placeholder} />}
                    value={value}
                    onChange={setValue}
                    layout={layout}
                    onContinue={() => {}}
                    onBack={() => {}}
                />
            </KioskScreen>
        );
    },
});

/** First name of the player being added to the list. */
export const EnterFirstName = detailStory("Enter First Name", "Enter your Full Name");

/** Last name. Same template, same keyboard. */
export const EnterLastName = detailStory("Enter Last Name", "Enter your Full Name");

/** Phone — the numeric layout, since a phone number has no letters in it. */
export const EnterPhoneNumber = detailStory("Enter Phone Number", "Enter your Phone Number", "numeric");

/** Email — the layout carrying `@`, `.` and `.com`. */
export const EnterYourEmail = detailStory("Enter Your Email", "Enter your email", "email");

// ---------------------------------------------------------------------------
// Confirmation
// ---------------------------------------------------------------------------

/**
 * Where a new party lands: behind everyone the board numbers. Derived from the
 * board's own fixture so the confirmation and the board never disagree.
 */
const NEW_PLACE_IN_LINE = nextPlaceInLine();

/**
 * The sign-off, with the party's place in line and size — the same two numbers
 * they will find next to their name on the standby board.
 */
export const AddedToWaitlist: Story = {
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
                heading="All set! We will be in touch with next steps!"
                subtitle="You have been added to the waitlist."
                illustrationSrc={assetUrl("screen-assets/waitlist/confirmation.svg")}
                onDismiss={() => {}}
            >
                <PlaceInLine place={NEW_PLACE_IN_LINE} partySize={2} />
                <p className="mt-4 text-[18px] text-tertiary">Watch for your name on the standby board.</p>
            </OrderSuccessfulScreen>
        </KioskScreen>
    ),
};
