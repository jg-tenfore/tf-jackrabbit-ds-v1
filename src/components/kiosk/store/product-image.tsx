"use client";

import { useState } from "react";
import { Image01 } from "@untitledui/icons";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

/**
 * Renders a catalog image, resolving its path against the deploy base.
 *
 * Always use this rather than a bare `<img src={product.image}>`: catalog paths
 * are stored base-relative precisely so they survive being served from
 * `/tf-jackrabbit-ds-v1/` on GitHub Pages, and `assetUrl` is what applies that.
 *
 * It also owns the missing-image case. A kiosk that shows a broken-image glyph
 * on the shop grid looks unattended, and product photography is the one asset
 * class most likely to be incomplete while a catalog is being built out — so
 * the fallback is a deliberate, on-brand empty state rather than the browser's.
 */
export const ProductImage = ({
    src,
    alt,
    className,
    imgClassName,
}: {
    /** Base-relative path from the catalog, e.g. "pos-images/pro-shop/x.webp". */
    src?: string;
    alt: string;
    className?: string;
    imgClassName?: string;
}) => {
    const [hasFailed, setHasFailed] = useState(false);
    const showFallback = !src || hasFailed;

    return (
        <div className={cx("flex items-center justify-center overflow-hidden bg-primary", className)}>
            {showFallback ? (
                <div
                    data-placeholder-asset="product-photo"
                    className="flex size-full flex-col items-center justify-center gap-2 bg-secondary text-quaternary"
                    role="img"
                    aria-label={`${alt} — image unavailable`}
                >
                    <Image01 className="size-10" aria-hidden="true" />
                </div>
            ) : (
                <img
                    src={assetUrl(src)}
                    alt={alt}
                    onError={() => setHasFailed(true)}
                    // Product shots are pack shots on white, so contain (not
                    // cover) — cropping a box of golf balls loses the label,
                    // which is the only thing distinguishing one from the next.
                    className={cx("size-full object-contain", imgClassName)}
                    loading="lazy"
                />
            )}
        </div>
    );
};
