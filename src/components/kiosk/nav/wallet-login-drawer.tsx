"use client";

import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "@untitledui/icons";
import { useKioskSession } from "@/providers/kiosk-session";
import { cx } from "@/utils/cx";

interface WalletLoginDrawerProps {
    isExpanded: boolean;
    onExpandedChange: (next: boolean) => void;
    /** Opens the "How to log in" explainer sheet. */
    onHowToLogIn?: () => void;
    className?: string;
}

/**
 * The green wallet drawer pinned to the bottom-right of every screen.
 *
 * It is the kiosk's single, always-present entry point to authentication:
 * collapsed it reads "Tap your wallet below"; expanded it reveals the scan
 * banner and the explainer link. Because it lives in the footer rail it never
 * moves between screens, so a member learns one target and reuses it.
 *
 * Scan state comes from `KioskSessionProvider` — the drawer renders the machine,
 * it does not own it, so the same states are reachable from any screen.
 */
export const WalletLoginDrawer = ({ isExpanded, onExpandedChange, onHowToLogIn, className }: WalletLoginDrawerProps) => {
    const { scanStatus, beginScan, member, mode } = useKioskSession();

    const isAuthenticated = mode === "authenticated" && member;
    const isScanning = scanStatus === "scanning";
    const hasScanError = scanStatus === "not-found" || scanStatus === "expired";

    const handleTap = () => {
        if (isAuthenticated) return;

        // Tapping the collapsed drawer both opens it and simulates the wallet
        // read, matching the single-tap gesture on hardware.
        if (!isExpanded) onExpandedChange(true);
        beginScan();
    };

    return (
        <div className={cx("flex flex-col items-end", className)}>
            {isExpanded && !isAuthenticated && (
                <ScanBanner scanStatus={scanStatus} onHowToLogIn={onHowToLogIn} />
            )}

            <button
                type="button"
                onClick={handleTap}
                aria-expanded={isExpanded}
                aria-label={isAuthenticated ? `Signed in as ${member.firstName}` : "Tap your wallet to log in"}
                className={cx(
                    "flex w-[232px] flex-col items-center gap-1 px-6 pt-4 pb-5 transition duration-100 ease-linear",
                    isAuthenticated ? "bg-secondary text-primary" : "bg-brand-solid text-white active:bg-brand-solid_hover",
                    hasScanError && "bg-error-solid",
                )}
            >
                {isAuthenticated ? (
                    <>
                        <CheckCircle className="size-6 text-fg-success-secondary" aria-hidden="true" />
                        <span className="text-xl font-semibold">{member.firstName}</span>
                    </>
                ) : (
                    <>
                        <span className="text-sm text-white/90">
                            {isScanning ? "Reading your wallet…" : hasScanError ? "Try again" : "Tap your wallet below"}
                        </span>
                        <span className="text-2xl font-semibold">{hasScanError ? "Not recognized" : "Log In"}</span>
                        {isExpanded ? <ChevronDown className="size-6" aria-hidden="true" /> : <ChevronUp className="size-6" aria-hidden="true" />}
                    </>
                )}
            </button>
        </div>
    );
};

/**
 * The green banner the drawer expands into. Doubles as the scan-progress
 * surface so a member's eye never has to move during the scan.
 */
const ScanBanner = ({ scanStatus, onHowToLogIn }: { scanStatus: string; onHowToLogIn?: () => void }) => {
    const isScanning = scanStatus === "scanning";
    const isError = scanStatus === "not-found" || scanStatus === "expired";

    return (
        <div
            className={cx(
                "flex w-[750px] items-center justify-between gap-6 px-16 py-10 text-white",
                isError ? "bg-error-solid" : "bg-brand-solid",
            )}
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col gap-3">
                <h2 className="text-4xl font-bold">
                    {isScanning ? "Reading your wallet…" : isError ? "We couldn't read that" : "Scan your code"}
                </h2>
                <p className="text-lg text-white/90">
                    {isScanning
                        ? "Hold your pass steady over the scanner"
                        : isError
                          ? "Hold the pass flat against the scanner and try again"
                          : "Use the scanner below to log in"}
                </p>

                {!isScanning && !isError && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/80">
                        <span>Reserve a table</span>
                        <span>Book a tee time</span>
                        <span>Make purchases</span>
                        <span>Access to 500+ courses nationwide</span>
                    </div>
                )}

                {onHowToLogIn && (
                    <button
                        type="button"
                        onClick={onHowToLogIn}
                        className="mt-2 w-fit rounded-lg px-5 py-3 text-base font-semibold ring-1 ring-white/70 ring-inset transition duration-100 ease-linear active:bg-white/15"
                    >
                        How do I Log In?
                    </button>
                )}
            </div>

            <div data-placeholder-asset="wallet-in-hand-illustration" className="flex size-32 shrink-0 items-center justify-center rounded-2xl ring-2 ring-white/60">
                {isError ? <AlertTriangle className="size-14" aria-hidden="true" /> : <PhoneGlyph isScanning={isScanning} />}
            </div>
        </div>
    );
};

const PhoneGlyph = ({ isScanning }: { isScanning: boolean }) => (
    <div className={cx("flex h-20 w-12 items-center justify-center rounded-lg ring-2 ring-white", isScanning && "animate-pulse")} aria-hidden="true">
        <span className="text-xl font-bold">TF</span>
    </div>
);
