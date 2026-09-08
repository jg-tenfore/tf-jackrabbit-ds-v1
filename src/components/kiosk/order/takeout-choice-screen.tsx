"use client";

import { assetUrl } from "@/utils/asset-url";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { cx } from "@/utils/cx";

export type TakeoutChoice = "for-here" | "to-go";

const CHOICES: { id: TakeoutChoice; label: string; art: string; artWidth: number }[] = [
    { id: "for-here", label: "For Here", art: "for-here.svg", artWidth: 289 },
    { id: "to-go", label: "To Go", art: "to-go.svg", artWidth: 277 },
];

/**
 * "Where will you enjoy your food items?" — the last question before checkout.
 *
 * Two equal cards, neither styled as primary. Either answer is normal at a golf
 * course and the kiosk has no basis for a guess: a walker eating at the bar and
 * a group loading a cart are the same customer on different days.
 *
 * The illustrations do the discriminating, not the labels. "For Here" and "To
 * Go" are four short words that look alike at a glance, whereas a table of
 * beers and a loaded cart are told apart before either label is read — which is
 * the whole reason this screen is pictures rather than a pair of buttons.
 *
 * Both exports carry a tall transparent headroom above the drawing, so the art
 * is **bottom-anchored** and its empty top overlaps the label. Sizing the image
 * to fit the box instead would shrink the visible drawing to about half the
 * card and leave it floating in the middle.
 */
export const TakeoutChoiceScreen = ({
    onChoose,
    onBack,
    className,
}: {
    onChoose?: (choice: TakeoutChoice) => void;
    onBack?: () => void;
    className?: string;
}) => (
    <div className={cx("flex h-full w-full flex-col items-center pt-[72px] text-center", className)}>
        <BrandMark />

        <h1 className="mt-[90px] px-16 text-[50px] leading-[1.15] font-bold text-balance text-primary">Where will you enjoy your food items?</h1>

        {/* Grid and Go Back share one padded column so their edges line up. */}
        <div className="mt-[110px] w-full px-16">
            <div className="grid grid-cols-2 gap-5">
                {CHOICES.map((choice) => (
                    <button
                        key={choice.id}
                        type="button"
                        onClick={() => onChoose?.(choice.id)}
                        // flex-col + items-start on the cross axis: a bare <button>
                        // centres its content, which dropped the label into the middle
                        // of the card underneath the artwork.
                        className="relative flex h-[336px] flex-col items-center overflow-hidden rounded-2xl bg-primary pt-[42px] ring-1 ring-border-secondary ring-inset transition duration-75 ease-linear active:scale-[0.99] active:bg-secondary"
                    >
                        {/* z-10: the artwork is absolutely placed and would otherwise
                            paint over the label, since it comes later in the DOM. */}
                        <span className="relative z-10 text-[30px] leading-none font-bold text-primary">{choice.label}</span>
                        <img
                            src={assetUrl(`screen-assets/takeout/${choice.art}`)}
                            alt=""
                            aria-hidden="true"
                            className="absolute bottom-0 left-1/2 -translate-x-1/2"
                            style={{ width: choice.artWidth }}
                        />
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={onBack}
                className="mt-[164px] h-[49px] w-full rounded-xl text-[22px] text-tertiary ring-1 ring-border-secondary ring-inset transition duration-100 ease-linear active:bg-secondary"
            >
                Go Back
            </button>
        </div>
    </div>
);
