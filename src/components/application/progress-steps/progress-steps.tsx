"use client";

import type { ComponentPropsWithRef, FC, ReactNode } from "react";
import { isValidElement } from "react";
import { Check } from "@untitledui/icons";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

export type StepStatus = "complete" | "current" | "incomplete";

export interface Step {
    /** Unique identifier for the step. */
    id: string;
    /** Primary label for the step. */
    title: string;
    /** Optional supporting text shown beneath the title. */
    description?: string;
    /** Optional icon shown inside the indicator (used by the `icon` type). */
    icon?: FC<{ className?: string }> | ReactNode;
    /** Progress state of the step. */
    status: StepStatus;
}

const styles = sortCx({
    /** The round/indicator that sits at each step. */
    indicator: {
        base: "relative z-1 flex shrink-0 items-center justify-center rounded-full transition duration-100 ease-linear",
        sizes: {
            sm: "size-6 *:data-icon:size-3.5 text-xs font-semibold",
            md: "size-8 *:data-icon:size-4 text-sm font-semibold",
            lg: "size-10 *:data-icon:size-5 text-md font-semibold",
        },
        status: {
            // Filled brand (near-black in the monochromatic theme).
            complete: "bg-brand-solid text-white *:data-icon:text-white",
            // Ringed brand outline with brand-colored content.
            current: "bg-brand-primary text-brand-secondary ring-2 ring-brand ring-inset *:data-icon:text-fg-brand-primary",
            // Muted, low contrast.
            incomplete: "bg-primary text-quaternary ring-1 ring-secondary ring-inset *:data-icon:text-fg-quaternary",
        },
    },
    /** The inner dot used by the `dot` indicator type. */
    dot: {
        base: "rounded-full transition duration-100 ease-linear",
        sizes: {
            sm: "size-2",
            md: "size-2.5",
            lg: "size-3",
        },
        status: {
            complete: "bg-fg-brand-primary",
            current: "bg-fg-brand-primary",
            incomplete: "bg-fg-quaternary",
        },
    },
    /** The connector line drawn between consecutive steps. */
    connector: {
        complete: "bg-brand-solid",
        current: "bg-brand-solid",
        incomplete: "bg-border-secondary",
    },
    /** Text colors for the title per status. */
    title: {
        complete: "text-secondary",
        current: "text-brand-secondary",
        incomplete: "text-secondary",
    },
});

const textSizes = {
    sm: { title: "text-sm font-semibold", description: "text-xs" },
    md: { title: "text-sm font-semibold", description: "text-sm" },
    lg: { title: "text-md font-semibold", description: "text-sm" },
} as const;

type Size = keyof typeof textSizes;
type IndicatorType = "icon" | "number" | "dot";

const StepIndicator = ({ step, index, size, type }: { step: Step; index: number; size: Size; type: IndicatorType }) => {
    if (type === "dot") {
        return (
            <span className={cx(styles.indicator.base, styles.indicator.sizes[size], styles.indicator.status[step.status])}>
                <span className={cx(styles.dot.base, styles.dot.sizes[size], styles.dot.status[step.status])} />
            </span>
        );
    }

    let content: ReactNode;

    if (step.status === "complete" && type !== "number") {
        content = <Check data-icon aria-hidden="true" />;
    } else if (type === "icon" && step.icon) {
        const Icon = step.icon;
        content = (
            <>
                {isReactComponent(Icon) && <Icon data-icon aria-hidden="true" />}
                {isValidElement(Icon) && Icon}
            </>
        );
    } else {
        content = <span>{index + 1}</span>;
    }

    return <span className={cx(styles.indicator.base, styles.indicator.sizes[size], styles.indicator.status[step.status])}>{content}</span>;
};

const StepText = ({ step, size, align }: { step: Step; size: Size; align: "center" | "start" }) => {
    if (!step.title && !step.description) return null;

    return (
        <div className={cx("flex flex-col gap-0.5", align === "center" ? "items-center text-center" : "items-start text-left")}>
            <span className={cx(textSizes[size].title, styles.title[step.status])}>{step.title}</span>
            {step.description && <span className={cx(textSizes[size].description, "text-tertiary")}>{step.description}</span>}
        </div>
    );
};

export interface ProgressStepsProps extends Omit<ComponentPropsWithRef<"nav">, "type"> {
    /** Ordered list of steps to render. */
    steps: Step[];
    /** Layout direction. */
    orientation?: "horizontal" | "vertical";
    /** Indicator style for each step. */
    type?: IndicatorType;
    /** Size of the indicators and text. */
    size?: Size;
    /** Accessible label for the stepper navigation. */
    "aria-label"?: string;
}

export const ProgressSteps = ({
    steps,
    orientation = "horizontal",
    type = "number",
    size = "md",
    "aria-label": ariaLabel = "Progress",
    className,
    ...props
}: ProgressStepsProps) => {
    const isVertical = orientation === "vertical";

    return (
        <nav
            aria-label={ariaLabel}
            className={cx("flex w-full", isVertical ? "flex-col" : "items-start", className)}
            {...props}
        >
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                // The connector after a step reflects whether that step is done.
                const connectorStatus = step.status === "complete" ? "complete" : step.status === "current" ? "current" : "incomplete";

                if (isVertical) {
                    return (
                        <div key={step.id} className="flex gap-3" aria-current={step.status === "current" ? "step" : undefined}>
                            <div className="flex flex-col items-center self-stretch">
                                <StepIndicator step={step} index={index} size={size} type={type} />
                                {!isLast && <div className={cx("w-0.5 flex-1 rounded-full", styles.connector[connectorStatus])} />}
                            </div>
                            <div className={cx("pb-6", isLast && "pb-0", size === "lg" ? "pt-2" : "pt-1")}>
                                <StepText step={step} size={size} align="start" />
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={step.id} className="flex flex-1 flex-col items-center last:flex-none" aria-current={step.status === "current" ? "step" : undefined}>
                        <div className="flex w-full items-center">
                            <div className="flex flex-1 justify-end">
                                {index !== 0 && (
                                    <div className={cx("h-0.5 w-full rounded-full", styles.connector[step.status === "incomplete" ? "incomplete" : "complete"])} />
                                )}
                            </div>
                            <StepIndicator step={step} index={index} size={size} type={type} />
                            <div className="flex flex-1 justify-start">
                                {!isLast && (
                                    <div className={cx("h-0.5 w-full rounded-full", styles.connector[step.status === "complete" ? "complete" : "incomplete"])} />
                                )}
                            </div>
                        </div>
                        <div className="mt-3 px-2">
                            <StepText step={step} size={size} align="center" />
                        </div>
                    </div>
                );
            })}
        </nav>
    );
};
