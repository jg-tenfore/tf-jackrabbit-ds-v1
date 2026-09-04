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
 * The three steps are the **exported layout image**, not markup. They are a
 * fixed piece of instructional artwork — the numerals, illustrations and store
 * badges are laid out as one composition and never reflow, respond, or take
 * dynamic content — so rebuilding them as a grid would only reintroduce drift
 * against the export for no benefit. It is authored at 750px, the exact canvas
 * width, so it sits edge to edge with no scaling.
 *
 * The title and the dismiss action stay as markup: they are the parts that are
 * translatable and interactive.
 *
 * Built as a screen rather than a full-screen overlay, because a member reading
 * these instructions is being told to scan their wallet — the nav rail's drawer
 * has to stay reachable. An overlay would explain the gesture while hiding its
 * target.
 */

const ASSET = (file: string) => assetUrl(`screen-assets/how-to-login/${file}`);

export const HowToLogInScreen = ({
    onDismiss,
    dismissLabel = "Ok, I got it",
    className,
}: {
    onDismiss?: () => void;
    dismissLabel?: string;
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col pt-12", className)}>
        <header className="flex flex-col items-center gap-4">
            <img src={ASSET("hero-logo.svg")} alt="" aria-hidden="true" className="size-14" />
            <h1 className="text-5xl font-bold text-primary">How to log in</h1>
        </header>

        {/* Authored at exactly 750px, so it spans the canvas with no scaling. */}
        <img
            src={ASSET("steps.png")}
            alt="Step 1: open your TenFore Golf Wallet ID, available on the App Store and Google Play. Step 2: scan your code at the kiosk below. Step 3: check out products from your proshop and book a tee time."
            className="mt-8 w-full"
        />

        <div className="mt-auto flex justify-center pt-6 pb-10">
            <KioskKey size="xl" variant="action" span={0} onPress={onDismiss} className="w-[360px]">
                {dismissLabel}
            </KioskKey>
        </div>
    </div>
);
