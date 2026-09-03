import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextArea } from "@/components/base/textarea/textarea";

/**
 * Textareas capture the free-form notes a golfer leaves while booking — special
 * requests for the round, messages for the pro shop. Minimal: hairline border,
 * ink focus ring, no fill.
 */
const meta = {
    title: "Components/Forms/Textarea",
    component: TextArea,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
        isDisabled: { control: "boolean" },
        isRequired: { control: "boolean" },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
        rows: { control: "number" },
    },
    args: {
        label: "Special requests for your round",
        placeholder: "Please pair us with another twosome.",
        hint: "Our starter will do their best to accommodate.",
        size: "md",
        rows: 4,
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ProShopNotes: Story = {
    args: {
        label: "Notes for the pro shop",
        placeholder: "Reserve a cart and two rental sets, please.",
        hint: "Rentals are subject to availability.",
    },
};

export const Required: Story = {
    args: {
        label: "Reason for cancellation",
        placeholder: "Tell us why you're cancelling this tee time.",
        hint: "Required for refunds within 24 hours of your round.",
        isRequired: true,
    },
};

export const SmallSize: Story = {
    args: {
        size: "sm",
        label: "Quick note",
        placeholder: "Running 10 minutes late.",
        hint: undefined,
        rows: 2,
    },
};

/** Edge case — notes are locked once the round is checked in. */
export const Disabled: Story = {
    args: {
        label: "Special requests for your round",
        placeholder: "Please pair us with another twosome.",
        hint: "This round has already been checked in.",
        isDisabled: true,
    },
};
