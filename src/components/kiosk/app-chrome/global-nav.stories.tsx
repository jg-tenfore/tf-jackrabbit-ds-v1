import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { MEMBERS } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "App Chrome/Global Nav",
    component: GlobalNav,
    parameters: {
        // "centered" pads and centres the story, which at 750x1298 overflows the
        // preview in both axes. "fullscreen" hands over the whole iframe, and
        // the default kiosk viewport is exactly 750x1298, so the frame fits with
        // no padding and nothing to scroll.
        layout: "fullscreen",
        // Dark surround so the frame edge is visible too — the rail is the
        // thing under test, and it should not blend into the Storybook canvas.
        backgrounds: { value: "ink" },
        docs: {
            description: {
                component: `The fixed navigation rail, built from the exported assets and annotated states in \`references/build/globalNav\`.

It is an **action rail, not a set of destinations**. A kiosk session is one linear task, so the only things that must always be reachable are: abandon the session, see what you've added, and identify yourself. Destination-style nav items would invite wandering in a flow with nowhere to wander to.

All four states are driven from **session + cart**, not props-as-flags, so a screen cannot render a combination the session does not support.

Anatomy worth noting, because it inverts the usual button ordering: the drawer puts the **illustration first**, then the instruction, then the label, then the chevron. A user glancing bottom-right sees a hand holding a phone before reading anything — the gesture is what they need to perform, and the words only confirm it.

**About the black screen area:** these stories deliberately black out the screen body. The rail is the component under test, and its own surfaces are white and brand green — on the real white screen its top edge, the drawer's overhang and the identity card's ring all disappear into the page. Blacking out everything above the rail makes its true silhouette and bounds unmistakable. It is a test surface, not the product: see \`Screens/*\` for the rail in situ.`,
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

/**
 * Test harness: blacks out the screen body so the rail's own edges read.
 *
 * `bg-black` on the KioskScreen root overrides its `bg-primary` through
 * tailwind-merge, and the body carries no background of its own, so the whole
 * area above the rail goes black while the rail keeps its real surfaces.
 */
const NavHarness = ({ label, footer }: { label: string; footer: ReactNode }) => (
    <KioskScreen className="bg-black" footer={footer}>
        <div className="flex h-full items-center justify-center p-16 text-center text-lg text-white/40">{label}</div>
    </KioskScreen>
);

/** Logged out, no order — the attract-loop resting state. */
export const LoggedOut: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <NavHarness label="Screen area" footer={<GlobalNav {...args} />} />,
};

/**
 * Logged out with an order started. The bag shows at zero too — the reference
 * draws "$0.00" with a 0 badge, because a started order is a state the user
 * needs to see before anything is in it.
 */
export const LoggedOutWithCart: Story = {
    args: { hasOrder: true, cartCount: 0, cartTotal: 0 },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <NavHarness label="Screen area" footer={<GlobalNav {...args} />} />,
};

/** A populated order. */
export const WithItems: Story = {
    args: { cartCount: 4, cartTotal: 34.45 },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <NavHarness label="Screen area" footer={<GlobalNav {...args} />} />,
};

/** Drawer expanded into the full-width sign-in prompt, at the specified 225px. */
export const SignInPromptExpanded: Story = {
    args: { isPromptExpanded: true },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <NavHarness label="Screen area" footer={<GlobalNav {...args} onHowToLogIn={() => {}} />} />,
};

/**
 * The same band at ~300px, which is what the annotated export actually
 * measures. Same content, more room to breathe — here to compare against the
 * 225px story above and settle which one is intended.
 */
export const SignInPromptAtReferenceHeight: Story = {
    args: { isPromptExpanded: true, promptHeight: 304 },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => <NavHarness label="Screen area" footer={<GlobalNav {...args} onHowToLogIn={() => {}} />} />,
};

/** Signed in — the drawer becomes a white identity card with Log out. */
export const LoggedIn: Story = {
    args: { cartCount: 0, cartTotal: 0 },
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: (args) => <NavHarness label="Screen area" footer={<GlobalNav {...args} />} />,
};

/** Signed in with a populated order — the fullest the rail ever gets. */
export const LoggedInWithItems: Story = {
    args: { cartCount: 4, cartTotal: 34.45 },
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: (args) => <NavHarness label="Screen area" footer={<GlobalNav {...args} />} />,
};

/**
 * The attract screen's navigation.
 *
 * A separate component from the rail, not a variant: there is no Start Over, no
 * cart, the drawer moves left and roughly triples, and two large choice cards
 * take the remaining width. Folding it into `GlobalNav` would give one
 * component two unrelated layouts.
 *
 * The drawer's anatomy inverts here too. On the rail the illustration leads,
 * because the drawer is small and the picture is what catches the eye. At this
 * size the label leads and the illustration supports it — same control, but on
 * the attract screen it is one of three equally-weighted ways in rather than a
 * persistent affordance hanging off the edge. Neither card is brand-filled for
 * the same reason: styling one as primary would push guests toward a path they
 * may not want.
 */
export const WelcomeScreen: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen className="bg-black" footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <div className="flex h-full items-center justify-center p-16 text-center text-[16px] text-white/40">Hero area</div>
        </KioskScreen>
    ),
};
