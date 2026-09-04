"use client";

import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * "How to log in" — the three-step explainer.
 *
 * Reached from the wallet drawer or the scan prompt, for the member who has the
 * app but has never used a kiosk.
 *
 * Built as a **screen**, not a full-screen overlay: the reference keeps the
 * persistent Start Over / Log In rail visible at the bottom. That is the right
 * call for this content — a member reading these instructions is being told to
 * scan their wallet, so the wallet drawer has to stay reachable. An overlay
 * that covered it would explain the gesture while hiding its target.
 *
 * Layout is a fixed three-column grid — badge, copy, image — rather than each
 * row laying itself out. The numerals and the images are the two things the eye
 * tracks down the page, so they must sit on hard vertical lines regardless of
 * how many lines of copy a step happens to carry.
 */

const ASSET = (file: string) => assetUrl(`screen-assets/how-to-login/${file}`);

interface Step {
    badge: string;
    image: string;
    title: string;
    /** Rendered under the title. The store badges are one baked-in image. */
    storeBadges?: boolean;
}

const STEPS: Step[] = [
    {
        badge: "step-1-badge.png",
        image: "step-1-image.png",
        title: "Open your TenFore Golf Wallet ID",
        // The exported badge image already carries the "Download the Tenfore
        // Golf App" caption, so the copy must not repeat it.
        storeBadges: true,
    },
    { badge: "step-2-badge.png", image: "step-2-image.png", title: "Scan your code at the kiosk below" },
    { badge: "step-3-badge.png", image: "step-3-image.png", title: "Check out products from your proshop and book a tee time." },
];

export const HowToLogInScreen = ({
    onDismiss,
    dismissLabel = "Ok, I got it",
    className,
}: {
    onDismiss?: () => void;
    dismissLabel?: string;
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col px-8 pt-14", className)}>
        <header className="flex flex-col items-center gap-5">
            <img src={ASSET("hero-logo.png")} alt="" aria-hidden="true" className="size-14" />
            <h1 className="text-5xl font-bold text-primary">How to log in</h1>
        </header>

        <ol className="mt-12 flex flex-col gap-12">
            {STEPS.map((step, index) => (
                <li
                    key={step.title}
                    // Fixed side columns keep the numerals and images on hard
                    // vertical lines; only the copy column flexes.
                    className="grid grid-cols-[80px_1fr_136px] items-center gap-6"
                >
                    <img src={ASSET(step.badge)} alt={`Step ${index + 1}`} className="size-20" />

                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl leading-snug font-bold text-primary">{step.title}</h2>
                        {step.storeBadges && (
                            <img
                                src={ASSET("app-store-badges.png")}
                                alt="Download the TenFore Golf app on the App Store or Google Play"
                                className="w-[274px] max-w-full"
                            />
                        )}
                    </div>

                    <img src={ASSET(step.image)} alt="" aria-hidden="true" className="size-34 justify-self-end" />
                </li>
            ))}
        </ol>

        <div className="mt-auto flex justify-center pt-10 pb-8">
            <KioskKey size="xl" variant="action" span={0} onPress={onDismiss} className="w-[360px]">
                {dismissLabel}
            </KioskKey>
        </div>
    </div>
);
