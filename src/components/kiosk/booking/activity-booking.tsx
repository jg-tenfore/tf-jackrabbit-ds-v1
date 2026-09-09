"use client";

import { useState } from "react";
import { type ActivityConfig } from "@/components/kiosk/booking/activity-config";
import {
    ActivityDayTimePicker,
    ActivityDurationList,
    ActivityResourceGrid,
    ActivityStepFrame,
    durationOptionsFor,
} from "@/components/kiosk/booking/activity-step-screens";
import { ACTIVITY_START_TIMES } from "@/data/booking";

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

    const order: ActivityStepId[] = ["duration", "start-time", "resource", "review"];
    const completed = order.slice(0, order.indexOf(step));

    return (
        <ActivityStepFrame
            config={config}
            currentStepId={step}
            completedStepIds={completed}
            onStepSelect={(id) => setStep(id as ActivityStepId)}
            subtitle={`${config.subtitle} for ${duration} ${duration === 1 ? "hour" : "hours"}`}
            className={className}
        >
            {step === "duration" && (
                <ActivityDurationList
                    title="How long do you want to play for?"
                    options={durationOptionsFor(config, config.durations)}
                    value={duration}
                    onSelect={(next) => {
                        setDuration(next);
                        setStep("start-time");
                    }}
                />
            )}

            {step === "start-time" && (
                <ActivityDayTimePicker
                    selected={date}
                    onSelect={setDate}
                    times={ACTIVITY_START_TIMES}
                    selectedTime={startTime}
                    onSelectTime={(time) => {
                        setStartTime(time);
                        setStep("resource");
                    }}
                />
            )}

            {step === "resource" && (
                <ActivityResourceGrid
                    title={`Select available ${config.resourceNoun.toLowerCase()} locations`}
                    // Price is duration x the hourly rate, so the grid answers
                    // "what will this cost me" rather than "what does an hour
                    // cost" — by this step the duration is already settled.
                    resources={config.resources.map((resource) => ({
                        ...resource,
                        maxParticipants: config.maxGroupSize,
                        priceCents: Math.round(config.hourlyRateCents * duration),
                    }))}
                    selectedId={resourceId}
                    onSelect={(id) => {
                        setResourceId(id);
                        setStep("review");
                    }}
                />
            )}

            {step === "review" && (
                <ActivityReview config={config} duration={duration} date={date} startTime={startTime} resourceId={resourceId} />
            )}
        </ActivityStepFrame>
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
