import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slider } from "@/components/base/slider/slider";

/**
 * Sliders narrow the tee sheet — set a per-player price ceiling for the round,
 * cap the group size, or carve out a booking window. Monochromatic: a hairline
 * quaternary track with an ink-filled range and grab handles.
 *
 * Built on React Aria's `Slider`. Single value or an array for multiple thumbs;
 * `labelPosition` controls how the readout sits ("default" hidden, "bottom"
 * inline, "top-floating" tooltip); `labelFormatter` formats each thumb, and
 * without it the value renders as a percentage.
 */
const meta = {
    title: "Components/Forms/Slider",
    component: Slider,
    parameters: { layout: "centered" },
    argTypes: {
        labelPosition: {
            control: "inline-radio",
            options: ["default", "bottom", "top-floating"],
            description: "Where the thumb value readout sits.",
        },
        minValue: { control: "number" },
        maxValue: { control: "number" },
        step: { control: "number" },
        isDisabled: { control: "boolean" },
        labelFormatter: { control: false, table: { disable: true } },
    },
    args: {
        minValue: 0,
        maxValue: 120,
        step: 5,
        defaultValue: 55,
        labelPosition: "bottom",
        labelFormatter: (value: number) => `$${value}`,
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Single thumb — cap the per-player green fee at one price ceiling. */
export const SingleThumb: Story = {
    args: {
        defaultValue: 89,
        labelFormatter: (value: number) => `$${value}`,
    },
};

/** Two thumbs set a price range across the tee sheet. */
export const Range: Story = {
    args: {
        defaultValue: [30, 89],
        labelFormatter: (value: number) => `$${value}`,
    },
};

/** Three thumbs — early, mid, and late tee-time price tiers on one rail. */
export const MultipleThumbs: Story = {
    args: {
        minValue: 0,
        maxValue: 120,
        step: 5,
        defaultValue: [25, 60, 95],
        labelFormatter: (value: number) => `$${value}`,
    },
};

/** No readout — `labelPosition: "default"` hides the value for a compact filter. */
export const LabelHidden: Story = {
    args: {
        labelPosition: "default",
        defaultValue: 89,
        labelFormatter: (value: number) => `$${value}`,
    },
};

/** Inline readout below the handle — the default tee-sheet treatment. */
export const LabelBottom: Story = {
    args: {
        labelPosition: "bottom",
        defaultValue: 89,
        labelFormatter: (value: number) => `$${value}`,
    },
};

/** Floating tooltip above the handle — a clear callout while dragging. */
export const LabelFloating: Story = {
    args: {
        labelPosition: "top-floating",
        defaultValue: [30, 89],
        labelFormatter: (value: number) => `$${value}`,
    },
};

/** Custom min/max/step — handicap index from +2 to 36 in half-stroke steps. */
export const MinMaxStep: Story = {
    args: {
        minValue: -2,
        maxValue: 36,
        step: 0.5,
        defaultValue: [8, 18],
        labelPosition: "top-floating",
        labelFormatter: (value: number) => (value > 0 ? `${value}` : `+${Math.abs(value)}`),
    },
};

/** Whole-number group size for the booking — 1 to 4 players. */
export const GroupSize: Story = {
    args: {
        minValue: 1,
        maxValue: 4,
        step: 1,
        defaultValue: 4,
        labelFormatter: (value: number) => `${value} ${value === 1 ? "player" : "players"}`,
    },
};

/** Custom value formatting — a morning booking window rendered as clock times. */
export const TimeWindow: Story = {
    args: {
        minValue: 6 * 60,
        maxValue: 12 * 60,
        step: 15,
        defaultValue: [7 * 60 + 30, 10 * 60],
        labelPosition: "top-floating",
        labelFormatter: (value: number) => {
            const hours = Math.floor(value / 60);
            const minutes = value % 60;
            const period = hours >= 12 ? "PM" : "AM";
            const hour12 = hours % 12 === 0 ? 12 : hours % 12;
            return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
        },
    },
};

/** Default percent formatting — drop `labelFormatter` and the value reads as a percentage (course-occupancy cap). */
export const PercentFormat: Story = {
    args: {
        minValue: 0,
        maxValue: 100,
        step: 5,
        defaultValue: 75,
        labelPosition: "bottom",
        labelFormatter: undefined,
    },
};

/** Edge case — a locked filter on a fully booked morning. */
export const Disabled: Story = {
    args: {
        defaultValue: 89,
        isDisabled: true,
        labelFormatter: (value: number) => `$${value}`,
    },
};
