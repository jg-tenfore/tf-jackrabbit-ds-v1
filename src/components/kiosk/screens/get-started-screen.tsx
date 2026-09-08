"use client";

import { ArrowRight } from "@untitledui/icons";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

export interface GetStartedOption {
    id: string;
    /** The quiet line above the label — what kind of thing this is. */
    eyebrow: string;
    /** The label, phrased as the thing the user is about to do. */
    title: string;
    /** Path under `screen-assets/get-started/`. */
    image: string;
}

/**
 * The four ways into the kiosk, in the order the references draw them:
 * new here, already booked, booking later, just buying something.
 *
 * Data rather than markup because the set is course-specific — a venue with no
 * pro shop should drop that card, not hide it — and because four hand-written
 * cards would drift apart the moment one of them gained a state.
 */
export const GET_STARTED_OPTIONS: GetStartedOption[] = [
    { id: "first-time", eyebrow: "Create account", title: "First time here", image: "first-time.png" },
    { id: "check-in", eyebrow: "Welcome!", title: "Check-in to course", image: "check-in.png" },
    { id: "tee-time", eyebrow: "Book a tee time", title: "Plan your next round", image: "tee-time.png" },
    { id: "shop", eyebrow: "Bar & Proshop", title: "Shop Food & Gear", image: "shop.png" },
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
 */
export const GetStartedScreen = ({
    courseName = "The Course",
    options = GET_STARTED_OPTIONS,
    onSelect,
    onBack,
    className,
}: {
    courseName?: string;
    options?: GetStartedOption[];
    onSelect?: (id: string) => void;
    onBack?: () => void;
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col items-center pt-[70px] text-center", className)}>
        <BrandMark />

        <h1 className="mt-[26px] px-12 text-[50px] leading-[1.08] font-bold text-balance text-primary">
            Welcome to {courseName}! Lets get started!
        </h1>

        <div className="mt-[147px] grid w-full grid-cols-2 gap-[18px] px-16">
            {options.map((option) => (
                <OptionCard key={option.id} option={option} onPress={() => onSelect?.(option.id)} />
            ))}
        </div>

        <button
            type="button"
            onClick={onBack}
            className="mt-auto mb-[103px] h-[58px] w-[354px] rounded-xl text-[24px] text-tertiary ring-1 ring-border-secondary ring-inset transition duration-100 ease-linear active:bg-secondary"
        >
            Go Back
        </button>
    </div>
);

/**
 * Fixed 248 tall so the two rows line up whether or not a title wraps.
 *
 * The text block is bottom-anchored under the photo rather than following it
 * directly: a one-line and a two-line title then still sit their labels on the
 * same baseline across the row, which is what stops the grid looking ragged.
 */
const OptionCard = ({ option, onPress }: { option: GetStartedOption; onPress?: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        className="flex h-[248px] flex-col rounded-2xl bg-secondary px-6 pt-5 pb-6 text-left ring-1 ring-border-secondary ring-inset transition duration-75 ease-linear active:scale-[0.98] active:bg-tertiary"
    >
        <img
            src={assetUrl(`screen-assets/get-started/${option.image}`)}
            alt=""
            aria-hidden="true"
            className="h-[154px] w-full shrink-0 rounded-xl object-cover"
        />

        <div className="mt-auto w-full">
            <p className="text-[16px] leading-none text-tertiary">{option.eyebrow}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
                {/* 19px is what keeps the longest label ("Plan your next round")
                    on one line beside the arrow inside a 302 card. A wrapped title
                    would grow the text block upward into the photo, since the
                    card height is fixed to keep the two rows aligned. */}
                <span className="text-[19px] leading-tight font-bold text-primary">{option.title}</span>
                <ArrowRight className="size-7 shrink-0 text-fg-primary" aria-hidden="true" />
            </div>
        </div>
    </button>
);
