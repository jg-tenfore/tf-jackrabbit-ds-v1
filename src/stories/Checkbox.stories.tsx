import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "@/components/base/checkbox/checkbox";

/**
 * Checkboxes capture the small commitments in the Sagamore booking flow —
 * agreeing to the cancellation policy, adding a cart, opting into reminders.
 * Monochromatic: the checked state is near-black, never coloured.
 */
const meta = {
    title: "Components/Forms/Checkbox",
    component: Checkbox,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
        isDisabled: { control: "boolean" },
        isIndeterminate: { control: "boolean" },
        isSelected: { control: "boolean" },
        label: { control: "text" },
        hint: { control: "text" },
    },
    args: {
        label: "Add a cart ($20)",
        size: "sm",
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A checkbox paired with a supporting hint at checkout. */
export const WithHint: Story = {
    args: {
        label: "I agree to Sagamore’s cancellation policy",
        hint: "Free cancellation up to 24 hours before your tee time.",
    },
};

/** The booking add-ons a golfer toggles before paying. */
export const BookingOptions: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Checkbox {...args} defaultSelected label="Add a cart ($20)" />
            <Checkbox {...args} label="Email me tee-time reminders" />
            <Checkbox {...args} label="I agree to Sagamore’s cancellation policy" hint="Free cancellation up to 24 hours before your tee time." />
        </div>
    ),
};

/** Both sizes, selected, for the dense vs. comfortable tee-sheet layouts. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Checkbox {...args} size="sm" defaultSelected label="Members-only tee times (small)" />
            <Checkbox {...args} size="md" defaultSelected label="Members-only tee times (medium)" />
        </div>
    ),
};

/** Edge cases — an indeterminate "select all" header and a locked add-on. */
export const EdgeCases: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Checkbox {...args} isIndeterminate label="Add all four players to the group" hint="Two of four spots already filled." />
            <Checkbox {...args} isDisabled defaultSelected label="Add a cart ($20)" hint="Cart included with this twilight rate." />
        </div>
    ),
};
