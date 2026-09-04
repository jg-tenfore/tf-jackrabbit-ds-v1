"use client";

import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/welcome/${file}`);

/**
 * "Log in below for everything for your round" — the wallet interstitial.
 *
 * From `references/flows/3-bookTeeTime/🟢 Interstitial.png`.
 *
 * The whole hero is one exported @2x graphic rather than markup, because the
 * phone render and its copy are laid out together as a single composition —
 * the text is positioned against the device, not flowed beside it. Splitting
 * them apart would mean re-deriving that relationship in CSS and drifting from
 * the export for no gain, since none of it is dynamic.
 *
 * It pairs with `WelcomeNav`, not the rail: this is an attract-flow screen
 * where logging in, ordering as a guest and joining the waitlist are three
 * equal ways forward.
 */
export const WalletInterstitialScreen = ({ className }: { className?: string }) => (
    <div className={cx("flex h-full w-full flex-col", className)}>
        <img
            src={ASSET("wallet-interstitial.png")}
            alt="Log in below for everything for your round. Redeem points on the TenFore Golf app."
            className="w-full"
        />
    </div>
);
