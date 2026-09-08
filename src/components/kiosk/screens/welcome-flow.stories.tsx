import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { WalletInterstitialScreen } from "@/components/kiosk/screens/wallet-interstitial-screen";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Screens/Welcome Flow",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `The two screens that sit between the attract loop and a logged-in session, built from the exported @2x graphics in \`references/build/welcomeScreen\` and matched to \`references/flows\`.

Both use a **whole exported graphic** rather than rebuilt markup where the artwork and its copy are one composition — the interstitial's text is positioned *against* the phone render, not flowed beside it, so splitting them would mean re-deriving that relationship in CSS and drifting from the export for no gain. Nothing in either is dynamic.

Note the two screens treat chrome **differently**. The interstitial pairs with \`WelcomeNav\`, where logging in, ordering as a guest and joining the waitlist are three equal ways forward. The scan prompt takes **no nav at all** — it owns its four buttons, Start Over included. The rail's wallet drawer would otherwise offer a third way to log in beside the scan target and Enter Code, on the one screen whose whole job is to make that choice feel simple.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The decision point. Enter Code and No Thanks carry equal weight — declining
 * is legitimate at a kiosk, and plenty of guests have no pass to scan.
 * Tapping the render triggers the simulated read.
 *
 * Four buttons, no global nav: this screen is the way out, so it carries its
 * own Start Over rather than sitting on the rail.
 */
export const DoYouWantToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <ScanPromptScreen onEnterCode={() => {}} onDecline={() => {}} onHowToLogIn={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};

/** The wallet interstitial, paired with the welcome nav. */
export const LogInBelowForEverything: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WalletInterstitialScreen />
        </KioskScreen>
    ),
};
