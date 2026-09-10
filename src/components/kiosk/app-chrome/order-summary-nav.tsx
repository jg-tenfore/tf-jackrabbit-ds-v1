"use client";

import { useState } from "react";
import { KioskButton } from "@/components/kiosk/kiosk-button";
import { SignedInCard, WalletDrawer } from "@/components/kiosk/app-chrome/wallet-drawer";
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
     * draws it. Ignored when signed in, where the identity card takes that
     * corner instead — a signed-in user has nothing to gain from a log-in
     * prompt at checkout.
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
    const { member, mode, signOut, resetSession } = useKioskSession();
    const isAuthenticated = mode === "authenticated" && member;
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
                    <KioskButton size="lg" onPress={onOrderMore} className="w-[183px]">
                        Order More
                    </KioskButton>
                )}
                <KioskButton tone="primary" size="lg" onPress={onCompleteOrder} isDisabled={isCompleteDisabled} className="ml-auto w-[421px] text-[24px]">
                    Complete Order
                </KioskButton>
            </div>

            {/* Bottom-anchored and left-aligned, diagonally opposite Complete
                Order — the same placement it holds on every other rail, so the
                one destructive control never moves. */}
            <KioskButton size="md" onPress={handleStartOver} className="mt-auto w-[387px]">
                Start Over
            </KioskButton>

            {/* Overhangs the rail's bottom edge like it does everywhere else, so
                whichever card is showing stays in one place across every screen.
                Signed in it is the identity card, exactly as on the main rail —
                driven off the session rather than a prop, because a signed-in
                user being shown a "log in" drawer is not a state any screen
                should be able to ask for. */}
            {isAuthenticated ? (
                <div className="absolute right-16 bottom-0">
                    <SignedInCard firstName={member.firstName} onSignOut={signOut} />
                </div>
            ) : (
                showWalletDrawer && (
                    <div className="absolute right-16 bottom-0">
                        <WalletDrawer isCompact isExpanded={isDrawerExpanded} onExpandedChange={setIsDrawerExpanded} caption="Scan or tap to" />
                    </div>
                )
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
