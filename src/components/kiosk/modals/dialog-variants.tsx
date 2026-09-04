"use client";

import { useState } from "react";
import { Minus, Plus } from "@untitledui/icons";
import { SlotMeta, type TeeTimeSlot } from "@/components/kiosk/booking/slot-card";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { DialogSplitFooter, KioskDialog } from "@/components/kiosk/modals/kiosk-dialog";
import { cx } from "@/utils/cx";

/**
 * Card-overlay variants.
 *
 * Everything here is a step *inside* the current task, so the page stays
 * visible around the card. Anything that halts the flow belongs in
 * `full-screen-variants.tsx` instead.
 */

/**
 * Rate picker — opened from a tee sheet slot.
 *
 * A dialog rather than a takeover because the tee sheet behind it is the
 * context for the choice: the user picked this time out of that grid, and
 * keeping the grid on screen makes backing out cost nothing.
 */
export const RatePickerDialog = ({
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
        <KioskDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={time}
            subtitle="Available Rates"
            onClose={() => onOpenChange(false)}
            footerLayout="split"
            footer={
                <DialogSplitFooter
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
                                <span className="shrink-0 text-2xl font-bold text-primary tabular-nums">
                                    ${dollars}
                                    <sup className="text-base font-semibold">{cents}</sup>
                                </span>
                            </div>
                            <SlotMeta slot={rate} />
                        </button>
                    );
                })}
            </div>
        </KioskDialog>
    );
};

/**
 * Product detail — opened from a menu or pro shop grid.
 *
 * A dialog because the grid behind is what the user is shopping: closing this
 * should return them to exactly the scroll position they were at, and a card
 * makes that continuity obvious.
 */
export const ProductDetailDialog = ({
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
        <KioskDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={() => onOpenChange(false)}
            footerLayout="split"
            footer={<DialogSplitFooter onCancel={() => onOpenChange(false)} onConfirm={() => onConfirm?.(quantity)} />}
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
        </KioskDialog>
    );
};

/**
 * Choice dialog — two or more forward paths of comparable weight.
 *
 * Actions stack full-width rather than sitting side by side, because these are
 * not opposites: side-by-side placement would imply one is the cancel.
 */
export const ChoiceDialog = ({
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
    <KioskDialog
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
