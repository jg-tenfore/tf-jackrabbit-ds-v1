"use client";

import { useState } from "react";
import { WalletDrawer } from "@/components/kiosk/app-chrome/wallet-drawer";
import { useKioskSession } from "@/providers/kiosk-session";
import { cx } from "@/utils/cx";

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/**
 * The rail as it appears on the order review screen, at 750x420.
 *
 * A separate component from `GlobalNav` rather than a fifth state of it. The
 * two overlap only in Start Over: there is no wallet drawer, no bag, and no
 * View My Order — you are already looking at the order, so a control that takes
 * you to it would point at the screen you are on. What replaces them is a
 * totals block and a commit button, which is a different job from the rail's
 * "abandon, review, identify" triple. Folding this in would have given
 * `GlobalNav` two unrelated layouts behind a mode flag.
 *
 * Layout from the reference. The totals column and Complete Order are
 * **right-aligned** in a 421px column ending 64 from the right edge, while
 * Start Over stays left-aligned at 64 in its usual 387 — so the thing you are
 * meant to press and the thing you are meant to miss sit at opposite corners.
 *
 * The total is **derived**, not passed. The reference itself shows $20.74 plus
 * $1.71 arriving at $34.45, which is the kind of drift that only happens when
 * three numbers can be set independently.
 */
export const OrderSummaryNav = ({
    subtotalCents,
    taxCents,
    onCompleteOrder,
    /** Supply to add "Order More" in the left gutter beside Complete Order. */
    onOrderMore,
    onStartOver,
    isCompleteDisabled = false,
    /**
     * Show the wallet drawer bottom-right, as the guest-checkout reference
     * draws it. A signed-in user has nothing to gain from it here, so it is
     * opt-in rather than driven off session state.
     */
    showWalletDrawer = false,
    className,
}: {
    subtotalCents: number;
    taxCents: number;
    onCompleteOrder?: () => void;
    onOrderMore?: () => void;
    onStartOver?: () => void;
    isCompleteDisabled?: boolean;
    showWalletDrawer?: boolean;
    className?: string;
}) => {
    const { resetSession } = useKioskSession();
    const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

    const handleStartOver = () => {
        resetSession();
        onStartOver?.();
    };

    return (
        // min-h rather than h: 420 is what the reference specifies and what this
        // renders at, but a clipped total is a worse failure than a rail a few
        // pixels tall.
        <nav
            aria-label="Order summary"
            className={cx(
                "relative z-50 flex min-h-[420px] w-full max-w-full flex-col bg-primary px-16 pt-[112px] pb-7",
                "shadow-[0_-4px_16px_rgba(0,0,0,0.08)]",
                className,
            )}
        >
            <dl className="ml-auto w-[421px]">
                <SummaryRow label="Sub Total" value={money(subtotalCents)} />
                <SummaryRow label="Tax" value={money(taxCents)} />

                <div className="mt-1 flex items-baseline justify-between gap-6">
                    <dt className="text-[32px] leading-tight font-bold text-primary">Total</dt>
                    <dd className="text-[32px] leading-tight font-bold text-primary tabular-nums">{money(subtotalCents + taxCents)}</dd>
                </div>
            </dl>

            {/* Order More sits in the left gutter the totals column leaves empty,
                rather than splitting Complete Order's width. Commit keeps the
                same size and position whether or not the secondary is there. */}
            <div className="mt-9 flex items-center gap-[18px]">
                {onOrderMore && (
                    <button
                        type="button"
                        onClick={onOrderMore}
                        className="h-[65px] w-[183px] rounded-lg text-[20px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                    >
                        Order More
                    </button>
                )}
                <button
                    type="button"
                    onClick={onCompleteOrder}
                    disabled={isCompleteDisabled}
                    className="ml-auto h-[65px] w-[421px] rounded-lg bg-brand-solid text-[24px] font-bold text-white transition duration-100 ease-linear active:bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Complete Order
                </button>
            </div>

            {/* Bottom-anchored and left-aligned, diagonally opposite Complete
                Order — the same placement it holds on every other rail, so the
                one destructive control never moves. */}
            <button
                type="button"
                onClick={handleStartOver}
                className="mt-auto h-[52px] w-[387px] rounded-lg text-[18px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
            >
                Start Over
            </button>

            {/* Overhangs the rail's bottom edge like it does everywhere else, so
                the drawer stays in one place across every screen. */}
            {showWalletDrawer && (
                <div className="absolute right-16 bottom-0">
                    <WalletDrawer isCompact isExpanded={isDrawerExpanded} onExpandedChange={setIsDrawerExpanded} caption="Scan or tap to" />
                </div>
            )}
        </nav>
    );
};

/** Sub Total and Tax — same weight, so neither reads as the number that matters. */
const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-baseline justify-between gap-6">
        <dt className="text-[22px] leading-tight text-secondary">{label}</dt>
        <dd className="text-[22px] leading-tight text-secondary tabular-nums">{value}</dd>
    </div>
);
