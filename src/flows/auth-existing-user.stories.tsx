import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { HomeScreen } from "@/components/kiosk/screens/home-screen";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { HowToLogInScreen } from "@/components/kiosk/screens/how-to-log-in-screen";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { WalletInterstitialScreen } from "@/components/kiosk/screens/wallet-interstitial-screen";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import { MENU_ITEMS } from "@/data/menu-catalog";
import { MANUAL_ENTRY_CODES, MEMBERS } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Auth w Existing User",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/1-1-User Account Authentication with Existing User\`** — a member who has an account but is not scanning it.

**Enter your code** and **Enter your email** are one layout with different fields, so they share a single \`EntryScreen\` template: brand mark, title, subtitle, field, keyboard, Go Back / Continue.

The field is a **slot**, not a \`type\` prop. The three fields have genuinely different shapes — six segmented cells, a wide pill, a free-text line — and expressing them through one union would push the differences *into* the template instead of removing them.

The green scan band belongs to **\`GlobalNav\`**, not to this template: \`<GlobalNav isPromptExpanded />\` draws the band and the matching short wallet drawer from one flag. The screens used to render the band themselves, which left the band open above a drawer still drawing its *collapsed* 214px card — two halves of one control in different states.

Code and email pass \`isPromptExpanded\` because the user is mid-authentication and scanning is still a faster way out; **name entry does not**, because by then they have chosen to continue as a guest and re-offering the scan reopens a settled decision.

Fields are display-only, like everywhere else in this kiosk — characters arrive from the on-screen keyboard, so a focused \`<input>\` would fight it for focus and risk the OS keyboard covering the UI.

The flow runs top to bottom: the attract screen, the case for connecting a wallet, the decision point, the explainer, the code entry and its states, and the signed-in landing screen the member arrives on.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Where the flow starts — the member walks up to the attract loop.
 *
 * `WelcomeNav`, not the rail: at this point logging in, ordering as a guest and
 * joining the waitlist are three equal ways forward, and the rail's job (get me
 * out of the task I am in) has nothing to act on yet.
 */
export const Attract: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen courseName="Sagamore Golf Club" onSelect={() => {}} />
        </KioskScreen>
    ),
};

/** The case for connecting a wallet, before anything is asked of the member. */
export const LogInBelowForEverything: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WalletInterstitialScreen />
        </KioskScreen>
    ),
};

/**
 * The decision point. Tapping the render triggers the simulated scan.
 *
 * No chrome: the screen *is* the way out, and the rail's drawer would offer a
 * third route to log in beside the scan target and Enter Code.
 */
export const DoYouWantToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <ScanPromptScreen onEnterCode={() => {}} onDecline={() => {}} onHowToLogIn={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};

/** The three-step explainer, with the rail's drawer — the target — still there. */
export const HowToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav className="shadow-none" onHowToLogIn={() => {}} />}>
            <HowToLogInScreen onDismiss={() => {}} />
        </KioskScreen>
    ),
};

/** Six-digit member code. Try **482913** — it resolves to a real fixture. */
export const EnterYourCode: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Code() {
        const [value, setValue] = useState("");
        const [isInvalid, setIsInvalid] = useState(false);
        return (
            <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
                <EntryScreen
                    title="Enter your code"
                    subtitle="Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time."
                    field={<CodeInput value={value} length={6} isMasked isInvalid={isInvalid} />}
                    value={value}
                    onChange={(next) => {
                        setValue(next);
                        setIsInvalid(false);
                    }}
                    maxLength={6}
                    isContinueDisabled={value.length < 6}
                    onContinue={() => setIsInvalid(!MANUAL_ENTRY_CODES[value])}
                    onBack={() => {}}
                />
            </KioskScreen>
        );
    },
};

/**
 * One character in.
 *
 * The filled cell and the caret are the same brand ring, so the eye follows one
 * moving marker across the row rather than tracking two competing highlights.
 * Continue stays disabled — a partial code cannot be checked.
 */
export const CodeFirstDigit: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
            <EntryScreen
                title="Enter your code"
                subtitle="Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time."
                field={<CodeInput value="4" length={6} isMasked />}
                value="4"
                onChange={() => {}}
                maxLength={6}
                isContinueDisabled
                onContinue={() => {}}
                onBack={() => {}}
            />
        </KioskScreen>
    ),
};

/** All six in. Continue turns solid — the only state change in the footer. */
export const CodeComplete: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
            <EntryScreen
                title="Enter your code"
                subtitle="Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time."
                field={<CodeInput value="482913" length={6} isMasked />}
                value="482913"
                onChange={() => {}}
                maxLength={6}
                isContinueDisabled={false}
                onContinue={() => {}}
                onBack={() => {}}
            />
        </KioskScreen>
    ),
};

/** Email entry. The keyboard swaps to the layout carrying `@`, `.` and `.com`. */
export const EnterYourEmail: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Email() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
                <EntryScreen
                    title="Enter your email"
                    subtitle="Enter your email address to get started."
                    field={<EntryTextField value={value} placeholder="you@example.com" />}
                    value={value}
                    onChange={setValue}
                    layout="email"
                    onContinue={() => {}}
                    onBack={() => {}}
                />
            </KioskScreen>
        );
    },
};

/** Rejected code — the cells and the ring share one invalid signal. */
export const InvalidCode: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
            <EntryScreen
                title="Enter your code"
                subtitle="That code wasn't recognised. Check the app and try again."
                field={<CodeInput value="482911" length={6} isInvalid />}
                value="482911"
                onChange={() => {}}
                maxLength={6}
                onContinue={() => {}}
                onBack={() => {}}
            />
        </KioskScreen>
    ),
};

/** Three merchandised items under the shortcuts, standing in for "New Hats". */
const FEATURED = MENU_ITEMS.filter((item) => ["cheeseburger", "chicken-sandwich", "soft-pretzel"].includes(item.id));

/**
 * Where the flow lands: recognised, greeted, and put in front of the shop.
 *
 * The session carries a member, so the rail swaps its wallet drawer for the
 * identity card with Log out — there is no action left to advertise once
 * someone is signed in, so it stops pulling the eye.
 *
 * `hasOrder` is set with a zero count on purpose: the reference draws the bag
 * at $0.00. An order that has been started and is still empty is a state the
 * member needs to see, and count alone cannot tell it apart from no order.
 */
export const SignedInHome: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen
            scroll={false}
            footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} onViewOrder={() => {}} onStartOver={() => {}} />}
        >
            <HomeScreen
                featuredTitle="New This Week"
                featuredItems={FEATURED}
                onSelectCategory={() => {}}
                onSelectItem={() => {}}
            />
        </KioskScreen>
    ),
};
