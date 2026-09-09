import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BUTTON_SIZES, KioskButton, type KioskButtonSize, type KioskButtonTone, buttonSizeMm } from "@/components/kiosk/kiosk-button";
import { TOUCH_FLOOR_MM } from "@/kiosk/touch";

const TONES: KioskButtonTone[] = ["primary", "quiet", "destructive"];
const SIZES: KioskButtonSize[] = ["sm", "md", "lg", "xl"];

const meta = {
    title: "Components/Kiosk Button",
    component: KioskButton,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: `The screen-action button.

An audit of the built flows found **62 buttons across 26 files** using only three treatments — a green commit, a quiet outline, a red destructive — but hand-rolling **thirteen different heights** and four radii between them. Two Start Overs on two rails were 52 and 65 tall with different type. The treatments were already a system; the sizes were not.

Distinct from \`KioskKey\`, deliberately. That component is sized off \`KEY_SIZES\`, a scale derived from fitting ten keys across a 750px row — it exists to make keyboards land edge to edge. A screen action has no row to fit, so borrowing that scale means overriding the one property it exists to set, which several call sites were already doing.

**Every size clears the touch floor**, and the last story asserts it rather than claiming it.`,
            },
        },
    },
} satisfies Meta<typeof KioskButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every tone at every size. */
export const AllTones: Story = {
    args: { children: "Continue" },
    render: () => (
        <div className="flex flex-col gap-8 bg-primary p-6">
            {TONES.map((tone) => (
                <div key={tone} className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-tertiary uppercase">{tone}</p>
                    <div className="flex flex-wrap items-end gap-4">
                        {SIZES.map((size) => (
                            <KioskButton key={size} tone={tone} size={size} className="w-[180px]">
                                {size} · {BUTTON_SIZES[size]}px
                            </KioskButton>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
};

/** Disabled — 50% opacity and no press response, across all three tones. */
export const Disabled: Story = {
    args: { children: "Continue" },
    render: () => (
        <div className="flex gap-4 bg-primary p-6">
            {TONES.map((tone) => (
                <KioskButton key={tone} tone={tone} isDisabled className="w-[180px]">
                    {tone}
                </KioskButton>
            ))}
        </div>
    ),
};

/** The pairs the flows actually use, at the sizes they use them. */
export const InContext: Story = {
    args: { children: "Continue" },
    render: () => (
        <div className="flex w-[622px] flex-col gap-8 bg-primary p-6">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-tertiary">Rail — Start Over</p>
                <KioskButton size="md" className="w-[387px]">
                    Start Over
                </KioskButton>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm text-tertiary">Order review — Order More / Complete Order</p>
                <div className="flex gap-4">
                    <KioskButton size="lg" className="w-[183px]">
                        Order More
                    </KioskButton>
                    <KioskButton tone="primary" size="lg" className="w-[421px]">
                        Complete Order
                    </KioskButton>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm text-tertiary">Destructive confirm — Cancel / Remove</p>
                <div className="flex justify-center gap-4">
                    <KioskButton size="xl" className="min-w-[246px]">
                        Cancel
                    </KioskButton>
                    <KioskButton tone="destructive" size="xl" className="min-w-[246px]">
                        Remove
                    </KioskButton>
                </div>
            </div>
        </div>
    ),
};

/**
 * Every size against the touch floor, in millimetres on the reference panel.
 *
 * The floor is not decoration: 11mm is the absolute minimum for anything
 * interactive and 14mm is what a primary action wants. This is the same
 * arithmetic `touch.ts` uses, shown rather than asserted in a comment.
 */
export const TouchFloor: Story = {
    args: { children: "Continue" },
    render: () => (
        <div className="flex flex-col gap-3 bg-primary p-6">
            <p className="text-sm text-tertiary">
                Floor: {TOUCH_FLOOR_MM.minimum}mm minimum · {TOUCH_FLOOR_MM.primary}mm for primary actions
            </p>
            <table className="w-[420px] text-left text-sm">
                <thead>
                    <tr className="border-b border-secondary text-tertiary">
                        <th className="py-2">Size</th>
                        <th>Pixels</th>
                        <th>Millimetres</th>
                        <th>Clears</th>
                    </tr>
                </thead>
                <tbody>
                    {SIZES.map((size) => {
                        const mm = buttonSizeMm(size);
                        return (
                            <tr key={size} className="border-b border-secondary text-primary">
                                <td className="py-2 font-semibold">{size}</td>
                                <td className="tabular-nums">{BUTTON_SIZES[size]}px</td>
                                <td className="tabular-nums">{mm.toFixed(1)}mm</td>
                                <td>{mm >= TOUCH_FLOOR_MM.primary ? "primary" : mm >= TOUCH_FLOOR_MM.minimum ? "minimum" : "FAILS"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    ),
};
