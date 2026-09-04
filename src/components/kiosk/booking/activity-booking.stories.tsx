import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActivityBooking } from "@/components/kiosk/booking/activity-booking";
import { PICKLEBALL_CONFIG, SIMULATOR_CONFIG } from "@/components/kiosk/booking/activity-config";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Booking/Activity",
    component: ActivityBooking,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "Simulator and pickleball are the same four questions in the same order — duration, start time, bay/court, review — so they are **one component driven by an `ActivityConfig`**, not two component trees. A third activity costs a config object. Steps render one at a time because each answer narrows the next: duration changes which start times fit, start time changes which bays are free, so showing them together would show options about to become invalid.",
            },
        },
        docsOnly: false,
    },
} satisfies Meta<typeof ActivityBooking>;

export default meta;
type Story = StoryObj<typeof meta>;

const screen = (config: typeof SIMULATOR_CONFIG, initialStep: "duration" | "start-time" | "resource" | "review") => (
    <KioskScreen scroll={false} footer={<KioskFooterBar />}>
        <ActivityBooking config={config} initialStep={initialStep} />
    </KioskScreen>
);

/** Step 1 — duration. Choosing one advances the flow. */
export const SimulatorDuration: Story = {
    args: { config: SIMULATOR_CONFIG },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => screen(SIMULATOR_CONFIG, "duration"),
};

/** Step 2 — the day strip plus a three-column half-hour time grid. */
export const SimulatorStartTime: Story = {
    args: { config: SIMULATOR_CONFIG },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => screen(SIMULATOR_CONFIG, "start-time"),
};

/** Step 3 — named bays, with an unavailable one shown rather than hidden. */
export const SimulatorBayLocation: Story = {
    args: { config: SIMULATOR_CONFIG },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => screen(SIMULATOR_CONFIG, "resource"),
};

/**
 * The identical flow with the pickleball config — different title, subtitle,
 * durations and resource noun ("Court" not "Bay"), zero different code.
 */
export const PickleballStartTime: Story = {
    args: { config: PICKLEBALL_CONFIG },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => screen(PICKLEBALL_CONFIG, "start-time"),
};

export const PickleballCourtLocation: Story = {
    args: { config: PICKLEBALL_CONFIG },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => screen(PICKLEBALL_CONFIG, "resource"),
};
