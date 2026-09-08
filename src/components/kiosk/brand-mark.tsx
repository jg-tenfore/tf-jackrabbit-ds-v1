import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * The TenFore antler mark that opens most kiosk screens.
 *
 * Purely decorative — every screen that shows it also states where the user is
 * in words directly underneath, so announcing it would only make a screen
 * reader read the brand twice before reaching the actual heading.
 *
 * It exists as a component rather than three `<img>` tags because the entry
 * screens, the welcome flow and the full-screen modals had already started
 * disagreeing about its size.
 */
export const BrandMark = ({ className }: { className?: string }) => (
    <img src={assetUrl("screen-assets/brand/hero-logo.svg")} alt="" aria-hidden="true" className={cx("size-12 shrink-0", className)} />
);
