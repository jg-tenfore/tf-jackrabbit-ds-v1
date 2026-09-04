import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowToLogInScreen } from "@/components/kiosk/screens/how-to-log-in-screen";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { assetUrl } from "@/utils/asset-url";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Screens/How to Log In",
    component: HowToLogInScreen,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `The three-step explainer, built from the exported assets in \`references/build/how-to-login\`.

Built as a **screen, not a full-screen overlay**, because the reference keeps the persistent Start Over / Log In rail visible. That is the right call for this content: a member reading these instructions is being told to scan their wallet, so the wallet drawer has to stay reachable — an overlay covering it would explain the gesture while hiding its target.

Layout is a fixed three-column grid (badge · copy · image) rather than each row laying itself out, so the numerals and images sit on hard vertical lines regardless of how many lines of copy a step carries.

The exported store-badge asset already carries the "Download the Tenfore Golf App" caption, so the copy does not repeat it.`,
            },
        },
    },
} satisfies Meta<typeof HowToLogInScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The screen as drawn, with the persistent rail beneath it. */
export const Default: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen footer={<GlobalNav />}>
            <HowToLogInScreen {...args} onDismiss={() => {}} />
        </KioskScreen>
    ),
};

/**
 * Pixel diff against the export. The reference is a @1x 375x649 capture of the
 * 750x1298 canvas, so it scales exactly 2x. Matching pixels render black under
 * `mix-blend-difference` — anything visible is drift.
 */
export const ReferenceOverlay: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame({ overlaySrc: assetUrl("screen-assets/how-to-login/reference.png") })],
    render: (args) => (
        <KioskScreen footer={<GlobalNav />}>
            <HowToLogInScreen {...args} onDismiss={() => {}} />
        </KioskScreen>
    ),
};

/** The content alone, without the rail — for reviewing spacing in isolation. */
export const ContentOnly: Story = {
    args: {},
    decorators: [withKioskFrame()],
    render: (args) => (
        <KioskScreen>
            <HowToLogInScreen {...args} onDismiss={() => {}} />
        </KioskScreen>
    ),
};
