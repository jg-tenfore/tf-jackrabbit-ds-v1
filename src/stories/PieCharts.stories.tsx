import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard, CHART_INK, CHART_SERIES, ChartTooltip } from "@/components/application/charts/chart-kit";

const meta = {
    title: "Components/Charts & Data/Pie Charts",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const revenueMix = [
    { name: "Green fees", value: 148 },
    { name: "Pro shop", value: 62 },
    { name: "F & B", value: 44 },
    { name: "Lessons", value: 28 },
    { name: "Events", value: 21 },
];

const total = revenueMix.reduce((sum, d) => sum + d.value, 0);
const money = (v: React.ReactNode) => `$${Number(v).toLocaleString()}k`;

/** Direct-labelled legend — required because three of the slice hues sit below 3:1 on white (relief rule). */
const LabelledLegend = () => (
    <ul className="flex flex-col gap-2">
        {revenueMix.map((slice, i) => (
            <li key={slice.name} className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: CHART_SERIES[i] }} aria-hidden="true" />
                <span className="text-secondary">{slice.name}</span>
                <span className="ml-auto font-medium text-primary tabular-nums">${slice.value}k</span>
                <span className="w-10 text-right text-tertiary tabular-nums">{Math.round((slice.value / total) * 100)}%</span>
            </li>
        ))}
    </ul>
);

/** Pie — categorical slices with a 2px surface gap between them. */
export const Pie_: Story = {
    name: "Pie",
    render: () => (
        <div className="mx-auto max-w-xl">
            <ChartCard title="Revenue mix" subtitle="Share of revenue, trailing 12 months">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                    <ResponsiveContainer width="100%" height={240} className="max-w-56">
                        <PieChart>
                            <Pie data={revenueMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} paddingAngle={2} stroke="#ffffff" strokeWidth={2}>
                                {revenueMix.map((_, i) => (
                                    <Cell key={i} fill={CHART_SERIES[i]} />
                                ))}
                            </Pie>
                            <Tooltip content={<ChartTooltip valueFormatter={money} />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="w-full sm:max-w-64">
                        <LabelledLegend />
                    </div>
                </div>
            </ChartCard>
        </div>
    ),
};

/** Donut — same data, with the headline total in the hole. */
export const Donut: Story = {
    render: () => (
        <div className="mx-auto max-w-xl">
            <ChartCard title="Revenue mix" subtitle="Share of revenue, trailing 12 months">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                    <div className="relative max-w-56 flex-1">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={revenueMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={66} outerRadius={100} paddingAngle={2} stroke="#ffffff" strokeWidth={2}>
                                    {revenueMix.map((_, i) => (
                                        <Cell key={i} fill={CHART_SERIES[i]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip valueFormatter={money} />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs text-tertiary">Total</span>
                            <span className="text-xl font-semibold text-primary tabular-nums" style={{ color: CHART_INK.primary }}>
                                ${total}k
                            </span>
                        </div>
                    </div>
                    <div className="w-full sm:max-w-64">
                        <LabelledLegend />
                    </div>
                </div>
            </ChartCard>
        </div>
    ),
};
