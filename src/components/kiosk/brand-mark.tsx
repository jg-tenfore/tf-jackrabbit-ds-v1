"use client";

import { useCourseBrand } from "@/providers/course-brand";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * The mark that opens most kiosk screens — TenFore's antler mark, or the
 * course's own when the kiosk is branded (see `CourseBrandProvider`).
 *
 * Purely decorative — every screen that shows it also states where the user is
 * in words directly underneath, so announcing it would only make a screen
 * reader read the brand twice before reaching the actual heading.
 *
 * It exists as a component rather than three `<img>` tags because the entry
 * screens, the welcome flow and the full-screen modals had already started
 * disagreeing about its size.
 *
 * A course mark brings its own size rather than taking TenFore's 48px square:
 * the size *replaces* the default instead of merging with it, because `size-12`
 * and a course's `h-16 w-auto` are not one class group and would both apply.
 */
export const BrandMark = ({ className }: { className?: string }) => {
    const brand = useCourseBrand();

    return (
        <img
            src={assetUrl(brand?.mark.src ?? "screen-assets/brand/hero-logo.svg")}
            alt=""
            aria-hidden="true"
            className={cx("shrink-0 object-contain", brand?.mark.className ?? "size-12", className)}
        />
    );
};
