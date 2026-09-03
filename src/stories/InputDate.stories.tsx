import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "@untitledui/icons";
import { InputDate } from "@/components/base/input/input-date";

/**
 * Input Date is the segmented field a member fills when picking a round date —
 * type the month, day, year straight into the boxes. Ink-on-white, no fill,
 * the active segment flips to the club's near-black.
 */
const meta = {
    title: "Components/Forms/Inputs/Input Date",
    component: InputDate,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        label: { control: "text" },
        hint: { control: "text" },
        isDisabled: { control: "boolean" },
        isInvalid: { control: "boolean" },
    },
    args: {
        size: "md",
        label: "Round date",
        hint: "Tee sheet opens 14 days out.",
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InputDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Three sizes for the booking form. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex w-80 flex-col gap-4">
            <InputDate {...args} size="sm" hint={undefined} label="Small" />
            <InputDate {...args} size="md" hint={undefined} label="Medium" />
            <InputDate {...args} size="lg" hint={undefined} label="Large" />
        </div>
    ),
    decorators: [(Story) => <Story />],
};

/** Leading calendar icon for the round date. */
export const WithIcon: Story = {
    args: {
        label: "Round date",
        icon: Calendar,
    },
};

/** Help tooltip explaining the booking window. */
export const WithTooltip: Story = {
    args: {
        label: "Round date",
        tooltip: "Members may book up to 14 days in advance.",
    },
};

/** Invalid — the chosen date falls outside the booking window. */
export const Invalid: Story = {
    args: {
        label: "Round date",
        icon: Calendar,
        isInvalid: true,
        hint: "That date is beyond the 14-day window.",
    },
};

/** Disabled while the tee sheet is being rebuilt. */
export const Disabled: Story = {
    args: {
        label: "Round date",
        icon: Calendar,
        isDisabled: true,
    },
};
