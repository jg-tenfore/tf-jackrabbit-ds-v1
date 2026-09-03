import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarCheck01, CurrencyDollar, Mail01, SlashCircle01, Star01, UserPlus01 } from "@untitledui/icons";
import { ActivityFeed } from "@/components/application/activity-feed/activity-feed";

const meta = {
    title: "Components/Feedback & Status/Activity Feed",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bold = (name: string) => <span className="font-semibold text-primary">{name}</span>;

/** Member activity timeline. */
export const Default: Story = {
    render: () => (
        <div className="mx-auto max-w-lg rounded-xl bg-primary p-6 ring-1 ring-secondary">
            <h3 className="mb-5 text-md font-semibold text-primary">Recent activity</h3>
            <ActivityFeed
                items={[
                    {
                        id: "1",
                        icon: CalendarCheck01,
                        color: "brand",
                        title: <>{bold("Olivia Chen")} booked a tee time for Saturday 9:20 AM</>,
                        description: "Championship course · foursome",
                        timestamp: "2m ago",
                    },
                    {
                        id: "2",
                        icon: CurrencyDollar,
                        color: "success",
                        title: <>Payment of {bold("$148.00")} received from {bold("Marcus Bennett")}</>,
                        description: "Green fees + cart",
                        timestamp: "18m ago",
                    },
                    {
                        id: "3",
                        icon: UserPlus01,
                        color: "brand",
                        title: <>{bold("James Park")} joined as a new annual member</>,
                        timestamp: "1h ago",
                    },
                    {
                        id: "4",
                        icon: Star01,
                        color: "warning",
                        title: <>{bold("Dana Lee")} left a 5-star review for the Bunker Play clinic</>,
                        timestamp: "3h ago",
                    },
                    {
                        id: "5",
                        icon: SlashCircle01,
                        color: "error",
                        title: <>{bold("Chris Wu")} cancelled a tee time for today 2:40 PM</>,
                        description: "Within 24h — cancellation fee applied",
                        timestamp: "5h ago",
                    },
                    {
                        id: "6",
                        icon: Mail01,
                        color: "gray",
                        title: <>Weekly newsletter sent to {bold("1,204 members")}</>,
                        timestamp: "Yesterday",
                    },
                ]}
            />
        </div>
    ),
};
