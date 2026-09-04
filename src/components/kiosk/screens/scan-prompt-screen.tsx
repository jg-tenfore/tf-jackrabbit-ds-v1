"use client";

import { InfoCircle } from "@untitledui/icons";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { useKioskSession } from "@/providers/kiosk-session";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/welcome/${file}`);

/**
 * "Do you want to log in?" — the deliberate decision point in the flow.
 *
 * From `references/flows/1-0-User Account Authentication with New User/Kiosk-3.png`,
 * with the kiosk-and-phone render supplied as an exported @2x graphic.
 *
 * Enter Code and No Thanks are equal-weight buttons rather than a
 * primary/secondary pair. Declining is a legitimate choice at a kiosk — plenty
 * of guests have no pass to scan — and styling it as the lesser option
 * pressures them toward a path they cannot take.
 *
 * The graphic is also the scan target: a member's hand is already at the
 * scanner, so tapping the render triggers the read rather than being decorative.
 */
export const ScanPromptScreen = ({
    courseName = "Sagamore Golf Club",
    onEnterCode,
    onDecline,
    onHowToLogIn,
    className,
}: {
    courseName?: string;
    onEnterCode?: () => void;
    onDecline?: () => void;
    onHowToLogIn?: () => void;
    className?: string;
}) => {
    const { scanStatus, beginScan } = useKioskSession();
    const isScanning = scanStatus === "scanning";
    const hasError = scanStatus === "not-found" || scanStatus === "expired";

    return (
        <div className={cx("flex h-full w-full flex-col items-center px-16 pt-12 text-center", className)}>
            <h1 className="text-[44px] leading-tight font-bold text-balance text-primary">Do you want to log in?</h1>
            <p className="mt-4 max-w-[520px] text-[20px] text-tertiary">Scan your TenFore Golf Wallet below to check in to {courseName}</p>

            <button
                type="button"
                onClick={() => beginScan()}
                aria-label="Simulate scanning your wallet"
                className={cx("mt-6 w-full transition duration-100 ease-linear active:scale-[0.99]", isScanning && "animate-pulse")}
            >
                <img src={ASSET("scan-prompt-hero.png")} alt="" aria-hidden="true" className="w-full" />
            </button>

            <p className="mt-2 min-h-6 text-[16px] text-tertiary" role="status" aria-live="polite">
                {isScanning ? "Reading your wallet…" : hasError ? "We couldn't read that — hold the pass flat and try again" : ""}
            </p>

            <div className="mt-4 flex w-full max-w-[420px] flex-col gap-3">
                <KioskKey size="lg" variant="action" span={0} onPress={onEnterCode} className="w-full text-[22px]">
                    Enter Code
                </KioskKey>
                <KioskKey size="lg" variant="action" span={0} onPress={onDecline} className="w-full text-[22px]">
                    No Thanks
                </KioskKey>
            </div>

            {onHowToLogIn && (
                <button
                    type="button"
                    onClick={onHowToLogIn}
                    className="mt-6 flex items-center gap-3 rounded-xl px-6 py-3 text-[18px] text-primary ring-2 ring-brand transition duration-100 ease-linear active:bg-brand-primary"
                >
                    <InfoCircle className="size-6 text-fg-brand-primary" aria-hidden="true" />
                    How do I Log In?
                </button>
            )}
        </div>
    );
};
