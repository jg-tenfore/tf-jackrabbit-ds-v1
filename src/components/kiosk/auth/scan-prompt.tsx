"use client";

import { InfoCircle } from "@untitledui/icons";
import { useKioskSession } from "@/providers/kiosk-session";
import { cx } from "@/utils/cx";

interface ScanPromptProps {
    courseName?: string;
    onEnterCode?: () => void;
    onDecline?: () => void;
    onHowToLogIn?: () => void;
    className?: string;
}

/**
 * The full-screen "Do you want to log in?" interstitial.
 *
 * This is the deliberate decision point in the flow: a member scans, everyone
 * else declines. Both paths are presented as equal-weight buttons rather than a
 * primary/secondary pair — declining is a legitimate choice at a kiosk, and
 * styling it as the lesser option pressures guests who have no pass to scan.
 */
export const ScanPrompt = ({ courseName = "Sagamore Golf Club", onEnterCode, onDecline, onHowToLogIn, className }: ScanPromptProps) => {
    const { scanStatus, beginScan } = useKioskSession();
    const isScanning = scanStatus === "scanning";
    const hasError = scanStatus === "not-found" || scanStatus === "expired";

    return (
        <div className={cx("flex h-full flex-col items-center px-16 pt-16 text-center", className)}>
            <div data-placeholder-asset="tenfore-mark" className="mb-8 flex size-14 items-center justify-center rounded-full text-brand-secondary ring-2 ring-brand">
                <span className="text-lg font-bold">TF</span>
            </div>

            <h1 className="text-5xl font-bold text-primary">Do you want to log in?</h1>
            <p className="mt-6 max-w-[520px] text-xl text-tertiary">
                Scan your TenFore Golf Wallet below to check in to {courseName}
            </p>

            {/* Tapping the illustration is the same gesture as tapping the drawer —
                a member's hand is already at the scanner, so both are live. */}
            <button
                type="button"
                onClick={() => beginScan()}
                aria-label="Simulate scanning your wallet"
                data-placeholder-asset="kiosk-and-phone-render"
                className={cx(
                    "mt-12 flex h-[300px] w-[400px] items-center justify-center rounded-2xl bg-secondary ring-1 ring-border-secondary transition duration-100 ease-linear active:scale-[0.99]",
                    isScanning && "animate-pulse ring-2 ring-brand",
                    hasError && "ring-2 ring-error",
                )}
            >
                <span className="text-lg text-tertiary">
                    {isScanning ? "Reading your wallet…" : hasError ? "Not recognized — tap to retry" : "Tap to simulate a wallet scan"}
                </span>
            </button>

            <div className="mt-10 flex w-full max-w-[420px] flex-col gap-4">
                <button
                    type="button"
                    onClick={onEnterCode}
                    className="h-20 rounded-xl text-2xl font-semibold text-primary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                >
                    Enter Code
                </button>
                <button
                    type="button"
                    onClick={onDecline}
                    className="h-20 rounded-xl text-2xl font-semibold text-primary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                >
                    No Thanks
                </button>
            </div>

            {onHowToLogIn && (
                <button
                    type="button"
                    onClick={onHowToLogIn}
                    className="mt-10 flex items-center gap-3 rounded-xl px-6 py-4 text-xl text-primary ring-2 ring-brand transition duration-100 ease-linear active:bg-brand-primary"
                >
                    <InfoCircle className="size-6 text-fg-brand-primary" aria-hidden="true" />
                    How do I Log In?
                </button>
            )}
        </div>
    );
};
