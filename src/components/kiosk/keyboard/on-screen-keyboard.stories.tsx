import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { OnScreenKeyboard, type OnScreenKeyboardProps } from "@/components/kiosk/keyboard/on-screen-keyboard";
import { KEY_SIZES, pxToMm } from "@/kiosk/touch";

const meta = {
    title: "Kiosk Core/Keyboard/On-Screen Keyboard",
    component: OnScreenKeyboard,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `The kiosk has no physical keyboard, so every text entry point drives this. Layouts are data (\`layouts.ts\`), not markup. Every key is a \`KioskKey\`, so target sizing is decided in one place — the default \`md\` key is ${KEY_SIZES.md}px (${pxToMm(KEY_SIZES.md).toFixed(1)}mm on the reference panel), which is precisely the widest key that fits a 10-column row edge to edge at 750px. Rows always consume the full width, because leftover horizontal space is wasted target area.`,
            },
        },
    },
    argTypes: {
        layout: { control: "select", options: ["qwerty", "email", "numeric", "phone"] },
        size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
        maxLength: { control: "number" },
        isDisabled: { control: "boolean" },
    },
} satisfies Meta<typeof OnScreenKeyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Wires the controlled value + shift latch so the keyboard is typeable in QA. */
const Harness = (props: Partial<OnScreenKeyboardProps>) => {
    const [value, setValue] = useState("");
    const [isShifted, setIsShifted] = useState(false);

    return (
        <div className="flex w-[750px] flex-col gap-6 py-6">
            <div className="mx-4 flex min-h-20 items-center rounded-xl bg-secondary px-6 text-2xl break-all text-primary ring-1 ring-border-primary ring-inset">
                {value || <span className="text-placeholder">Type using the keyboard below…</span>}
            </div>
            <OnScreenKeyboard value={value} onChange={setValue} isShifted={isShifted} onShiftChange={setIsShifted} {...props} />
        </div>
    );
};

export const Qwerty: Story = {
    args: { value: "", onChange: () => {}, layout: "qwerty" },
    render: (args) => <Harness layout={args.layout} size={args.size} isDisabled={args.isDisabled} maxLength={args.maxLength} />,
};

/** Bottom row trades Space — never valid in an address — for `@`, `.` and `.com`. */
export const Email: Story = {
    args: { value: "", onChange: () => {}, layout: "email" },
    render: (args) => <Harness layout={args.layout} size={args.size} isDisabled={args.isDisabled} />,
};

/** Three columns instead of a number row: a 234px key rather than a 64px one. */
export const Numeric: Story = {
    args: { value: "", onChange: () => {}, layout: "numeric" },
    render: (args) => <Harness layout={args.layout} size={args.size} />,
};

/** The compact size, for the rare screen where a QWERTY shares space with content. */
export const CompactSize: Story = {
    args: { value: "", onChange: () => {}, size: "sm" },
    render: () => <Harness size="sm" />,
};

export const Disabled: Story = {
    args: { value: "", onChange: () => {}, isDisabled: true },
    render: () => <Harness isDisabled />,
};

/** The full "Enter your code" pairing: segmented display + keyboard, capped at six. */
export const WithCodeInput: Story = {
    args: { value: "", onChange: () => {} },
    render: function CodeEntry() {
        const [value, setValue] = useState("");
        const [isShifted, setIsShifted] = useState(false);
        return (
            <div className="flex w-[750px] flex-col gap-8 py-6">
                <div className="px-4">
                    <CodeInput value={value} length={6} />
                </div>
                <OnScreenKeyboard value={value} onChange={setValue} maxLength={6} isShifted={isShifted} onShiftChange={setIsShifted} />
            </div>
        );
    },
};

export const CodeInputInvalid: Story = {
    args: { value: "", onChange: () => {} },
    render: () => (
        <div className="w-[718px]">
            <CodeInput value="482911" length={6} isInvalid />
        </div>
    ),
};
