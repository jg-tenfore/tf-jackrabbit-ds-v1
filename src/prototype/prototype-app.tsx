"use client";

import { type ComponentType, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { MEMBERS } from "@/data/members";
import { KioskSessionProvider } from "@/providers/kiosk-session";
import { deepLinkState } from "./deep-link-state";
import { NavigationProvider, type ScreenId, useNavigation } from "./navigation";
import { PrototypeProvider } from "./prototype-state";
import { PrototypeUrlSync } from "./prototype-url-sync";
import { PrototypeViewport } from "./prototype-viewport";
import { readScreenLink } from "./screen-links";
import {
    BookingActivityProvider,
    BookingDurationRoute,
    BookingResourceRoute,
    BookingReviewRoute,
    BookingWhenRoute,
    useBookingActivity,
} from "./screens/booking-screens";
import {
    AddedToBagRoute,
    CheckoutMethodRoute,
    CustomizeRoute,
    FollowInstructionsRoute,
    ItemDetailRoute,
    MenuRoute,
    OrderReviewRoute,
    OrderSuccessfulRoute,
    ProShopRoute,
    TakeoutChoiceRoute,
    setOrderFlow,
    useOrderFlow,
} from "./screens/order-screens";
import {
    AttractRoute,
    DoYouWantToLogInRoute,
    EnterCodeRoute,
    EnterEmailRoute,
    EnterNameRoute,
    GetStartedRoute,
    HomeRoute,
    HowToLogInRoute,
    WalletInterstitialRoute,
} from "./screens/session-screens";

/**
 * The prototype's whole router: one screen id to one component.
 *
 * A `Record<ScreenId, ...>` rather than a switch or a lookup with a fallback,
 * because the record is exhaustive by type — adding a `ScreenId` without
 * building its screen fails the typecheck instead of shipping a blank panel
 * someone discovers in a demo. That is the only reason this file knows about
 * every screen.
 */
const SCREENS: Record<ScreenId, ComponentType> = {
    // Session envelope
    attract: AttractRoute,
    "get-started": GetStartedRoute,
    "do-you-want-to-log-in": DoYouWantToLogInRoute,
    "wallet-interstitial": WalletInterstitialRoute,
    "how-to-log-in": HowToLogInRoute,
    "enter-code": EnterCodeRoute,
    "enter-email": EnterEmailRoute,
    home: HomeRoute,
    // Food
    menu: MenuRoute,
    "item-detail": ItemDetailRoute,
    customize: CustomizeRoute,
    "added-to-bag": AddedToBagRoute,
    // Pro shop
    "pro-shop": ProShopRoute,
    // Booking
    "booking-when": BookingWhenRoute,
    "booking-duration": BookingDurationRoute,
    "booking-resource": BookingResourceRoute,
    "booking-review": BookingReviewRoute,
    // Checkout
    "order-review": OrderReviewRoute,
    "takeout-choice": TakeoutChoiceRoute,
    "enter-name": EnterNameRoute,
    "checkout-method": CheckoutMethodRoute,
    "follow-instructions": FollowInstructionsRoute,
    "order-successful": OrderSuccessfulRoute,
};

const CurrentScreen = () => {
    const { screen } = useNavigation();
    const { item, categoryId, favoriteStyle } = useOrderFlow();
    const { activity } = useBookingActivity();
    const Screen = SCREENS[screen];
    // Keyed so a screen's local state (a keypad's digits, a scroll position)
    // dies with the screen. Without it React reuses the tree between two routes
    // that happen to render the same shape and the second one inherits the
    // first one's half-typed input.
    return <Screen key={`${screen}:${item?.id ?? ""}:${categoryId}:${activity}:${favoriteStyle}`} />;
};

/**
 * The standalone prototype.
 *
 * Provider order is a dependency order, outermost first: session identity is
 * read by the cart's screens, the cart is read by navigation targets, and the
 * booking draft is scoped inside all three because it is the only state that
 * belongs to one flow rather than the session.
 *
 * `KioskFrame` comes last (inside `PrototypeViewport`) because it is also the
 * React Aria portal container — every dialog these screens open renders into
 * it, so it has to sit under the providers those dialogs read.
 */
const PrototypeSession = () => {
    const [entry] = useState(() => {
        const url = new URL(window.location.href);
        const link = readScreenLink(url);
        const seed = deepLinkState(link);
        return { link, seed, directEntry: url.searchParams.has("screen") };
    });

    useLayoutEffect(() => {
        setOrderFlow({ item: entry.seed.item, categoryId: entry.seed.categoryId, returnTo: "menu", favoriteStyle: entry.link.favoriteStyle ?? "icon" });
    }, [entry]);

    return (
        <KioskSessionProvider initialMember={entry.link.screen === "home" ? MEMBERS[0] : null}>
            <PrototypeProvider initialLines={entry.seed.lines} initialBooking={entry.seed.booking}>
                <NavigationProvider initial={entry.link.screen} directEntry={entry.directEntry}>
                    <BookingActivityProvider initialChoice={entry.seed.choice}>
                        <PrototypeUrlSync />
                        <PrototypeViewport>
                            <CurrentScreen />
                        </PrototypeViewport>
                    </BookingActivityProvider>
                </NavigationProvider>
            </PrototypeProvider>
        </KioskSessionProvider>
    );
};

const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Defer browser URL reads until hydration, including in the static export. */
export const PrototypeApp = () => {
    const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
    return hydrated ? <PrototypeSession /> : null;
};
