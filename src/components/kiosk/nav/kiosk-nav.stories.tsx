import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { KioskHeader } from "@/components/kiosk/nav/kiosk-header";
import { MEMBERS } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Global Nav/Footer Bar",
    component: KioskFooterBar,
    parameters: {
        // "centered" wraps the story in a padded box. At the kiosk viewport
        // (750x1298) a full-canvas frame then overflows by exactly that padding
        // — 32px — and the preview scrolls sideways on a panel that cannot.
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The kiosk's global navigation is a persistent *action rail*, not a set of destinations — a kiosk session is one linear task, so the only always-reachable things are: abandon the session (Start Over), see what you've added (cart), and identify yourself (wallet drawer). `KioskScreen` pins it to the footer slot so its position is identical on every screen.",
            },
        },
    },
} satisfies Meta<typeof KioskFooterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Anonymous, empty cart — the attract-loop resting state. */
export const Anonymous: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen header={<KioskHeader variant="solid" />} footer={<KioskFooterBar {...args} />}>
            <div className="flex h-full items-center justify-center p-16 text-center text-tertiary">Screen body</div>
        </KioskScreen>
    ),
};

/**
 * Tap the green drawer to run the simulated wallet scan: it dwells in
 * "Reading your wallet…" for 1.6s, then resolves to the signed-in state.
 */
export const ScanToLogIn: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen header={<KioskHeader variant="solid" />} footer={<KioskFooterBar {...args} />}>
            <div className="flex h-full flex-col items-center justify-center gap-3 p-16 text-center">
                <p className="text-2xl font-semibold text-primary">Tap the green Log In drawer</p>
                <p className="text-lg text-tertiary">The scan is simulated on a real timer, so every visual state is reachable here.</p>
            </div>
        </KioskScreen>
    ),
};

/** An unrecognised pass — the drawer turns red and offers a retry. */
export const ScanNotRecognized: Story = {
    args: {},
    decorators: [withKioskSession({ defaultWalletCode: "TF-NOT-A-REAL-PASS" }), withKioskFrame()],
    render: (args) => (
        <KioskScreen header={<KioskHeader variant="solid" />} footer={<KioskFooterBar {...args} />}>
            <div className="flex h-full items-center justify-center p-16 text-center text-tertiary">Tap Log In to trigger the failure path</div>
        </KioskScreen>
    ),
};

/** Signed in with items in the order — cart summary and Log out both appear. */
export const AuthenticatedWithCart: Story = {
    args: { cartCount: 4, cartTotal: 34.45 },
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: (args) => (
        <KioskScreen header={<KioskHeader variant="solid" />} footer={<KioskFooterBar {...args} />}>
            <div className="flex h-full items-center justify-center p-16 text-center text-tertiary">Screen body</div>
        </KioskScreen>
    ),
};

/** Guest ordering — cart is populated but no member is attached. */
export const GuestWithCart: Story = {
    args: { cartCount: 2, cartTotal: 17.49 },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen header={<KioskHeader variant="solid" />} footer={<KioskFooterBar {...args} />}>
            <div className="flex h-full items-center justify-center p-16 text-center text-tertiary">Screen body</div>
        </KioskScreen>
    ),
};
