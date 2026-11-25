"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/utils/cx";

/**
 * A vertical scroll area whose bottom edge fades to white while there is more
 * below, instead of slicing a row of cards in half.
 *
 * A hard clip reads as broken: a half card looks like a layout bug, not a cue
 * to scroll. The fade says "more" without a scrollbar (kiosks hide them), and
 * it only shows while it is true — never on a list that fits, and gone once
 * the last row is in view, so the final cards are never left under it.
 *
 * `className` places the area in its parent (margins, flex); `contentClassName`
 * styles what scrolls inside it (padding, layout). The area takes the flex slot
 * it is given, so drop it where an `overflow-y-auto` box used to be.
 */
export const ScrollFade = ({ children, className, contentClassName }: { children: ReactNode; className?: string; contentClassName?: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [hasMoreBelow, setHasMoreBelow] = useState(false);

    const measure = useCallback(() => {
        const el = scrollRef.current;
        if (el) setHasMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    }, []);

    // Content changes size without scrolling — a filter empties the list, a
    // month grid opens — so watch both boxes, not just the scroll event.
    useEffect(() => {
        measure();
        const observer = new ResizeObserver(measure);
        if (scrollRef.current) observer.observe(scrollRef.current);
        if (contentRef.current) observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, [measure]);

    return (
        <div className={cx("relative min-h-0 flex-1", className)}>
            <div ref={scrollRef} onScroll={measure} className="scrollbar-hide h-full overflow-y-auto overscroll-contain">
                <div ref={contentRef} className={contentClassName}>
                    {children}
                </div>
            </div>
            <div
                aria-hidden="true"
                className={cx(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent transition-opacity duration-200 ease-linear",
                    hasMoreBelow ? "opacity-100" : "opacity-0",
                )}
            />
        </div>
    );
};
