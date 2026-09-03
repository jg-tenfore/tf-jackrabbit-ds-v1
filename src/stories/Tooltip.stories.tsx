import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

/**
 * Tooltips explain the small print on the tee sheet — what a twilight rate
 * means, whether a cart is included — without crowding the booking card. The
 * surface is ink-solid with white type, matching the monochromatic theme.
 */
const meta = {
    title: "Components/Feedback & Status/Tooltip",
    component: Tooltip,
    parameters: { layout: "centered" },
    argTypes: {
        title: { control: "text" },
        description: { control: "text" },
        arrow: { control: "boolean" },
        placement: {
            control: "select",
            options: ["top", "bottom", "left", "right"],
        },
        delay: { control: "number" },
    },
    args: {
        title: "Twilight rate",
        description: "Discounted tee times after 4 PM.",
        arrow: true,
        placement: "top",
        children: (
            <TooltipTrigger>
                <Button color="secondary">Twilight rate</Button>
            </TooltipTrigger>
        ),
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Single-line note on what comes with the round. */
export const CartIncluded: Story = {
    args: {
        title: "Cart included",
        description: undefined,
        children: (
            <TooltipTrigger>
                <Button color="secondary">Cart included</Button>
            </TooltipTrigger>
        ),
    },
};

/** A fuller explanation with a title and supporting description. */
export const MembersOnly: Story = {
    args: {
        title: "Members only",
        description: "This 7:10 AM slot is reserved for Sagamore members until 48 hours out.",
        placement: "right",
        children: (
            <TooltipTrigger>
                <Button color="tertiary">Why is this locked?</Button>
            </TooltipTrigger>
        ),
    },
};

/** Edge case — kept open so the surface is always visible in the docs. */
export const AlwaysOpen: Story = {
    args: {
        title: "Replay rate",
        description: "Play the back nine again the same day for $30.",
        defaultOpen: true,
        placement: "bottom",
        children: (
            <TooltipTrigger>
                <Button color="secondary">Replay rate</Button>
            </TooltipTrigger>
        ),
    },
};
