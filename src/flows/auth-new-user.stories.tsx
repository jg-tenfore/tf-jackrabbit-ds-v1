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
import { MEMBERS } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Auth w New User",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/1-0-User Account Authentication with New User\`** — someone who has not logged in at this kiosk before, end to end: attract, the case for logging in, the decision, the explainer, manual entry, and the signed-in landing.

The decision point is deliberately even-handed: Enter Code and No Thanks carry equal weight, because declining is a legitimate choice at a kiosk and plenty of guests have no pass to scan. Styling No Thanks as the lesser option pressures them toward a path they cannot take.

"How to log in" is the explainer for the member who has the app but has never used a kiosk. It is a screen rather than an overlay because it tells the user to scan their wallet — an overlay would explain the gesture while hiding its target.

Manual entry is the same \`EntryScreen\` template the existing-user flow uses; the stories below walk its **states** rather than its variants, because the reference draws each keystroke stage separately: empty, one character in, and complete with Continue live. The green scan band is \`<GlobalNav isPromptExpanded />\` — band and drawer are one control, so a screen asks the nav for both or neither.

Every story here is assembled from existing components. Only the signed-in landing needed new markup (\`AuthSignedInHomeScreen\`), and even that is \`CategoryRail\` + \`ProductCard\` fed data.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** `Kiosk-1` — where the flow starts: the attract screen, nobody signed in. */
export const Welcome: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen courseName="The Course" onSelect={() => {}} />
        </KioskScreen>
    ),
};

/** `Kiosk-2` — the case for connecting a wallet, before anything is asked. */
export const AccountValueProp: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WalletInterstitialScreen />
        </KioskScreen>
    ),
};

/** `Kiosk-3` — the decision point. Tapping the render triggers the simulated read. */
export const DoYouWantToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <ScanPromptScreen onEnterCode={() => {}} onDecline={() => {}} onHowToLogIn={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};

/** `Kiosk` — the three-step explainer, with the rail's drawer still reachable. */
export const HowToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav className="shadow-none" />}>
            <HowToLogInScreen onDismiss={() => {}} />
        </KioskScreen>
    ),
};

/** `Kiosk-4` — email entry, nothing typed. Continue is dead until it is not. */
export const EnterYourEmail: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
            <EntryScreen
                title="Enter your email"
                subtitle="Enter your email address to get started."
                field={<EntryTextField value="" placeholder="Enter your email" />}
                value=""
                onChange={() => {}}
                layout="email"
                onContinue={() => {}}
                onBack={() => {}}
            />
        </KioskScreen>
    ),
};

/**
 * `Kiosk-5` — a complete address. The field turns brand green and Continue fills,
 * so the "you may proceed" signal is carried twice on one line of sight.
 */
export const EmailEntered: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Email() {
        const [value, setValue] = useState("hello@girardjustin.com");
        return (
            <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
                <EntryScreen
                    title="Enter your email"
                    subtitle="Enter your email address to get started."
                    field={<EntryTextField value={value} placeholder="Enter your email" />}
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

/** `Kiosk-6` — six empty cells, the caret on the first. */
export const EnterYourCode: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
            <EntryScreen
                title="Enter your code"
                subtitle="Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time."
                field={<CodeInput value="" length={6} isMasked />}
                value=""
                onChange={() => {}}
                maxLength={6}
                isContinueDisabled
                onContinue={() => {}}
                onBack={() => {}}
            />
        </KioskScreen>
    ),
};

/**
 * `Kiosk-7` — one character in. Masked as it lands: the cell that was the caret
 * becomes the entry, so the ring moves forward rather than the value appearing
 * behind it.
 */
export const CodePartiallyEntered: Story = {
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

/** `Kiosk-8` — all six cells filled and Continue live. Try **482913** live below. */
export const CodeComplete: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Code() {
        const [value, setValue] = useState("482913");
        return (
            <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
                <EntryScreen
                    title="Enter your code"
                    subtitle="Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time."
                    field={<CodeInput value={value} length={6} isMasked />}
                    value={value}
                    onChange={setValue}
                    maxLength={6}
                    isContinueDisabled={value.length < 6}
                    onContinue={() => {}}
                    onBack={() => {}}
                />
            </KioskScreen>
        );
    },
};

/**
 * `Kiosk-9` — recognised, and landed. The rail swaps its wallet drawer for the
 * identity card, which is the only confirmation the sign-in gets: there is no
 * "you are logged in" screen, because the greeting and the name in the rail
 * already say it and a fifth screen would be one more tap to nowhere.
 */
export const SignedInHome: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} onViewOrder={() => {}} />}>
            <HomeScreen featuredTitle="New This Week" featuredItems={MENU_ITEMS.slice(0, 3)} onSelectCategory={() => {}} onSelectItem={() => {}} />
        </KioskScreen>
    ),
};
