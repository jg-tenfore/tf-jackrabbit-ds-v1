import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { HowToLogInScreen } from "@/components/kiosk/screens/how-to-log-in-screen";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Auth w New User",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/1-0-User Account Authentication with New User\`** — someone who has not logged in at this kiosk before.

The decision point comes first and is deliberately even-handed: Enter Code and No Thanks carry equal weight, because declining is a legitimate choice at a kiosk and plenty of guests have no pass to scan. Styling No Thanks as the lesser option pressures them toward a path they cannot take.

"How to log in" is the explainer for the member who has the app but has never used a kiosk. It is a screen rather than an overlay because it tells the user to scan their wallet — an overlay would explain the gesture while hiding its target.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The decision point. Tapping the render triggers the simulated read. */
export const DoYouWantToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <ScanPromptScreen onEnterCode={() => {}} onDecline={() => {}} onHowToLogIn={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};

/** The three-step explainer, with the rail's drawer still reachable. */
export const HowToLogIn: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav className="shadow-none" />}>
            <HowToLogInScreen onDismiss={() => {}} />
        </KioskScreen>
    ),
};
