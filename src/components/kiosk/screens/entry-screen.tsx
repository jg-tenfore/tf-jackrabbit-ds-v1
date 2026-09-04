"use client";

import type { ReactNode } from "react";
import { SignInPrompt } from "@/components/kiosk/app-chrome/wallet-drawer";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { OnScreenKeyboard } from "@/components/kiosk/keyboard/on-screen-keyboard";
import type { LayoutName } from "@/components/kiosk/keyboard/layouts";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * The shared template behind every "enter something" screen.
 *
 * Enter your code, Enter your email and Enter your name are one layout with
 * different fields: brand mark, title, subtitle, the field, a keyboard, and a
 * Go Back / Continue pair. Building them separately would duplicate the header,
 * the keyboard wiring and the footer three ways and let them drift — which is
 * exactly what happened with the two nav components earlier in this project.
 *
 * The field is a slot rather than a prop union, because the three fields have
 * genuinely different shapes: six segmented cells, a single wide input, a
 * free-text line. Trying to express all of them through one `type` prop would
 * push the differences into this file instead of removing them.
 *
 * `showSignInPanel` reflects the references: code and email keep the green scan
 * panel because the user is mid-authentication and scanning is still a faster
 * way out; name entry drops it because by then they have already chosen to
 * continue as a guest, and offering the scan again would reopen a settled
 * decision.
 */
export const EntryScreen = ({
    title,
    subtitle,
    field,
    value,
    onChange,
    layout = "qwerty",
    maxLength,
    onBack,
    onContinue,
    continueLabel = "Continue",
    isContinueDisabled,
    showSignInPanel = false,
    onHowToLogIn,
    className,
}: {
    title: string;
    subtitle?: string;
    /** The field itself — segmented cells, a text line, whatever the screen needs. */
    field: ReactNode;
    value: string;
    onChange: (next: string) => void;
    layout?: LayoutName;
    maxLength?: number;
    onBack?: () => void;
    onContinue?: () => void;
    continueLabel?: string;
    /** Defaults to "nothing typed yet" when omitted. */
    isContinueDisabled?: boolean;
    showSignInPanel?: boolean;
    onHowToLogIn?: () => void;
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col", className)}>
        <div className="flex flex-1 flex-col items-center px-8 pt-12 text-center">
            <img src={assetUrl("screen-assets/how-to-login/hero-logo.svg")} alt="" aria-hidden="true" className="size-12" />
            <h1 className="mt-5 text-[44px] leading-tight font-bold text-balance text-primary">{title}</h1>
            {subtitle && <p className="mt-3 max-w-[560px] text-[20px] text-tertiary">{subtitle}</p>}

            <div className="mt-8 w-full px-4">{field}</div>

            <div className="mt-8 w-full">
                <OnScreenKeyboard value={value} onChange={onChange} layout={layout} maxLength={maxLength} onEnter={onContinue} />
            </div>

            <div className="mt-8 flex w-full gap-4 px-8 pb-8">
                <KioskKey size="xl" variant="action" onPress={onBack} className="flex-1">
                    Go Back
                </KioskKey>
                <KioskKey
                    size="xl"
                    variant="primary"
                    onPress={onContinue}
                    isDisabled={isContinueDisabled ?? value.length === 0}
                    className="flex-1"
                >
                    {continueLabel}
                </KioskKey>
            </div>
        </div>

        {showSignInPanel && <SignInPrompt onHowToLogIn={onHowToLogIn} height={309} />}
    </div>
);

/**
 * The single-line field used by email and name entry.
 *
 * Display-only, like `CodeInput`: characters arrive from the on-screen
 * keyboard, so a focused `<input>` would only fight it for focus and risk the
 * OS keyboard appearing over the UI on some panels.
 */
export const EntryTextField = ({
    value,
    placeholder,
    isInvalid = false,
}: {
    value: string;
    placeholder?: string;
    isInvalid?: boolean;
}) => (
    <div
        role="textbox"
        aria-readonly="true"
        className={cx(
            "flex min-h-[86px] items-center justify-center rounded-full px-8 text-center text-[30px] break-all ring-2 transition duration-100 ease-linear",
            isInvalid ? "text-error-primary ring-error" : value ? "text-brand-secondary ring-brand" : "text-placeholder ring-border-primary",
        )}
    >
        {value || placeholder}
    </div>
);
