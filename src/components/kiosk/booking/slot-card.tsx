"use client";

import { Car01, Flag01, Users01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export interface TeeTimeSlot {
    id: string;
    /** Display time, e.g. "6:06 AM". */
    time: string;
    /** Rate name, e.g. "18 Holes". */
    rateName: string;
    priceCents: number;
    holes: 9 | 18;
    /** Player range the rate admits, e.g. [2, 4]. */
    players: [number, number];
    transport: "cart" | "walking";
    isAvailable?: boolean;
}

/**
 * A bookable tee time.
 *
 * Price is split into dollars and a superscript cents pair, matching the
 * references. That is not decoration: it lets the dollar figure carry the
 * largest type on the card, which is the number a golfer actually scans for
 * when reading a grid of twenty slots at arm's length.
 */
export const SlotCard = ({
    slot,
    isSelected = false,
    onSelect,
    className,
}: {
    slot: TeeTimeSlot;
    isSelected?: boolean;
    onSelect?: () => void;
    className?: string;
}) => {
    const isAvailable = slot.isAvailable !== false;
    const dollars = Math.floor(slot.priceCents / 100);
    const cents = String(slot.priceCents % 100).padStart(2, "0");

    return (
        <button
            type="button"
            disabled={!isAvailable}
            onClick={onSelect}
            aria-pressed={isSelected}
            className={cx(
                "flex w-full flex-col gap-2 rounded-xl bg-primary p-4 text-left ring-1 ring-border-secondary transition duration-100 ease-linear",
                isAvailable ? "active:bg-secondary" : "cursor-not-allowed opacity-50",
                isSelected && "ring-2 ring-brand",
                className,
            )}
        >
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl font-semibold text-primary">{slot.rateName}</span>
                <span className="text-xl font-semibold text-primary tabular-nums">{slot.time}</span>
            </div>

            <div className="flex items-end justify-between gap-2">
                <SlotMeta slot={slot} />
                {/* shrink-0 so the price never yields width to the meta line —
                    without it the two overlap once the meta wraps wide. */}
                <span className="shrink-0 text-2xl font-bold text-primary tabular-nums">
                    ${dollars}
                    <sup className="text-sm font-semibold">{cents}</sup>
                </span>
            </div>
        </button>
    );
};

/** The compact "2-4 · 18 · cart" line. */
export const SlotMeta = ({ slot }: { slot: TeeTimeSlot }) => (
    <div className="flex min-w-0 items-center gap-1 overflow-hidden text-xs whitespace-nowrap text-tertiary">
        <Users01 className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">
            {slot.players[0]}-{slot.players[1]}
        </span>
        <span aria-hidden="true">·</span>
        <Flag01 className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">{slot.holes}</span>
        <span aria-hidden="true">·</span>
        {slot.transport === "cart" ? (
            <Car01 className="size-3.5 shrink-0" aria-label="Cart" />
        ) : (
            <Flag01 className="size-3.5 shrink-0" aria-label="Walking" />
        )}
    </div>
);

/**
 * A start time with no rate attached — the simulator and pickleball grid.
 *
 * Activities price by duration rather than per slot, so the card carries only
 * the time. Three columns of these fit the canvas at a comfortable size, which
 * is why the activity grid reads so differently from the tee sheet.
 */
export const TimeSlotCard = ({
    time,
    isSelected = false,
    isAvailable = true,
    onSelect,
}: {
    time: string;
    isSelected?: boolean;
    isAvailable?: boolean;
    onSelect?: () => void;
}) => (
    <button
        type="button"
        disabled={!isAvailable}
        onClick={onSelect}
        aria-pressed={isSelected}
        className={cx(
            "flex h-20 w-full items-center justify-center rounded-xl bg-primary text-xl font-medium tabular-nums ring-1 ring-border-secondary transition duration-100 ease-linear",
            isAvailable ? "text-primary active:bg-secondary" : "cursor-not-allowed text-quaternary opacity-60",
            isSelected && "bg-brand-primary text-brand-secondary ring-2 ring-brand",
        )}
    >
        {time}
    </button>
);
