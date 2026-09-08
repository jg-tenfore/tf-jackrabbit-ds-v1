"use client";

import type { FC, ReactNode } from "react";
import {
    Dialog as AriaDialog,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { cx } from "@/utils/cx";

/**
 * A full-screen overlay — the second of the two overlay kinds.
 *
 * Unlike `KioskDialog`, this **replaces the entire screen**. There is no card,
 * no visible page behind it, and the persistent footer rail is covered. It owns
 * the whole 750x1298 canvas.
 *
 * The distinction is about what the overlay is doing, not how big its content
 * is. A dialog is a step *inside* the current task and leaves its context on
 * screen. A full-screen modal is a *hard stop*: the flow cannot continue until
 * it is answered, and the surrounding context is deliberately removed so
 * nothing competes with the question. That is why the references use it for
 * destroying an order, choosing where to pay, and the between-step
 * interstitials — decisions where a half-visible screen behind would invite the
 * user to keep poking at what they were doing.
 *
 * Removing the context is the point, so this takes no scrim and no card: a
 * dimmed page behind would reintroduce exactly what it is trying to strip away.
 */

export interface KioskFullScreenModalProps extends Omit<AriaModalOverlayProps, "children"> {
    children?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    /** Large glyph above the title — carries the destructive and success tones. */
    icon?: FC<{ className?: string }>;
    iconTone?: "brand" | "error" | "warning" | "success";
    /**
     * Exported artwork above the title, for the screens that have a drawn mark
     * rather than an icon. Takes the icon's place — a screen has one thing at
     * the top, and letting both render would stack two competing symbols.
     */
    art?: ReactNode;
    /**
     * The TenFore mark above the title, as the checkout reference draws it.
     *
     * Separate from `icon` rather than passed through it, because the two say
     * different things: an icon here is the *tone* of a hard stop — a red
     * warning, a green tick — while the mark says "this is still the kiosk, you
     * have not been thrown somewhere else". A full-screen modal that removes all
     * surrounding context is exactly where that reassurance is worth its space.
     */
    showBrandMark?: boolean;
    /** Pinned actions at the bottom. Content scrolls above them. */
    footer?: ReactNode;
    /** Vertically centre the content block. Off for tall, scrolling content. */
    isCentered?: boolean;
    className?: string;
}

const ICON_TONES = {
    brand: "text-fg-brand-primary",
    error: "text-fg-error-primary",
    warning: "text-fg-warning-primary",
    success: "text-fg-success-primary",
} as const;

export const KioskFullScreenModal = ({
    children,
    title,
    subtitle,
    icon: Icon,
    iconTone = "brand",
    art,
    showBrandMark = false,
    footer,
    isCentered = true,
    className,
    ...props
}: KioskFullScreenModalProps) => (
    <AriaModalOverlay
        {...props}
        // Fills the kiosk canvas exactly — no inset, no scrim, nothing showing
        // through. This is a screen, not something floating above one.
        className={({ isEntering, isExiting }) =>
            cx(
                "absolute inset-0 z-50 bg-primary",
                isEntering && "duration-200 ease-out animate-in fade-in",
                isExiting && "duration-150 ease-in animate-out fade-out",
            )
        }
    >
        <AriaModal className="h-full w-full bg-primary">
            <AriaDialog className={cx("flex h-full w-full flex-col outline-hidden", className)}>
                <div
                    className={cx(
                        "flex min-h-0 flex-1 flex-col overflow-y-auto px-16 scrollbar-hide",
                        isCentered ? "justify-center" : "pt-16",
                    )}
                >
                    {/* w-full on the block: `items-center` sizes flex children to
                        max-content, so without it a long title lays out on one
                        line and overflows the canvas instead of wrapping. */}
                    <div className="flex w-full flex-col items-center text-center">
                        {showBrandMark && <BrandMark className="mb-8" />}
                        {/* Art wins over icon: one mark at the top, never two. */}
                        {art ? (
                            <div className="mb-10">{art}</div>
                        ) : (
                            Icon && <Icon className={cx("mb-10 size-28", ICON_TONES[iconTone])} aria-hidden="true" />
                        )}
                        {title && <h1 className="w-full max-w-[600px] text-5xl font-bold text-balance text-primary">{title}</h1>}
                        {subtitle && <p className="mt-7 max-w-[560px] text-2xl text-tertiary">{subtitle}</p>}
                    </div>

                    {/* 40 / 28 / 56 between mark, title, subtitle and content —
                        measured off the cancel-order export, which is drawn at
                        the canvas's own 750x1298 and so needs no conversion. */}
                    {children && <div className="mt-14">{children}</div>}
                </div>

                {footer && <div className="shrink-0 px-16 pt-6 pb-14">{footer}</div>}
            </AriaDialog>
        </AriaModal>
    </AriaModalOverlay>
);

/**
 * The centred Cancel / action pill pair used by the full-screen confirms.
 *
 * Deliberately *not* the dialog's edge-to-edge split footer: a full-screen
 * modal has no card edge for the bar to span, and the references draw these as
 * two discrete pills sitting together in the middle of the screen.
 */
export const FullScreenActions = ({
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    onCancel,
    onConfirm,
    isDestructive = false,
}: {
    cancelLabel?: string;
    confirmLabel?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    isDestructive?: boolean;
}) => (
    <div className="flex items-center justify-center gap-4">
        <button
            type="button"
            onClick={onCancel}
            className="h-[74px] min-w-[246px] rounded-xl px-8 text-2xl font-medium text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
        >
            {cancelLabel}
        </button>
        <button
            type="button"
            onClick={onConfirm}
            className={cx(
                "h-[74px] min-w-[246px] rounded-xl px-8 text-2xl font-semibold text-white transition duration-100 ease-linear",
                isDestructive ? "bg-error-solid active:bg-error-solid_hover" : "bg-brand-solid active:bg-brand-solid_hover",
            )}
        >
            {confirmLabel}
        </button>
    </div>
);
