"use client";

import { BrandMark } from "@/components/kiosk/brand-mark";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/order/${file}`);

/**
 * "All set! Good luck and enjoy the round" — the last screen of a session.
 *
 * The whole surface is the dismiss target. There is no button because there is
 * no decision left: any tap ends it, and a user walking away without touching
 * anything gets the same result when the session times out. Making them find a
 * button to leave would be the one place this kiosk asked for a tap it did not
 * need.
 *
 * It closes with the wordmark and an attribution line rather than more chrome.
 * By this point the person has what they came for and the next thing the panel
 * shows is the attract loop, so the screen's job is to hand back gracefully.
 */
export const OrderSuccessfulScreen = ({
    heading = "All set! Good luck and enjoy the round",
    /**
     * Kept as a prop and defaulted to the reference wording, which reads
     * "The selections you have chosen will be removed." — see the story notes.
     */
    subtitle = "The selections you have chosen will be removed.",
    dismissLabel = "Tap anywhere to dismiss",
    attribution = "Experience powered by TenFore Golf",
    onDismiss,
    className,
}: {
    heading?: string;
    subtitle?: string;
    dismissLabel?: string;
    attribution?: string;
    onDismiss?: () => void;
    className?: string;
}) => (
    // A button, not a div with onClick: the entire screen is one control, and
    // it should be reachable and announced as one.
    <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className={cx("flex h-full w-full flex-col items-center pt-[68px] text-center", className)}
    >
        <BrandMark />

        <h1 className="mt-[80px] max-w-[600px] px-16 text-[48px] leading-[1.12] font-bold text-balance text-primary">{heading}</h1>
        {subtitle && <p className="mt-4 px-16 text-[24px] text-tertiary">{subtitle}</p>}

        <img src={ASSET("golf-cart.svg")} alt="" aria-hidden="true" className="mt-[132px] h-[268px] w-[353px] object-contain" />

        <p className="mt-[70px] text-[22px] text-tertiary">{dismissLabel}</p>

        <div className="mt-auto flex flex-col items-center gap-3 pb-[64px]">
            <img src={ASSET("wordmark.svg")} alt="TenFore Golf" className="h-[56px] w-[285px] object-contain" />
            <p className="text-[16px] text-tertiary">{attribution}</p>
        </div>
    </button>
);
