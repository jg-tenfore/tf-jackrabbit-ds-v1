import type { MenuItem } from "@/data/menu-catalog";

/**
 * Range ball buckets, as the kiosk sells them.
 *
 * Kept apart from the generated pro-shop catalogue on purpose. That file is
 * rebuilt from a raw product capture by `scripts/build-pos-images.mjs`, and its
 * two bucket rows carry a home practice-net photo from that capture, so editing
 * them in place would be undone on the next run. The prices match it (small
 * $12, large $18), with a medium between.
 *
 * A bucket is a `MenuItem` so it drops into the same cart, review and checkout
 * screens as a sandwich — a range purchase is one more line on an order, not a
 * separate checkout.
 */
export interface RangeBucket extends MenuItem {
    /** Size word used on its own on the picker card. */
    size: "Small" | "Medium" | "Large";
    /** Roughly how many balls the machine dispenses for this bucket. */
    ballCount: number;
}

const bucket = (size: RangeBucket["size"], ballCount: number, priceCents: number): RangeBucket => {
    const id = `range-bucket-${size.toLowerCase()}`;
    return {
        id,
        name: `${size} Bucket`,
        brand: "",
        model: `${size} Bucket`,
        packaging: "bucket",
        category: "range",
        priceCents,
        image: `screen-assets/range/${id}.webp`,
        size,
        ballCount,
        detail: `About ${ballCount} balls`,
    };
};

export const RANGE_BUCKETS: RangeBucket[] = [bucket("Small", 40, 1200), bucket("Medium", 80, 1500), bucket("Large", 120, 1800)];

/** "About 120 balls" — approximate, because a machine dispenses by weight. */
export const ballCountLabel = (b: RangeBucket) => `About ${b.ballCount} balls`;

/**
 * Anything the range sells beside a single bucket — the cards a busier range
 * adds to the same grid. Each carries the line its detail sheet shows under
 * the price, since none of them is described by a ball count alone.
 */
export interface RangeExtra extends MenuItem {
    note: string;
    /** Ball codes one of these issues — four for a party pack, none for a card. */
    codes?: number;
}

const extra = (
    id: string,
    name: string,
    priceCents: number,
    detail: string,
    note: string,
    packaging: MenuItem["packaging"] = "single",
    codes?: number,
): RangeExtra => ({
    id,
    name,
    brand: "",
    model: name,
    packaging,
    category: "range",
    priceCents,
    image: `screen-assets/range/${id}.webp`,
    detail,
    note,
    codes,
});

/** Sample extras: a group pack, a gift card and a punch card. Prices are placeholders. */
export const RANGE_EXTRAS: RangeExtra[] = [
    extra(
        "range-party-pack",
        "Party Pack",
        6000,
        "4 large buckets · save $12",
        "Four large buckets, four ball codes — about 480 balls for the group.",
        "bucket",
    ),
    extra("range-gift-card", "Range Gift Card", 2500, "Sent by email", "A $25 range card, emailed to you or a friend. Good for any bucket."),
    extra("range-punch-card", "Punch Card", 15000, "10 large buckets · save $30", "Ten large buckets, one punched each visit. Never expires."),
];

/** The six-card range: the three sizes and the three extras. */
export const RANGE_MENU_FULL: (RangeBucket | RangeExtra)[] = [...RANGE_BUCKETS, ...RANGE_EXTRAS];

/** The line under the price on an item's detail sheet. */
export const rangeItemNote = (item: RangeBucket | RangeExtra) =>
    "ballCount" in item ? `${ballCountLabel(item)} · each bucket gets its own ball code` : item.note;

/** Ball codes one unit of an item issues: one per bucket, set per extra. */
export const codesPerUnit = (item: RangeBucket | RangeExtra) => ("ballCount" in item ? 1 : (item.codes ?? 0));
