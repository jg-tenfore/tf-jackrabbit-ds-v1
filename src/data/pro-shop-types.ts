/** Shape of the generated pro-shop catalog. See scripts/build-pos-images.mjs. */
export interface ProShopProduct {
    id: string;
    name: string;
    brand: string;
    model: string;
    /** How the item is sold — drives the "12 balls" style subtitle. */
    packaging: "box" | "sleeve" | "single" | "bucket";
    category: string;
    priceCents: number;
    /** Base-relative path. Resolve with `assetUrl()` before rendering. */
    image: string;
    sourceTitle?: string;
    sourceUrl?: string;
    /** How many gallery shots the raw capture holds for this product. */
    galleryCount?: number;
}
