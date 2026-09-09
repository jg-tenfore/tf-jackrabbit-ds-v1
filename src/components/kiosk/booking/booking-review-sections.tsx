"use client";

import type { ReactNode } from "react";
import { Switch as AriaSwitch } from "react-aria-components";
import { cx } from "@/utils/cx";

/**
 * The sections below the fold on the tee-time review screen.
 *
 * These live here rather than inline in the flow story because the review
 * screen is two stories — above the fold and scrolled — and they have to be the
 * same markup in both or the pair stops proving anything.
 *
 * Everything here is `tee-` prefixed: none of it duplicates a component that
 * already exists (`booking-summary` has the facts and the money,
 * `segmented-selector` has the joined bars), and prefixing keeps it obvious at
 * the import site which screen these belong to.
 */

/**
 * One band of the review screen.
 *
 * The rule is full-bleed while the content keeps the canvas's 64px inset —
 * that is how the references draw it, and it is the right call: a rule that
 * stopped at the text margin would read as an underline on the section above
 * rather than a division between two.
 */
export const BookingReviewSection = ({ children, className }: { children: ReactNode; className?: string }) => (
    <section className={cx("border-t border-secondary px-16 py-8", className)}>{children}</section>
);

/**
 * Venue policy prose.
 *
 * Left at body weight and full measure. It is the one block on this screen a
 * user is expected to actually read rather than scan, so it does not compete
 * with the facts above it for emphasis.
 */
export const BookingVenuePolicy = ({ title = "Venue Policy", paragraphs }: { title?: string; paragraphs: string[] }) => (
    <div className="flex flex-col gap-5">
        <h3 className="text-4xl font-bold text-primary">{title}</h3>
        {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-xl leading-relaxed text-secondary">
                {paragraph}
            </p>
        ))}
    </div>
);

/**
 * The opt-in for booking text messages.
 *
 * A kiosk-sized switch rather than `Components/Forms/Toggle`: that one tops out
 * at 24px tall and carries hover states, both of which are wrong here. The
 * whole row is the target, so a press anywhere along the title line flips it —
 * on a panel used standing, a 96px switch at the far right of a 750px canvas is
 * a needlessly precise thing to ask for.
 */
export const BookingUpdatesToggle = ({
    isSelected,
    onChange,
    title = "Booking text updates",
    description = "Get booking reminders and waitlist status updates.",
    learnMoreLabel = "Learn more",
    onLearnMore,
}: {
    isSelected: boolean;
    onChange: (next: boolean) => void;
    title?: string;
    description?: string;
    learnMoreLabel?: string;
    onLearnMore?: () => void;
}) => (
    <div className="flex flex-col gap-3">
        <AriaSwitch
            isSelected={isSelected}
            onChange={onChange}
            className="flex w-full cursor-pointer items-center justify-between gap-6 outline-hidden"
        >
            <span className="text-4xl font-bold text-primary">{title}</span>
            <span
                className={cx(
                    "flex h-14 w-24 shrink-0 items-center rounded-full p-1.5 transition duration-100 ease-linear",
                    isSelected ? "bg-brand-solid" : "bg-tertiary",
                )}
                aria-hidden="true"
            >
                <span
                    className={cx(
                        "size-11 rounded-full bg-primary shadow-md transition-transform duration-100 ease-linear",
                        isSelected && "translate-x-10",
                    )}
                />
            </span>
        </AriaSwitch>

        <p className="text-xl text-secondary">{description}</p>

        <button
            type="button"
            onClick={onLearnMore}
            className="self-start text-xl font-medium text-brand-secondary transition duration-100 ease-linear active:opacity-70"
        >
            {learnMoreLabel}
        </button>
    </div>
);

/**
 * "What's the occasion?" — an optional single-select over free-form chips.
 *
 * Wrapped chips rather than a `SegmentedSelector`: the answers are not a scale
 * and there are more of them than fit one bar, so joining them edge to edge
 * would imply an order they do not have. Selection is a brand fill, and
 * pressing the selected chip clears it — the question is optional, so there has
 * to be a way back to no answer.
 */
export const BookingOccasionChips = ({
    options,
    value,
    onChange,
    title = "What's the occasion?",
}: {
    options: string[];
    value: string | null;
    onChange: (next: string | null) => void;
    title?: string;
}) => (
    <div className="flex flex-col gap-6">
        <h3 className="text-4xl font-bold text-primary">{title}</h3>

        <div role="group" aria-label={title} className="flex flex-wrap gap-4">
            {options.map((option) => {
                const isSelected = option === value;
                return (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onChange(isSelected ? null : option)}
                        className={cx(
                            "h-16 rounded-xl px-6 text-xl font-semibold transition duration-100 ease-linear",
                            isSelected
                                ? "bg-brand-solid text-white ring-2 ring-brand"
                                : "bg-primary text-primary ring-1 ring-border-primary active:bg-secondary",
                        )}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    </div>
);

/**
 * The action bar that sits between screen content and the rail on the booking
 * screens.
 *
 * One component with two shapes rather than two components, because the shape
 * is decided by whether there is anything to commit to. Browsing the tee sheet
 * offers only a way back, so Back takes the full width; on the review screen a
 * commit exists, so Back shrinks to the left gutter and Book Now takes the
 * remainder — the control you are meant to press keeps the same corner it holds
 * on every other decision surface in the kiosk.
 */
export const BookingActionBar = ({
    onBack,
    onBook,
    bookLabel = "Book Now",
    backLabel = "Go Back",
    isBookDisabled = false,
}: {
    onBack?: () => void;
    /** Omit for a browse screen: Back then spans the full width alone. */
    onBook?: () => void;
    bookLabel?: string;
    backLabel?: string;
    isBookDisabled?: boolean;
}) => (
    <div className="flex items-center gap-4 bg-primary px-16 pb-2">
        <button
            type="button"
            onClick={onBack}
            className={cx(
                "h-[65px] rounded-lg text-[20px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary",
                onBook ? "w-[183px] shrink-0" : "flex-1",
            )}
        >
            {backLabel}
        </button>
        {onBook && (
            <button
                type="button"
                onClick={onBook}
                disabled={isBookDisabled}
                className="h-[65px] flex-1 rounded-lg bg-brand-solid text-[24px] font-bold text-white transition duration-100 ease-linear active:bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-50"
            >
                {bookLabel}
            </button>
        )}
    </div>
);
