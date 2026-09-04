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
    /**
     * Whether an order exists at all. Defaults to "there is something in it",
     * but must be settable independently: the reference draws the bag with a 0
     * badge and $0.00 for an order that has been started and is still empty,
     * and count/total alone cannot tell that apart from having no order.
     */
    hasOrder: hasOrderProp,
    /** Force the expanded prompt open — for stories and for the scan step. */
    isPromptExpanded,
    /** Height of the expanded sign-in band. See SignInPrompt. */
    promptHeight,
    className,
}: {
    cartCount?: number;
    cartTotal?: number;
    hasOrder?: boolean;
    promptHeight?: number;
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
    // The bag shows whenever an order exists, including at zero — a started
    // order is a state the user needs to see before anything is in it.
    const hasOrder = hasOrderProp ?? (cartCount > 0 || cartTotal > 0);

    const handleStartOver = () => {
        setIsExpandedInternal(false);
        resetSession();
        onStartOver?.();
    };

    return (
        // z-50 + a shadow cast upward: the rail always sits above screen
        // content, and the shadow is what makes that legible when the content
        // behind it is white — a border alone reads as a divider, not a layer.
        <nav aria-label="Kiosk navigation" className={cx("relative z-50 w-full max-w-full shadow-[0_-4px_16px_rgba(0,0,0,0.08)]", className)}>
            {isExpanded && !isAuthenticated && <SignInPrompt onHowToLogIn={onHowToLogIn} height={promptHeight} />}

            <div className="relative bg-primary">
                {/* The drawer overhangs the rail, so it is absolutely placed and
                    the rail reserves its width with padding instead. */}
                <div className="absolute right-16 bottom-0">
                    {isAuthenticated ? (
                        <SignedInCard firstName={member.firstName} onSignOut={signOut} />
                    ) : (
                        <WalletDrawer isExpanded={isExpanded} onExpandedChange={setIsExpandedInternal} />
                    )}
                </div>

                {/* Measured off the cart reference, which is 1:1 with this
                    canvas (its drawer is 174px, matching the spec). Left inset
                    68, rows 112 and 52 tall, 24 between, 28/30 above and below.
                    The content column is a fixed 387 so Start Over ends where
                    View My Order does — they are aligned in the reference, and
                    a full-width button would run past it toward the drawer. */}
                <div data-nav-rail
                    className={cx("flex flex-col justify-end gap-6 border-t border-secondary px-16 py-7", isExpanded && !isAuthenticated ? "min-h-[114px]" : "min-h-[244px]")}>
                    <div className="flex w-[387px] flex-col gap-6">
                        {hasOrder && (
                            <div className="flex items-end justify-between gap-6">
                                <div className="relative flex items-end gap-2">
                                    <img src={ASSET("golf-bag.svg")} alt="" aria-hidden="true" className="h-[117px] w-[50px] object-contain" />
                                    <span
                                        className="absolute top-2 left-8 flex size-9 items-center justify-center rounded-full bg-error-solid text-[16px] font-bold text-white"
                                        aria-label={`${cartCount} items in order`}
                                    >
                                        {cartCount}
                                    </span>
                                    <span className="text-[32px] leading-none font-bold text-primary tabular-nums">${cartTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={onViewOrder}
                                    className="h-[56px] shrink-0 rounded-lg bg-brand-solid px-[18px] text-[18px] font-bold whitespace-nowrap text-white transition duration-100 ease-linear active:bg-brand-solid_hover"
                                >
                                    View My Order
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleStartOver}
                            className="h-[52px] w-full rounded-lg text-[18px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
