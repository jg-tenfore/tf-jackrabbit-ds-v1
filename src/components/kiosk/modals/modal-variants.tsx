"use client";

import { useState } from "react";
import { AlertTriangle, Minus, Plus } from "@untitledui/icons";
import { SlotMeta, type TeeTimeSlot } from "@/components/kiosk/booking/slot-card";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { KioskModal, ModalSplitFooter } from "@/components/kiosk/modals/kiosk-modal";
import { cx } from "@/utils/cx";

/**
 * The six modal patterns found in the references, each a thin composition over
 * `KioskModal`. Overlay, dismissal and focus containment live in the base, so
 * these files only describe what is different.
 */

/**
 * Rate picker — opened from a tee sheet slot.
 *
 * Rates are a single-select list rather than four buttons because they are
 * alternatives to one another: exactly one gets booked, and the list makes the
 * comparison (price against holes against transport) legible in one read.
 */
export const RatePickerModal = ({
    isOpen,
    onOpenChange,
    time,
    rates,
    onConfirm,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    time: string;
    rates: TeeTimeSlot[];
    onConfirm?: (rate: TeeTimeSlot) => void;
}) => {
    const [selectedId, setSelectedId] = useState(rates[0]?.id);
    const selected = rates.find((r) => r.id === selectedId);

    return (
        <KioskModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={time}
            subtitle="Available Rates"
            onClose={() => onOpenChange(false)}
            footerLayout="split"
            footer={
                <ModalSplitFooter
                    onCancel={() => onOpenChange(false)}
                    onConfirm={() => selected && onConfirm?.(selected)}
                    isConfirmDisabled={!selected}
                />
            }
        >
            <div className="flex flex-col gap-4">
                {rates.map((rate) => {
                    const isSelected = rate.id === selectedId;
                    const dollars = Math.floor(rate.priceCents / 100);
                    const cents = String(rate.priceCents % 100).padStart(2, "0");

                    return (
                        <button
                            key={rate.id}
                            type="button"
                            onClick={() => setSelectedId(rate.id)}
                            aria-pressed={isSelected}
                            className={cx(
                                "flex flex-col gap-2 rounded-xl bg-primary p-5 text-left ring-1 transition duration-100 ease-linear",
                                isSelected ? "ring-2 ring-brand" : "ring-border-secondary active:bg-secondary",
                            )}
                        >
                            <div className="flex items-baseline justify-between gap-4">
                                <span className="text-2xl font-bold text-primary">{rate.rateName}</span>
                                <span className="text-2xl font-bold text-primary tabular-nums">
                                    ${dollars}
                                    <sup className="text-base font-semibold">{cents}</sup>
                                </span>
                            </div>
                            <SlotMeta slot={rate} />
                        </button>
                    );
                })}
            </div>
        </KioskModal>
    );
};

/**
 * Product detail — opened from a menu item.
 *
 * The quantity stepper sits inside the modal rather than on the card behind it,
 * so the whole decision (what, how many, customised how) is committed in one
 * confirm instead of leaving partial state on the grid.
 */
export const ProductDetailModal = ({
    isOpen,
    onOpenChange,
    name,
    priceCents,
    imageSlot,
    onCustomize,
    onConfirm,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    priceCents: number;
    imageSlot?: React.ReactNode;
    onCustomize?: () => void;
    onConfirm?: (quantity: number) => void;
}) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <KioskModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={() => onOpenChange(false)}
            footerLayout="split"
            footer={<ModalSplitFooter onCancel={() => onOpenChange(false)} onConfirm={() => onConfirm?.(quantity)} />}
        >
            <div className="flex flex-col items-center gap-6">
                {imageSlot ?? (
                    <div
                        data-placeholder-asset="menu-item-photo"
                        className="size-48 rounded-2xl bg-secondary ring-1 ring-border-secondary"
                        aria-hidden="true"
                    />
                )}

                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-4xl font-bold text-balance text-primary">{name}</h3>
                    <p className="text-3xl font-bold text-primary tabular-nums">${(priceCents / 100).toFixed(2)}</p>
                </div>

                {onCustomize && (
                    <KioskKey size="lg" variant="action" span={0} onPress={onCustomize} className="w-full">
                        Customize Ingredients
                    </KioskKey>
                )}

                <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>
        </KioskModal>
    );
};

/**
 * Quantity stepper.
 *
 * Minus and plus are full-height targets at the ends of a wide control, so the
 * two most-pressed elements get the most reachable real estate and the count
 * itself — which is read, not pressed — takes the middle.
 */
export const QuantityStepper = ({
    value,
    onChange,
    min = 1,
    max = 99,
}: {
    value: number;
    onChange: (next: number) => void;
    min?: number;
    max?: number;
}) => (
    <div className="flex w-full items-center justify-between rounded-xl px-4 py-3 ring-1 ring-border-primary">
        <KioskKey
            size="lg"
            variant="action"
            span={0}
            icon={Minus}
            label="Decrease quantity"
            isDisabled={value <= min}
            onPress={() => onChange(Math.max(min, value - 1))}
            className="w-20"
        />
        <span className="text-4xl font-bold text-primary tabular-nums" aria-live="polite">
            {value}
        </span>
        <KioskKey
            size="lg"
            variant="action"
            span={0}
            icon={Plus}
            label="Increase quantity"
            isDisabled={value >= max}
            onPress={() => onChange(Math.min(max, value + 1))}
            className="w-20"
        />
    </div>
);

/** Destructive confirm — cancelling an order or abandoning a booking. */
export const DestructiveConfirmModal = ({
    isOpen,
    onOpenChange,
    title,
    body,
    confirmLabel = "Confirm",
    onConfirm,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    body?: string;
    confirmLabel?: string;
    onConfirm?: () => void;
}) => (
    <KioskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        icon={AlertTriangle}
        iconTone="error"
        title={title}
        subtitle={body}
        footerLayout="split"
        footer={<ModalSplitFooter confirmLabel={confirmLabel} isDestructive onCancel={() => onOpenChange(false)} onConfirm={onConfirm} />}
    />
);

/**
 * Choice modal — two or more forward paths of comparable weight (Join Standby).
 *
 * Actions stack full-width rather than sitting side by side, because these are
 * not opposites: side-by-side placement would imply one is the cancel.
 */
export const ChoiceModal = ({
    isOpen,
    onOpenChange,
    title,
    body,
    choices,
    footnote,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    body?: string;
    choices: { label: string; onPress?: () => void; isPrimary?: boolean }[];
    footnote?: string;
}) => (
    <KioskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        subtitle={body}
        footerLayout="stacked"
        footer={
            <>
                {choices.map((choice) => (
                    <KioskKey
                        key={choice.label}
                        size="xl"
                        span={0}
                        variant={choice.isPrimary ? "primary" : "action"}
                        onPress={choice.onPress}
                        className="w-full"
                    >
                        {choice.label}
                    </KioskKey>
                ))}
                {footnote && <p className="pt-2 text-center text-base text-tertiary">{footnote}</p>}
            </>
        }
    />
);

/**
 * Checkout method — pay at the kiosk or at the counter.
 *
 * The two are not equivalent options in a list: paying here is a card/mobile
 * choice inside one panel, and the counter is an alternative to that whole
 * panel. The "Or" divider makes that nesting visible rather than flattening
 * three peers.
 */
export const CheckoutMethodModal = ({
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
    <KioskModal isOpen={isOpen} onOpenChange={onOpenChange} title="Where would you like to check out?">
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

            {onBack && (
                <KioskKey size="lg" variant="action" span={0} onPress={onBack} className="w-2/3">
                    Go Back
                </KioskKey>
            )}
        </div>
    </KioskModal>
);

/** Info sheet — a dismissible explainer with one acknowledgement. */
export const InfoSheetModal = ({
    isOpen,
    onOpenChange,
    title,
    children,
    dismissLabel = "Ok, I got it",
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children?: React.ReactNode;
    dismissLabel?: string;
}) => (
    <KioskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        footerLayout="stacked"
        footer={
            <KioskKey size="xl" variant="action" span={0} onPress={() => onOpenChange(false)} className="w-full">
                {dismissLabel}
            </KioskKey>
        }
    >
        {children}
    </KioskModal>
);
