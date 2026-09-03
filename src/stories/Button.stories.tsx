import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight, Calendar, Flag06 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

/**
 * Buttons drive every action in the Sagamore booking flow — reserving a tee
 * time, joining a waitlist, cancelling a round. With the monochromatic theme,
 * the primary action is near-black; everything else is greyscale.
 */
const meta = {
    title: "Components/Actions/Button",
    component: Button,
    parameters: { layout: "centered" },
    argTypes: {
        color: {
            control: "select",
            options: [
                "primary",
                "secondary",
                "tertiary",
                "link-gray",
                "link-color",
                "primary-destructive",
                "secondary-destructive",
            ],
        },
        size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
        isLoading: { control: "boolean" },
        isDisabled: { control: "boolean" },
        children: { control: "text" },
    },
    args: {
        color: "primary",
        size: "md",
        children: "Book tee time",
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every colour variant, rendered greyscale by the Sagamore theme. */
export const Variants: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...args} color="primary">
                Reserve
            </Button>
            <Button {...args} color="secondary">
                Add to round
            </Button>
            <Button {...args} color="tertiary">
                View details
            </Button>
            <Button {...args} color="link-gray">
                Change date
            </Button>
            <Button {...args} color="primary-destructive">
                Cancel booking
            </Button>
        </div>
    ),
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...args} size="sm">
                Small
            </Button>
            <Button {...args} size="md">
                Medium
            </Button>
            <Button {...args} size="lg">
                Large
            </Button>
            <Button {...args} size="xl">
                Extra large
            </Button>
        </div>
    ),
};

export const WithIcons: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...args} iconLeading={Calendar}>
                Pick a date
            </Button>
            <Button {...args} color="secondary" iconTrailing={ArrowRight}>
                Continue to checkout
            </Button>
            <Button {...args} color="tertiary" iconLeading={Flag06}>
                Course info
            </Button>
        </div>
    ),
};

/** Booking flow states — the same action across its lifecycle. */
export const BookingStates: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...args}>Book tee time</Button>
            <Button {...args} isLoading>
                Reserving…
            </Button>
            <Button {...args} isDisabled>
                Fully booked
            </Button>
            <Button {...args} color="secondary">
                Join waitlist
            </Button>
        </div>
    ),
};
