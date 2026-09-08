"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle } from "@untitledui/icons";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { FullScreenActions, KioskFullScreenModal } from "@/components/kiosk/modals/kiosk-full-screen-modal";
import { assetUrl } from "@/utils/asset-url";

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
const PAY_METHODS = [
    { id: "card", label: "Card", art: "card.svg" },
    { id: "mobile", label: "Mobile Pay", art: "mobile-pay.svg" },
] as const;

export const CheckoutMethodFullScreen = ({
    isOpen,
    onOpenChange,
    onPayHere,
    onPayAtCounter,
    onBack,
    onStartOver,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onPayHere?: (method: "card" | "mobile") => void;
    onPayAtCounter?: () => void;
    onBack?: () => void;
    onStartOver?: () => void;
}) => (
    <KioskFullScreenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        showBrandMark
        // Not centred: the reference hangs this off the top of the canvas, and
        // centring a block this tall leaves the mark floating in the middle of
        // the screen instead of heading it.
        isCentered={false}
        title="Where would you like to check out?"
        footer={
            (onBack || onStartOver) && (
                <div className="mx-auto flex w-[531px] flex-col items-center gap-7">
                    {onBack && (
                        <KioskKey size="xl" variant="action" span={0} onPress={onBack} className="w-[355px]">
                            Go Back
                        </KioskKey>
                    )}
                    {/* Start Over survives here even though the modal covers the
                        rail that normally carries it. A hard stop that also
                        removes the one control for abandoning the session strands
                        a user who opened checkout by mistake. Left-aligned and
                        quiet, matching the rail it stands in for. */}
                    {onStartOver && (
                        <button
                            type="button"
                            onClick={onStartOver}
                            className="mr-auto h-[45px] w-[386px] rounded-lg text-[18px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                        >
                            Start Over
                        </button>
                    )}
                </div>
            )
        }
    >
        {/* The column is sized to the *widest* thing in it. Sizing it to the
            card instead let the counter button overhang, and since the modal
            body scrolls, an overhang on one axis silently promotes the other to
            scrollable and drags the whole block off centre. */}
        <div className="mx-auto mt-6 flex w-[531px] flex-col items-center gap-12">
            {/* Narrower than the counter button below it: the card is a discrete
                object being offered, not a section of the page. */}
            <div className="flex w-[435px] flex-col gap-14 rounded-2xl px-8 py-12 ring-1 ring-border-secondary">
                <h3 className="text-center text-2xl font-bold text-primary">Pay Right Here</h3>

                {PAY_METHODS.map((method) => (
                    <button
                        key={method.id}
                        type="button"
                        onClick={() => onPayHere?.(method.id)}
                        className="flex items-center justify-between gap-4 rounded-xl px-2 transition duration-100 ease-linear active:bg-secondary"
                    >
                        <span className="text-2xl text-primary">{method.label}</span>
                        <img src={assetUrl(`screen-assets/checkout/${method.art}`)} alt="" aria-hidden="true" className="size-[86px] shrink-0" />
                    </button>
                ))}

                <p className="text-center text-sm text-tertiary">Accepted Here (Credit &amp; Arch Cards only)</p>
            </div>

            <span className="text-2xl font-bold text-primary">Or</span>

            {/* Wider than the card above it, as drawn: paying at the counter is
                the equal alternative, not a footnote to the card. */}
            <KioskKey size="xl" variant="action" span={0} onPress={onPayAtCounter} className="h-[109px] w-full flex-col gap-1 bg-primary">
                <span className="text-2xl font-bold text-primary">Or at the counter</span>
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
