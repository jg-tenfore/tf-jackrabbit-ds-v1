"use client";

import { ArrowUp, Delete } from "@untitledui/icons";
import { LAYOUTS, type KeyDef, type LayoutName } from "@/components/kiosk/keyboard/layouts";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    key: {
        base: [
            "flex select-none items-center justify-center rounded-md bg-primary text-primary ring-1 ring-border-primary ring-inset",
            "transition duration-100 ease-linear",
            // No hover state on a touch panel — the press state is what a user
            // actually perceives, so it carries the whole affordance.
            "active:scale-[0.97] active:bg-brand-solid active:text-white active:ring-brand",
            "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" "),
        action: "bg-secondary text-secondary",
        held: "bg-brand-solid text-white ring-brand",
    },
});

export interface OnScreenKeyboardProps {
    /** Current field value; the keyboard is fully controlled. */
    value: string;
    onChange: (next: string) => void;
    layout?: LayoutName;
    /** Stop accepting characters past this length (codes, phone numbers). */
    maxLength?: number;
    /** Uppercase latch. Omit to let the keyboard manage it internally. */
    isShifted?: boolean;
    onShiftChange?: (next: boolean) => void;
    onEnter?: () => void;
    isDisabled?: boolean;
    className?: string;
}

/**
 * The kiosk on-screen keyboard.
 *
 * Renders a layout from `layouts.ts` and applies presses to the controlled
 * `value`. Keys are real `<button>`s so screen readers and the a11y addon see
 * them, and every key clears the 64px kiosk touch-target floor.
 */
export const OnScreenKeyboard = ({
    value,
    onChange,
    layout = "qwerty",
    maxLength,
    isShifted,
    onShiftChange,
    onEnter,
    isDisabled = false,
    className,
}: OnScreenKeyboardProps) => {
    // Shift is uncontrolled unless the caller opts in, so the common case needs
    // no extra state wiring at the call site.
    const shifted = isShifted ?? false;

    const rows = LAYOUTS[layout];

    const commit = (next: string) => {
        if (maxLength !== undefined && next.length > maxLength) return;
        onChange(next);
    };

    const handleKey = (key: KeyDef) => {
        if (isDisabled) return;

        switch (key.action) {
            case "backspace":
                commit(value.slice(0, -1));
                return;
            case "clear":
                commit("");
                return;
            case "space":
                commit(value + " ");
                return;
            case "shift":
                onShiftChange?.(!shifted);
                return;
            case "enter":
                onEnter?.();
                return;
            default:
                if (!key.value) return;
                // Multi-character keys like ".com" are inserted verbatim; single
                // letters follow the shift latch.
                commit(value + (key.value.length > 1 ? key.value : shifted ? key.value.toUpperCase() : key.value.toLowerCase()));
        }
    };

    return (
        <div className={cx("flex w-full flex-col gap-2", className)} role="group" aria-label="On-screen keyboard">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex w-full gap-2">
                    {row.map((key, keyIndex) => {
                        const isAction = Boolean(key.action);
                        const isShiftKey = key.action === "shift";
                        const label = key.label ?? (key.value && key.value.length === 1 ? (shifted ? key.value.toUpperCase() : key.value) : key.value);

                        return (
                            <button
                                key={`${rowIndex}-${keyIndex}`}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => handleKey(key)}
                                aria-label={key.action ?? key.value}
                                aria-pressed={isShiftKey ? shifted : undefined}
                                // `flex-1` + `flexGrow` share the row proportionally, so a
                                // span of 1.5 is 1.5x a standard key at any row width.
                                style={{ flexGrow: key.span ?? 1, flexBasis: 0 }}
                                className={cx(
                                    styles.key.base,
                                    "h-16 min-w-0 text-lg font-medium",
                                    isAction && styles.key.action,
                                    isShiftKey && shifted && styles.key.held,
                                )}
                            >
                                {key.action === "backspace" ? (
                                    <Delete className="size-6" aria-hidden="true" />
                                ) : isShiftKey ? (
                                    <ArrowUp className="size-6" aria-hidden="true" />
                                ) : (
                                    label
                                )}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
