import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GET_STARTED_OPTIONS, GetStartedScreen } from "@/components/kiosk/screens/get-started-screen";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Screens/Get Started",
    component: GetStartedScreen,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `The hub the kiosk opens onto once someone has engaged with it — the four ways in, drawn from \`references/build/getStarted\`.

A **2x2 grid, not a list**: these are four peers, and a list would rank them. Nothing is styled as primary for the same reason — the kiosk cannot know whether the person in front of it came to check in or to buy a sandwich, and guessing wrong costs a mis-tap on the very first screen.

**Photographs rather than icons.** At standing distance a photo of a burger is recognised before a label is read, and these four choices are genuinely distinguishable by picture in a way four line icons would not be. The exports are 500x298 for a 250px render — 2x exactly — and are renamed on the way through the asset pipeline, since the Shutterstock ids say nothing about which card each belongs to.

The cards are **data**, not markup: the set is course-specific (a venue with no pro shop should drop that card rather than hide it), and four hand-written cards would drift the moment one gained a state.

No global nav. Go Back is the only control, because there is nowhere to return to but the attract screen and nothing yet to abandon.`,
            },
        },
    },
} satisfies Meta<typeof GetStartedScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All four ways in, as the reference draws them. */
export const Default: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen scroll={false}>
            <GetStartedScreen {...args} onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * A venue without a pro shop. The grid reflows to a single row rather than
 * leaving a hole, which is the reason the cards are data.
 */
export const WithoutProShop: Story = {
    args: { options: GET_STARTED_OPTIONS.filter((option) => option.id !== "shop") },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen scroll={false}>
            <GetStartedScreen {...args} onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/** A longer course name, to check the heading still balances across two lines. */
export const LongCourseName: Story = {
    args: { courseName: "Sagamore Golf Club" },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen scroll={false}>
            <GetStartedScreen {...args} onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};
