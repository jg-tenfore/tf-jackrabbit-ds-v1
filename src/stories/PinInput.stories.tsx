import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PinInput } from "@/components/base/input/pin-input";

/**
 * Pin Input is the four-digit code a member punches in at the kiosk to check
 * in for a round — big ink boxes that light to near-black as they fill. Built
 * from compound parts: PinInput, .Label, .Group, .Slot, .Description.
 */
const meta = {
    title: "Components/Forms/Inputs/Pin Input",
    component: PinInput,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["xxxs", "xxs", "xs", "sm", "md", "lg"] },
        disabled: { control: "boolean" },
        invalid: { control: "boolean" },
    },
    args: {
        size: "xs",
        disabled: false,
        invalid: false,
    },
    render: (args) => (
        <PinInput {...args}>
            <PinInput.Label>Member check-in PIN</PinInput.Label>
            <PinInput.Group maxLength={4}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
            </PinInput.Group>
            <PinInput.Description>Enter the 4-digit code from your booking confirmation.</PinInput.Description>
        </PinInput>
    ),
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Large display boxes for the lobby check-in kiosk. */
export const LargeKiosk: Story = {
    args: { size: "lg" },
    render: (args) => (
        <PinInput {...args}>
            <PinInput.Label>Check-in PIN</PinInput.Label>
            <PinInput.Group maxLength={4}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
            </PinInput.Group>
        </PinInput>
    ),
};

/** Six digits with a separator — a longer member account code. */
export const WithSeparator: Story = {
    args: { size: "xs" },
    render: (args) => (
        <PinInput {...args}>
            <PinInput.Label>Member account code</PinInput.Label>
            <PinInput.Group maxLength={6}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Separator />
                <PinInput.Slot index={3} />
                <PinInput.Slot index={4} />
                <PinInput.Slot index={5} />
            </PinInput.Group>
            <PinInput.Description>Six digits, found on your membership card.</PinInput.Description>
        </PinInput>
    ),
};

/** Invalid — the entered PIN didn't match the booking. */
export const Invalid: Story = {
    args: { size: "xs", invalid: true },
    render: (args) => (
        <PinInput {...args}>
            <PinInput.Label>Check-in PIN</PinInput.Label>
            <PinInput.Group maxLength={4}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
            </PinInput.Group>
            <PinInput.Description>That PIN didn’t match. Check your confirmation email.</PinInput.Description>
        </PinInput>
    ),
};

/** Disabled while the kiosk syncs with the tee sheet. */
export const Disabled: Story = {
    args: { size: "xs", disabled: true },
    render: (args) => (
        <PinInput {...args}>
            <PinInput.Label>Check-in PIN</PinInput.Label>
            <PinInput.Group maxLength={4}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
            </PinInput.Group>
        </PinInput>
    ),
};
