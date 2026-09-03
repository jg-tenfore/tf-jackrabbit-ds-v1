import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputBase } from "@/components/base/input/input";
import { InputGroup } from "@/components/base/input/input-group";

/**
 * Input Group pairs the field with addons set off by their own hairline box —
 * a currency symbol on a green fee, the club's domain on a member URL, a units
 * suffix on a yardage. Same ink focus ring, no fill.
 */
const meta = {
    title: "Components/Forms/Inputs/Input Group",
    component: InputGroup,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        label: { control: "text" },
        hint: { control: "text" },
    },
    args: {
        size: "md",
        label: "Green fee",
        hint: "Per player, weekday twilight rate.",
        leadingAddon: <InputGroup.Prefix>$</InputGroup.Prefix>,
        children: <InputBase placeholder="65.00" />,
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Leading addon — a currency symbol on the green fee. */
export const LeadingAddon: Story = {
    args: {
        label: "Green fee",
        leadingAddon: <InputGroup.Prefix>$</InputGroup.Prefix>,
        trailingAddon: undefined,
        children: <InputBase placeholder="65.00" />,
    },
};

/** Trailing addon — a units suffix on a recorded drive. */
export const TrailingAddon: Story = {
    args: {
        label: "Longest drive",
        hint: "Recorded on the 7th tee.",
        leadingAddon: undefined,
        trailingAddon: <InputGroup.Prefix>yds</InputGroup.Prefix>,
        children: <InputBase placeholder="295" />,
    },
};

/** Both addons — protocol and domain around the member's vanity URL. */
export const LeadingAndTrailing: Story = {
    args: {
        label: "Member profile URL",
        hint: undefined,
        leadingAddon: <InputGroup.Prefix>https://</InputGroup.Prefix>,
        trailingAddon: <InputGroup.Prefix>.sagamore.golf</InputGroup.Prefix>,
        children: <InputBase placeholder="olivia-rhye" />,
    },
};

/** Inline prefix text — club code shown inside the same box. */
export const Prefix: Story = {
    args: {
        label: "Locker number",
        hint: undefined,
        prefix: "SAG-",
        leadingAddon: undefined,
        children: <InputBase placeholder="142" />,
    },
};
