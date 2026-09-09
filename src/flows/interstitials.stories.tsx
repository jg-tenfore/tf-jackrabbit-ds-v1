import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
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

The wallet interstitial pairs with \`WelcomeNav\`, where logging in, ordering as a guest and joining the waitlist are three equal ways forward.`,
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
