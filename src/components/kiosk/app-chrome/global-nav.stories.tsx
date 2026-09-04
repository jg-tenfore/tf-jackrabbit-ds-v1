import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { MEMBERS } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { KioskSessionProvider } from "@/providers/kiosk-session";
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
 * Every state stacked on one black surface, for comparing them against each
 * other the way the annotated export does.
 */
export const AllStates: Story = {
    args: {},
    parameters: { layout: "fullscreen" },
    render: () => (
        <div className="flex min-h-screen w-full flex-col gap-10 overflow-x-hidden bg-black py-10">
            {(
                [
                    ["Logged out", { member: null, props: {} }],
                    ["Logged out, empty order", { member: null, props: { hasOrder: true, cartCount: 0, cartTotal: 0 } }],
                    ["With items", { member: null, props: { cartCount: 4, cartTotal: 34.45 } }],
                    ["Logged in", { member: MEMBERS[0], props: { cartCount: 4, cartTotal: 34.45 } }],
                ] as const
            ).map(([label, config]) => (
                <div key={label} className="flex flex-col gap-2">
                    <span className="px-10 text-sm text-white/50">{label}</span>
                    <StateRow member={config.member} navProps={config.props} />
                </div>
            ))}
        </div>
    ),
};

/**
 * One rail rendered at canvas width, outside the full 1298px frame.
 *
 * Uses the provider directly rather than the story decorator: a decorator takes
 * (Story, context) from Storybook, and calling it by hand here would depend on
 * internals that are not ours to rely on.
 */
const StateRow = ({ member, navProps }: { member: (typeof MEMBERS)[number] | null; navProps: Partial<Parameters<typeof GlobalNav>[0]> }) => (
    <KioskSessionProvider initialMember={member}>
        {/* Full width, and pt-28 rather than overflow-hidden: the drawer
            overhangs the rail upward, and clipping it hides the exact
            silhouette these rows exist to show. */}
        <div className="w-full pt-28">
            <GlobalNav {...navProps} />
        </div>
    </KioskSessionProvider>
);
