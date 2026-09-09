"use client";

import { useEffect, useState } from "react";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { GET_STARTED_OPTIONS_WITH_ACTIVITIES, GetStartedScreen } from "@/components/kiosk/screens/get-started-screen";
import { HomeScreen } from "@/components/kiosk/screens/home-screen";
import { HowToLogInScreen } from "@/components/kiosk/screens/how-to-log-in-screen";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { WalletInterstitialScreen } from "@/components/kiosk/screens/wallet-interstitial-screen";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import { MENU_ITEMS } from "@/data/menu-catalog";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { type ScreenId, useNavigation } from "@/prototype/navigation";
import { usePrototype } from "@/prototype/prototype-state";
import { PrototypeGlobalNav, startBookingDraft, useBookingActivity } from "@/prototype/screens/booking-screens";
import { useEndSession } from "@/prototype/session-lifecycle";
import { useKioskSession } from "@/providers/kiosk-session";

/**
 * The session envelope — every screen a flow passes through before and after it
 * is a booking or an order.
 *
 * These are the screens the flow stories restate in every file: the attract
 * loop, the hub, the log-in decision, the two entry screens, the explainer and
 * the signed-in landing. They are shared here for the same reason they are
 * shared there — a kiosk session has one way in and one way out, and three
 * copies of it would drift on the third.
 *
 * Routing decisions live in this file rather than in the shell, because the
 * choice a screen offers and the screen it leads to are one design decision.
 * The shell only maps a `ScreenId` to a component.
 */

const COURSE_NAME = "Sagamore Golf Club";

/**
 * A completed wallet scan moves the session on.
 *
 * `KioskSessionProvider` runs the scan on real timers and reports it as status,
 * not as a callback — several screens carry a scan target and none of them know
 * where the flow goes next. So the screens that offer one watch for success and
 * decide that themselves.
 */
const useScanAdvance = (target: ScreenId) => {
    const { scanStatus } = useKioskSession();
    const { go, screen } = useNavigation();

    useEffect(() => {
        if (scanStatus === "success" && screen !== target) go(target);
    }, [scanStatus, screen, target, go]);
};

/**
 * Where each card on the hub leads.
 *
 * The two account cards ask the log-in question, shopping goes to the menu, and
 * the three bookable things all enter the same booking flow one draft apart —
 * which is the argument `activity-config.ts` makes, expressed as navigation.
 */
const useGetStartedRouter = () => {
    const { go } = useNavigation();
    const { setBooking } = usePrototype();
    const { setActivity, setTeeRate, setDurationHours } = useBookingActivity();

    return (id: string) => {
        // A first-timer gets the case for the wallet before the question, which
        // is the order the reference flows draw it in; someone checking in has
        // heard it and goes straight to the scan.
        if (id === "first-time") return go("wallet-interstitial");
        if (id === "check-in") return go("do-you-want-to-log-in");
        if (id === "shop") return go("menu");

        const kind = id === "simulator" ? "simulator" : id === "pickleball" ? "pickleball" : "tee-time";
        setActivity(kind);
        setTeeRate(null);
        setDurationHours(null);
        setBooking(startBookingDraft(kind));
        go("booking-when");
    };
};

/**
 * The attract loop.
 *
 * The card row is the six-option set rather than the four, so both activities
 * are reachable from a standing start — the row scrolls, which is what makes
 * offering six there honest.
 */
export const AttractRoute = () => {
    const { go } = useNavigation();
    const { continueAsGuest } = useKioskSession();
    const selectStart = useGetStartedRouter();
    useScanAdvance("home");

    return (
        <KioskScreen
            scroll={false}
            footer={
                <WelcomeNav
                    onStartOrder={() => {
                        continueAsGuest();
                        go("get-started");
                    }}
                    onJoinWaitlist={() => go("get-started")}
                />
            }
        >
            <WindowScreen courseName={COURSE_NAME} options={GET_STARTED_OPTIONS_WITH_ACTIVITIES} onSelect={selectStart} />
        </KioskScreen>
    );
};

/**
 * The hub.
 *
 * No rail: Go Back is the only control, because there is nowhere to return to
 * but the attract screen and nothing yet to abandon.
 */
export const GetStartedRoute = () => {
    const { goBack, canGoBack, reset } = useNavigation();
    const selectStart = useGetStartedRouter();

    return (
        <KioskScreen scroll={false}>
            <GetStartedScreen
                courseName={COURSE_NAME}
                options={GET_STARTED_OPTIONS_WITH_ACTIVITIES}
                onSelect={selectStart}
                onBack={() => (canGoBack ? goBack() : reset())}
            />
        </KioskScreen>
    );
};

/**
 * "Do you want to log in?"
 *
 * No chrome at all — the screen is the way out, and the rail's drawer would
 * offer a third route to log in beside the scan target and Enter Code.
 * Declining is a first-class answer: it continues as a guest rather than
 * dead-ending, which is why it is not styled as the lesser choice.
 */
export const DoYouWantToLogInRoute = () => {
    const { go } = useNavigation();
    const { continueAsGuest } = useKioskSession();
    const endSession = useEndSession();
    useScanAdvance("home");

    return (
        <KioskScreen scroll={false}>
            <ScanPromptScreen
                courseName={COURSE_NAME}
                // Email first, then the code — the order the new-user flow
                // draws it in. Scanning stays the one-tap path for a member who
                // has the wallet; typing is for the one who does not.
                onEnterCode={() => go("enter-email")}
                onDecline={() => {
                    continueAsGuest();
                    go("home");
                }}
                onHowToLogIn={() => go("how-to-log-in")}
                onStartOver={endSession}
            />
        </KioskScreen>
    );
};

/**
 * The case for connecting a wallet.
 *
 * Paired with `WelcomeNav` rather than the rail: this is still part of the entry
 * decision, so it keeps the three-way choice instead of the in-session actions.
 */
export const WalletInterstitialRoute = () => {
    const { go } = useNavigation();
    useScanAdvance("home");

    return (
        <KioskScreen
            scroll={false}
            footer={
                // Moving on from the pitch lands on the log-in question rather
                // than skipping it — the interstitial argues for the wallet, and
                // the question is where that argument is answered.
                <WelcomeNav onStartOrder={() => go("do-you-want-to-log-in")} onJoinWaitlist={() => go("get-started")} />
            }
        >
            <WalletInterstitialScreen />
        </KioskScreen>
    );
};

/**
 * The three-step explainer.
 *
 * It keeps the rail — a member reading these instructions is being told to scan
 * their wallet, and the drawer is the target. `shadow-none` because the artwork
 * runs to the rail's edge and the upward shadow would fall across it.
 */
export const HowToLogInRoute = () => {
    const { goBack, canGoBack, go } = useNavigation();
    useScanAdvance("home");

    return (
        <KioskScreen scroll={false} footer={<PrototypeGlobalNav className="shadow-none" />}>
            <HowToLogInScreen onDismiss={() => (canGoBack ? goBack() : go("do-you-want-to-log-in"))} />
        </KioskScreen>
    );
};

/**
 * Six-digit member code — the manual fallback for a wallet that will not scan.
 *
 * Really checked: the code is resolved against the member fixtures, a bad one
 * marks the field invalid, and a good one signs the session in. The rail carries
 * `isPromptExpanded` because scanning is still the faster way out of this screen.
 */
export const EnterCodeRoute = () => {
    const { go, goBack, canGoBack } = useNavigation();
    const { submitManualCode } = useKioskSession();
    const [value, setValue] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);

    return (
        <KioskScreen scroll={false} footer={<PrototypeGlobalNav isPromptExpanded />}>
            <EntryScreen
                title="Enter your code"
                subtitle="Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time."
                field={<CodeInput value={value} length={6} isMasked isInvalid={isInvalid} />}
                value={value}
                onChange={(next) => {
                    setValue(next);
                    setIsInvalid(false);
                }}
                layout="numeric"
                maxLength={6}
                isContinueDisabled={value.length < 6}
                onContinue={() => (submitManualCode(value) ? go("home") : setIsInvalid(true))}
                onBack={() => (canGoBack ? goBack() : go("enter-email"))}
            />
        </KioskScreen>
    );
};

/**
 * Email entry — the first half of logging in without the app.
 *
 * The keyboard swaps to the layout carrying `@`, `.` and `.com`. Any address is
 * accepted, because there is no account fixture to check one against and a demo
 * that rejects the address a stakeholder types is a demo that stops there. The
 * code screen after it is where the real check happens.
 */
export const EnterEmailRoute = () => {
    const { go, goBack, canGoBack } = useNavigation();
    const [value, setValue] = useState("");

    return (
        <KioskScreen scroll={false} footer={<PrototypeGlobalNav isPromptExpanded />}>
            <EntryScreen
                title="Enter your email"
                subtitle="Enter your email address to get started."
                field={<EntryTextField value={value} placeholder="you@example.com" />}
                value={value}
                onChange={setValue}
                layout="email"
                onContinue={() => go("enter-code")}
                onBack={() => (canGoBack ? goBack() : go("do-you-want-to-log-in"))}
            />
        </KioskScreen>
    );
};

/** Three merchandised items under the shortcuts, standing in for "New This Week". */
const FEATURED = MENU_ITEMS.filter((item) => ["cheeseburger", "chicken-sandwich", "soft-pretzel"].includes(item.id));

/**
 * Where an authenticated session lands: greeted, and put in front of the shop.
 *
 * Every tile and every featured item leads to the menu rather than straight to
 * an item detail. The detail screen belongs to the ordering flow and reads the
 * item it is showing from that flow's own state, so jumping into it from here
 * would land on a screen with nothing to show.
 */
export const HomeRoute = () => {
    const { go } = useNavigation();

    return (
        <KioskScreen scroll={false} footer={<PrototypeGlobalNav />}>
            <HomeScreen featuredTitle="New This Week" featuredItems={FEATURED} onSelectCategory={() => go("menu")} onSelectItem={() => go("menu")} />
        </KioskScreen>
    );
};

/**
 * Whose reservation or order this is.
 *
 * The same `EntryScreen` template with a different field — and deliberately no
 * rail and no scan band. By this point the user has chosen to continue as a
 * guest, and re-offering the scan reopens a settled decision; the keyboard also
 * wants the room.
 */
export const EnterNameRoute = () => {
    const { go, goBack, canGoBack } = useNavigation();
    const { booking, lines } = usePrototype();
    const [value, setValue] = useState("");

    const isBooking = Boolean(booking) || lines.some((line) => line.kind === "booking");

    return (
        <KioskScreen scroll={false}>
            <EntryScreen
                title="Enter your name"
                subtitle={isBooking ? "Enter your full name for your reservation." : "Enter your full name for your food order."}
                field={<EntryTextField value={value} placeholder="Enter your Full Name" />}
                value={value}
                onChange={setValue}
                onContinue={() => go("checkout-method")}
                onBack={() => (canGoBack ? goBack() : go("order-review"))}
            />
        </KioskScreen>
    );
};
