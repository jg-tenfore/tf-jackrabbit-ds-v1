"use client";

import { useState } from "react";
import { KioskDatePicker } from "@/components/kiosk/booking/kiosk-date-picker";
import { SegmentedSelector } from "@/components/kiosk/booking/segmented-selector";
import { TimeSlotCard } from "@/components/kiosk/booking/slot-card";
import { StepRail } from "@/components/kiosk/booking/step-rail";
import { type ActivityConfig, stepsFor } from "@/components/kiosk/booking/activity-config";
import { ACTIVITY_START_TIMES } from "@/data/booking";
import { cx } from "@/utils/cx";

export type ActivityStepId = "duration" | "start-time" | "resource" | "review";

/**
 * The activity booking flow, shared by the simulator and pickleball.
 *
 * Both are the same four questions in the same order; only the wording and the
 * offered durations differ, so they are one component driven by an
 * `ActivityConfig`. A third activity costs a config object.
 *
 * Steps are rendered one at a time rather than as a long scroll: each answer
 * narrows what the next step can offer (duration changes which start times fit,
 * start time changes which bays are free), so showing them together would mean
 * showing options that are about to become invalid.
 */
export const ActivityBooking = ({
    config,
    initialStep = "duration",
    className,
}: {
    config: ActivityConfig;
    initialStep?: ActivityStepId;
    className?: string;
}) => {
    const [step, setStep] = useState<ActivityStepId>(initialStep);
    const [duration, setDuration] = useState<number>(config.defaultDuration);
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState<string | null>(null);
    const [resourceId, setResourceId] = useState<string | null>(null);

    const steps = stepsFor(config);
    const order: ActivityStepId[] = ["duration", "start-time", "resource", "review"];
    const completed = order.slice(0, order.indexOf(step));

    return (
        <div className={cx("relative flex h-full w-full flex-col", className)}>
            <StepRail
                steps={steps}
                currentStepId={step}
                completedStepIds={completed}
                onStepSelect={(id) => setStep(id as ActivityStepId)}
                className="top-56"
            />

            <div className="flex flex-col gap-2 pt-14 pr-8 pl-[232px]">
                <h1 className="text-5xl font-bold text-balance text-primary">{config.title}</h1>
                <p className="text-lg text-tertiary">
                    {config.subtitle} for {duration} {duration === 1 ? "hour" : "hours"}
                </p>
            </div>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-8 pb-8 pl-[232px] scrollbar-hide">
                {step === "duration" && (
                    <SegmentedSelector
                        label="How long do you need?"
                        size="lg"
                        value={duration}
                        onChange={(next) => {
                            setDuration(next);
                            setStep("start-time");
                        }}
                        options={config.durations.map((hours) => ({ value: hours, label: `${hours} ${hours === 1 ? "hour" : "hours"}` }))}
                    />
                )}

                {step === "start-time" && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold text-primary">Select day and start time</h2>
                        <KioskDatePicker selected={date} onSelect={setDate} />
                        <h3 className="text-2xl font-bold text-primary">
                            {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                        </h3>
                        {/* Three columns: a bare time needs far less width than a
                            tee sheet card, so the grid buys back vertical space. */}
                        <div className="grid grid-cols-3 gap-3">
                            {ACTIVITY_START_TIMES.map((time) => (
                                <TimeSlotCard
                                    key={time}
                                    time={time}
                                    isSelected={time === startTime}
                                    onSelect={() => {
                                        setStartTime(time);
                                        setStep("resource");
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {step === "resource" && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold text-primary">Choose a {config.resourceNoun.toLowerCase()}</h2>
                        <div className="flex flex-col gap-3">
                            {config.resources.map((resource) => {
                                const isAvailable = resource.isAvailable !== false;
                                return (
                                    <button
                                        key={resource.id}
                                        type="button"
                                        disabled={!isAvailable}
                                        onClick={() => {
                                            setResourceId(resource.id);
                                            setStep("review");
                                        }}
                                        aria-pressed={resource.id === resourceId}
                                        className={cx(
                                            "flex h-24 items-center justify-between rounded-xl bg-primary px-6 text-left ring-1 transition duration-100 ease-linear",
                                            isAvailable ? "ring-border-secondary active:bg-secondary" : "cursor-not-allowed opacity-50 ring-border-secondary",
                                            resource.id === resourceId && "ring-2 ring-brand",
                                        )}
                                    >
                                        <span className="flex flex-col">
                                            <span className="text-2xl font-semibold text-primary">{resource.name}</span>
                                            {resource.note && <span className="text-base text-tertiary">{resource.note}</span>}
                                        </span>
                                        {!isAvailable && <span className="text-base text-tertiary">Unavailable</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === "review" && (
                    <ActivityReview
                        config={config}
                        duration={duration}
                        date={date}
                        startTime={startTime}
                        resourceId={resourceId}
                    />
                )}
            </div>
        </div>
    );
};

const ActivityReview = ({
    config,
    duration,
    date,
    startTime,
    resourceId,
}: {
    config: ActivityConfig;
    duration: number;
    date: Date;
    startTime: string | null;
    resourceId: string | null;
}) => {
    const resource = config.resources.find((r) => r.id === resourceId);
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-primary">Review</h2>
            <dl className="flex flex-col gap-3 text-xl">
                <ReviewRow label={config.resourceNoun} value={resource?.name ?? "—"} />
                <ReviewRow label="Date" value={date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} />
                <ReviewRow label="Duration" value={`${duration} ${duration === 1 ? "hour" : "hours"}`} />
                <ReviewRow label="Start time" value={startTime ?? "—"} />
            </dl>
        </div>
    );
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between gap-4 border-b border-secondary pb-3">
        <dt className="text-secondary">{label}</dt>
        <dd className="font-semibold text-primary">{value}</dd>
    </div>
);
