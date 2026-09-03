import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { BRAND, ChartCard, ChartLegend, CHART_INK, CHART_SERIES, ChartTooltip } from "@/components/application/charts/chart-kit";

const meta = {
    title: "Components/Charts & Data/Radar Charts",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const skills = [
    { skill: "Driving", Olivia: 82, Marcus: 68 },
    { skill: "Approach", Olivia: 74, Marcus: 79 },
    { skill: "Short game", Olivia: 66, Marcus: 88 },
    { skill: "Putting", Olivia: 71, Marcus: 84 },
    { skill: "Bunker", Olivia: 58, Marcus: 72 },
    { skill: "Course mgmt", Olivia: 88, Marcus: 76 },
];

const polarAngle = { dataKey: "skill", tick: { fill: CHART_INK.secondary, fontSize: 12 } } as const;

/** Single series — brand green, one player's skill profile. */
export const SingleSeries: Story = {
    render: () => (
        <div className="mx-auto max-w-md">
            <ChartCard title="Skill profile" subtitle="Olivia Chen — assessment score (0–100)">
                <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={skills} outerRadius="72%">
                        <PolarGrid stroke={CHART_INK.grid} />
                        <PolarAngleAxis {...polarAngle} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Olivia" dataKey="Olivia" stroke={BRAND[600]} strokeWidth={2} fill={BRAND[500]} fillOpacity={0.2} />
                        <Tooltip content={<ChartTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    ),
};

/** Two series compared, with a legend so identity is never color-alone. */
export const Comparison: Story = {
    render: () => {
        const series = ["Olivia", "Marcus"] as const;
        return (
            <div className="mx-auto max-w-md">
                <ChartCard
                    title="Skill comparison"
                    subtitle="Assessment score (0–100)"
                    actions={<ChartLegend items={series.map((label, i) => ({ label, color: CHART_SERIES[i] }))} />}
                >
                    <ResponsiveContainer width="100%" height={320}>
                        <RadarChart data={skills} outerRadius="72%">
                            <PolarGrid stroke={CHART_INK.grid} />
                            <PolarAngleAxis {...polarAngle} />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                            {series.map((key, i) => (
                                <Radar key={key} name={key} dataKey={key} stroke={CHART_SERIES[i]} strokeWidth={2} fill={CHART_SERIES[i]} fillOpacity={0.15} />
                            ))}
                            <Tooltip content={<ChartTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        );
    },
};
