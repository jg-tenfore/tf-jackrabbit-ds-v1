import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { WalletInterstitialScreen } from "@/components/kiosk/screens/wallet-interstitial-screen";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Interstitials",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/0-1-Interstitial\`** — the between-step screens that explain or reassure rather than ask.

An interstitial is a beat in the flow, not an interruption of one: there is no underlying screen the user is meant to return to, which is why these are full screens rather than overlays.

The wallet interstitial pairs with \`WelcomeNav\`, where logging in, ordering as a guest and joining the waitlist are three equal ways forward.

The scan prompt is the other half of the pair and takes **no chrome at all**. Everywhere else the rail is right, because the user is inside a task and needs a way out of it; here the whole screen *is* the way out, and the rail's wallet drawer would offer a third route to log in beside the scan target and Enter Code — on the one screen whose entire job is to make that choice feel simple.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Log in below for everything" — the case for connecting a wallet. */
export const LogInBelowForEverything: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WalletInterstitialScreen />
        </KioskScreen>
    ),
};

/**
 * "Do you want to log in?" — the decision the value prop was arguing for.
 *
 * The kiosk-and-phone render is the scan target as well as the illustration, so
 * tapping it runs the simulated read rather than doing nothing.
 */
export const DoYouWantToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <ScanPromptScreen onEnterCode={() => {}} onDecline={() => {}} onHowToLogIn={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};
