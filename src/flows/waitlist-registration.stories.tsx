import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { DEFAULT_STANDBY_COLUMNS, StandbyBoardScreen } from "@/components/kiosk/screens/standby-board-screen";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { assetUrl } from "@/utils/asset-url";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "User Flows/Waitlist Reg",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/5-WaitlistRegistration\`** — joining the standby list and watching it.

The board is the one screen in this kiosk nobody is standing at. It is read from across the pro shop by people waiting for their name, so it inverts the usual hierarchy: no controls in the body, names at 27px, two columns because a third would halve the type.

Names are **first name plus last initial**. That is what makes a public board acceptable at all — a full name on a screen anyone can photograph is a different thing — so the shape is enforced in the component's fixture rather than left to whatever the booking system returns.

**Copy note:** the reference reads "Recieved" and "Players current in Standby". Both are corrected here; they are props, so either can be set back.

The **participant detail** screens are one \`EntryScreen\` four times over — first name, last name, phone, email — differing only in field, keyboard layout and placeholder. The avatar between subtitle and field is a new \`illustration\` slot on that template rather than a fourth copy of the screen.

The rest of this flow's 23 reference screens are not built yet.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The standby board, as it sits on the wall between check-ins. */
export const StandbyBoard: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <StandbyBoardScreen />
        </KioskScreen>
    ),
};

/** A quiet afternoon — the board has to read as calm, not broken, when short. */
export const StandbyBoardQuiet: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <StandbyBoardScreen
                columns={[
                    { ...DEFAULT_STANDBY_COLUMNS[0], names: ["Liam S."] },
                    { ...DEFAULT_STANDBY_COLUMNS[1], names: [] },
                ]}
            />
        </KioskScreen>
    ),
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
