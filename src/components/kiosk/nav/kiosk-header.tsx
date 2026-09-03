"use client";

import { cx } from "@/utils/cx";

interface KioskHeaderProps {
    /** Course/brand logo. Swap for the exported TenFore Golf mark when available. */
    logo?: React.ReactNode;
    temperature?: number;
    windSummary?: string;
    /**
     * "over" floats the header on top of a hero image (white text, no
     * background); "solid" gives it an opaque bar for content screens.
     */
    variant?: "over" | "solid";
    className?: string;
}

/**
 * The persistent top rail: brand mark on the left, live conditions on the
 * right. Conditions are the one piece of ambient information the kiosk always
 * shows — a golfer checks the weather before anything else.
 */
export const KioskHeader = ({ logo, temperature = 74, windSummary = "12mph NE", variant = "over", className }: KioskHeaderProps) => {
    const isOver = variant === "over";

    return (
        <header
            className={cx(
                "flex w-full items-start justify-between px-16 pt-14 pb-6",
                isOver ? "bg-transparent text-white" : "bg-primary text-primary",
                className,
            )}
        >
            <div className="flex items-center">{logo ?? <PlaceholderWordmark isOver={isOver} />}</div>

            <div className={cx("flex flex-col items-end", isOver ? "text-white" : "text-primary")}>
                <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold tabular-nums">{temperature}°</span>
                    {/* Placeholder for the exported weather glyph. */}
                    <span aria-hidden="true" className="text-4xl leading-none">
                        ⛅️
                    </span>
                </div>
                <span className={cx("text-lg", isOver ? "text-white/90" : "text-tertiary")}>Wind: {windSummary}</span>
            </div>
        </header>
    );
};

/**
 * Stand-in for the TenFore Golf wordmark until the Figma export lands.
 * Marked with `data-placeholder-asset` so every unreplaced asset is greppable.
 */
const PlaceholderWordmark = ({ isOver }: { isOver: boolean }) => (
    <div data-placeholder-asset="tenfore-wordmark" className="flex items-center gap-3">
        <div
            className={cx(
                "flex size-12 items-center justify-center rounded-full ring-2",
                isOver ? "text-white ring-white/70" : "text-brand-secondary ring-brand",
            )}
            aria-hidden="true"
        >
            <span className="text-xl font-bold">TF</span>
        </div>
        <div className="flex flex-col leading-none">
            <span className={cx("text-2xl font-semibold tracking-[0.25em]", isOver ? "text-white" : "text-primary")}>TENFORE</span>
            <span className={cx("text-sm tracking-[0.3em]", isOver ? "text-brand-300" : "text-brand-secondary")}>GOLF</span>
        </div>
    </div>
);
