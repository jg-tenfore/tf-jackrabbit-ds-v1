"use client";

import { useState } from "react";
import { SignInPrompt, SignedInCard, WalletDrawer } from "@/components/kiosk/app-chrome/wallet-drawer";
import { useKioskSession } from "@/providers/kiosk-session";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/global-nav/${file}`);

/**
 * The fixed global navigation rail.
 *
 * It is an *action rail*, not a set of destinations. A kiosk session is one
 * linear task, so the only things that must always be reachable are: abandon
 * the session, see what you have added, and identify yourself. Adding
 * destination-style nav items here would invite wandering in a flow that has
 * nowhere to wander to.
 *
 * Four states, all driven from session + cart rather than props-as-flags, so a
 * screen cannot accidentally render a combination the session does not support:
 *
 *   logged out              Start Over + wallet drawer
 *   logged out with cart    adds the bag, running total and View My Order
 *   sign-in prompt          drawer expanded into the full-width green panel
 *   logged in               drawer replaced by the identity card with Log out
 *
 * The cart sits on its own row above Start Over rather than beside it. Start
 * Over is a full-width target because it is the one control a confused user
 * reaches for, and it should be impossible to miss.
 */
export const GlobalNav = ({
    cartCount = 0,
    cartTotal = 0,
    onViewOrder,
    onStartOver,
    onHowToLogIn,
    /** Force the expanded prompt open — for stories and for the scan step. */
    isPromptExpanded,
    className,
}: {
    cartCount?: number;
    cartTotal?: number;
    onViewOrder?: () => void;
    onStartOver?: () => void;
    onHowToLogIn?: () => void;
    isPromptExpanded?: boolean;
    className?: string;
}) => {
    const { member, mode, signOut, resetSession } = useKioskSession();
    const [isExpandedInternal, setIsExpandedInternal] = useState(false);

    const isExpanded = isPromptExpanded ?? isExpandedInternal;
    const isAuthenticated = mode === "authenticated" && member;
    // The bag shows whenever an order exists, including at zero — the reference
    // draws "$0.00" with a 0 badge, because a started order is a state the user
    // needs to see even before anything is in it.
    const hasOrder = cartCount > 0 || cartTotal > 0;

    const handleStartOver = () => {
        setIsExpandedInternal(false);
        resetSession();
        onStartOver?.();
    };

    return (
        <nav aria-label="Kiosk navigation" className={cx("w-full", className)}>
            {isExpanded && !isAuthenticated && <SignInPrompt onHowToLogIn={onHowToLogIn} />}

            <div className="relative bg-primary">
                {/* The drawer overhangs the rail, so it is absolutely placed and
                    the rail reserves its width with padding instead. */}
                <div className="absolute right-0 bottom-0">
                    {isAuthenticated ? (
                        <SignedInCard firstName={member.firstName} onSignOut={signOut} />
                    ) : (
                        <WalletDrawer isExpanded={isExpanded} onExpandedChange={setIsExpandedInternal} />
                    )}
                </div>

                <div className="flex flex-col gap-4 border-t border-secondary py-6 pr-[248px] pl-12">
                    {hasOrder && (
                        <div className="flex items-center gap-8">
                            <div className="relative flex items-center gap-3">
                                <img src={ASSET("golf-bag.svg")} alt="" aria-hidden="true" className="h-[118px] w-[52px] object-contain" />
                                <span
                                    className="absolute top-3 left-9 flex size-9 items-center justify-center rounded-full bg-error-solid text-base font-bold text-white"
                                    aria-label={`${cartCount} items in order`}
                                >
                                    {cartCount}
                                </span>
                                <span className="text-4xl font-bold text-primary tabular-nums">${cartTotal.toFixed(2)}</span>
                            </div>

                            <button
                                type="button"
                                onClick={onViewOrder}
                                className="h-20 shrink-0 rounded-lg bg-brand-solid px-8 text-2xl font-bold whitespace-nowrap text-white transition duration-100 ease-linear active:bg-brand-solid_hover"
                            >
                                View My Order
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleStartOver}
                        className="h-20 w-full rounded-lg text-2xl text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        </nav>
    );
};
