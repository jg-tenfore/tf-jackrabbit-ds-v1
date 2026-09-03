import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CurrencyDollar, Flag06, TrendUp01, Users01 } from "@untitledui/icons";
import { MetricCard } from "@/components/application/metrics/metric-card";

const meta = {
    title: "Components/Charts & Data/Metrics",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const spark = (points: number[]) => points.map((value) => ({ value }));

/** A single metric tile with an icon, delta, and sparkline. */
export const Default: Story = {
    render: () => (
        <div className="max-w-xs">
            <MetricCard title="Total revenue" value="$264k" change={12.4} changeLabel="vs last month" icon={CurrencyDollar} trendData={spark([40, 44, 42, 51, 58, 64, 72])} />
        </div>
    ),
};

/** A metric row — the common dashboard header. */
export const MetricRow: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Total revenue" value="$264k" change={12.4} icon={CurrencyDollar} trendData={spark([40, 44, 42, 51, 58, 64, 72])} />
            <MetricCard title="Rounds played" value="3,204" change={8.1} icon={Flag06} trendData={spark([28, 30, 33, 31, 38, 42, 46])} />
            <MetricCard title="New members" value="122" change={-3.2} icon={Users01} trendData={spark([22, 24, 20, 19, 18, 17, 16])} />
            <MetricCard title="Avg. spend / round" value="$82.40" change={2.6} icon={TrendUp01} trendData={spark([70, 72, 74, 73, 78, 80, 82])} />
        </div>
    ),
};

/** Compact tiles without sparklines. */
export const Simple: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <MetricCard title="Utilization" value="74%" change={5.4} />
            <MetricCard title="No-shows" value="3.1%" change={-1.2} />
            <MetricCard title="Member retention" value="91%" change={0.8} />
        </div>
    ),
};
