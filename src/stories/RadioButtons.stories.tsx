import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { RadioButton, RadioButtonBase, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";

/**
 * Radio groups let a golfer pick exactly one option while booking — how many
 * holes they're playing, whether they're riding or walking, or which rate
 * applies. Monochromatic: the selected dot fills near-black, everything else
 * stays greyscale.
 */
const meta = {
    title: "Components/Forms/RadioButtons",
    component: RadioGroup,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
        isDisabled: { control: "boolean" },
        orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    },
    args: {
        size: "sm",
        "aria-label": "Players in your group",
        children: (
            <>
                <RadioButton value="1" label="1 player" />
                <RadioButton value="2" label="2 players" />
                <RadioButton value="3" label="3 players" />
                <RadioButton value="4" label="4 players" />
            </>
        ),
    },
    render: (args) => <RadioGroup {...args} defaultValue="2" />,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** How many holes is the round — the most common choice on the tee sheet. */
export const NumberOfHoles: Story = {
    render: (args) => (
        <RadioGroup {...args} aria-label="Number of holes" defaultValue="18">
            <RadioButton value="9" label="9 holes" />
            <RadioButton value="18" label="18 holes" />
            <RadioButton value="27" label="27 holes" />
        </RadioGroup>
    ),
};

/** Ride or walk — a two-option group laid out side by side. */
export const RideOrWalk: Story = {
    args: { orientation: "horizontal" },
    render: (args) => (
        <RadioGroup {...args} aria-label="Getting around" defaultValue="ride" className="flex-row gap-6">
            <RadioButton value="ride" label="Ride (cart)" />
            <RadioButton value="walk" label="Walk" />
        </RadioGroup>
    ),
};

/** Rate type, with a hint under each option. */
export const RateType: Story = {
    render: (args) => (
        <RadioGroup {...args} aria-label="Rate type" defaultValue="standard">
            <RadioButton value="standard" label="Standard" hint="Full price, all 18 holes." />
            <RadioButton value="twilight" label="Twilight" hint="After 3:00 PM, reduced rate." />
            <RadioButton value="member" label="Member" hint="Sagamore members only." />
        </RadioGroup>
    ),
};

/** Course selection with supporting text for each layout. */
export const CourseSelection: Story = {
    render: (args) => (
        <RadioGroup {...args} aria-label="Choose your course" defaultValue="lakeside">
            <RadioButton value="lakeside" label="Lakeside" hint="Par 72 — water on the back nine." />
            <RadioButton value="ridge" label="The Ridge" hint="Par 70 — tight, tree-lined fairways." />
            <RadioButton value="links" label="Sagamore Links" hint="Par 71 — open, windswept links style." />
        </RadioGroup>
    ),
};

/** A single radio button on its own, outside a multi-option group. */
export const SingleButton: Story = {
    render: (args) => (
        <RadioGroup {...args} aria-label="Cart add-on" defaultValue="cart">
            <RadioButton value="cart" label="Add a cart ($20)" hint="Shared two-seater, keys at the bag drop." />
        </RadioGroup>
    ),
};

/** Both sizes — small for the dense tee sheet, medium for the on-course kiosk. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-8">
            <RadioGroup {...args} size="sm" aria-label="Number of holes (small)" defaultValue="18">
                <RadioButton value="9" label="9 holes" />
                <RadioButton value="18" label="18 holes" />
                <RadioButton value="27" label="27 holes" />
            </RadioGroup>
            <RadioGroup {...args} size="md" aria-label="Number of holes (medium)" defaultValue="18">
                <RadioButton value="9" label="9 holes" />
                <RadioButton value="18" label="18 holes" />
                <RadioButton value="27" label="27 holes" />
            </RadioGroup>
        </div>
    ),
};

/** Larger touch target for the on-course kiosk. */
export const MediumSize: Story = {
    args: { size: "md" },
};

/** Vertical (default) versus horizontal layout for the same choice. */
export const Orientation: Story = {
    render: (args) => (
        <div className="flex flex-col gap-8">
            <RadioGroup {...args} aria-label="Getting around (vertical)" defaultValue="ride">
                <RadioButton value="ride" label="Ride (cart)" />
                <RadioButton value="walk" label="Walk" />
            </RadioGroup>
            <RadioGroup {...args} aria-label="Getting around (horizontal)" orientation="horizontal" defaultValue="ride" className="flex-row gap-6">
                <RadioButton value="ride" label="Ride (cart)" />
                <RadioButton value="walk" label="Walk" />
            </RadioGroup>
        </div>
    ),
};

/** Controlled selection — the booking summary updates as you choose. */
export const Controlled: Story = {
    render: (args) => {
        const [players, setPlayers] = useState("2");
        return (
            <div className="flex flex-col gap-4">
                <RadioGroup {...args} aria-label="Players in your group" value={players} onChange={setPlayers}>
                    <RadioButton value="1" label="1 player" />
                    <RadioButton value="2" label="2 players" />
                    <RadioButton value="3" label="3 players" />
                    <RadioButton value="4" label="4 players" />
                </RadioGroup>
                <p className="text-sm text-tertiary">Booking for {players} on the Lakeside course.</p>
            </div>
        );
    },
};

/** A single disabled option inside an otherwise live group — twilight isn't open yet. */
export const DisabledOption: Story = {
    render: (args) => (
        <RadioGroup {...args} aria-label="Rate type" defaultValue="standard">
            <RadioButton value="standard" label="Standard" hint="Full price, all 18 holes." />
            <RadioButton value="twilight" label="Twilight" hint="Opens at 3:00 PM." isDisabled />
            <RadioButton value="member" label="Member" hint="Sagamore members only." />
        </RadioGroup>
    ),
};

/** Edge case — the whole group is disabled while the rate card is being updated. */
export const Disabled: Story = {
    args: { isDisabled: true },
    render: (args) => (
        <RadioGroup {...args} aria-label="Rate type" defaultValue="standard">
            <RadioButton value="standard" label="Standard" hint="Full price, all 18 holes." />
            <RadioButton value="twilight" label="Twilight" hint="Opens at 3:00 PM." />
            <RadioButton value="member" label="Member" hint="Sagamore members only." />
        </RadioGroup>
    ),
};

/** The raw dot indicator (RadioButtonBase) across every visual state. */
export const BaseStates: Story = {
    render: () => (
        <div className="flex items-center gap-6">
            <RadioButtonBase />
            <RadioButtonBase isSelected />
            <RadioButtonBase isDisabled />
            <RadioButtonBase isSelected isDisabled />
            <RadioButtonBase size="md" isSelected />
        </div>
    ),
};
