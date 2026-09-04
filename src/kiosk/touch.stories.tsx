import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { KIOSK_WIDTH } from "@/kiosk/constants";
import { KEY_SIZES, PANEL_WIDTHS_MM, REFERENCE_PANEL, TOUCH_FLOOR_MM, type KeySize, type PanelSize, maxKeyWidthForColumns, pxToMm } from "@/kiosk/touch";
import { cx } from "@/utils/cx";

const meta = {
    title: "Foundations/Touch Targets",
    parameters: {
        // "centered" pads the story; at the 750px kiosk viewport that padding
        // becomes 32px of horizontal overflow on a panel that cannot scroll.
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Everything on this kiosk is finger-driven, so target size is a correctness concern rather than a style choice. Sizes are argued in millimetres because pixels cannot express hittability — 64px is generous on a 21\" panel and cramped on a 55\" one. The scale below is validated against the **smallest** panel we expect to ship on, since that is the binding constraint.",
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PANELS = Object.keys(PANEL_WIDTHS_MM) as PanelSize[];

/**
 * The key size scale in physical millimetres on each panel, checked against the
 * touch floors. Green means the size clears the floor on that panel.
 */
export const SizeScale: Story = {
    render: () => (
        <div className="flex w-[820px] flex-col gap-8 p-8">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-primary">Key size scale</h2>
                <p className="text-tertiary">
                    Floors: <strong>{TOUCH_FLOOR_MM.minimum}mm</strong> any target, <strong>{TOUCH_FLOOR_MM.primary}mm</strong> primary
                    actions. Both sit above ISO 9241-411 (9mm) and Material (48dp ≈ 9mm) — standing users in gloves get no benefit from
                    scraping a minimum.
                </p>
            </header>

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-secondary text-sm text-quaternary">
                        <th className="py-3 font-medium">Size</th>
                        <th className="py-3 font-medium">px</th>
                        {PANELS.map((p) => (
                            <th key={p} className="py-3 font-medium">
                                {p}
                                {p === REFERENCE_PANEL && <span className="ml-1 text-brand-secondary">(ref)</span>}
                            </th>
                        ))}
                        <th className="py-3 font-medium">Use</th>
                    </tr>
                </thead>
                <tbody>
                    {(Object.keys(KEY_SIZES) as KeySize[]).map((size) => (
                        <tr key={size} className="border-b border-secondary">
                            <td className="py-4 font-semibold text-primary">{size}</td>
                            <td className="py-4 tabular-nums text-secondary">{KEY_SIZES[size]}</td>
                            {PANELS.map((panel) => {
                                const mm = pxToMm(KEY_SIZES[size], panel);
                                return (
                                    <td key={panel} className="py-4">
                                        <span
                                            className={cx(
                                                "rounded-md px-2 py-1 text-sm font-medium tabular-nums",
                                                mm >= TOUCH_FLOOR_MM.primary
                                                    ? "bg-success-secondary text-success-primary"
                                                    : mm >= TOUCH_FLOOR_MM.minimum
                                                      ? "bg-warning-secondary text-warning-primary"
                                                      : "bg-error-secondary text-error-primary",
                                            )}
                                        >
                                            {mm.toFixed(1)}mm
                                        </span>
                                    </td>
                                );
                            })}
                            <td className="py-4 text-sm text-tertiary">{USE[size]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
};

const USE: Record<KeySize, string> = {
    sm: "Only when a full QWERTY shares the screen with content",
    md: "Default — fills a 10-key row edge to edge at 750px",
    lg: "Numeric pads, where 3 columns leave width spare",
    xl: "Single-purpose pads and primary actions",
};

/**
 * Why fewer columns is a usability decision, not a visual one: the same screen
 * width buys drastically more target area when a layout drops keys it does not
 * need.
 */
export const ColumnBudget: Story = {
    render: () => (
        <div className="flex w-[820px] flex-col gap-6 p-8">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-primary">Column budget</h2>
                <p className="text-tertiary">
                    Widest key that fits N columns across the {KIOSK_WIDTH}px canvas. Target <em>area</em> scales with the square, so
                    halving the column count is worth far more than it looks.
                </p>
            </header>

            <div className="flex flex-col gap-4">
                {[3, 4, 6, 10].map((columns) => {
                    const width = maxKeyWidthForColumns(columns);
                    const area = ((width * width) / (maxKeyWidthForColumns(10) * maxKeyWidthForColumns(10))).toFixed(1);
                    return (
                        <div key={columns} className="flex items-center gap-4">
                            <span className="w-24 shrink-0 font-semibold text-primary">{columns} cols</span>
                            <div className="h-10 rounded-md bg-brand-solid" style={{ width: width / 1.4 }} />
                            <span className="tabular-nums text-secondary">{width}px</span>
                            <span className="text-sm text-tertiary">
                                {pxToMm(width).toFixed(0)}mm · {area}× the area of a QWERTY key
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    ),
};

/** Every size and variant of the atomic key, rendered at true scale. */
export const KeyVariants: Story = {
    render: () => (
        <div className="flex w-[720px] flex-col gap-8 p-8">
            {(Object.keys(KEY_SIZES) as KeySize[]).map((size) => (
                <div key={size} className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-quaternary">
                        {size} · {KEY_SIZES[size]}px · {pxToMm(KEY_SIZES[size]).toFixed(1)}mm on {REFERENCE_PANEL}
                    </p>
                    <div className="flex gap-2">
                        <KioskKey size={size} variant="character">A</KioskKey>
                        <KioskKey size={size} variant="action">Clear</KioskKey>
                        <KioskKey size={size} variant="primary">Continue</KioskKey>
                        <KioskKey size={size} variant="destructive">Cancel</KioskKey>
                        <KioskKey size={size} variant="character" isActive>Held</KioskKey>
                        <KioskKey size={size} variant="character" isDisabled>Off</KioskKey>
                    </div>
                </div>
            ))}
        </div>
    ),
};
