import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";

/**
 * Progress bars track how full a tee block is and how far along the season
 * pass a member has played at Sagamore. The fill is the near-black brand
 * foreground under the monochromatic theme.
 */
const meta = {
    title: "Components/Feedback & Status/Progress Indicators",
    component: ProgressBar,
    parameters: { layout: "padded" },
    argTypes: {
        value: { control: { type: "range", min: 0, max: 100, step: 1 } },
        labelPosition: {
            control: "inline-radio",
            options: ["right", "bottom", "top-floating", "bottom-floating"],
        },
    },
    args: {
        value: 64,
        labelPosition: "right",
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tee block at 64% capacity. */
export const Playground: Story = {};

/** Every label position. */
export const LabelPositions: Story = {
    render: () => (
        <div className="flex flex-col gap-10">
            <ProgressBar value={64} labelPosition="right" />
            <ProgressBar value={64} labelPosition="bottom" />
            <ProgressBar value={64} labelPosition="top-floating" />
            <ProgressBar value={64} labelPosition="bottom-floating" />
        </div>
    ),
};

/** A custom formatter — holes played out of 18 rather than a percentage. */
export const CustomFormatter: Story = {
    args: {
        value: 12,
        min: 0,
        max: 18,
        labelPosition: "right",
        valueFormatter: (value) => `${value} / 18 holes`,
    },
};

/** Season-pass fill at three stages. */
export const SeasonProgress: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <ProgressBar value={20} labelPosition="right" />
            <ProgressBar value={55} labelPosition="right" />
            <ProgressBar value={90} labelPosition="right" />
        </div>
    ),
};
