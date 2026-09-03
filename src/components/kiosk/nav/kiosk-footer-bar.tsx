"use client";

import { useState } from "react";
import { LogOut01, ShoppingBag03 } from "@untitledui/icons";
import { WalletLoginDrawer } from "@/components/kiosk/nav/wallet-login-drawer";
import { useKioskSession } from "@/providers/kiosk-session";
import { cx } from "@/utils/cx";

interface KioskFooterBarProps {
    /** Line-item count driving the cart badge. Hidden when 0. */
    cartCount?: number;
    cartTotal?: number;
    onViewOrder?: () => void;
    onStartOver?: () => void;
    onHowToLogIn?: () => void;
    className?: string;
}

/**
 * The kiosk's global navigation.
 *
 * Unlike an app's nav bar this is a *persistent action rail*, not a set of
 * destinations — a kiosk session is a single linear task, so the only things
 * that must always be reachable are: abandon the session (Start Over), see what
 * you have added (cart), and identify yourself (wallet drawer).
 *
 * It is pinned by `KioskScreen`'s footer slot on every screen, so its position
 * is identical throughout the session.
 */
export const KioskFooterBar = ({ cartCount = 0, cartTotal = 0, onViewOrder, onStartOver, onHowToLogIn, className }: KioskFooterBarProps) => {
    const { member, mode, signOut, resetSession } = useKioskSession();
    const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

    const isAuthenticated = mode === "authenticated" && member;
    const hasCart = cartCount > 0;

    const handleStartOver = () => {
        setIsDrawerExpanded(false);
        resetSession();
        onStartOver?.();
    };

    return (
        <div className={cx("w-full", className)}>
            {/* The drawer overlays upward, so it sits above the rail in the stack. */}
            <div className="flex justify-end">
                <WalletLoginDrawer
                    isExpanded={isDrawerExpanded}
                    onExpandedChange={setIsDrawerExpanded}
                    onHowToLogIn={onHowToLogIn}
                />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-secondary bg-primary px-16 py-6">
                <button
                    type="button"
                    onClick={handleStartOver}
                    className="h-16 flex-1 rounded-lg text-lg text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                >
                    Start Over
                </button>

                {hasCart && (
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center gap-2" data-placeholder-asset="golf-bag-cart-icon">
                            <ShoppingBag03 className="size-9 text-fg-brand-primary" aria-hidden="true" />
                            <span
                                className="absolute -top-1 -left-1 flex size-6 items-center justify-center rounded-full bg-error-solid text-xs font-semibold text-white"
                                aria-label={`${cartCount} items in order`}
                            >
                                {cartCount}
                            </span>
                            <span className="text-xl font-semibold text-primary tabular-nums">${cartTotal.toFixed(2)}</span>
                        </div>

                        <button
                            type="button"
                            onClick={onViewOrder}
                            className="h-16 rounded-lg bg-brand-solid px-6 text-lg font-semibold text-white transition duration-100 ease-linear active:bg-brand-solid_hover"
                        >
                            View My Order
                        </button>
                    </div>
                )}

                {isAuthenticated && (
                    <button
                        type="button"
                        onClick={signOut}
                        className="flex h-16 items-center gap-2 rounded-lg bg-error-solid px-6 text-lg font-semibold text-white transition duration-100 ease-linear active:bg-error-solid_hover"
                    >
                        <LogOut01 className="size-5" aria-hidden="true" />
                        Log out
                    </button>
                )}
            </div>
        </div>
    );
};
