import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

/**
 * The Loading Indicator is the spinning ball on the practice green while the tee
 * sheet finishes loading. Pick a style, pick a size, and let members know the
 * course is just about ready.
 */
const meta = {
    title: "Components/Feedback & Status/Loading Indicator",
    component: LoadingIndicator,
    parameters: { layout: "centered" },
    argTypes: {
        type: {
            control: "inline-radio",
            options: ["line-simple", "line-spinner", "dot-circle"],
        },
        size: {
            control: "inline-radio",
            options: ["sm", "md", "lg", "xl"],
        },
        label: { control: "text" },
    },
    args: {
        type: "line-simple",
        size: "sm",
    },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Tune the type, size, and label to find your favourite spinner on the range. */
export const Playground: Story = {};

/** Every spinner style lined up, like clubs waiting in the bag. */
export const Types: Story = {
    render: () => (
        <div className="flex items-center gap-12">
            <LoadingIndicator type="line-simple" size="lg" />
            <LoadingIndicator type="line-spinner" size="lg" />
            <LoadingIndicator type="dot-circle" size="lg" />
        </div>
    ),
};

/** From the short game to the long drive — every size, smallest to largest. */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-end gap-12">
            <LoadingIndicator size="sm" />
            <LoadingIndicator size="md" />
            <LoadingIndicator size="lg" />
            <LoadingIndicator size="xl" />
        </div>
    ),
};

/** A friendly word below the spinner while the tee sheet loads. */
export const WithLabel: Story = {
    args: {
        size: "lg",
        label: "Loading the tee sheet...",
    },
};
