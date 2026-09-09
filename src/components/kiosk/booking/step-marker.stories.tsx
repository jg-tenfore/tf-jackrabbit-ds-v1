import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StepMarker } from "@/components/kiosk/booking/step-marker";

const meta = {
    title: "Components/Kiosk Booking/Step Marker",
    component: StepMarker,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `The progress dot beside a step's label in a booking rail.

Three states, and each is a different **shape**, not a different colour: complete is a filled tick, current is a hollow ring, upcoming is a flat disc.

That matters on a kiosk more than anywhere else. The panel is read standing, at arm's length, sometimes in direct sunlight — and a user who cannot tell green from grey can still tell a tick from a ring from a dot. Colour carries the same information a second time rather than being the only channel.

Extracted from \`StepRail\` because the tee-time flow, the activity flows and anything else with a wizard all need the same three marks, and three copies of a traffic light is how they stop agreeing with each other.`,
            },
        },
    },
} satisfies Meta<typeof StepMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All three, in the order a user passes through them. */
export const AllStates: Story = {
    args: { state: "current" },
    render: () => (
        <div className="flex items-start gap-10 bg-primary p-8">
            {(["complete", "current", "upcoming"] as const).map((state) => (
                <div key={state} className="flex flex-col items-center gap-3">
                    <StepMarker state={state} />
                    <span className="text-xs text-tertiary">{state}</span>
                </div>
            ))}
        </div>
    ),
};

/** In context: a four-step rail mid-flow. */
export const InARail: Story = {
    args: { state: "current" },
    render: () => (
        <div className="flex w-[300px] flex-col bg-primary ring-1 ring-border-secondary">
            {[
                { label: "Duration", state: "complete" as const },
                { label: "Start time", state: "current" as const },
                { label: "Court location", state: "upcoming" as const },
                { label: "Review", state: "upcoming" as const },
            ].map((step) => (
                <div key={step.label} className="flex h-[68px] items-center gap-3 border-b border-secondary px-6">
                    <StepMarker state={step.state} />
                    <span
                        className={
                            step.state === "current"
                                ? "text-lg font-semibold text-brand-secondary underline decoration-2 underline-offset-8"
                                : step.state === "complete"
                                  ? "text-lg text-primary"
                                  : "text-lg text-quaternary"
                        }
                    >
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
    ),
};
