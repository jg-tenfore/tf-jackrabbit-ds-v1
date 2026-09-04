"use client";

import { Minus, Plus } from "@untitledui/icons";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { ProductImage } from "@/components/kiosk/store/product-image";
import type { MenuItem } from "@/data/menu-catalog";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

export interface OrderLine {
    item: MenuItem;
    quantity: number;
    /** Chosen modifiers, shown under the name. */
    modifiers?: string[];
}

const centsToUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/**
 * "Your Order" — the cart.
 *
 * Each line carries its own quantity stepper and Remove rather than routing
 * edits back through the product dialog. At a kiosk the person is standing with
 * a queue behind them, and making them reopen an item to change its count would
 * turn a one-tap correction into four.
 *
 * Remove is a plain outlined button, not destructive-red. The reference draws
 * it that way and it is right: removing one line from a cart is trivially
 * reversible by tapping the item again, so it does not warrant the colour the
 * kiosk reserves for cancelling a whole order.
 */
export const OrderReviewScreen = ({
    lines,
    taxCents,
    onChangeQuantity,
    onRemove,
    onViewDetails,
    onOrderMore,
    onCompleteOrder,
    className,
}: {
    lines: OrderLine[];
    taxCents?: number;
    onChangeQuantity?: (itemId: string, quantity: number) => void;
    onRemove?: (itemId: string) => void;
    onViewDetails?: (item: MenuItem) => void;
    onOrderMore?: () => void;
    onCompleteOrder?: () => void;
    className?: string;
}) => {
    const subtotalCents = lines.reduce((total, line) => total + line.item.priceCents * line.quantity, 0);
    // 8.25% when not supplied, so the story reads like a real receipt.
    const tax = taxCents ?? Math.round(subtotalCents * 0.0825);

    return (
        <div className={cx("flex h-full w-full flex-col", className)}>
            <header className="flex items-center gap-4 px-16 pt-12">
                <img
                    src={assetUrl("screen-assets/global-nav/golf-bag.svg")}
                    alt=""
                    aria-hidden="true"
                    className="h-[70px] w-[31px] object-contain"
                />
                <h1 className="text-[44px] leading-none font-bold text-primary">Your Order</h1>
            </header>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-16 scrollbar-hide">
                {lines.length === 0 ? (
                    <p className="py-20 text-center text-[19px] text-tertiary">Your bag is empty.</p>
                ) : (
                    lines.map((line) => (
                        <OrderLineRow
                            key={line.item.id}
                            line={line}
                            onChangeQuantity={onChangeQuantity}
                            onRemove={onRemove}
                            onViewDetails={onViewDetails}
                        />
                    ))
                )}
            </div>

            <div className="shrink-0 border-t border-secondary px-16 pt-5 pb-6">
                <div className="flex justify-between text-[17px] text-secondary">
                    <span>Sub Total</span>
                    <span className="tabular-nums">{centsToUsd(subtotalCents)}</span>
                </div>
                <div className="mt-1 flex justify-between text-[17px] text-secondary">
                    <span>Tax</span>
                    <span className="tabular-nums">{centsToUsd(tax)}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-[30px] font-bold text-primary">Total</span>
                    <span className="text-[30px] font-bold text-primary tabular-nums">{centsToUsd(subtotalCents + tax)}</span>
                </div>

                <div className="mt-5 flex gap-4">
                    <KioskKey size="lg" variant="action" onPress={onOrderMore} className="flex-1 text-[19px]">
                        Order More
                    </KioskKey>
                    <KioskKey
                        size="lg"
                        variant="primary"
                        onPress={onCompleteOrder}
                        isDisabled={lines.length === 0}
                        className="flex-[2] text-[19px]"
                    >
                        Complete Order
                    </KioskKey>
                </div>
            </div>
        </div>
    );
};

const OrderLineRow = ({
    line,
    onChangeQuantity,
    onRemove,
    onViewDetails,
}: {
    line: OrderLine;
    onChangeQuantity?: (itemId: string, quantity: number) => void;
    onRemove?: (itemId: string) => void;
    onViewDetails?: (item: MenuItem) => void;
}) => {
    const { item, quantity, modifiers } = line;

    return (
        <div className="flex gap-4 border-b border-secondary py-5">
            <ProductImage src={item.image} alt={item.name} className="size-[76px] shrink-0 rounded-lg" />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[19px] leading-tight font-semibold text-primary">{item.name}</span>
                {modifiers && modifiers.length > 0 && <span className="text-[13px] text-tertiary">{modifiers.join(", ")}</span>}
                <button
                    type="button"
                    onClick={() => onViewDetails?.(item)}
                    className="mt-2 h-11 w-[132px] rounded-lg text-[15px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                >
                    View Details
                </button>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex items-center overflow-hidden rounded-lg ring-1 ring-border-primary">
                    <StepButton icon={Minus} label="Decrease quantity" onPress={() => onChangeQuantity?.(item.id, Math.max(1, quantity - 1))} />
                    <span className="w-12 text-center text-[19px] font-medium text-primary tabular-nums">{quantity}</span>
                    <StepButton icon={Plus} label="Increase quantity" onPress={() => onChangeQuantity?.(item.id, quantity + 1)} />
                </div>
                <button
                    type="button"
                    onClick={() => onRemove?.(item.id)}
                    className="h-11 w-[132px] rounded-lg text-[15px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                >
                    Remove
                </button>
            </div>

            <span className="shrink-0 self-start text-[19px] font-semibold text-primary tabular-nums">
                {centsToUsd(item.priceCents * quantity)}
            </span>
        </div>
    );
};

const StepButton = ({ icon: Icon, label, onPress }: { icon: typeof Minus; label: string; onPress: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        aria-label={label}
        className="flex size-11 items-center justify-center text-fg-secondary transition duration-100 ease-linear active:bg-secondary"
    >
        <Icon className="size-5" />
    </button>
);
