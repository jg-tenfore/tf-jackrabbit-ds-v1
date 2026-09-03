"use client";

import { cx } from "@/utils/cx";

interface CodeInputProps {
    value: string;
    length?: number;
    /** Render entered characters as asterisks (wallet codes are semi-private). */
    isMasked?: boolean;
    isInvalid?: boolean;
    className?: string;
}

/**
 * The segmented code display used by "Enter your code".
 *
 * Display-only by design: on a kiosk the characters arrive from
 * `OnScreenKeyboard`, never from a focused native input, so rendering real
 * `<input>`s here would only fight the on-screen keyboard for focus. The value
 * is exposed to assistive tech through a single labelled group instead.
 */
export const CodeInput = ({ value, length = 6, isMasked = false, isInvalid = false, className }: CodeInputProps) => {
    const characters = value.split("").slice(0, length);
    // The first empty cell is the caret position.
    const activeIndex = Math.min(characters.length, length - 1);

    return (
        <div
            className={cx("flex w-full justify-center gap-3", className)}
            role="group"
            aria-label={`Code entry, ${characters.length} of ${length} characters entered`}
        >
            {Array.from({ length }).map((_, index) => {
                const character = characters[index];
                const isActive = index === activeIndex && characters.length < length;

                return (
                    <div
                        key={index}
                        aria-hidden="true"
                        className={cx(
                            "flex h-20 flex-1 items-center justify-center rounded-xl text-3xl font-semibold ring-1 ring-inset transition duration-100 ease-linear",
                            isInvalid
                                ? "text-error-primary ring-2 ring-error"
                                : isActive
                                  ? "text-brand-secondary ring-2 ring-brand"
                                  : "text-primary ring-border-primary",
                        )}
                    >
                        {character ? (
                            isMasked ? (
                                "✳"
                            ) : (
                                character
                            )
                        ) : isActive ? (
                            <span className="text-brand-secondary">✳</span>
                        ) : (
                            <span className="text-quaternary">—</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
