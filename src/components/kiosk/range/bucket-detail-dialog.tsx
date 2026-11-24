"use client";

import { ProductDetailDialog } from "@/components/kiosk/modals/dialog-variants";
import { MAX_BALL_CODES } from "@/components/kiosk/range/ball-code-screen";
import { ProductImage } from "@/components/kiosk/store/product-image";
import { type RangeBucket, type RangeExtra, codesPerUnit, rangeItemNote } from "@/data/range-catalog";

/**
 * The item detail sheet for anything on the range grid — the same one a bottle
 * of water opens: photo, price, quantity, Add. The line under the price says
 * what the item is: for a bucket, its size and that each gets its own code;
 * for a pack, gift card or punch card, what you get.
 */
export const BucketDetailDialog = ({ item, onClose, onAdd }: { item: RangeBucket | RangeExtra; onClose: () => void; onAdd?: (quantity: number) => void }) => (
    <ProductDetailDialog
        isOpen
        onOpenChange={(isOpen) => !isOpen && onClose()}
        name={item.name}
        priceCents={item.priceCents}
        subtitle={rangeItemNote(item)}
        // A purchase shows at most six ball codes, so the stepper stops where
        // the codes would run out: six buckets, or one four-bucket party pack.
        maxQuantity={codesPerUnit(item) ? Math.floor(MAX_BALL_CODES / codesPerUnit(item)) : undefined}
        imageSlot={<ProductImage src={item.image} alt={item.name} className="size-48" imgClassName="object-contain" />}
        onConfirm={(quantity) => {
            onAdd?.(quantity);
            onClose();
        }}
    />
);
