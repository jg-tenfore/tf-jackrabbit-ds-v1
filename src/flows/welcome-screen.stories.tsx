import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { GET_STARTED_OPTIONS_WITH_ACTIVITIES, GetStartedScreen } from "@/components/kiosk/screens/get-started-screen";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "User Flows/Welcome Screen",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/0-0-Welcome Screen\`** — what the kiosk shows with nobody at it, and the first thing it shows when someone arrives.

Two beats. The **attract screen** is read from across a room, so its hierarchy inverts the rest of the kiosk: the photograph carries it, the course name is the largest type in the product, and the ways in run off the right edge rather than sitting in a tidy grid. The marquee is the only moving thing on it — motion is what makes a dark panel read as live rather than switched off.

**Get Started** is the same set of choices at arm's length, as a grid. Nothing is styled as primary in either: the kiosk cannot know whether the person in front of it came to check in or to buy a sandwich, and guessing wrong costs a mis-tap on the very first screen.

Every screen here is assembled from \`WindowScreen\`, \`GetStartedScreen\`, \`ChoiceCard\`, \`Marquee\` and \`WelcomeNav\` — change any of those and every story below moves with it.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The attract loop: photo band, weather, scrolling ways in, marquee. */
export const Attract: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen onSelect={() => {}} />
        </KioskScreen>
    ),
};

/** A named course and different weather, to check nothing is hard-coded. */
export const AttractEveningRain: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen courseName="Sagamore Golf Club" temperature={58} condition="moderate-rain" wind="6mph SW" onSelect={() => {}} />
        </KioskScreen>
    ),
};

/** The hub, once someone has engaged. Four peers, none of them primary. */
export const GetStarted: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <GetStartedScreen onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * With the bookable activities — pickleball courts and simulator bays.
 *
 * The same screen with two more options rather than a second layout: the grid
 * lays out whatever it is given two across.
 */
export const GetStartedWithActivities: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <GetStartedScreen options={GET_STARTED_OPTIONS_WITH_ACTIVITIES} onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/** A venue with no pro shop. The grid reflows rather than leaving a hole. */
export const GetStartedWithoutProShop: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <GetStartedScreen
                options={GET_STARTED_OPTIONS_WITH_ACTIVITIES.filter((option) => option.id !== "shop")}
                onSelect={() => {}}
                onBack={() => {}}
            />
        </KioskScreen>
    ),
};

/** A longer course name, to check the heading still balances. */
export const GetStartedLongCourseName: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <GetStartedScreen courseName="Sagamore Golf Club" onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};
