"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "@untitledui/icons";
import { useKioskSession } from "@/providers/kiosk-session";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/global-nav/${file}`);

/**
 * The welcome-screen navigation.
 *
 * A separate component from `GlobalNav` rather than a variant of it, because
 * the two share almost nothing beyond the scan wiring: there is no Start Over,
 * no cart, the drawer moves to the left and roughly triples in size, and two
 * large choice cards take the remaining width. Folding this into `GlobalNav`
 * would give one component two unrelated layouts and a `variant` prop that
 * gates nearly every line.
 *
 * The drawer's anatomy also inverts here. On the rail the illustration comes
 * first, because the drawer is small and the picture is what catches the eye.
 * At this size the label leads — "Log In" is the largest text on the panel —
 * and the illustration sits beneath it as support. Same control, different job:
 * on the attract screen it is one of three equally-weighted ways in, not a
 * persistent affordance hanging off the edge.
 *
 * All measurements are taken from `references/build/welcomeScreen/Kiosk.png`,
 * which is @2x (1500x800) of this canvas.
 */
export const WelcomeNav = ({
    onStartOrder,
    onJoinWaitlist,
    /** Copy under the cards. Kept a prop because it is legal-ish text. */
    footnote = "Don't worry — logging in is optional. You can browse and buy as a guest, or connect your wallet now to save activity and check out faster. You can decide later if you want to log in.",
    className,
}: {
    onStartOrder?: () => void;
    onJoinWaitlist?: () => void;
    footnote?: string;
    className?: string;
}) => {
    const { scanStatus, beginScan } = useKioskSession();
    const isScanning = scanStatus === "scanning";
    const hasError = scanStatus === "not-found" || scanStatus === "expired";

    return (
        <nav aria-label="Welcome" className={cx("relative z-50 h-[400px] w-full max-w-full bg-primary px-16 pt-[62px]", className)}>
            <div className="flex h-full gap-[17px]">
                <button
                    type="button"
                    onClick={() => beginScan()}
                    aria-label="Tap your wallet to log in"
                    className={cx(
                        "flex h-full w-[254px] shrink-0 flex-col items-center gap-2 rounded-t-2xl px-6 pt-8 text-center text-white transition duration-100 ease-linear",
                        hasError ? "bg-error-solid" : "bg-brand-solid active:bg-brand-solid_hover",
                    )}
                >
                    <span className="text-[34px] leading-none font-bold">{hasError ? "Try again" : "Log In"}</span>
                    <span className="text-[18px] text-white/95">
                        {isScanning ? "Reading your wallet…" : hasError ? "Hold the pass flat" : "Tap your wallet below"}
                    </span>
                    <img
                        src={ASSET("wallet-large.svg")}
                        alt=""
                        aria-hidden="true"
                        className={cx("mt-2 h-[163px] w-[130px] object-contain", isScanning && "animate-pulse")}
                    />
                    {/* Points down at the physical scanner, not a disclosure caret. */}
                    <ChevronDown className="mt-2 size-9" aria-hidden="true" />
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-[11px]">
                    <WelcomeChoice title="Start Order" subtitle="Continue without logging in" height={132} onPress={onStartOrder} />
                    <WelcomeChoice title="Join Waitlist" subtitle="We'll text you if a tee time opens" height={129} onPress={onJoinWaitlist} />
                    <p className="mt-2 text-[11px] leading-snug text-tertiary">{footnote}</p>
                </div>
            </div>
        </nav>
    );
};

/**
 * One of the two large choice cards.
 *
 * Both are neutral rather than one being brand-filled: logging in, ordering as a
 * guest and joining the waitlist are three legitimate ways into the kiosk, and
 * styling one as primary would push guests toward a path they may not want.
 * The green drawer already reads as the promoted option by colour alone.
 */
const WelcomeChoice = ({
    title,
    subtitle,
    height,
    onPress,
}: {
    title: ReactNode;
    subtitle: ReactNode;
    height: number;
    onPress?: () => void;
}) => (
    <button
        type="button"
        onClick={onPress}
        style={{ height }}
        className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl bg-primary ring-1 ring-border-secondary transition duration-100 ease-linear active:bg-secondary"
    >
        <span className="text-[34px] leading-none font-bold text-primary">{title}</span>
        <span className="text-[18px] text-tertiary">{subtitle}</span>
    </button>
);
