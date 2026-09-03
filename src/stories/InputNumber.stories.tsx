import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputNumber } from "@/components/base/input/input-number";

/**
 * Input Number is the stepper a member uses to set a party size, cart count,
 * or hole number — steppers nudge the value without reaching for the keyboard.
 * Hairline border, ink focus ring, no fill.
 */
const meta = {
    title: "Components/Forms/Inputs/Input Number",
    component: InputNumber,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
        label: { control: "text" },
        hint: { control: "text" },
        isDisabled: { control: "boolean" },
        isInvalid: { control: "boolean" },
    },
    args: {
        size: "md",
        orientation: "vertical",
        label: "Party size",
        hint: "Up to four players per tee time.",
        placeholder: "1",
        minValue: 1,
        maxValue: 4,
        defaultValue: 2,
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Three sizes for the booking form. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex w-80 flex-col gap-4">
            <InputNumber {...args} size="sm" hint={undefined} label="Small" />
            <InputNumber {...args} size="md" hint={undefined} label="Medium" />
            <InputNumber {...args} size="lg" hint={undefined} label="Large" />
        </div>
    ),
    decorators: [(Story) => <Story />],
};

/** Horizontal steppers flanking the value — minus on the left, plus on the right. */
export const Horizontal: Story = {
    args: {
        label: "Carts",
        hint: "One cart seats two players.",
        orientation: "horizontal",
        minValue: 0,
        maxValue: 2,
        defaultValue: 1,
    },
};

/** Formatted as currency for a guest green fee. */
export const Currency: Story = {
    args: {
        label: "Guest green fee",
        hint: undefined,
        formatOptions: { style: "currency", currency: "USD" },
        minValue: 0,
        defaultValue: 85,
    },
};

/** Invalid — the party exceeds the four-player limit. */
export const Invalid: Story = {
    args: {
        label: "Party size",
        isInvalid: true,
        hint: "Maximum four players per tee time.",
    },
};

/** Disabled while the booking is being confirmed. */
export const Disabled: Story = {
    args: {
        label: "Party size",
        isDisabled: true,
    },
};
