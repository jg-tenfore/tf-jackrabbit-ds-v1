"use client";

import { Fragment } from "react";
import { cx } from "@/utils/cx";

/**
 * A continuously scrolling line of text.
 *
 * Two identical tracks sit side by side and both translate left by exactly
 * their own width, so the moment the first leaves the viewport the second is
 * where it started and the loop is seamless. That only holds while **one track
 * is at least as wide as its container** — a short phrase leaves a visible gap
 * that crosses the screen once per cycle. Repeat the phrases if the line is
 * short rather than reaching for a narrower container.
 *
 * Only the first track is announced. The second is `aria-hidden` because it is
 * the same sentence again, and a screen reader reading the attract loop twice
 * is worse than not reading the duplicate at all.
 *
 * Motion stops entirely under `prefers-reduced-motion`. A kiosk is a public
 * screen — someone with vestibular sensitivity cannot walk away from it as
 * easily as they can close a tab — and the text stays legible standing still.
 */
export const Marquee = ({
    items,
    separator = "·",
    /** One full pass of a track. Slower reads calmer at standing distance. */
    durationMs = 40000,
    className,
}: {
    items: string[];
    separator?: string;
    durationMs?: number;
    className?: string;
}) => {
    const track = (
        <div
            className="flex shrink-0 animate-marquee items-center whitespace-nowrap motion-reduce:animate-none"
            style={{ animationDuration: `${durationMs}ms` }}
        >
            {items.map((item, index) => (
                <Fragment key={index}>
                    <span>{item}</span>
                    <span aria-hidden="true" className="px-4 opacity-60">
                        {separator}
                    </span>
                </Fragment>
            ))}
        </div>
    );

    return (
        <div className={cx("flex w-full overflow-hidden", className)}>
            {track}
            <div aria-hidden="true" className="flex shrink-0">
                {track}
            </div>
        </div>
    );
};
