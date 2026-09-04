"use client";

import { ArrowUp, Delete } from "@untitledui/icons";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { LAYOUTS, type KeyDef, type LayoutName } from "@/components/kiosk/keyboard/layouts";
import { KEYBOARD_INSET, KEY_GAP, type KeySize } from "@/kiosk/touch";
import { cx } from "@/utils/cx";

export interface OnScreenKeyboardProps {
    /** Current field value; the keyboard is fully controlled. */
    value: string;
    onChange: (next: string) => void;
    layout?: LayoutName;
    /** Key size from the `KEY_SIZES` scale. Defaults per layout — see below. */
    size?: KeySize;
    /** Stop accepting characters past this length (codes, phone numbers). */
    maxLength?: number;
    /** Uppercase latch. Omit to let the keyboard manage it internally. */
    isShifted?: boolean;
    onShiftChange?: (next: boolean) => void;
    onEnter?: () => void;
    isDisabled?: boolean;
    /** Inset the keyboard from the canvas edge. Off for full-bleed keypads. */
    inset?: boolean;
    className?: string;
}

/**
 * Default key size per layout.
 *
 * A 10-column QWERTY can only afford 64px keys at 750px wide, but a 3-column
 * numeric pad has width to spare — so it takes `lg` and spends the surplus on
 * target area rather than leaving it as empty margin.
 */
const DEFAULT_SIZE: Record<LayoutName, KeySize> = {
    qwerty: "md",
    email: "md",
    numeric: "lg",
    phone: "lg",
};

/**
 * The kiosk on-screen keyboard.
 *
 * Renders a layout from `layouts.ts` onto `KioskKey`, so every target in the
 * app is sized from one scale. Rows consume the full available width — leftover
 * horizontal space is wasted target area, which is the thing this component
 * exists to avoid.
 */
export const OnScreenKeyboard = ({
    value,
    onChange,
    layout = "qwerty",
    size,
    maxLength,
    isShifted,
    onShiftChange,
    onEnter,
    isDisabled = false,
    inset = true,
    className,
}: OnScreenKeyboardProps) => {
    // Shift is uncontrolled unless the caller opts in, so the common case needs
    // no extra state wiring at the call site.
    const shifted = isShifted ?? false;
    const keySize = size ?? DEFAULT_SIZE[layout];
    const rows = LAYOUTS[layout];

    const commit = (next: string) => {
        if (maxLength !== undefined && next.length > maxLength) return;
        onChange(next);
    };

    const handleKey = (key: KeyDef) => {
        switch (key.action) {
            case "backspace":
                return commit(value.slice(0, -1));
            case "clear":
                return commit("");
            case "space":
                return commit(value + " ");
            case "shift":
                return onShiftChange?.(!shifted);
            case "enter":
                return onEnter?.();
            default:
                if (!key.value) return;
                // Multi-character keys like ".com" insert verbatim; single
                // letters follow the shift latch.
                commit(value + (key.value.length > 1 ? key.value : shifted ? key.value.toUpperCase() : key.value.toLowerCase()));
        }
    };

    return (
        <div
            className={cx("flex w-full flex-col", className)}
            style={{ gap: KEY_GAP, paddingInline: inset ? KEYBOARD_INSET : 0 }}
            role="group"
            aria-label="On-screen keyboard"
        >
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex w-full" style={{ gap: KEY_GAP }}>
                    {row.map((key, keyIndex) => {
                        const isShiftKey = key.action === "shift";
                        const isBackspace = key.action === "backspace";
                        const label = key.label ?? (key.value?.length === 1 ? (shifted ? key.value.toUpperCase() : key.value) : key.value);

                        return (
                            <KioskKey
                                key={`${rowIndex}-${keyIndex}`}
                                size={keySize}
                                span={key.span ?? 1}
                                variant={key.action ? "action" : "character"}
                                isActive={isShiftKey && shifted}
                                isDisabled={isDisabled}
                                onPress={() => handleKey(key)}
                                label={key.action ?? key.value}
                                icon={isBackspace ? Delete : isShiftKey ? ArrowUp : undefined}
                            >
                                {label}
                            </KioskKey>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
