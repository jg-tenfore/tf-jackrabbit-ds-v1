"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle } from "@untitledui/icons";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { FullScreenActions, KioskFullScreenModal } from "@/components/kiosk/modals/kiosk-full-screen-modal";

/**
 * Full-screen overlay variants.
 *
 * Each of these is a hard stop: the flow cannot continue until it is answered,
 * and the surrounding screen is removed so nothing competes with the question.
 * Anything that is merely a step inside the current task belongs in
 * `dialog-variants.tsx` as a card instead.
 */

/**
 * Destructive confirm — cancelling an order, abandoning a booking.
 *
 * Full screen, not a card. Destroying work is the one decision where leaving
 * the thing being destroyed visible behind a card would be actively unhelpful:
 * the user should be reading the question, not re-reading the order. The
 * reference names the action for what it does ("Remove"), not "Confirm" — a
 * generic verb makes the user re-derive what they are agreeing to.
 */
export const DestructiveConfirmFullScreen = ({
    isOpen,
    onOpenChange,
    title,
    body,
    confirmLabel = "Remove",
    onConfirm,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    body?: string;
    confirmLabel?: string;
    onConfirm?: () => void;
}) => (
    <KioskFullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        icon={AlertTriangle}
        iconTone="error"
        title={title}
        subtitle={body}
    >
        <FullScreenActions confirmLabel={confirmLabel} isDestructive onCancel={() => onOpenChange(false)} onConfirm={onConfirm} />
    </KioskFullScreenModal>
);

/**
 * Checkout method — pay at the kiosk or at the counter.
 *
 * Full screen because it is a fork in the flow rather than a detail of it:
 * choosing the counter ends the kiosk session entirely, so the cart behind is
 * no longer the context.
 *
 * The two options are not peers in a list. Paying here is a card/mobile choice
 * *inside* one panel; the counter is an alternative to that whole panel. The
 * "Or" divider makes that nesting visible rather than flattening three peers.
 */
export const CheckoutMethodFullScreen = ({
    isOpen,
    onOpenChange,
    onPayHere,
    onPayAtCounter,
    onBack,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onPayHere?: (method: "card" | "mobile") => void;
    onPayAtCounter?: () => void;
    onBack?: () => void;
}) => (
    <KioskFullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Where would you like to check out?"
        footer={
            onBack ? (
                <KioskKey size="xl" variant="action" span={0} onPress={onBack} className="mx-auto w-[340px]">
                    Go Back
                </KioskKey>
            ) : undefined
        }
    >
        <div className="flex flex-col items-center gap-8">
            <div className="flex w-full flex-col gap-6 rounded-2xl p-8 ring-1 ring-border-secondary">
                <h3 className="text-center text-2xl font-bold text-primary">Pay Right Here</h3>

                {(["card", "mobile"] as const).map((method) => (
                    <button
                        key={method}
                        type="button"
                        onClick={() => onPayHere?.(method)}
                        className="flex items-center justify-between gap-4 rounded-xl px-4 py-4 transition duration-100 ease-linear active:bg-secondary"
                    >
                        <span className="text-2xl text-primary">{method === "card" ? "Card" : "Mobile Pay"}</span>
                        <span
                            data-placeholder-asset={method === "card" ? "credit-cards-illustration" : "mobile-pay-illustration"}
                            className="size-20 rounded-xl bg-secondary ring-1 ring-border-secondary"
                            aria-hidden="true"
                        />
                    </button>
                ))}

                <p className="text-center text-sm text-tertiary">Accepted Here (Credit &amp; Arch Cards only)</p>
            </div>

            <span className="text-2xl font-bold text-primary">Or</span>

            <KioskKey size="xl" variant="action" span={0} onPress={onPayAtCounter} className="w-full flex-col gap-1">
                <span className="text-2xl font-bold">Or at the counter</span>
                <span className="text-base font-normal text-tertiary">Cash &amp; Credit Accepted</span>
            </KioskKey>
        </div>
    </KioskFullScreenModal>
);

/**
 * Interstitial — the between-step screens that explain or reassure.
 *
 * Full screen because it is a beat in the flow rather than an interruption of
 * it: there is no underlying screen the user is meant to return to.
 */
export const InterstitialFullScreen = ({
    isOpen,
    onOpenChange,
    title,
    body,
    children,
    primaryLabel,
    onPrimary,
    secondaryLabel,
    onSecondary,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    body?: string;
    children?: ReactNode;
    primaryLabel?: string;
    onPrimary?: () => void;
    secondaryLabel?: string;
    onSecondary?: () => void;
}) => (
    <KioskFullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        subtitle={body}
        footer={
            primaryLabel || secondaryLabel ? (
                <div className="flex flex-col items-center gap-4">
                    {primaryLabel && (
                        <KioskKey size="xl" variant="primary" span={0} onPress={onPrimary} className="w-full max-w-[480px]">
                            {primaryLabel}
                        </KioskKey>
                    )}
                    {secondaryLabel && (
                        <KioskKey size="xl" variant="action" span={0} onPress={onSecondary} className="w-full max-w-[480px]">
                            {secondaryLabel}
                        </KioskKey>
                    )}
                </div>
            ) : undefined
        }
    >
        {children}
    </KioskFullScreenModal>
);

/**
 * Info sheet — a dismissible explainer with one acknowledgement.
 *
 * Full screen because the explainer is usually long enough that a card would
 * scroll internally, and an overlay that scrolls inside an overlay is
 * disorienting on a touch panel where there is no scrollbar to disambiguate.
 */
export const InfoSheetFullScreen = ({
    isOpen,
    onOpenChange,
    title,
    children,
    dismissLabel = "Ok, I got it",
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children?: ReactNode;
    dismissLabel?: string;
}) => (
    <KioskFullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        isCentered={false}
        footer={
            <KioskKey size="xl" variant="action" span={0} onPress={() => onOpenChange(false)} className="mx-auto w-[340px]">
                {dismissLabel}
            </KioskKey>
        }
    >
        {children}
    </KioskFullScreenModal>
);

/** Success confirmation — the terminal screen of a completed booking or order. */
export const ConfirmationFullScreen = ({
    isOpen,
    onOpenChange,
    title,
    body,
    children,
    doneLabel = "Done",
    onDone,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    body?: string;
    children?: ReactNode;
    doneLabel?: string;
    onDone?: () => void;
}) => (
    <KioskFullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        icon={CheckCircle}
        iconTone="success"
        title={title}
        subtitle={body}
        footer={
            <KioskKey size="xl" variant="primary" span={0} onPress={onDone} className="mx-auto w-[340px]">
                {doneLabel}
            </KioskKey>
        }
    >
        {children}
    </KioskFullScreenModal>
);
