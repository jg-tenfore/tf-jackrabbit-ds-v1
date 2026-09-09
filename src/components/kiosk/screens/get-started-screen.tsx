"use client";

import { BrandMark } from "@/components/kiosk/brand-mark";
import { ChoiceCard, type ChoiceOption } from "@/components/kiosk/choice-card";
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
 */
export const GetStartedScreen = ({
    courseName = "The Course",
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
}) => (
    <div className={cx("flex h-full w-full flex-col items-center pt-[70px] text-center", className)}>
        <BrandMark />

        <h1 className="mt-[26px] px-12 text-[50px] leading-[1.08] font-bold text-balance text-primary">
            Welcome to {courseName}! Lets get started!
        </h1>

        {/* Two rows sit low in the space, as the four-card reference draws them;
            three rows fill it and centre. Not one rule with a shrinking margin —
            CSS has no "147 unless it does not fit" — and not `my-auto` for both,
            which centres the two-row case 35px above where its reference puts
            it. Two layouts because there genuinely are two. */}
        <div className={cx("grid w-full grid-cols-2 gap-[18px] px-16", options.length > 4 ? "my-auto" : "mt-[147px] mb-auto")}>
            {options.map((option) => (
                <ChoiceCard key={option.id} option={option} size="lg" className="w-full" onPress={() => onSelect?.(option.id)} />
            ))}
        </div>

        <button
            type="button"
            onClick={onBack}
            className="mb-[103px] h-[58px] w-[354px] rounded-xl text-[24px] text-tertiary ring-1 ring-border-secondary ring-inset transition duration-100 ease-linear active:bg-secondary"
        >
            Go Back
        </button>
    </div>
);
