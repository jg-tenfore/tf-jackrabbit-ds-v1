import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, BRAND, ChartCard, ChartLegend, CHART_INK, CHART_SERIES, ChartTooltip } from "@/components/application/charts/chart-kit";

const meta = {
    title: "Components/Charts & Data/Line & Bar Charts",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const rounds = MONTHS.map((month, i) => ({ month, rounds: [820, 910, 1180, 1640, 2210, 2680, 3020, 2940, 2380, 1720, 1140, 940][i] }));

const revenue = MONTHS.map((month, i) => ({
    month,
    "Green fees": [42, 46, 58, 79, 104, 126][i % 6] + i,
    "Pro shop": [18, 20, 24, 31, 38, 44][i % 6] + (i % 4),
    "F & B": [12, 13, 17, 22, 28, 33][i % 6] + (i % 3),
}));

const bookings = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    Members: [24, 28, 26, 30, 44, 68, 62][i],
    Public: [12, 14, 18, 20, 34, 52, 48][i],
}));

const money = (v: React.ReactNode) => `$${Number(v).toLocaleString()}k`;

/** Single series — brand green. The title names the series, so no legend is needed. */
export const SingleLine: Story = {
    render: () => (
        <div className="mx-auto max-w-2xl">
            <ChartCard title="Rounds played" subtitle="Monthly rounds across all courses">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={rounds} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillRounds" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={BRAND[500]} stopOpacity={0.25} />
                                <stop offset="100%" stopColor={BRAND[500]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                        <XAxis dataKey="month" {...axisProps} />
                        <YAxis {...axisProps} width={40} />
                        <Tooltip content={<ChartTooltip valueFormatter={(v) => Number(v).toLocaleString()} />} cursor={{ stroke: CHART_INK.axis }} />
                        <Area type="monotone" dataKey="rounds" name="Rounds" stroke={BRAND[600]} strokeWidth={2} fill="url(#fillRounds)" activeDot={{ r: 4 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    ),
};

/** Multi-series line with a legend (identity is never color-alone). */
export const MultiLine: Story = {
    render: () => {
        const series = ["Green fees", "Pro shop", "F & B"] as const;
        return (
            <div className="mx-auto max-w-2xl">
                <ChartCard
                    title="Revenue by channel"
                    subtitle="Monthly, in thousands"
                    actions={<ChartLegend items={series.map((label, i) => ({ label, color: CHART_SERIES[i] }))} />}
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenue} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="month" {...axisProps} />
                            <YAxis {...axisProps} width={44} tickFormatter={(v) => `$${v}k`} />
                            <Tooltip content={<ChartTooltip valueFormatter={money} />} cursor={{ stroke: CHART_INK.axis }} />
                            {series.map((key, i) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={CHART_SERIES[i]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        );
    },
};

/** Grouped bars — members vs public bookings by day. Rounded data-ends. */
export const GroupedBar: Story = {
    render: () => {
        const series = ["Members", "Public"] as const;
        return (
            <div className="mx-auto max-w-2xl">
                <ChartCard
                    title="Bookings by day"
                    subtitle="This week"
                    actions={<ChartLegend items={series.map((label, i) => ({ label, color: CHART_SERIES[i] }))} />}
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bookings} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="day" {...axisProps} />
                            <YAxis {...axisProps} width={32} />
                            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            {series.map((key, i) => (
                                <Bar key={key} dataKey={key} fill={CHART_SERIES[i]} radius={[4, 4, 0, 0]} maxBarSize={22} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        );
    },
};

/** Stacked bars — a 2px surface gap between segments comes from the rounded ends. */
export const StackedBar: Story = {
    render: () => {
        const series = ["Members", "Public"] as const;
        return (
            <div className="mx-auto max-w-2xl">
                <ChartCard
                    title="Total bookings"
                    subtitle="Members + public, this week"
                    actions={<ChartLegend items={series.map((label, i) => ({ label, color: CHART_SERIES[i] }))} />}
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bookings} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="day" {...axisProps} />
                            <YAxis {...axisProps} width={32} />
                            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            <Bar dataKey="Members" stackId="a" fill={CHART_SERIES[0]} maxBarSize={28} />
                            <Bar dataKey="Public" stackId="a" fill={CHART_SERIES[1]} radius={[4, 4, 0, 0]} maxBarSize={28} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        );
    },
};
