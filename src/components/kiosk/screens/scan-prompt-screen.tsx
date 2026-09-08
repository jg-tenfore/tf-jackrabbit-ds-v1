"use client";

import { BrandMark } from "@/components/kiosk/brand-mark";
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
 * This screen carries **no global nav**. Everywhere else the rail is right,
 * because the user is inside a task and needs a way out of it; here the whole
 * screen *is* the way out, and the rail's wallet drawer would offer a third
 * route to log in alongside the scan target and Enter Code — on the one screen
 * whose entire job is to make that choice feel simple. So Start Over drops down
 * into the screen as the fourth button and the chrome goes away.
 *
 * The four buttons are deliberately not a primary/secondary ladder. Declining
 * is a legitimate choice at a kiosk — plenty of guests have no pass to scan —
 * and styling No Thanks as the lesser option pressures them toward a path they
 * cannot take. Weight comes from size and order instead: the two real choices
 * are large and identical, help is smaller, Start Over smaller still.
 *
 * The graphic is also the scan target: a member's hand is already at the
 * scanner, so tapping the render triggers the read rather than being decorative.
 */
export const ScanPromptScreen = ({
    courseName = "Sagamore Golf Club",
    onEnterCode,
    onDecline,
    onHowToLogIn,
    onStartOver,
    className,
}: {
    courseName?: string;
    onEnterCode?: () => void;
    onDecline?: () => void;
    onHowToLogIn?: () => void;
    onStartOver?: () => void;
    className?: string;
}) => {
    const { scanStatus, beginScan, resetSession } = useKioskSession();
    const isScanning = scanStatus === "scanning";
    const hasError = scanStatus === "not-found" || scanStatus === "expired";

    const handleStartOver = () => {
        resetSession();
        onStartOver?.();
    };

    return (
        // Padding lives on the individual bands rather than the column, so the
        // hero can run the full width of the canvas as it does in the reference
        // while the text and buttons stay inset.
        <div className={cx("flex h-full w-full flex-col items-center pt-[68px] text-center", className)}>
            <BrandMark />

            <h1 className="mt-6 px-16 text-[54px] leading-[1.08] font-bold text-balance text-primary">Do you want to log in?</h1>
            {/* Sized to hold the subtitle on two lines, as drawn. The measure is
                the max-width itself — no horizontal padding — because padding
                inside it eats the very width being set and quietly pushed the
                copy onto a third line. */}
            <p className="mt-5 max-w-[540px] text-[27px] leading-snug text-tertiary">
                Scan your TenFore Golf Wallet below to check in to {courseName}
            </p>

            <button
                type="button"
                onClick={() => beginScan()}
                aria-label="Simulate scanning your wallet"
                className={cx("mt-2 w-full transition duration-100 ease-linear active:scale-[0.99]", isScanning && "animate-pulse")}
            >
                <img src={ASSET("scan-prompt-hero.png")} alt="" aria-hidden="true" className="w-full" />
            </button>

            <p className="min-h-5 text-[16px] text-tertiary" role="status" aria-live="polite">
                {isScanning ? "Reading your wallet…" : hasError ? "We couldn't read that — hold the pass flat and try again" : ""}
            </p>

            <div className="flex w-full max-w-[415px] flex-col gap-4">
                <ChoiceButton onPress={onEnterCode}>Enter Code</ChoiceButton>
                <ChoiceButton onPress={onDecline}>No Thanks</ChoiceButton>
            </div>

            {/* Pushes help and Start Over to the bottom of whatever height is
                left, so the block above stays put when the status line changes
                between empty, scanning and error. */}
            <div className="mt-auto flex w-full flex-col items-center gap-14 pb-16">
                {onHowToLogIn && (
                    <button
                        type="button"
                        onClick={onHowToLogIn}
                        className="flex h-[62px] w-[303px] items-center justify-center gap-3 rounded-xl text-[24px] text-secondary ring-1 ring-border-secondary ring-inset transition duration-100 ease-linear active:bg-secondary"
                    >
                        <InfoBadge />
                        How do I Log In?
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleStartOver}
                    className="h-[79px] w-[501px] rounded-xl text-[24px] text-tertiary ring-1 ring-border-secondary ring-inset transition duration-100 ease-linear active:bg-secondary"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
};

/**
 * The two equal-weight choices.
 *
 * Not a `KioskKey`: those are sized off the keyboard's `KEY_SIZES` scale, which
 * exists to make a 10-column QWERTY row land exactly on the canvas. These two
 * are the only thing on the screen and are drawn taller than any key in the
 * reference, so borrowing that scale would mean overriding the one property it
 * exists to set.
 */
const ChoiceButton = ({ children, onPress }: { children: string; onPress?: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        className="h-[86px] w-full rounded-xl bg-primary text-[30px] font-bold text-primary ring-1 ring-border-secondary ring-inset transition duration-75 ease-linear active:scale-[0.98] active:bg-secondary"
    >
        {children}
    </button>
);

/**
 * The filled blue info dot, drawn rather than taken from the icon set.
 *
 * `InfoCircle` is outlined and inherits the button's text colour; the reference
 * wants a solid blue disc with a white glyph, which is a different mark, not a
 * restyled one. Blue also does real work here — it is the only non-brand accent
 * on the screen, so the help affordance never reads as a third green choice.
 */
const InfoBadge = () => (
    <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[17px] font-bold text-white">
        i
    </span>
);
