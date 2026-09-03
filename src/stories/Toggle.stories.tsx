import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from "@/components/base/toggle/toggle";

/**
 * Toggles flip the tee-sheet filters and booking preferences at Sagamore —
 * twilight-only rates, members-only times, walking instead of riding. The "on"
 * state is near-black under the monochromatic theme.
 */
const meta = {
    title: "Components/Forms/Toggle",
    component: Toggle,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
        slim: { control: "boolean" },
        isDisabled: { control: "boolean" },
        isSelected: { control: "boolean" },
        label: { control: "text" },
        hint: { control: "text" },
    },
    args: {
        label: "Show twilight rates only",
        size: "sm",
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A toggle with a supporting hint in the tee-sheet filter panel. */
export const WithHint: Story = {
    args: {
        label: "Members-only tee times",
        hint: "Restrict the sheet to times reserved for Sagamore members.",
        defaultSelected: true,
    },
};

/** The filters stacked in the booking sidebar. */
export const TeeSheetFilters: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Toggle {...args} defaultSelected label="Show twilight rates only" />
            <Toggle {...args} label="Members-only tee times" />
            <Toggle {...args} label="Walking (no cart)" hint="Cart not required for this round." />
        </div>
    ),
};

/** Default and slim variants across both sizes. */
export const Variants: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Toggle {...args} size="sm" defaultSelected label="Show twilight rates only (small)" />
            <Toggle {...args} size="md" defaultSelected label="Show twilight rates only (medium)" />
            <Toggle {...args} slim defaultSelected label="Walking (no cart) — slim" />
        </div>
    ),
};

/** Edge case — a filter locked on for member accounts. */
export const Disabled: Story = {
    args: {
        label: "Members-only tee times",
        hint: "Always on for member accounts.",
        isDisabled: true,
        defaultSelected: true,
    },
};
