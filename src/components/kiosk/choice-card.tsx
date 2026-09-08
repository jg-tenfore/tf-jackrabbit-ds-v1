"use client";

import { ArrowRight } from "@untitledui/icons";
import { assetUrl } from "@/utils/asset-url";
import { cx, sortCx } from "@/utils/cx";

export interface ChoiceOption {
    id: string;
    /** The quiet line above the label — what kind of thing this is. */
    eyebrow: string;
    /** The label, phrased as the thing the user is about to do. */
    title: string;
    /** Path under `screen-assets/get-started/`. */
    image: string;
}

/**
 * The photo-led choice card, shared by the attract screen and the Get Started
 * hub. One component at two sizes rather than two components: they are the same
 * card showing the same four options, and the last three things in this project
 * that were "nearly the same" drifted apart within a week.
 *
 * `lg` is the hub's 302x248; `sm` is the attract row's 252x213, which sits on a
 * photograph and so takes a white ground instead of the hub's grey.
 */
const styles = sortCx({
    lg: {
        card: "h-[248px] bg-secondary px-6 pt-5 pb-6",
        image: "h-[154px]",
        eyebrow: "text-[16px]",
        title: "text-[19px]",
        titleRow: "mt-2 gap-3",
        arrow: "size-7",
    },
    sm: {
        card: "h-[213px] w-[252px] bg-primary px-[10px] pt-[13px] pb-[10px]",
        image: "h-[130px]",
        eyebrow: "text-[15px]",
        title: "text-[17px]",
        titleRow: "mt-1.5 gap-2",
        arrow: "size-6",
    },
});

/**
 * Fixed height with the text block bottom-anchored under the photo, so a
 * one-line and a two-line title still sit their labels on the same baseline
 * across a row. Titles are sized to keep the longest label on one line beside
 * its arrow — a wrap grows the block upward into the photo.
 */
export const ChoiceCard = ({
    option,
    size = "lg",
    onPress,
    className,
}: {
    option: ChoiceOption;
    size?: "lg" | "sm";
    onPress?: () => void;
    className?: string;
}) => {
    const style = styles[size];

    return (
        <button
            type="button"
            onClick={onPress}
            className={cx(
                "flex shrink-0 flex-col rounded-2xl text-left ring-1 ring-border-secondary ring-inset transition duration-75 ease-linear active:scale-[0.98] active:bg-tertiary",
                style.card,
                className,
            )}
        >
            <img
                src={assetUrl(`screen-assets/get-started/${option.image}`)}
                alt=""
                aria-hidden="true"
                className={cx("w-full shrink-0 rounded-xl object-cover", style.image)}
            />

            <div className="mt-auto w-full">
                <p className={cx("leading-none text-tertiary", style.eyebrow)}>{option.eyebrow}</p>
                <div className={cx("flex items-center justify-between", style.titleRow)}>
                    <span className={cx("leading-tight font-bold text-primary", style.title)}>{option.title}</span>
                    <ArrowRight className={cx("shrink-0 text-fg-primary", style.arrow)} aria-hidden="true" />
                </div>
            </div>
        </button>
    );
};
