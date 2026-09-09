"use client";

import type { ReactNode } from "react";
import { Users01 } from "@untitledui/icons";
import { type ActivityConfig, stepsFor } from "@/components/kiosk/booking/activity-config";
import { KioskDatePicker, type DayAvailability } from "@/components/kiosk/booking/kiosk-date-picker";
import { TimeSlotCard } from "@/components/kiosk/booking/slot-card";
import { type BookingStep, StepRail } from "@/components/kiosk/booking/step-rail";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { cx } from "@/utils/cx";

/**
 * The step surfaces the activity flow is assembled from.
 *
 * `ActivityBooking` is the *stateful* driver — it owns which step you are on
 * and what you have answered. Everything here is the stateless half: the
 * scaffold every step sits in, and the three step bodies. Splitting them that
 * way is what lets the flow stories render any single step at a fixed state
 * (which is all a design reference is) without a second copy of the layout —
 * `ActivityBooking` renders these exact components, so a change to a step body
 * lands on the driver and the flow at once.
 *
 * Everything is `activity-` prefixed and none of it duplicates an existing
 * component: the rail is `StepRail`, the calendar is `KioskDatePicker`, the
 * time cells are `TimeSlotCard`. What is new here is only the arrangement.
 */

/**
 * The scaffold: brand card, progress rail, title block, scrolling body.
 *
 * The brand card is optional because the two contexts genuinely differ — the
 * flow references draw it, and the component-level stories that exercise the
 * driver in isolation do not need a course identity above a step list.
 */
export const ActivityStepFrame = ({
    config,
    steps,
    currentStepId,
    completedStepIds = [],
    onStepSelect,
    subtitle,
    showBrandCard = false,
    children,
    className,
}: {
    config: ActivityConfig;
    /**
     * The rail's steps. Defaults to `stepsFor(config)` — the four an activity
     * asks. Overridable because the rail has to report the order the flow
     * actually walks: the prototype asks *when* before *how long*, and a tee
     * time has no duration step at all, so a fixed list would draw a progress
     * rail that disagrees with the screen it is next to.
     */
    steps?: BookingStep[];
    currentStepId: string;
    completedStepIds?: string[];
    onStepSelect?: (id: string) => void;
    /** Overrides the config subtitle once answers start narrowing it. */
    subtitle?: string;
    showBrandCard?: boolean;
    children: ReactNode;
    className?: string;
}) => (
    <div className={cx("relative flex h-full w-full flex-col", className)}>
        {showBrandCard && (
            // Same peeking geometry as the rail beneath it: anchored off-canvas
            // so only its inner edge shows, and rounded on one side only. The
            // pl-16 exactly cancels the -left-16, so the mark starts on the
            // canvas edge rather than under it.
            <div
                aria-hidden="true"
                className="absolute top-[60px] -left-16 z-10 flex h-[156px] w-[272px] items-center justify-center rounded-r-2xl bg-primary pl-16 shadow-sm ring-1 ring-border-secondary"
            >
                <BrandMark className="size-28" />
            </div>
        )}

        <StepRail
            steps={steps ?? stepsFor(config)}
            currentStepId={currentStepId}
            completedStepIds={completedStepIds}
            onStepSelect={onStepSelect}
            className={showBrandCard ? "top-[232px]" : "top-56"}
        />

        {/* 219 is where the rail's cards stop, so it is the left margin for
            everything on the canvas — the title and the body share it rather
            than each picking their own. */}
        <div className="flex flex-col gap-2 pt-[76px] pr-[59px] pl-[219px]">
            <h1 className="text-5xl font-bold text-balance text-primary">{config.title}</h1>
            <p className="text-lg text-tertiary">{subtitle ?? config.subtitle}</p>
        </div>

        <div className="mt-10 min-h-0 flex-1 overflow-y-auto pr-[59px] pb-8 pl-[219px] scrollbar-hide">{children}</div>
    </div>
);

export interface ActivityDurationOption {
    /** Length in hours — 0.5 is a legal answer, so this is not an integer. */
    hours: number;
    label: string;
}

/**
 * "2.5 hours court time".
 *
 * The noun comes from the config rather than the copy deck: the references say
 * "bay time" on the pickleball screens too, which is a copy-paste in the design
 * — pickleball has no bays — and hard-coding it would ship the mistake.
 */
export const durationLabel = (hours: number, config: ActivityConfig) => {
    const noun = `${config.resourceNoun.toLowerCase()} time`;
    return hours === 0.5 ? `30 minutes ${noun}` : `${hours} ${hours === 1 ? "hour" : "hours"} ${noun}`;
};

/** Half-hour steps from 30 minutes to 4 hours, unless an explicit list is given. */
export const durationOptionsFor = (config: ActivityConfig, hours?: number[]): ActivityDurationOption[] =>
    (hours ?? Array.from({ length: 8 }, (_, i) => (i + 1) / 2)).map((value) => ({ hours: value, label: durationLabel(value, config) }));

/**
 * Step 1 — how long.
 *
 * A stacked list rather than the joined `SegmentedSelector` the driver used to
 * show, because there are eight answers here, not three: a bar with eight
 * segments across 472px puts each target below the kiosk touch floor, and the
 * labels ("2.5 hours bay time") do not fit one anyway.
 */
export const ActivityDurationList = ({
    title,
    options,
    value,
    onSelect,
}: {
    title: string;
    options: ActivityDurationOption[];
    value?: number | null;
    onSelect?: (hours: number) => void;
}) => (
    <div className="flex flex-col gap-6">
        <h2 className="text-[26px] font-bold text-primary">{title}</h2>

        <div className="flex flex-col gap-3">
            {options.map((option) => (
                <button
                    key={option.hours}
                    type="button"
                    onClick={() => onSelect?.(option.hours)}
                    aria-pressed={option.hours === value}
                    className={cx(
                        "flex h-[84px] w-full items-center rounded-xl bg-primary px-4 text-left text-xl font-semibold text-primary ring-1 ring-border-secondary transition duration-100 ease-linear active:bg-secondary",
                        option.hours === value && "ring-2 ring-brand",
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);

/**
 * Step 2 — which day, then which start time.
 *
 * One step, not two, because the answer is a single instant: splitting it would
 * make a user commit to a day before seeing whether it has anything open, and
 * the day strip is right here to change.
 */
export const ActivityDayTimePicker = ({
    title = "Select day and start time",
    selected,
    onSelect,
    days,
    mode,
    onModeChange,
    times,
    selectedTime,
    onSelectTime,
}: {
    title?: string;
    selected: Date;
    onSelect: (date: Date) => void;
    days?: DayAvailability[];
    mode?: "week" | "month";
    onModeChange?: (mode: "week" | "month") => void;
    times: string[];
    selectedTime?: string | null;
    onSelectTime?: (time: string) => void;
}) => (
    <div className="flex flex-col gap-6">
        <h2 className="text-[26px] font-bold text-primary">{title}</h2>

        <KioskDatePicker selected={selected} onSelect={onSelect} days={days} mode={mode} onModeChange={onModeChange} />

        <h3 className="text-2xl font-bold text-primary">
            {selected.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </h3>

        {/* Three columns: a bare time needs far less width than a tee sheet
            card, so the grid buys back vertical space. */}
        <div className="grid grid-cols-3 gap-3">
            {times.map((time) => (
                <TimeSlotCard key={time} time={time} isSelected={time === selectedTime} onSelect={() => onSelectTime?.(time)} />
            ))}
        </div>
    </div>
);

export interface ActivityResourceOption {
    id: string;
    name: string;
    /** Where it is — "By the jukebox", "Along the shoreline". */
    note?: string;
    maxParticipants?: number;
    /** All-in price shown large, in cents. */
    priceCents: number;
    /** The small rate line under it — "$40.00 + 2.49 Fee / hr". */
    rateNote?: string;
    isAvailable?: boolean;
}

/**
 * Step 3 — which bay or court.
 *
 * Two columns of cards rather than full-width rows: every card carries the same
 * price and the same participant cap, so the thing being compared is the *name
 * and location*, which is short. A full-width row would spend 470px saying
 * "$42.49" eleven times.
 */
export const ActivityResourceGrid = ({
    title,
    resources,
    selectedId,
    onSelect,
}: {
    title: string;
    resources: ActivityResourceOption[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
}) => (
    <div className="flex flex-col gap-6">
        <h2 className="text-[26px] font-bold text-primary">{title}</h2>

        <div className="grid grid-cols-2 gap-3">
            {resources.map((resource) => (
                <ActivityResourceCard
                    key={resource.id}
                    resource={resource}
                    isSelected={resource.id === selectedId}
                    onSelect={() => onSelect?.(resource.id)}
                />
            ))}
        </div>
    </div>
);

/**
 * One bookable unit.
 *
 * Price splits into dollars and a superscript cents pair, the same treatment
 * `SlotCard` uses — the dollar figure is what gets scanned across a grid of
 * eleven cards, so it takes the largest type and the cents ride along.
 */
export const ActivityResourceCard = ({
    resource,
    isSelected = false,
    onSelect,
}: {
    resource: ActivityResourceOption;
    isSelected?: boolean;
    onSelect?: () => void;
}) => {
    const isAvailable = resource.isAvailable !== false;
    const dollars = Math.floor(resource.priceCents / 100);
    const cents = String(resource.priceCents % 100).padStart(2, "0");

    return (
        <button
            type="button"
            disabled={!isAvailable}
            onClick={onSelect}
            aria-pressed={isSelected}
            className={cx(
                "flex min-h-[130px] w-full flex-col gap-1 rounded-xl bg-primary p-4 text-left ring-1 ring-border-secondary transition duration-100 ease-linear",
                isAvailable ? "active:bg-secondary" : "cursor-not-allowed opacity-50",
                isSelected && "ring-2 ring-brand",
            )}
        >
            <span className="text-lg font-bold text-primary">{resource.name}</span>
            {resource.note && <span className="text-sm text-tertiary">{resource.note}</span>}

            <span className="mt-auto flex items-end justify-between gap-2 pt-3">
                {/* min-w-0 + shrink-0 on the price: without it the meta column
                    takes width from the number and the two collide. */}
                <span className="flex min-w-0 flex-col gap-0.5">
                    {resource.maxParticipants && (
                        <span className="flex items-center gap-1 text-[11px] whitespace-nowrap text-tertiary">
                            <Users01 className="size-3 shrink-0" aria-hidden="true" />
                            {resource.maxParticipants} Max Participants
                        </span>
                    )}
                    {resource.rateNote && <span className="text-[11px] whitespace-nowrap text-tertiary">{resource.rateNote}</span>}
                </span>

                <span className="shrink-0 text-2xl font-bold text-primary tabular-nums">
                    ${dollars}
                    <sup className="text-xs font-semibold">{cents}</sup>
                </span>
            </span>
        </button>
    );
};

/**
 * The lone Back pill above the rail on every mid-flow step.
 *
 * It shares the body's left margin rather than the canvas's, so it lines up
 * under the content column instead of under the rail — the rail is chrome and
 * Back belongs to the step.
 */
export const ActivityBackBar = ({ onBack, label = "Back" }: { onBack?: () => void; label?: string }) => (
    <div className="flex bg-primary pt-4 pr-[47px] pb-2 pl-[219px]">
        <button
            type="button"
            onClick={onBack}
            className="h-[65px] w-full rounded-lg text-[20px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
        >
            {label}
        </button>
    </div>
);
