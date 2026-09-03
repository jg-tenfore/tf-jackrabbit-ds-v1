import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { OnScreenKeyboard, type OnScreenKeyboardProps } from "@/components/kiosk/keyboard/on-screen-keyboard";

const meta = {
    title: "Kiosk Core/Keyboard/On-Screen Keyboard",
    component: OnScreenKeyboard,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "The kiosk has no physical keyboard, so every text entry point drives this component. Layouts are data (`layouts.ts`), not markup — adding a layout is a data change. Every key clears the 64px kiosk touch-target floor and has a press state instead of a hover state, since a touch panel has no cursor.",
            },
        },
    },
    argTypes: {
        layout: { control: "select", options: ["qwerty", "email", "numeric", "phone"] },
        maxLength: { control: "number" },
        isDisabled: { control: "boolean" },
    },
} satisfies Meta<typeof OnScreenKeyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Wires the controlled value + shift latch so the keyboard is actually typeable in QA. */
const KeyboardHarness = (props: Partial<OnScreenKeyboardProps>) => {
    const [value, setValue] = useState("");
    const [isShifted, setIsShifted] = useState(false);

    return (
        <div className="flex w-[686px] flex-col gap-6">
            <div className="flex min-h-20 items-center rounded-xl bg-secondary px-6 text-2xl text-primary ring-1 ring-border-primary ring-inset">
                {value || <span className="text-placeholder">Type using the keyboard below…</span>}
            </div>

            <OnScreenKeyboard
                value={value}
                onChange={setValue}
                isShifted={isShifted}
                onShiftChange={setIsShifted}
                {...props}
            />
        </div>
    );
};

export const Qwerty: Story = {
    args: { value: "", onChange: () => {}, layout: "qwerty" },
    render: (args) => <KeyboardHarness layout={args.layout} isDisabled={args.isDisabled} maxLength={args.maxLength} />,
};

/** Bottom row swaps to `@`, `.` and `.com` — a member never hunts for email punctuation. */
export const Email: Story = {
    args: { value: "", onChange: () => {}, layout: "email" },
    render: (args) => <KeyboardHarness layout={args.layout} isDisabled={args.isDisabled} maxLength={args.maxLength} />,
};

export const Numeric: Story = {
    args: { value: "", onChange: () => {}, layout: "numeric" },
    render: () => (
        <div className="w-[400px]">
            <KeyboardHarness layout="numeric" />
        </div>
    ),
};

export const Disabled: Story = {
    args: { value: "", onChange: () => {}, isDisabled: true },
    render: () => <KeyboardHarness isDisabled />,
};

/**
 * The full "Enter your code" pairing: segmented display + numeric-capable
 * keyboard, capped at six characters. This is the exact composition used by
 * the manual-entry fallback in the auth flow.
 */
export const WithCodeInput: Story = {
    args: { value: "", onChange: () => {} },
    render: function CodeEntry() {
        const [value, setValue] = useState("");
        const [isShifted, setIsShifted] = useState(false);

        return (
            <div className="flex w-[686px] flex-col gap-8">
                <CodeInput value={value} length={6} />
                <OnScreenKeyboard value={value} onChange={setValue} maxLength={6} isShifted={isShifted} onShiftChange={setIsShifted} />
            </div>
        );
    },
};

/** Rejected-code state, for QA of the error treatment. */
export const CodeInputInvalid: Story = {
    args: { value: "", onChange: () => {} },
    render: () => (
        <div className="w-[686px]">
            <CodeInput value="482911" length={6} isInvalid />
        </div>
    ),
};
