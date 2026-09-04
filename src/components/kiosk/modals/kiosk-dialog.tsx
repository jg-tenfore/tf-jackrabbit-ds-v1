"use client";

import type { FC, ReactNode } from "react";
import { X as CloseIcon } from "@untitledui/icons";
import {
    Dialog as AriaDialog,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { KIOSK_WIDTH } from "@/kiosk/constants";
import { cx } from "@/utils/cx";

/**
 * A card overlay — the first of the two overlay kinds in this kiosk.
 *
 * A dialog is a rounded card that sits *on* the current screen. The page stays
 * visible around and beneath it, including the persistent footer rail, so the
 * user can see what they were doing and that they have not left it. Use it when
 * the overlay is a step inside the current task: choosing a rate for the tee
 * time you just tapped, setting a quantity for the item you just picked.
 *
 * Note there is **no scrim by default**. Every card overlay in the references
 * sits on an undimmed page — the standby card overlays the hero photograph at
 * full brightness. Dimming is available via `scrim` for cases where the page
 * behind is genuinely distracting, but it is not the house style, and turning
 * it on makes a dialog read as a full-screen takeover when it is not one.
 *
 * For an overlay that replaces the screen entirely, use `KioskFullScreenModal`.
 */

export type DialogFooterLayout =
    /** Cancel | Confirm, edge to edge with no padding — reads as one divided bar. */
    | "split"
    /** Full-width buttons stacked vertically, for actions that are not opposites. */
    | "stacked"
    | "none";

export interface KioskDialogProps extends Omit<AriaModalOverlayProps, "children"> {
    children?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    icon?: FC<{ className?: string }>;
    /** Round close affordance top-left, as on the product detail card. */
    onClose?: () => void;
    footer?: ReactNode;
    footerLayout?: DialogFooterLayout;
    align?: "center" | "start";
    /** Dim the page behind. Off by default — see the note above. */
    scrim?: boolean;
    className?: string;
}

export const KioskDialog = ({
    children,
    title,
    subtitle,
    icon: Icon,
    onClose,
    footer,
    footerLayout = "none",
    align = "center",
    scrim = false,
    className,
    ...props
}: KioskDialogProps) => (
    <AriaModalOverlay
        {...props}
        // Scoped to the kiosk canvas, not the browser viewport, so the overlay
        // never extends past the panel.
        className={({ isEntering, isExiting }) =>
            cx(
                "absolute inset-0 z-50 flex items-center justify-center px-8",
                scrim && "bg-overlay/70",
                isEntering && "duration-150 ease-out animate-in fade-in",
                isExiting && "duration-100 ease-in animate-out fade-out",
            )
        }
    >
        <AriaModal
            className={({ isEntering, isExiting }) =>
                cx(
                    "w-full overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-border-secondary",
                    isEntering && "duration-150 ease-out animate-in zoom-in-95",
                    isExiting && "duration-100 ease-in animate-out zoom-out-95",
                    className,
                )
            }
            style={{ maxWidth: KIOSK_WIDTH - 128 }}
        >
            <AriaDialog className="flex max-h-[900px] flex-col outline-hidden">
                {(onClose || title || Icon) && (
                    <div className={cx("flex flex-col px-8 pt-8", align === "center" ? "items-center text-center" : "items-start")}>
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="mb-4 flex size-16 shrink-0 items-center justify-center self-start rounded-full ring-1 ring-border-primary transition duration-100 ease-linear active:bg-secondary"
                            >
                                <CloseIcon className="size-7 text-fg-secondary" />
                            </button>
                        )}
                        {Icon && <Icon className="mb-5 size-16 text-fg-brand-primary" aria-hidden="true" />}
                        {title && <h2 className="text-4xl font-bold text-balance text-primary">{title}</h2>}
                        {subtitle && <p className="mt-3 text-xl text-tertiary">{subtitle}</p>}
                    </div>
                )}

                {children && <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8 scrollbar-hide">{children}</div>}

                {footer && footerLayout === "split" && (
                    <div className="grid grid-cols-2 border-t border-secondary [&>*]:h-24 [&>*]:rounded-none">{footer}</div>
                )}
                {footer && footerLayout === "stacked" && <div className="flex flex-col gap-4 px-8 pt-2 pb-8">{footer}</div>}
                {footer && footerLayout === "none" && <div className="px-8 pb-8">{footer}</div>}
            </AriaDialog>
        </AriaModal>
    </AriaModalOverlay>
);

/** The edge-to-edge Cancel | Confirm pair used by the card dialogs. */
export const DialogSplitFooter = ({
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    onCancel,
    onConfirm,
    isDestructive = false,
    isConfirmDisabled = false,
}: {
    cancelLabel?: string;
    confirmLabel?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    isDestructive?: boolean;
    isConfirmDisabled?: boolean;
}) => (
    <>
        <KioskKey size="xl" variant="action" onPress={onCancel} className="border-r border-secondary">
            {cancelLabel}
        </KioskKey>
        <KioskKey size="xl" variant={isDestructive ? "destructive" : "primary"} onPress={onConfirm} isDisabled={isConfirmDisabled}>
            {confirmLabel}
        </KioskKey>
    </>
);
