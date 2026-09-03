import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { BRAND, ChartCard, CHART_INK } from "@/components/application/charts/chart-kit";

const meta = {
    title: "Components/Charts & Data/Activity Gauges",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single radial progress gauge with a centered value. Single series → brand green (or a passed color). */
const Gauge = ({ value, label, sublabel, color = BRAND[600] }: { value: number; label: string; sublabel?: string; color?: string }) => (
    <div className="flex flex-col items-center gap-3">
        <div className="relative size-40">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="78%" outerRadius="100%" data={[{ value }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                    <RadialBar background={{ fill: CHART_INK.grid }} dataKey="value" cornerRadius={999} fill={color} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-primary tabular-nums">{value}%</span>
            </div>
        </div>
        <div className="text-center">
            <p className="text-sm font-medium text-secondary">{label}</p>
            {sublabel && <p className="text-xs text-tertiary">{sublabel}</p>}
        </div>
    </div>
);

/** A single utilization gauge. */
export const Single: Story = {
    render: () => (
        <div className="mx-auto max-w-xs">
            <ChartCard title="Tee sheet utilization" subtitle="Today">
                <div className="flex justify-center py-2">
                    <Gauge value={74} label="Booked" sublabel="182 of 246 slots" />
                </div>
            </ChartCard>
        </div>
    ),
};

/** A row of goal gauges — each is its own single-series gauge. */
export const GaugeGroup: Story = {
    render: () => (
        <div className="mx-auto max-w-2xl">
            <ChartCard title="Monthly goals" subtitle="Progress toward July targets">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <Gauge value={74} label="Tee sheet" sublabel="Utilization" color={BRAND[600]} />
                    <Gauge value={61} label="Membership" sublabel="122 of 200 new" color="#2a78d6" />
                    <Gauge value={88} label="Revenue" sublabel="$264k of $300k" color="#eb6834" />
                </div>
            </ChartCard>
        </div>
    ),
};
