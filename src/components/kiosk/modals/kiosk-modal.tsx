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
 * The one modal in the kiosk.
 *
 * Every overlay in the references — rate picker, product detail, destructive
 * confirm, standby choice, checkout method, info sheet — is the same anatomy
 * with different content: a centered card over a dimmed ground, an optional
 * close affordance, a title block, a body, and a footer of large actions.
 * Building them separately would mean reimplementing overlay, dismissal and
 * focus containment six times, and they would diverge on the details that
 * matter least and break most.
 *
 * Focus containment comes from React Aria rather than being hand-rolled: a
 * kiosk runs unattended for hours, and a modal that leaks focus leaves the
 * previous customer's session reachable behind the overlay.
 */

export type ModalFooterLayout =
    /** Cancel | Confirm, edge to edge with no padding, as drawn in the references. */
    | "split"
    /** Full-width buttons stacked vertically — used when actions are not opposites. */
    | "stacked"
    | "none";

export interface KioskModalProps extends Omit<AriaModalOverlayProps, "children"> {
    children?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    /** Large glyph above the title — the destructive and success treatments. */
    icon?: FC<{ className?: string }>;
    iconTone?: "brand" | "error" | "warning" | "success";
    /** Round close affordance in the top-left, as on the product detail modal. */
    onClose?: () => void;
    footer?: ReactNode;
    footerLayout?: ModalFooterLayout;
    /** Center the title block. Off for content-led modals like the rate picker. */
    align?: "center" | "start";
    className?: string;
}

const ICON_TONES = {
    brand: "text-fg-brand-primary",
    error: "text-fg-error-primary",
    warning: "text-fg-warning-primary",
    success: "text-fg-success-primary",
} as const;

export const KioskModal = ({
    children,
    title,
    subtitle,
    icon: Icon,
    iconTone = "brand",
    onClose,
    footer,
    footerLayout = "none",
    align = "center",
    className,
    ...props
}: KioskModalProps) => (
    <AriaModalOverlay
        {...props}
        // The overlay is scoped to the kiosk canvas, not the browser viewport,
        // so a modal dims exactly the panel and nothing outside it.
        className={({ isEntering, isExiting }) =>
            cx(
                "absolute inset-0 z-50 flex items-center justify-center bg-overlay/70 px-8",
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
                                // Self-aligned start so it sits top-left without
                                // knocking a centered title off centre.
                                className="mb-4 flex size-16 shrink-0 items-center justify-center self-start rounded-full ring-1 ring-border-primary transition duration-100 ease-linear active:bg-secondary"
                            >
                                <CloseIcon className="size-7 text-fg-secondary" />
                            </button>
                        )}

                        {Icon && <Icon className={cx("mb-5 size-20", ICON_TONES[iconTone])} aria-hidden="true" />}

                        {title && <h2 className="text-4xl font-bold text-balance text-primary">{title}</h2>}
                        {subtitle && <p className="mt-3 text-xl text-tertiary">{subtitle}</p>}
                    </div>
                )}

                {children && <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8 scrollbar-hide">{children}</div>}

                {footer && footerLayout === "split" && (
                    // Edge to edge, no padding, no gap — the split footer in the
                    // references reads as one bar divided, not two buttons.
                    <div className="grid grid-cols-2 border-t border-secondary [&>*]:h-24 [&>*]:rounded-none">{footer}</div>
                )}
                {footer && footerLayout === "stacked" && <div className="flex flex-col gap-4 px-8 pt-2 pb-8">{footer}</div>}
                {footer && footerLayout === "none" && <div className="px-8 pb-8">{footer}</div>}
            </AriaDialog>
        </AriaModal>
    </AriaModalOverlay>
);

/**
 * The Cancel / Confirm pair used by most modals.
 *
 * Confirm carries the destructive tone rather than Cancel, because at a kiosk
 * the risky action is the one being confirmed and it must be the one that looks
 * consequential.
 */
export const ModalSplitFooter = ({
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
