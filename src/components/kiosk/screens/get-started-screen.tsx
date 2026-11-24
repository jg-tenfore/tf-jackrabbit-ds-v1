"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { ChoiceCard, type ChoiceOption } from "@/components/kiosk/choice-card";
import { useCourseBrand } from "@/providers/course-brand";
import { cx } from "@/utils/cx";

/**
 * The four ways into the kiosk, in the order the references draw them:
 * new here, already booked, booking later, just buying something.
 *
 * Data rather than markup because the set is course-specific — a venue with no
 * pro shop should drop that card, not hide it — and because four hand-written
 * cards would drift apart the moment one of them gained a state. The attract
 * screen renders the same four at a smaller size.
 */
export const GET_STARTED_OPTIONS: ChoiceOption[] = [
    { id: "first-time", eyebrow: "Create account", title: "First time here", image: "first-time.png" },
    { id: "check-in", eyebrow: "Welcome!", title: "Check-in to course", image: "check-in.png" },
    { id: "tee-time", eyebrow: "Book a tee time", title: "Plan your next round", image: "tee-time.png" },
    { id: "shop", eyebrow: "Bar & Proshop", title: "Shop Food & Gear", image: "shop.png" },
];

/**
 * The four plus the two bookable activities.
 *
 * A separate export rather than a flag, because which set a venue shows is a
 * property of the venue: a course with no courts and no bays should never be
 * one boolean away from advertising them.
 */
export const GET_STARTED_OPTIONS_WITH_ACTIVITIES: ChoiceOption[] = [
    ...GET_STARTED_OPTIONS,
    { id: "pickleball", eyebrow: "Book a court, grab a paddle", title: "Pickleball Courts", image: "pickleball.png" },
    { id: "simulator", eyebrow: "Indoor Golf Experience", title: "Golf Simulator Bays", image: "simulator.png" },
];

/** The way into the range-ball purchase, for a venue with a driving range. */
export const RANGE_BALLS_OPTION: ChoiceOption = { id: "range-balls", eyebrow: "Driving range", title: "Buy a Bucket of Balls", image: "range-balls.jpg" };

/**
 * The four plus range balls, for the hub. Five cards, all the same size: the
 * fifth sits on its own in the last row rather than being stretched to fill it.
 */
export const GET_STARTED_OPTIONS_WITH_RANGE: ChoiceOption[] = [...GET_STARTED_OPTIONS, RANGE_BALLS_OPTION];

/** Everything: the activities and the range. Seven — more than fit, so the hub scrolls. */
export const GET_STARTED_OPTIONS_WITH_ACTIVITIES_AND_RANGE: ChoiceOption[] = [...GET_STARTED_OPTIONS_WITH_ACTIVITIES, RANGE_BALLS_OPTION];

/**
 * The same five for the attract row, with the range **first**. That row runs
 * off the right edge and only about two and a half cards show before a scroll,
 * so a range card in fifth place would be invisible to someone walking past —
 * which is exactly who the attract screen is for.
 */
export const ATTRACT_OPTIONS_WITH_RANGE: ChoiceOption[] = [RANGE_BALLS_OPTION, ...GET_STARTED_OPTIONS];

/** The attract row with the activities too, range still first. */
export const ATTRACT_OPTIONS_WITH_ACTIVITIES_AND_RANGE: ChoiceOption[] = [RANGE_BALLS_OPTION, ...GET_STARTED_OPTIONS_WITH_ACTIVITIES];

/**
 * "Welcome to The Course! Lets get started!" — the hub the kiosk opens onto
 * once someone has engaged with it.
 *
 * A 2x2 grid rather than a list, because these are four peers and a list would
 * rank them. Nothing here is styled as primary for the same reason: the kiosk
 * cannot know whether the person in front of it came to check in or to buy a
 * sandwich, and guessing wrong costs a mis-tap on the very first screen.
 *
 * Photographs rather than icons. At a standing distance a photo of a burger is
 * recognised before a label is read, and these four choices are genuinely
 * distinguishable by picture in a way that four line icons would not be.
 *
 * No global nav: Go Back is the only control, because there is nowhere to
 * return to but the attract screen and nothing yet to abandon.
 *
 * The grid takes whatever options it is given and lays them out two across, so
 * the four-card and six-card versions are the same screen with different data
 * rather than two screens to keep in step.
 *
 * Every card is the same size and weight, however many there are — an odd one
 * out sits alone in its row. When more rows than fit are given, the cards are
 * not shrunk to make room: the card area scrolls under the heading, a white
 * fade at its foot says there is more, and Go Back stays put below it.
 */
export const GetStartedScreen = ({
    courseName,
    options = GET_STARTED_OPTIONS,
    onSelect,
    onBack,
    className,
}: {
    courseName?: string;
    options?: ChoiceOption[];
    onSelect?: (id: string) => void;
    onBack?: () => void;
    className?: string;
}) => {
    const brand = useCourseBrand();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hasMoreBelow, setHasMoreBelow] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // The fade is a promise of more, so it shows only while there is more:
    // never on a hub that fits, and gone once the last row is in view.
    const measure = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setHasMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
        // Collapse past 24px, expand only back at the very top. The gap between
        // the two stops the heading flickering when a scroll comes to rest
        // near the threshold — collapsing itself changes the scroller's height.
        setIsCollapsed((was) => (was ? el.scrollTop > 2 : el.scrollTop > 24));
    }, []);
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        if (el.firstElementChild) observer.observe(el.firstElementChild);
        return () => observer.disconnect();
    }, [measure, options.length]);

    return (
        <div
            className={cx(
                "flex h-full w-full flex-col items-center text-center transition-[padding] duration-200 ease-out",
                isCollapsed ? "pt-8" : "pt-[70px]",
                className,
            )}
        >
            {/* Once the cards are scrolled, the heading collapses to one line and
            the mark tucks away, so the room goes to the cards. Back at the top it
            opens again. A hub that fits never scrolls, so it never changes. */}
            <div
                aria-hidden={isCollapsed}
                className={cx("overflow-hidden transition-all duration-200 ease-out", isCollapsed ? "max-h-0 opacity-0" : "max-h-24 opacity-100")}
            >
                <BrandMark />
            </div>

            <h1
                className={cx(
                    "px-12 font-bold text-balance text-primary transition-all duration-200 ease-out",
                    // Leading after the size: `cx` merges classes, and a text size
                    // listed after a leading class would drop it.
                    isCollapsed ? "mt-0 text-[32px] leading-[1.08]" : "mt-[26px] text-[50px] leading-[1.08]",
                )}
            >
                Welcome to {courseName ?? brand?.name ?? "The Course"}!<span className={cx(isCollapsed && "hidden")}> Lets get started!</span>
            </h1>

            <div className="relative mt-6 min-h-0 w-full flex-1">
                <div ref={scrollRef} onScroll={measure} className="scrollbar-hide h-full overflow-y-auto overscroll-contain">
                    {/* Two rows sit low in the space, as the four-card reference
                    draws them; three rows fill it and centre. Not one rule with a
                    shrinking margin — CSS has no "147 unless it does not fit" — and
                    not `my-auto` for both, which centres the two-row case 35px above
                    where its reference puts it. Two layouts because there genuinely
                    are two. `min-h-full` is what lets either rule work inside a
                    scroller, and the bottom padding lets the last row scroll clear of
                    the fade. */}
                    <div className="flex min-h-full flex-col">
                        <div
                            className={cx(
                                "grid w-full grid-cols-2 gap-[18px] px-16",
                                options.length > 4 ? "my-auto py-2" : "mt-[123px] mb-auto",
                                hasMoreBelow || options.length > 6 ? "pb-24" : "",
                            )}
                        >
                            {options.map((option) => (
                                <ChoiceCard key={option.id} option={option} size="lg" className="w-full" onPress={() => onSelect?.(option.id)} />
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    aria-hidden="true"
                    className={cx(
                        "pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent transition-opacity duration-200 ease-linear",
                        hasMoreBelow ? "opacity-100" : "opacity-0",
                    )}
                />
            </div>

            <button
                type="button"
                onClick={onBack}
                // Outside the scroller, so it never moves and never sits under the fade.
                className="relative z-10 mt-6 mb-[103px] h-[58px] w-[354px] shrink-0 rounded-xl bg-primary text-[24px] text-tertiary ring-1 ring-border-secondary transition duration-100 ease-linear ring-inset active:bg-secondary"
            >
                Go Back
            </button>
        </div>
    );
};
