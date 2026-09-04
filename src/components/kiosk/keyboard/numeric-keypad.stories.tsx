import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { NumericKeypad } from "@/components/kiosk/keyboard/numeric-keypad";
import { formatPhone } from "@/components/kiosk/keyboard/keyboard-field";
import { maxKeyWidthForColumns, pxToMm } from "@/kiosk/touch";

const meta = {
    title: "Kiosk Core/Keyboard/Numeric Keypad",
    component: NumericKeypad,
    parameters: {
        // "centered" pads the story; at the 750px kiosk viewport that padding
        // becomes 32px of horizontal overflow on a panel that cannot scroll.
        layout: "fullscreen",
        docs: {
            description: {
                component: `Separate from the keyboard's numeric layout because it is a different *ergonomic* proposition, not just a different key set. Three columns at 750px gives a ${maxKeyWidthForColumns(3)}px key (${pxToMm(maxKeyWidthForColumns(3)).toFixed(0)}mm) — roughly twelve times the target area of a QWERTY key in the same screen space. Digits run phone-style (123 on top) rather than calculator-style, because the numbers entered here come off a phone screen or a printed card.`,
            },
        },
    },
    argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] } },
} satisfies Meta<typeof NumericKeypad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { value: "", onChange: () => {} },
    render: function Pad(args) {
        const [value, setValue] = useState("");
        return (
            <div className="flex w-[750px] flex-col gap-6 py-6">
                <div className="mx-4 flex min-h-24 items-center justify-center rounded-xl bg-secondary text-4xl tabular-nums text-primary ring-1 ring-border-primary ring-inset">
                    {value || <span className="text-placeholder text-2xl">Enter a number</span>}
                </div>
                <NumericKeypad value={value} onChange={setValue} size={args.size} />
            </div>
        );
    },
};

/** Six-digit member code — the manual fallback when a wallet pass will not read. */
export const CodeEntry: Story = {
    args: { value: "", onChange: () => {} },
    render: function Code() {
        const [value, setValue] = useState("");
        return (
            <div className="flex w-[750px] flex-col gap-8 py-6">
                <div className="px-4">
                    <CodeInput value={value} length={6} />
                </div>
                <NumericKeypad value={value} onChange={setValue} maxLength={6} size="lg" />
            </div>
        );
    },
};

/** Phone entry, formatted progressively so the digit count is self-checking. */
export const PhoneEntry: Story = {
    args: { value: "", onChange: () => {} },
    render: function Phone() {
        const [value, setValue] = useState("");
        return (
            <div className="flex w-[750px] flex-col gap-6 py-6">
                <div className="mx-4 flex min-h-24 items-center justify-center rounded-xl bg-secondary text-4xl tabular-nums text-primary ring-1 ring-border-primary ring-inset">
                    {formatPhone(value) || <span className="text-placeholder text-2xl">(555) 123-4567</span>}
                </div>
                <NumericKeypad value={value} onChange={setValue} maxLength={10} size="lg" />
            </div>
        );
    },
};
