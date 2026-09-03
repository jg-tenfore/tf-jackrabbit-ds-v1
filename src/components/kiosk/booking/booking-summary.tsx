"use client";

import type { ReactNode } from "react";
import { Clock, Flag01, CalendarCheck01, MarkerPin01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export interface SummaryLine {
    label: string;
    value: string;
    /** Emphasise as the total row. */
    isTotal?: boolean;
    /** Muted disclaimer under the row. */
    note?: string;
}

/**
 * The venue block at the top of a review screen.
 *
 * Facts are icon-led rather than label-led ("Duration: 2 hours" beside a clock,
 * not "Duration" in a column). A standing user scanning a confirmation is
 * checking a handful of values against memory, and the icon gets them to the
 * right line faster than reading labels.
 */
export const VenueSummary = ({
    venueName,
    address,
    resource,
    date,
    duration,
    startTime,
    className,
}: {
    venueName: string;
    address?: string;
    resource?: string;
    date?: string;
    duration?: string;
    startTime?: string;
    className?: string;
}) => (
    <div className={cx("flex flex-col gap-4", className)}>
        <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-bold text-primary">{venueName}</h2>
            {address && <p className="text-lg text-tertiary">{address}</p>}
        </div>

        <dl className="flex flex-col gap-3">
            {resource && <SummaryFact icon={<Flag01 className="size-6" />} label="Location">{resource}</SummaryFact>}
            {date && <SummaryFact icon={<CalendarCheck01 className="size-6" />} label="Date">{date}</SummaryFact>}
            {duration && <SummaryFact icon={<Clock className="size-6" />} label="Duration">{duration}</SummaryFact>}
            {startTime && <SummaryFact icon={<MarkerPin01 className="size-6" />} label="Start time">{startTime}</SummaryFact>}
        </dl>
    </div>
);

const SummaryFact = ({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) => (
    <div className="flex items-center gap-3">
        <dt className="flex items-center gap-3 text-fg-quaternary">
            {icon}
            <span className="sr-only">{label}</span>
        </dt>
        <dd className="text-xl text-primary">{children}</dd>
    </div>
);

/** Fee breakdown. The total is the only row that changes weight. */
export const PriceBreakdown = ({ lines, footnote, className }: { lines: SummaryLine[]; footnote?: string; className?: string }) => (
    <div className={cx("flex flex-col gap-3", className)}>
        {lines.map((line) => (
            <div
                key={line.label}
                className={cx("flex items-baseline justify-between gap-4", line.isTotal && "border-t border-secondary pt-4")}
            >
                <span className={cx(line.isTotal ? "text-3xl font-bold text-primary" : "text-lg text-secondary")}>{line.label}</span>
                <span className={cx("tabular-nums", line.isTotal ? "text-3xl font-bold text-primary" : "text-lg text-secondary")}>
                    {line.value}
                </span>
            </div>
        ))}
        {footnote && <p className="text-sm text-tertiary italic">{footnote}</p>}
    </div>
);

/**
 * The pinned totals bar above the footer rail.
 *
 * "Due Now" and "Due at Tee Time" are separated because a golfer paying a
 * deposit at a kiosk needs to know what is being charged to the card in front
 * of them versus what they will owe later at the counter.
 */
export const DueBar = ({
    dueNow,
    dueLater,
    dueLaterLabel = "Due at Tee Time",
    total,
    className,
}: {
    dueNow: string;
    dueLater?: string;
    dueLaterLabel?: string;
    total: string;
    className?: string;
}) => (
    <div className={cx("flex flex-col gap-1 px-16 py-4", className)}>
        <div className="flex justify-between text-lg text-secondary">
            <span>Due Now</span>
            <span className="tabular-nums">{dueNow}</span>
        </div>
        {dueLater && (
            <div className="flex justify-between text-lg text-secondary">
                <span>{dueLaterLabel}</span>
                <span className="tabular-nums">{dueLater}</span>
            </div>
        )}
        <div className="flex justify-between text-3xl font-bold text-primary">
            <span>Total</span>
            <span className="tabular-nums">{total}</span>
        </div>
    </div>
);
