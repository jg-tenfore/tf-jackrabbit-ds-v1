"use client";

import { useCallback } from "react";
import { useKioskSession } from "@/providers/kiosk-session";
import { useNavigation } from "./navigation";
import { usePrototype } from "./prototype-state";

/**
 * Ending a session, in one place.
 *
 * A kiosk session ends for exactly two reasons — Start Over, or an order that
 * completed — and both have to leave the machine as the next stranger should
 * find it. That is more than emptying the cart: the previous customer is still
 * *signed in* until `resetSession()` is called, so a half-finished reset hands
 * person B person A's name, membership and saved cards. Every screen that ends
 * a session goes through this hook so that cannot be got wrong one screen at a
 * time.
 *
 * Order matters. Transient state clears first, then the cart and identity, and
 * navigation last — unwinding to the attract screen before the state behind it
 * is gone renders one frame of the old session on the way out.
 */

/**
 * Per-flow transient state that must die with the session.
 *
 * The food and booking flows each keep a little pointer state outside the cart
 * — which card was tapped, which activity is being booked. It is deliberately
 * not session state, but it still cannot outlive the session: left alone, the
 * next customer opens the menu in the category the last one was browsing.
 *
 * A registry rather than imports because the dependency only runs one way. This
 * module must not know what the flow modules keep; the flow modules already
 * know they own something transient, so they are the ones to say so.
 */
const resetters = new Set<() => void>();

/**
 * Registers transient state to be cleared when the session ends.
 *
 * Returns an unregister, so state that lives in a provider can register from an
 * effect and drop out cleanly when that provider unmounts. Module-scoped stores
 * can register once at import and ignore the return.
 */
export const registerSessionReset = (reset: () => void) => {
    resetters.add(reset);
    return () => {
        resetters.delete(reset);
    };
};

export const useEndSession = () => {
    const { resetOrder } = usePrototype();
    const { resetSession } = useKioskSession();
    const { reset } = useNavigation();

    return useCallback(() => {
        resetters.forEach((resetFlow) => resetFlow());
        resetOrder();
        resetSession();
        reset();
    }, [resetOrder, resetSession, reset]);
};
