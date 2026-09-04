"use client";

import { useState } from "react";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import type { LayoutName } from "@/components/kiosk/keyboard/layouts";
import { NumericKeypad } from "@/components/kiosk/keyboard/numeric-keypad";
import { OnScreenKeyboard } from "@/components/kiosk/keyboard/on-screen-keyboard";
import { KEYBOARD_INSET, KEY_GAP } from "@/kiosk/touch";
import { cx } from "@/utils/cx";

/** Domains that cover the large majority of consumer email entry. */
const COMMON_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "hotmail.com"];

export type FieldKind = "text" | "email" | "phone" | "numeric";

interface KeyboardFieldProps {
    label: string;
    value: string;
    onChange: (next: string) => void;
    kind?: FieldKind;
    placeholder?: string;
    hint?: string;
    errorMessage?: string;
    maxLength?: number;
    onSubmit?: () => void;
    submitLabel?: string;
    className?: string;
}

/**
 * A labelled value display bound to the right keyboard for its content type.
 *
 * This is the composition screens actually use, and it exists because the
 * display and the keyboard have to agree: a phone field must show
 * `(555) 123-4567` while storing `5551234567`, and an email field is worth
 * ~15 keypresses of one-tap domain completion. Wiring that at each call site
 * would guarantee it drifts.
 *
 * The display is not a real `<input>`. On a kiosk there is no native keyboard
 * to summon, and a focused input would only fight the on-screen keys for focus
 * while risking the OS keyboard appearing over the UI on some panels.
 */
export const KeyboardField = ({
    label,
    value,
    onChange,
    kind = "text",
    placeholder,
    hint,
    errorMessage,
    maxLength,
    onSubmit,
    submitLabel = "Continue",
    className,
}: KeyboardFieldProps) => {
    const [isShifted, setIsShifted] = useState(false);

    const isNumericPad = kind === "phone" || kind === "numeric";
    const effectiveMax = maxLength ?? (kind === "phone" ? 10 : undefined);

    const display = kind === "phone" ? formatPhone(value) : value;
    const isInvalid = Boolean(errorMessage);

    // Suggest a completion only once there is a local part and no domain yet —
    // before the "@" we cannot know what to suggest, and after it the user has
    // already committed to a domain.
    const emailSuggestions = kind === "email" ? suggestDomains(value) : [];

    return (
        <div className={cx("flex w-full flex-col", className)} style={{ gap: KEY_GAP * 3 }}>
            <div className="flex flex-col gap-2" style={{ paddingInline: KEYBOARD_INSET }}>
                <label className="text-lg font-medium text-secondary">{label}</label>

                <div
                    role="textbox"
                    aria-readonly="true"
                    aria-label={label}
                    aria-invalid={isInvalid || undefined}
                    className={cx(
                        "flex min-h-24 items-center rounded-xl bg-primary px-6 text-3xl break-all ring-1 ring-inset transition duration-100 ease-linear",
                        isInvalid ? "ring-2 ring-error" : "ring-border-primary",
                    )}
                >
                    {display || <span className="text-placeholder">{placeholder}</span>}
                </div>

                {(errorMessage || hint) && (
                    <p className={cx("text-base", isInvalid ? "text-error-primary" : "text-tertiary")}>{errorMessage ?? hint}</p>
                )}
            </div>

            {/* One-tap domain completion. On a kiosk this is the single largest
                reduction in keypresses available for email entry. */}
            {emailSuggestions.length > 0 && (
                <div className="flex w-full overflow-x-auto scrollbar-hide" style={{ gap: KEY_GAP, paddingInline: KEYBOARD_INSET }}>
                    {emailSuggestions.map((domain) => (
                        <KioskKey
                            key={domain}
                            size="sm"
                            variant="action"
                            span={1}
                            onPress={() => onChange(`${value.split("@")[0]}@${domain}`)}
                            label={`Complete with ${domain}`}
                            className="px-4 whitespace-nowrap"
                        >
                            @{domain}
                        </KioskKey>
                    ))}
                </div>
            )}

            {isNumericPad ? (
                <NumericKeypad value={value} onChange={onChange} maxLength={effectiveMax} size="lg" />
            ) : (
                <OnScreenKeyboard
                    value={value}
                    onChange={onChange}
                    layout={(kind === "email" ? "email" : "qwerty") as LayoutName}
                    maxLength={effectiveMax}
                    isShifted={isShifted}
                    onShiftChange={setIsShifted}
                    onEnter={onSubmit}
                />
            )}

            {onSubmit && (
                <div style={{ paddingInline: KEYBOARD_INSET }}>
                    <KioskKey size="xl" variant="primary" span={1} onPress={onSubmit} className="w-full">
                        {submitLabel}
                    </KioskKey>
                </div>
            )}
        </div>
    );
};

/**
 * Progressive US phone formatting.
 *
 * Formats what has been typed so far rather than waiting for a complete number,
 * so the shape of the value confirms the digit count as the user goes — the
 * cheapest possible error check at a kiosk, where re-entry is expensive.
 */
export const formatPhone = (digits: string) => {
    const d = digits.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/** Domain completions for a partially typed address. */
export const suggestDomains = (value: string) => {
    const [local, domain] = value.split("@");
    if (!local || domain === undefined) return [];
    if (domain === "") return COMMON_DOMAINS;
    return COMMON_DOMAINS.filter((d) => d.startsWith(domain.toLowerCase()) && d !== domain.toLowerCase());
};
