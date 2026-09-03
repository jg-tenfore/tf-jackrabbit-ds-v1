"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
    EXPIRED_WALLET_CODE,
    MANUAL_ENTRY_CODES,
    MEMBERS,
    type Member,
    findMemberByWalletCode,
} from "@/data/members";

/**
 * Kiosk session + simulated wallet scan.
 *
 * A real kiosk reads a TenFore Golf Wallet pass off a hardware scanner. For the
 * design system we simulate that entirely in software: `beginScan()` runs the
 * scripted scan states (idle -> scanning -> success | error) on real timers, so
 * every visual state a component must handle is reachable from a story without
 * any hardware or camera.
 *
 * The scan is modelled as a state machine rather than a boolean so screens can
 * render the beam animation, the "not recognised" retry, and the authenticated
 * greeting from one source of truth.
 */
export type ScanStatus = "idle" | "scanning" | "success" | "not-found" | "expired";

/** How long the simulated scan dwells in `scanning` before resolving. */
const SCAN_DURATION_MS = 1600;

export type SessionMode = "anonymous" | "guest" | "authenticated";

interface KioskSessionValue {
    /** The signed-in member, or null when anonymous/guest. */
    member: Member | null;
    mode: SessionMode;
    scanStatus: ScanStatus;

    /** Simulate a wallet tap. Omit the code to scan the default fixture member. */
    beginScan: (walletCode?: string) => void;
    /** Resolve a 6-digit manually typed code (the "Enter your code" fallback). */
    submitManualCode: (code: string) => boolean;
    /** Continue without logging in — the "Get Started" / "Start Order" path. */
    continueAsGuest: () => void;
    signOut: () => void;
    /** Return the kiosk to its attract-loop state ("Start Over"). */
    resetSession: () => void;
    /** Drop the scan back to idle without changing who is signed in. */
    dismissScan: () => void;
}

const KioskSessionContext = createContext<KioskSessionValue | null>(null);

interface KioskSessionProviderProps {
    children: ReactNode;
    /** Seed a signed-in member so stories can start from an authenticated state. */
    initialMember?: Member | null;
    initialMode?: SessionMode;
    /** Which fixture a bare `beginScan()` resolves to. */
    defaultWalletCode?: string;
}

export const KioskSessionProvider = ({
    children,
    initialMember = null,
    initialMode = initialMember ? "authenticated" : "anonymous",
    defaultWalletCode = MEMBERS[0].walletCode,
}: KioskSessionProviderProps) => {
    const [member, setMember] = useState<Member | null>(initialMember);
    const [mode, setMode] = useState<SessionMode>(initialMode);
    const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");

    // Held so a second tap mid-scan cancels the first rather than racing it.
    const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearScanTimer = useCallback(() => {
        if (scanTimer.current) {
            clearTimeout(scanTimer.current);
            scanTimer.current = null;
        }
    }, []);

    const beginScan = useCallback(
        (walletCode: string = defaultWalletCode) => {
            clearScanTimer();
            setScanStatus("scanning");

            scanTimer.current = setTimeout(() => {
                if (walletCode === EXPIRED_WALLET_CODE) {
                    setScanStatus("expired");
                    return;
                }

                const match = findMemberByWalletCode(walletCode);
                if (!match) {
                    setScanStatus("not-found");
                    return;
                }

                setMember(match);
                setMode("authenticated");
                setScanStatus("success");
            }, SCAN_DURATION_MS);
        },
        [clearScanTimer, defaultWalletCode],
    );

    const submitManualCode = useCallback((code: string) => {
        const memberId = MANUAL_ENTRY_CODES[code.trim()];
        const match = MEMBERS.find((entry) => entry.id === memberId);

        if (!match) {
            setScanStatus("not-found");
            return false;
        }

        setMember(match);
        setMode("authenticated");
        setScanStatus("success");
        return true;
    }, []);

    const continueAsGuest = useCallback(() => {
        clearScanTimer();
        setMember(null);
        setMode("guest");
        setScanStatus("idle");
    }, [clearScanTimer]);

    const signOut = useCallback(() => {
        clearScanTimer();
        setMember(null);
        setMode("anonymous");
        setScanStatus("idle");
    }, [clearScanTimer]);

    const resetSession = signOut;

    const dismissScan = useCallback(() => {
        clearScanTimer();
        setScanStatus("idle");
    }, [clearScanTimer]);

    const value = useMemo<KioskSessionValue>(
        () => ({ member, mode, scanStatus, beginScan, submitManualCode, continueAsGuest, signOut, resetSession, dismissScan }),
        [member, mode, scanStatus, beginScan, submitManualCode, continueAsGuest, signOut, resetSession, dismissScan],
    );

    return <KioskSessionContext.Provider value={value}>{children}</KioskSessionContext.Provider>;
};

export const useKioskSession = () => {
    const context = useContext(KioskSessionContext);
    if (!context) {
        throw new Error("useKioskSession must be used inside a <KioskSessionProvider>.");
    }
    return context;
};
