"use client";

import { ChevronDown, ChevronUp } from "@untitledui/icons";
import { useKioskSession } from "@/providers/kiosk-session";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/global-nav/${file}`);

/**
 * The wallet drawer pinned to the bottom-right of every screen.
 *
 * Anatomy is fixed by the reference and worth stating, because it is the
 * opposite of the usual button ordering: the illustration comes **first**, then
 * the instruction, then the label, then the chevron. A user glancing at the
 * bottom-right sees a hand holding a phone before they read anything — which is
 * the whole point, since the gesture is what they need to perform and the words
 * only confirm it.
 *
 * The card is taller than the rail and sits proud of it, so it reads as a
 * physical tab attached to the scanner rather than another button in a row.
 */
export const WalletDrawer = ({
    isExpanded,
    onExpandedChange,
    className,
}: {
    isExpanded: boolean;
    onExpandedChange: (next: boolean) => void;
    className?: string;
}) => {
    const { scanStatus, beginScan } = useKioskSession();
    const isScanning = scanStatus === "scanning";
    const hasError = scanStatus === "not-found" || scanStatus === "expired";

    return (
        <button
            type="button"
            onClick={() => {
                if (!isExpanded) onExpandedChange(true);
                beginScan();
            }}
            aria-expanded={isExpanded}
            aria-label="Tap your wallet to log in"
            className={cx(
                "flex w-[232px] flex-col items-center gap-2 rounded-t-2xl px-6 pt-5 pb-4 text-white transition duration-100 ease-linear",
                hasError ? "bg-error-solid" : "bg-brand-solid active:bg-brand-solid_hover",
                className,
            )}
        >
            <img
                src={ASSET("wallet-small.png")}
                alt=""
                aria-hidden="true"
                className={cx("h-[88px] w-[174px] object-contain", isScanning && "animate-pulse")}
            />
            <span className="text-sm text-white/90">
                {isScanning ? "Reading your wallet…" : hasError ? "Try again" : "Tap your wallet below"}
            </span>
            <span className="text-2xl leading-none font-bold">{hasError ? "Not recognized" : "Log In"}</span>
            {isExpanded ? <ChevronUp className="size-7" aria-hidden="true" /> : <ChevronDown className="size-7" aria-hidden="true" />}
        </button>
    );
};

/**
 * The signed-in replacement for the drawer.
 *
 * A white card rather than a green one: once you are logged in the drawer has
 * no job left to advertise, so it stops competing with the brand colour and
 * becomes an identity chip. Log out is red because it is the only destructive
 * control on the rail and it sits where the user's thumb already is.
 */
export const SignedInCard = ({ firstName, onSignOut, className }: { firstName: string; onSignOut?: () => void; className?: string }) => (
    <div className={cx("flex w-[232px] flex-col items-center gap-3 rounded-t-2xl bg-primary px-5 pt-5 pb-4 ring-1 ring-border-secondary", className)}>
        <button
            type="button"
            onClick={onSignOut}
            className="h-16 w-full rounded-lg bg-error-solid text-xl font-semibold text-white transition duration-100 ease-linear active:bg-error-solid_hover"
        >
            Log out
        </button>
        <span className="text-xl font-bold text-primary">{firstName}</span>
    </div>
);

/**
 * The expanded sign-in prompt — a full-width green panel above the rail.
 *
 * Full width, not a card: it is the drawer opening out, so it reads as the same
 * surface growing rather than a new object appearing on top of the screen.
 */
export const SignInPrompt = ({ onHowToLogIn, className }: { onHowToLogIn?: () => void; className?: string }) => {
    const { scanStatus } = useKioskSession();
    const isScanning = scanStatus === "scanning";
    const hasError = scanStatus === "not-found" || scanStatus === "expired";

    return (
        <div
            className={cx("flex w-full items-center justify-between gap-6 px-12 py-10 text-white", hasError ? "bg-error-solid" : "bg-brand-solid", className)}
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col gap-3">
                <h2 className="text-5xl font-bold">{isScanning ? "Reading your wallet…" : hasError ? "We couldn't read that" : "Scan your code"}</h2>
                <p className="text-xl text-white/90">
                    {isScanning ? "Hold your pass steady" : hasError ? "Hold the pass flat and try again" : "Use the scanner below to log in"}
                </p>

                {!isScanning && !hasError && (
                    <div className="mt-1 flex max-w-[420px] flex-wrap gap-x-8 gap-y-1 text-base text-white/85">
                        <span>Reserve a table</span>
                        <span>Book a tee time</span>
                        <span>Make Purchases</span>
                        <span>Access to 500+ courses nationwide</span>
                    </div>
                )}

                {onHowToLogIn && (
                    <button
                        type="button"
                        onClick={onHowToLogIn}
                        className="mt-3 h-16 w-fit rounded-lg px-6 text-lg font-bold ring-1 ring-white/80 ring-inset transition duration-100 ease-linear active:bg-white/15"
                    >
                        How do I Log In?
                    </button>
                )}
            </div>

            <img src={ASSET("wallet-large.png")} alt="" aria-hidden="true" className="h-[208px] w-[174px] shrink-0 object-contain" />
        </div>
    );
};
