import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { Marquee } from "@/components/kiosk/marquee";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Screens/Window",
    component: WindowScreen,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `The attract screen — what the kiosk shows with nobody standing at it. Built from \`references/build/windowScreen\`: an 898px photo band above the 400px \`WelcomeNav\`.

Everything here is read from across a room, so the hierarchy inverts the rest of the kiosk. The photograph carries the screen, the course name is the largest type in the product, and the four ways in run **off the right edge** rather than sitting in a tidy grid — a row that visibly continues past the bezel says "there is more here" to someone walking past, which a complete 2x2 does not.

The **marquee** is the only moving thing on screen. Motion is what makes a dark panel read as live rather than switched off, and one slow line does that without competing with the photograph. It stops entirely under \`prefers-reduced-motion\`: a kiosk is a public screen, and someone with vestibular sensitivity cannot walk away from it as easily as they can close a tab.

The cards are the same \`ChoiceCard\` the Get Started hub uses, at \`size="sm"\` — same four options, one component, so the two cannot drift.

Weather comes from the supplied 40-icon set, keyed by condition rather than by the file numbering.`,
            },
        },
    },
} satisfies Meta<typeof WindowScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full attract screen, hero above the welcome nav. */
export const Default: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen {...args} onSelect={() => {}} />
        </KioskScreen>
    ),
};

/** A named course and different weather, to check nothing is hard-coded. */
export const EveningRain: Story = {
    args: { courseName: "Sagamore Golf Club", temperature: 58, condition: "moderate-rain", wind: "6mph SW" },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen {...args} onSelect={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The marquee on its own.
 *
 * Two identical tracks translate left by exactly their own width, so the moment
 * the first leaves the viewport the second is where it started. That only holds
 * while **one track is at least as wide as its container** — a short phrase
 * leaves a gap that crosses the screen once per cycle, which the second example
 * here shows deliberately.
 */
export const MarqueeOnly: Story = {
    args: {},
    parameters: { layout: "padded" },
    render: () => (
        <div className="flex w-[750px] flex-col gap-10 bg-primary-solid p-8">
            <div>
                <p className="mb-3 text-sm text-tertiary">Default — long enough to fill the track</p>
                <Marquee
                    items={["Trusted by over thousands of golfers nationwide", "Powering leagues, events, and daily play"]}
                    className="text-[30px] text-white/70"
                />
            </div>

            <div>
                <p className="mb-3 text-sm text-tertiary">Faster</p>
                <Marquee items={["Book a tee time", "Join the waitlist", "Order from the bar"]} durationMs={15000} className="text-[24px] text-white/70" />
            </div>

            <div>
                <p className="mb-3 text-sm text-tertiary">Too short — note the gap crossing once per cycle</p>
                <Marquee items={["Open today"]} className="text-[24px] text-white/70" />
            </div>
        </div>
    ),
};
