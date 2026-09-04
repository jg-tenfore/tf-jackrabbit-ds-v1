import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { MEMBERS } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "App Chrome/Global Nav",
    component: GlobalNav,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `The fixed navigation rail, built from the exported assets and annotated states in \`references/build/globalNav\`.

It is an **action rail, not a set of destinations**. A kiosk session is one linear task, so the only things that must always be reachable are: abandon the session, see what you've added, and identify yourself. Destination-style nav items would invite wandering in a flow with nowhere to wander to.

All four states are driven from **session + cart**, not props-as-flags, so a screen cannot render a combination the session does not support.

Anatomy worth noting, because it inverts the usual button ordering: the drawer puts the **illustration first**, then the instruction, then the label, then the chevron. A user glancing bottom-right sees a hand holding a phone before reading anything — the gesture is what they need to perform, and the words only confirm it.`,
            },
        },
    },
    argTypes: {
        cartCount: { control: { type: "number", min: 0, max: 20 } },
        cartTotal: { control: { type: "number", min: 0 } },
        isPromptExpanded: { control: "boolean" },
    },
} satisfies Meta<typeof GlobalNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = (label: string) => (
    <div className="flex h-full items-center justify-center p-16 text-center text-lg text-tertiary">{label}</div>
);

/** Logged out, no order — the attract-loop resting state. */
export const LoggedOut: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <KioskScreen footer={<GlobalNav {...args} />}>{body("Screen content")}</KioskScreen>,
};

/**
 * Logged out with an order started. The bag shows at zero too — the reference
 * draws "$0.00" with a 0 badge, because a started order is a state the user
 * needs to see before anything is in it.
 */
export const LoggedOutWithCart: Story = {
    args: { cartCount: 0, cartTotal: 0 },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <KioskScreen footer={<GlobalNav {...args} />}>{body("Screen content")}</KioskScreen>,
};

/** A populated order. */
export const WithItems: Story = {
    args: { cartCount: 4, cartTotal: 34.45 },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <KioskScreen footer={<GlobalNav {...args} />}>{body("Screen content")}</KioskScreen>,
};

/** Drawer expanded into the full-width sign-in prompt. */
export const SignInPromptExpanded: Story = {
    args: { isPromptExpanded: true },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <KioskScreen footer={<GlobalNav {...args} onHowToLogIn={() => {}} />}>{body("Screen content")}</KioskScreen>,
};

/** Signed in — the drawer becomes a white identity card with Log out. */
export const LoggedIn: Story = {
    args: { cartCount: 0, cartTotal: 0 },
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: (args) => <KioskScreen footer={<GlobalNav {...args} />}>{body("Screen content")}</KioskScreen>,
};

/** Signed in with a populated order — the fullest the rail ever gets. */
export const LoggedInWithItems: Story = {
    args: { cartCount: 4, cartTotal: 34.45 },
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: (args) => <KioskScreen footer={<GlobalNav {...args} />}>{body("Screen content")}</KioskScreen>,
};

/** Live scan. Tap the drawer to run it: reading → recognised or not. */
export const ScanInteractive: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen footer={<GlobalNav {...args} onHowToLogIn={() => {}} />}>
            {body("Tap the green drawer to run the simulated scan")}
        </KioskScreen>
    ),
};

/** Unrecognised pass — the drawer and prompt both take the error tone. */
export const ScanNotRecognized: Story = {
    args: { isPromptExpanded: true },
    decorators: [withKioskSession({ defaultWalletCode: "TF-NOT-A-REAL-PASS" }), withKioskFrame()],
    render: (args) => (
        <KioskScreen footer={<GlobalNav {...args} onHowToLogIn={() => {}} />}>{body("Tap the drawer to trigger the failure path")}</KioskScreen>
    ),
};
