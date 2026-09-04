"use client";

import { ChevronDown } from "@untitledui/icons";
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
                "flex w-[174px] flex-col items-center justify-center gap-2 px-3 text-center text-white transition duration-100 ease-linear",
                // Expanded, the panel above already carries a large wallet
                // illustration; repeating it in the drawer would say the same
                // thing twice in the same glance. Collapsed, the illustration is
                // the whole affordance, so the card grows to hold it.
                isExpanded ? "h-[114px]" : "h-[214px] rounded-t-2xl",
                hasError ? "bg-error-solid" : "bg-brand-solid active:bg-brand-solid_hover",
                className,
            )}
        >
            {!isExpanded && (
                <img
                    src={ASSET("wallet-small.svg")}
                    alt=""
                    aria-hidden="true"
                    className={cx("h-[88px] w-[174px] shrink-0 object-contain", isScanning && "animate-pulse")}
                />
            )}
            <span className="text-[14px] leading-tight text-white/90">
                {isScanning ? "Reading your wallet…" : hasError ? "Try again" : "Tap your wallet below"}
            </span>
            <span className="text-[27px] leading-none font-bold">{hasError ? "Not recognized" : "Log In"}</span>
            {/* Always points down. It is not a disclosure triangle — it points at
                the physical scanner below the screen, which is where "tap your
                wallet below" is telling the user to reach. */}
            <ChevronDown className="size-8" aria-hidden="true" />
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
    <div
        className={cx(
            "flex h-[100px] w-[174px] flex-col items-center gap-2.5 rounded-2xl bg-primary px-3 pt-6 pb-3 ring-1 ring-border-secondary",
            className,
        )}
    >
        <button
            type="button"
            onClick={onSignOut}
            className="h-[32px] w-full shrink-0 rounded-md bg-error-solid text-[13px] font-semibold text-white transition duration-100 ease-linear active:bg-error-solid_hover"
        >
            Log out
        </button>
        <span className="text-[18px] font-bold text-primary">{firstName}</span>
    </div>
);

/**
 * The expanded sign-in prompt — a full-width green panel above the rail.
 *
 * Full width, not a card: it is the drawer opening out, so it reads as the same
 * surface growing rather than a new object appearing on top of the screen.
 */
export const SignInPrompt = ({
    onHowToLogIn,
    /**
     * Band height. Defaults to the specified 225px.
     *
     * Measured off the annotated export the panel is nearer 300px, and the
     * content is laid out for that proportion — at 225 it is legible but tight.
     * Exposed as a prop so both can be compared rather than one being asserted.
     */
    height = 309,
    className,
}: {
    onHowToLogIn?: () => void;
    height?: number;
    className?: string;
}) => {
    const { scanStatus } = useKioskSession();
    const isScanning = scanStatus === "scanning";
    const hasError = scanStatus === "not-found" || scanStatus === "expired";

    return (
        <div
            className={cx(
                "flex w-full items-center justify-between gap-8 px-16 text-white",
                hasError ? "bg-error-solid" : "bg-brand-solid",
                className,
            )}
            style={{ height }}
            role="status"
            aria-live="polite"
        >
            <div className="flex min-w-0 flex-col gap-2">
                <h2 className="text-[34px] leading-none font-bold">
                    {isScanning ? "Reading your wallet…" : hasError ? "We couldn't read that" : "Scan your code"}
                </h2>
                <p className="text-[18px] text-white/95">
                    {isScanning ? "Hold your pass steady" : hasError ? "Hold the pass flat and try again" : "Use the scanner below to log in"}
                </p>

                {!isScanning && !hasError && (
                    <>
                        {/* Three on the first line, one on the second, as drawn —
                            a plain wrap would break after "Make Purchases". */}
                        <div className="mt-2 flex gap-x-9 text-[14px] whitespace-nowrap text-white/90">
                            <span>Reserve a table</span>
                            <span>Book a tee time</span>
                            <span>Make Purchases</span>
                        </div>
                        <div className="text-[14px] whitespace-nowrap text-white/90">Access to 500+ courses nationwide</div>
                    </>
                )}

                {onHowToLogIn && (
                    <button
                        type="button"
                        onClick={onHowToLogIn}
                        className="mt-6 h-[46px] w-[184px] rounded-lg text-[16px] font-bold ring-1 ring-white ring-inset transition duration-100 ease-linear active:bg-white/15"
                    >
                        How do I Log In?
                    </button>
                )}
            </div>

            <img
                src={ASSET("wallet-large.svg")}
                alt=""
                aria-hidden="true"
                // Fills the band's height rather than a fixed size, so it stays
                // proportional whichever height the panel is set to.
                className="h-[238px] w-[162px] shrink-0 object-contain"
            />
        </div>
    );
};
