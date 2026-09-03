import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "@/components/application/date-picker/calendar";
import { RangeCalendar } from "@/components/application/date-picker/range-calendar";

const meta = {
    title: "Components/Forms/Calendar",
    component: Calendar,
    parameters: { layout: "centered" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = today(getLocalTimeZone());

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="w-max rounded-xl bg-primary p-5 shadow-sm ring-1 ring-secondary">{children}</div>
);

/** Single-date calendar with a date input and Today shortcut. */
export const Default: Story = {
    render: () => (
        <Card>
            <Calendar aria-label="Select a date" />
        </Card>
    ),
};

/** Highlighted dates — e.g. days with scheduled events. */
export const HighlightedDates: Story = {
    render: () => (
        <Card>
            <Calendar aria-label="Event calendar" highlightedDates={[now.add({ days: 2 }), now.add({ days: 5 }), now.add({ days: 11 }), now.add({ days: 18 })]} />
        </Card>
    ),
};

/** Range calendar with preset shortcuts — for reporting date ranges. */
export const Range: Story = {
    render: () => (
        <Card>
            <RangeCalendar aria-label="Select a date range" visibleDuration={{ months: 2 }} showPresetsOnDesktop />
        </Card>
    ),
};
