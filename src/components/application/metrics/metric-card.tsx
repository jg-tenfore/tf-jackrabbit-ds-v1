"use client";

import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { BRAND, CHART_INK } from "@/components/application/charts/chart-kit";
import { cx } from "@/utils/cx";

export interface MetricCardProps {
    /** Metric name. */
    title: string;
    /** Formatted primary value (e.g. "$264k", "1,204"). */
    value: ReactNode;
    /** Signed change vs. the comparison period, in percent. Omit to hide the delta. */
    change?: number;
    /** Comparison label, e.g. "vs last month". */
    changeLabel?: string;
    /** Leading icon. */
    icon?: ComponentType<HTMLAttributes<HTMLOrSVGElement>>;
    /** Optional sparkline data — an array of `{ value }` points. */
    trendData?: { value: number }[];
    className?: string;
}

/**
 * A KPI tile: label, large value, a signed delta (icon + label + color — never
 * color alone), and an optional brand-green sparkline. Built for metric rows on
 * dashboards.
 */
export const MetricCard = ({ title, value, change, changeLabel = "vs last month", icon: Icon, trendData, className }: MetricCardProps) => {
    const isUp = (change ?? 0) >= 0;
    const DeltaIcon = isUp ? ArrowUp : ArrowDown;
    const deltaColor = isUp ? "text-success-primary" : "text-error-primary";

    return (
        <div className={cx("flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary", className)}>
            <div className="flex items-center gap-2">
                {Icon && (
                    <span className="flex size-8 items-center justify-center rounded-lg bg-brand-secondary text-fg-brand-primary">
                        <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                )}
                <p className="text-sm font-medium text-tertiary">{title}</p>
            </div>

            <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p className="text-display-xs font-semibold text-primary tabular-nums">{value}</p>
                    {change != null && (
                        <p className="flex items-center gap-1 text-sm">
                            <span className={cx("flex items-center gap-0.5 font-medium", deltaColor)}>
                                <DeltaIcon className="size-4" aria-hidden="true" />
                                {Math.abs(change)}%
                            </span>
                            <span className="text-tertiary">{changeLabel}</span>
                        </p>
                    )}
                </div>

                {trendData && trendData.length > 1 && (
                    <div className="h-12 w-24 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`spark-${title.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={isUp ? BRAND[500] : CHART_INK.bad} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={isUp ? BRAND[500] : CHART_INK.bad} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isUp ? BRAND[600] : CHART_INK.bad}
                                    strokeWidth={2}
                                    fill={`url(#spark-${title.replace(/\s+/g, "")})`}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};
