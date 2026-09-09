"use client";

import { Check } from "@untitledui/icons";
import { cx } from "@/utils/cx";

/**
 * The progress dot beside a step's label.
 *
 * Three states, and each is a different *shape*, not a different colour:
 * complete is a filled tick, current is a hollow ring, upcoming is a flat
 * disc. That matters on a kiosk more than anywhere else — the panel is read
 * standing, at arm's length, sometimes in sunlight, and a user who cannot tell
 * green from grey can still tell a tick from a ring from a dot.
 *
 * Extracted from `StepRail` because the booking flows, the activity flows and
 * anything with a wizard all need the same three marks, and three copies of a
 * traffic light is how they stop agreeing.
 */
export type StepState = "complete" | "current" | "upcoming";

export const stepStateFor = (id: string, currentStepId: string, completedStepIds: string[]): StepState =>
    completedStepIds.includes(id) ? "complete" : id === currentStepId ? "current" : "upcoming";

export const StepMarker = ({ state, className }: { state: StepState; className?: string }) => {
    if (state === "complete") {
        return (
            <span className={cx("flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-solid", className)} aria-hidden="true">
                <Check className="size-4 text-white" />
            </span>
        );
    }

    if (state === "current") {
        return <span className={cx("size-6 shrink-0 rounded-full ring-[3px] ring-brand", className)} aria-hidden="true" />;
    }

    return <span className={cx("size-6 shrink-0 rounded-full bg-quaternary opacity-40", className)} aria-hidden="true" />;
};
