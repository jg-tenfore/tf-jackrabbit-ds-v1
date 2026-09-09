"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

/**
 * Where the prototype is, and how it got there.
 *
 * A state machine rather than routes. A kiosk has no address bar, no back
 * button and no shareable link — the screen a user is on is a fact about the
 * session, not a location — and the moment you make it a URL you inherit
 * browser history semantics the hardware cannot honour.
 *
 * The one thing routes give for free and this has to do by hand is **back**, so
 * it keeps an explicit stack. `goBack` pops it; `go` pushes. `reset` empties it
 * and returns to the attract screen, which is what Start Over and a completed
 * order both do.
 */
export type ScreenId =
    // Session envelope
    | "attract"
    | "get-started"
    | "do-you-want-to-log-in"
    | "wallet-interstitial"
    | "how-to-log-in"
    | "enter-code"
    | "enter-email"
    | "home"
    // Food
    | "menu"
    | "item-detail"
    | "customize"
    | "added-to-bag"
    // Pro shop
    | "pro-shop"
    // Booking, shared by all three activities
    | "booking-when"
    | "booking-duration"
    | "booking-resource"
    | "booking-review"
    // Checkout, shared by everything
    | "order-review"
    | "takeout-choice"
    | "enter-name"
    | "checkout-method"
    | "follow-instructions"
    | "order-successful";

interface NavigationValue {
    screen: ScreenId;
    /** True when there is somewhere to go back to. */
    canGoBack: boolean;
    go: (screen: ScreenId) => void;
    /** Replaces rather than pushes — for steps that should not be returned to. */
    replace: (screen: ScreenId) => void;
    goBack: () => void;
    reset: () => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

export const NavigationProvider = ({ children, initial = "attract" }: { children: ReactNode; initial?: ScreenId }) => {
    const [stack, setStack] = useState<ScreenId[]>([initial]);

    const go = useCallback((screen: ScreenId) => setStack((prev) => [...prev, screen]), []);
    const replace = useCallback((screen: ScreenId) => setStack((prev) => [...prev.slice(0, -1), screen]), []);
    const goBack = useCallback(() => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)), []);
    const reset = useCallback(() => setStack([initial]), [initial]);

    const value = useMemo<NavigationValue>(
        () => ({ screen: stack[stack.length - 1], canGoBack: stack.length > 1, go, replace, goBack, reset }),
        [stack, go, replace, goBack, reset],
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
    const value = useContext(NavigationContext);
    if (!value) throw new Error("useNavigation must be used inside a NavigationProvider");
    return value;
};
