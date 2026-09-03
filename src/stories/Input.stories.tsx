import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail01, SearchLg, Tag01 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";

/**
 * Inputs collect everything a golfer types while booking — the email for the
 * confirmation, a promo code, searching the tee sheet. Minimal: hairline
 * border, ink focus ring, no fill.
 */
const meta = {
    title: "Components/Forms/Inputs/Input",
    component: Input,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        isInvalid: { control: "boolean" },
        isDisabled: { control: "boolean" },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
    },
    args: {
        label: "Email address",
        placeholder: "you@email.com",
        hint: "We’ll send your tee-time confirmation here.",
        size: "md",
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Three sizes for the member booking form — sm, md, lg. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex w-80 flex-col gap-4">
            <Input {...args} size="sm" hint={undefined} label="Small" />
            <Input {...args} size="md" hint={undefined} label="Medium" />
            <Input {...args} size="lg" hint={undefined} label="Large" />
        </div>
    ),
    decorators: [(Story) => <Story />],
};

/** Leading icon for the confirmation email field. */
export const WithIcon: Story = {
    args: {
        label: "Confirmation email",
        icon: Mail01,
        placeholder: "you@email.com",
    },
};

/** Help tooltip explaining where the confirmation lands. */
export const WithTooltip: Story = {
    args: {
        label: "Member email",
        tooltip: "Your tee-time confirmation and scorecard are sent here.",
        placeholder: "you@email.com",
    },
};

/** Required field — a member name is needed to hold the booking. */
export const Required: Story = {
    args: {
        label: "Member name",
        placeholder: "Olivia Rhye",
        isRequired: true,
        hint: "As it appears on your membership card.",
    },
};

/** Promo code with a member savings hint. */
export const PromoCode: Story = {
    args: {
        label: "Promo code",
        icon: Tag01,
        placeholder: "SAGAMORE20",
        hint: "Members save 20% on twilight rounds.",
    },
};

/** Search field with no label for filtering the tee sheet. */
export const SearchTeeSheet: Story = {
    args: {
        label: undefined,
        icon: SearchLg,
        placeholder: "Search tee times…",
        hint: undefined,
    },
};

/** Password type with a built-in visibility toggle, for the member portal. */
export const Password: Story = {
    args: {
        label: "Member portal password",
        type: "password",
        placeholder: "Enter your password",
        hint: undefined,
    },
};

/** Email type for the booking confirmation address. */
export const EmailType: Story = {
    args: {
        label: "Confirmation email",
        type: "email",
        icon: Mail01,
        placeholder: "you@email.com",
    },
};

/** Disabled — the field is locked while the round is being processed. */
export const Disabled: Story = {
    args: {
        label: "Confirmation email",
        icon: Mail01,
        placeholder: "you@email.com",
        isDisabled: true,
    },
};

/** Validation edge case — an invalid promo code at checkout. */
export const Invalid: Story = {
    args: {
        label: "Promo code",
        icon: Tag01,
        placeholder: "Enter code",
        isInvalid: true,
        hint: "That code isn’t valid for this tee time.",
    },
};
