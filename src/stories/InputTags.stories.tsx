import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputTags } from "@/components/base/input/input-tags";

/**
 * Input Tags collects short chips inline — course features a member wants, or
 * the playing partners on a booking. Type and press Enter to add; backspace
 * peels the last chip off. Hairline border, ink focus ring, no fill.
 */
const meta = {
    title: "Components/Forms/Inputs/Input Tags",
    component: InputTags,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
        isDisabled: { control: "boolean" },
        isInvalid: { control: "boolean" },
    },
    args: {
        size: "md",
        label: "Course features",
        hint: "Press Enter to add a feature.",
        placeholder: "Add a feature…",
        defaultValue: ["Links", "Walking", "Caddies"],
    },
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InputTags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Empty state inviting the member to list playing partners. */
export const PlayingPartners: Story = {
    args: {
        label: "Playing partners",
        hint: "Add each guest by name.",
        placeholder: "Add a partner…",
        defaultValue: [],
    },
};

/** Capped at four chips — one tee time, four players. */
export const MaxTags: Story = {
    args: {
        label: "Group (max 4)",
        hint: "Four players per tee time.",
        maxTags: 4,
        defaultValue: ["Olivia", "Phoenix"],
    },
};

/** Help tooltip describing accepted feature tags. */
export const WithTooltip: Story = {
    args: {
        label: "Course features",
        tooltip: "Tags help members filter the course directory.",
    },
};

/** Invalid — a required feature tag is missing. */
export const Invalid: Story = {
    args: {
        label: "Course features",
        isInvalid: true,
        hint: "Add at least one feature.",
        defaultValue: [],
    },
};

/** Disabled while the course profile is locked for editing. */
export const Disabled: Story = {
    args: {
        label: "Course features",
        isDisabled: true,
        defaultValue: ["Links", "Walking"],
    },
};
