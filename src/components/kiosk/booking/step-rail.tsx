"use client";

import { Check } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export interface BookingStep {
    id: string;
    label: string;
}

/**
 * The left rail shared by the booking flows.
 *
 * It is pinned to the left edge and deliberately clipped by the canvas: only
 * the right portion of each card is on screen, which reads as a stack of tabs
 * hanging off the edge. That peeking treatment is what tells a user the rail is
 * a surface they can reach for, without spending the horizontal room a fully
 * visible sidebar would cost — and horizontal room is exactly what the slot
 * grid needs.
 *
 * `progress` mode drives the activity flows (Duration, Start time, Bay
 * location, Review); `filter` mode drives the tee sheet.
 */
export const StepRail = ({
    steps,
    currentStepId,
    completedStepIds = [],
    onStepSelect,
    className,
}: {
    steps: BookingStep[];
    currentStepId: string;
    completedStepIds?: string[];
    onStepSelect?: (id: string) => void;
    className?: string;
}) => (
    <nav
        aria-label="Booking progress"
        // Negative inset is the point: the cards are anchored off-canvas so only
        // their inner edge shows, exactly as drawn in the references.
        className={cx("absolute top-0 -left-16 z-10 flex w-[272px] flex-col", className)}
    >
        {steps.map((step) => {
            const isComplete = completedStepIds.includes(step.id);
            const isCurrent = step.id === currentStepId;
            const isReachable = isComplete || isCurrent;

            return (
                <button
                    key={step.id}
                    type="button"
                    disabled={!isReachable}
                    onClick={() => onStepSelect?.(step.id)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cx(
                        "flex h-[68px] items-center gap-3 rounded-r-2xl bg-primary pr-6 pl-20 text-left shadow-sm ring-1 ring-border-secondary transition duration-100 ease-linear",
                        !isReachable && "cursor-not-allowed",
                    )}
                >
                    <StepMarker isComplete={isComplete} isCurrent={isCurrent} />
                    <span
                        className={cx(
                            // nowrap: a two-word step label ("Bay location")
                            // wraps and breaks the rail's fixed row height.
                            "text-lg whitespace-nowrap",
                            isCurrent ? "font-semibold text-brand-secondary underline decoration-2 underline-offset-8" : isComplete ? "text-primary" : "text-quaternary",
                        )}
                    >
                        {step.label}
                    </span>
                </button>
            );
        })}
    </nav>
);

const StepMarker = ({ isComplete, isCurrent }: { isComplete: boolean; isCurrent: boolean }) => {
    if (isComplete) {
        return (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-solid" aria-hidden="true">
                <Check className="size-4 text-white" />
            </span>
        );
    }
    if (isCurrent) {
        return <span className="size-6 shrink-0 rounded-full ring-[3px] ring-brand" aria-hidden="true" />;
    }
    return <span className="size-6 shrink-0 rounded-full bg-quaternary opacity-40" aria-hidden="true" />;
};

/**
 * The tee sheet's filter rail. Same peeking geometry as `StepRail`, but the
 * groups are independent filters rather than sequential steps.
 */
export const FilterRail = ({
    groups,
    values,
    onChange,
    className,
}: {
    groups: { id: string; options: { id: string; label: string }[] }[];
    values: Record<string, string>;
    onChange: (groupId: string, optionId: string) => void;
    className?: string;
}) => (
    <nav aria-label="Tee sheet filters" className={cx("absolute top-0 -left-16 z-10 flex w-[272px] flex-col gap-6", className)}>
        {groups.map((group) => (
            <div key={group.id} className="flex flex-col">
                {group.options.map((option) => {
                    const isActive = values[group.id] === option.id;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onChange(group.id, option.id)}
                            aria-pressed={isActive}
                            className="flex h-16 items-center rounded-r-2xl bg-primary pr-6 pl-20 text-left shadow-sm ring-1 ring-border-secondary transition duration-100 ease-linear active:bg-secondary"
                        >
                            <span
                                className={cx(
                                    "text-lg whitespace-nowrap",
                                    isActive ? "font-semibold text-brand-secondary underline decoration-2 underline-offset-8" : "text-primary",
                                )}
                            >
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        ))}
    </nav>
);

/**
 * The menu's category rail — the third mode of this geometry.
 *
 * Same peeking treatment as `StepRail` and `FilterRail`: anchored off-canvas so
 * only each card's inner edge shows. It lives beside them rather than in its
 * own file precisely so the clip offset, width and radius stay one set of
 * numbers — three copies of `-left-16 w-[272px]` would drift the first time one
 * of them was nudged.
 *
 * It differs in carrying two sections. The top group is destinations (Home,
 * Deals, Members); the bottom is the category the grid is currently showing.
 * They are separated by a gap rather than a divider, because a divider would
 * read as one list with a rule through it rather than two lists.
 */
export interface RailEntry {
    id: string;
    label: string;
    /** Small leading glyph. Exported artwork, so it is a path not a component. */
    iconSrc?: string;
}

export const CategoryRail = ({
    destinations,
    categories,
    activeCategoryId,
    onSelect,
    logoSrc,
    className,
}: {
    destinations: RailEntry[];
    categories: RailEntry[];
    activeCategoryId?: string;
    onSelect?: (id: string) => void;
    logoSrc?: string;
    className?: string;
}) => (
    <nav aria-label="Menu categories" className={cx("absolute top-0 -left-16 z-10 flex w-[272px] flex-col gap-6", className)}>
        {logoSrc && (
            <div className="flex h-[152px] items-center justify-end rounded-r-2xl bg-primary pr-8 shadow-sm ring-1 ring-border-secondary">
                <img src={logoSrc} alt="" aria-hidden="true" className="size-20" />
            </div>
        )}

        <div className="flex flex-col">
            {destinations.map((entry) => (
                <RailRow key={entry.id} entry={entry} onPress={() => onSelect?.(entry.id)} />
            ))}
        </div>

        <div className="flex flex-col">
            {categories.map((entry) => (
                <RailRow key={entry.id} entry={entry} isActive={entry.id === activeCategoryId} onPress={() => onSelect?.(entry.id)} />
            ))}
        </div>
    </nav>
);

const RailRow = ({ entry, isActive = false, onPress }: { entry: RailEntry; isActive?: boolean; onPress?: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        aria-current={isActive ? "true" : undefined}
        className="flex h-16 items-center gap-3 rounded-r-2xl bg-primary pr-6 pl-20 text-left shadow-sm ring-1 ring-border-secondary transition duration-100 ease-linear active:bg-secondary"
    >
        {entry.iconSrc ? (
            <img src={entry.iconSrc} alt="" aria-hidden="true" className="size-7 shrink-0 object-contain" />
        ) : (
            <span data-placeholder-asset="category-icon" className="size-7 shrink-0 rounded bg-secondary" aria-hidden="true" />
        )}
        <span
            className={cx(
                "text-[17px] whitespace-nowrap",
                isActive ? "font-semibold text-brand-secondary underline decoration-2 underline-offset-8" : "text-primary",
            )}
        >
            {entry.label}
        </span>
    </button>
);
