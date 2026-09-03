import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarCheck01, Clock, CreditCard02, Flag01, Users01 } from "@untitledui/icons";
import { ProgressSteps } from "@/components/application/progress-steps/progress-steps";
import type { Step } from "@/components/application/progress-steps/progress-steps";

/**
 * Progress Steps walk a golfer through a tee-time booking — from picking a
 * course to a confirmed reservation. Completed steps fill solid (near-black in
 * the monochromatic Sagamore theme) with a check, the current step wears a
 * brand ring, and steps still ahead stay muted. Connector lines fill in as the
 * booking advances.
 */
const meta = {
    title: "Components/Feedback & Status/Progress Steps",
    component: ProgressSteps,
    parameters: { layout: "centered" },
} satisfies Meta<typeof ProgressSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The five stages of booking a round at Sagamore. */
const BOOKING_STEPS: Step[] = [
    { id: "course", title: "Select course", status: "complete" },
    { id: "tee-time", title: "Pick tee time", status: "complete" },
    { id: "players", title: "Add players", status: "current" },
    { id: "payment", title: "Payment", status: "incomplete" },
    { id: "confirmed", title: "Confirmed", status: "incomplete" },
];

const BOOKING_STEPS_WITH_DESC: Step[] = [
    { id: "course", title: "Select course", description: "Championship or Executive", status: "complete" },
    { id: "tee-time", title: "Pick tee time", description: "Morning frost has cleared", status: "complete" },
    { id: "players", title: "Add players", description: "Up to four in your group", status: "current" },
    { id: "payment", title: "Payment", description: "Cart included on the 18", status: "incomplete" },
    { id: "confirmed", title: "Confirmed", description: "Receipt sent to your inbox", status: "incomplete" },
];

const BOOKING_STEPS_WITH_ICONS: Step[] = [
    { id: "course", title: "Select course", icon: Flag01, status: "complete" },
    { id: "tee-time", title: "Pick tee time", icon: Clock, status: "complete" },
    { id: "players", title: "Add players", icon: Users01, status: "current" },
    { id: "payment", title: "Payment", icon: CreditCard02, status: "incomplete" },
    { id: "confirmed", title: "Confirmed", icon: CalendarCheck01, status: "incomplete" },
];

/** Default numbered, horizontal stepper mid-booking. */
export const Playground: Story = {
    args: {
        steps: BOOKING_STEPS,
        orientation: "horizontal",
        type: "number",
        size: "md",
    },
    render: (args) => (
        <div className="w-[44rem] max-w-full">
            <ProgressSteps {...args} aria-label="Booking progress" />
        </div>
    ),
};

/** Horizontal numbered steps across the full booking flow. */
export const Horizontal: Story = {
    args: { steps: BOOKING_STEPS },
    render: () => (
        <div className="w-[44rem] max-w-full">
            <ProgressSteps steps={BOOKING_STEPS} orientation="horizontal" type="number" aria-label="Booking progress" />
        </div>
    ),
};

/** Vertical layout — handy for a narrow booking sidebar. */
export const Vertical: Story = {
    args: { steps: BOOKING_STEPS },
    render: () => (
        <div className="w-72">
            <ProgressSteps steps={BOOKING_STEPS} orientation="vertical" type="number" aria-label="Booking progress" />
        </div>
    ),
};

/** Each step carries supporting copy describing what happens there. */
export const WithDescriptions: Story = {
    args: { steps: BOOKING_STEPS_WITH_DESC },
    render: () => (
        <div className="w-80">
            <ProgressSteps steps={BOOKING_STEPS_WITH_DESC} orientation="vertical" type="dot" size="md" aria-label="Booking progress" />
        </div>
    ),
};

/** Icon indicators — a flag, clock, players, card, and calendar tell the story at a glance. */
export const IconSteps: Story = {
    args: { steps: BOOKING_STEPS_WITH_ICONS },
    render: () => (
        <div className="w-[48rem] max-w-full">
            <ProgressSteps steps={BOOKING_STEPS_WITH_ICONS} orientation="horizontal" type="icon" size="lg" aria-label="Booking progress" />
        </div>
    ),
};

/** Classic numbered circles — completed steps swap their number for a check. */
export const Numbered: Story = {
    args: { steps: BOOKING_STEPS },
    render: () => (
        <div className="w-[44rem] max-w-full">
            <ProgressSteps steps={BOOKING_STEPS} orientation="horizontal" type="number" size="sm" aria-label="Booking progress" />
        </div>
    ),
};
