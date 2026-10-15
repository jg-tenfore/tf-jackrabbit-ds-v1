"use client";

import { useEffect, useRef } from "react";
import { useKioskSession } from "@/providers/kiosk-session";
import { deepLinkState } from "./deep-link-state";
import { useNavigation } from "./navigation";
import { usePrototype } from "./prototype-state";
import { readScreenLink, screenLinkUrl } from "./screen-links";
import { useBookingActivity } from "./screens/booking-screens";
import { setOrderFlow, useOrderFlow } from "./screens/order-screens";

/** One owner for URL updates and browser Back/Forward. No page reloads. */
export const PrototypeUrlSync = () => {
    const { screen, restore, historyMode } = useNavigation();
    const { item, categoryId, favoriteStyle } = useOrderFlow();
    const { activity, setActivity, setTeeRate, setDurationHours } = useBookingActivity();
    const { booking, setBooking, lines, addMenuItem } = usePrototype();
    const { dismissScan } = useKioskSession();
    const previousScreen = useRef(screen);

    useEffect(() => {
        const url = screenLinkUrl(new URL(window.location.href), { screen, item: item?.id ?? null, category: categoryId, activity, favoriteStyle });
        if (url.href !== window.location.href) {
            const method = previousScreen.current === screen ? "replaceState" : historyMode;
            window.history[method](window.history.state, "", url);
        }
        previousScreen.current = screen;
    }, [screen, item?.id, categoryId, activity, historyMode, favoriteStyle]);

    useEffect(() => {
        const onPopState = () => {
            const link = readScreenLink(new URL(window.location.href));
            const seed = deepLinkState(link);
            previousScreen.current = link.screen;
            setOrderFlow({ item: seed.item, categoryId: seed.categoryId, returnTo: "menu", favoriteStyle: link.favoriteStyle ?? "icon" });
            if (seed.booking && (!booking || booking.kind !== link.activity)) {
                setBooking(seed.booking);
                setActivity(seed.choice.activity);
                setTeeRate(seed.choice.teeRate);
                setDurationHours(seed.choice.durationHours);
            }
            if (seed.lines.length && lines.length === 0) addMenuItem(seed.item);
            // Revisiting an entry screen must not auto-advance from an earlier scan.
            dismissScan();
            restore(link.screen);
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [restore, booking, setBooking, setActivity, setTeeRate, setDurationHours, lines.length, addMenuItem, dismissScan]);

    return null;
};
