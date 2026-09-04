"use client";

import { Delete } from "@untitledui/icons";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { KEYBOARD_INSET, KEY_GAP, type KeySize } from "@/kiosk/touch";
import { cx } from "@/utils/cx";

interface NumericKeypadProps {
    value: string;
    onChange: (next: string) => void;
    maxLength?: number;
    size?: KeySize;
    /** Replace the bottom-left key. Defaults to Clear. */
    accessoryKey?: { label: string; onPress: () => void } | null;
    isDisabled?: boolean;
    className?: string;
}

/**
 * Dedicated numeric keypad for codes, phone numbers and quantities.
 *
 * Separate from `OnScreenKeyboard`'s numeric layout because it is a different
 * *ergonomic* proposition, not just a different key set. Three columns at 750px
 * gives a 234px-wide key — roughly twelve times the target area of a QWERTY key
 * in the same screen space. When only digits are valid there is no reason to
 * spend that width on anything else.
 *
 * Digits are laid out phone-style (123 on top), not calculator-style, because
 * the numbers users enter here come off a phone screen or a printed card.
 */
export const NumericKeypad = ({ value, onChange, maxLength, size = "xl", accessoryKey, isDisabled = false, className }: NumericKeypadProps) => {
    const append = (digit: string) => {
        if (maxLength !== undefined && value.length >= maxLength) return;
        onChange(value + digit);
    };

    const rows = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
    ];

    return (
        <div
            className={cx("flex w-full flex-col", className)}
            style={{ gap: KEY_GAP, paddingInline: KEYBOARD_INSET }}
            role="group"
            aria-label="Numeric keypad"
        >
            {rows.map((row) => (
                <div key={row[0]} className="flex w-full" style={{ gap: KEY_GAP }}>
                    {row.map((digit) => (
                        <KioskKey key={digit} size={size} isDisabled={isDisabled} onPress={() => append(digit)} label={digit}>
                            {digit}
                        </KioskKey>
                    ))}
                </div>
            ))}

            <div className="flex w-full" style={{ gap: KEY_GAP }}>
                {accessoryKey === null ? (
                    <div style={{ flexGrow: 1, flexBasis: 0 }} aria-hidden="true" />
                ) : (
                    <KioskKey
                        size={size}
                        variant="action"
                        isDisabled={isDisabled}
                        onPress={accessoryKey ? accessoryKey.onPress : () => onChange("")}
                        label={accessoryKey?.label ?? "Clear"}
                    >
                        {accessoryKey?.label ?? "Clear"}
                    </KioskKey>
                )}

                <KioskKey size={size} isDisabled={isDisabled} onPress={() => append("0")} label="0">
                    0
                </KioskKey>

                <KioskKey
                    size={size}
                    variant="action"
                    icon={Delete}
                    isDisabled={isDisabled}
                    onPress={() => onChange(value.slice(0, -1))}
                    label="Delete"
                />
            </div>
        </div>
    );
};
