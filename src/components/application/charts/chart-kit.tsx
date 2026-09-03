"use client";

import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/**
 * Tenfore chart palette. The categorical series colors are the data-viz skill's
 * validated 8-hue set (worst adjacent CVD ΔE 9.1, normal-vision 19.6 on a white
 * surface). Assign them in fixed order, never cycled. Brand green is reserved for
 * single-series / primary-emphasis charts. Aqua, yellow and magenta sit below 3:1
 * on white, so any chart using them ships a legend + direct labels (the relief rule).
 */
export const CHART_SERIES = [
    "#2a78d6", // 1 blue
    "#eb6834", // 2 orange
    "#1baf7a", // 3 aqua
    "#eda100", // 4 yellow
    "#e87ba4", // 5 magenta
    "#008300", // 6 green
    "#4a3aa7", // 7 violet
    "#e34948", // 8 red
] as const;

/** Brand green ramp — use for single-series and primary emphasis. */
export const BRAND = { 400: "#4ab675", 500: "#339c5d", 600: "#227c48", 700: "#1b643b" } as const;

/** Neutral chart chrome (light surface). */
export const CHART_INK = {
    primary: "#0b0b0b",
    secondary: "#52514e",
    muted: "#898781",
    grid: "#e1e0d9",
    axis: "#c3c2b7",
    good: "#006300",
    bad: "#d03b3b",
} as const;

/** Shared axis props for a recessive, hairline look. */
export const axisProps = {
    stroke: CHART_INK.axis,
    tick: { fill: CHART_INK.muted, fontSize: 12 },
    tickLine: false,
    axisLine: false,
} as const;

/**
 * Current-vs-past comparison colors — for the "single measure vs a prior period"
 * case: the current series in brand, the comparison series in neutral gray.
 */
export const COMPARISON = { current: BRAND[600], past: CHART_INK.axis } as const;

/**
 * Compact axis/tooltip number formatting per the data-viz rules: at most 3
 * numeric chars, 1 decimal, 1 unit letter — `1.2k`, `$3.4m`, `1.1b`.
 */
export const formatCompact = (value: number, currency = false): string => {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    const [scaled, unit] = abs >= 1e9 ? [abs / 1e9, "b"] : abs >= 1e6 ? [abs / 1e6, "m"] : abs >= 1e3 ? [abs / 1e3, "k"] : [abs, ""];
    const num = unit ? scaled.toFixed(scaled >= 100 ? 0 : 1).replace(/\.0$/, "") : scaled.toLocaleString();
    return `${sign}${currency ? "$" : ""}${num}${unit}`;
};

interface TooltipEntry {
    name?: ReactNode;
    value?: ReactNode;
    color?: string;
    dataKey?: string | number;
}

/** Custom recharts tooltip — a compact card with a color swatch per series. */
export const ChartTooltip = ({
    active,
    payload,
    label,
    valueFormatter = (v) => String(v),
}: {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: ReactNode;
    valueFormatter?: (value: ReactNode) => string;
}) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg bg-primary px-3 py-2 shadow-lg ring-1 ring-secondary_alt">
            {label != null && <p className="mb-1 text-xs font-semibold text-primary">{label}</p>}
            <div className="flex flex-col gap-1">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden="true" />
                        {entry.name != null && <span className="text-tertiary">{entry.name}</span>}
                        <span className="ml-auto font-medium text-primary tabular-nums">{valueFormatter(entry.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/** A titled card wrapper for a chart, matching the DS surface style. */
export const ChartCard = ({
    title,
    subtitle,
    actions,
    children,
    className,
}: {
    title?: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}) => (
    <div className={cx("flex w-full flex-col gap-5 rounded-xl bg-primary p-5 ring-1 ring-secondary", className)}>
        {(title || subtitle || actions) && (
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    {title && <h3 className="text-md font-semibold text-primary">{title}</h3>}
                    {subtitle && <p className="text-sm text-tertiary">{subtitle}</p>}
                </div>
                {actions}
            </div>
        )}
        {children}
    </div>
);

/** A simple legend row — identity is never color-alone. */
export const ChartLegend = ({ items }: { items: { label: string; color: string }[] }) => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {items.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <span className="text-xs font-medium text-tertiary">{item.label}</span>
            </div>
        ))}
    </div>
);
