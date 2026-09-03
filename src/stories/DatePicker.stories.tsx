import { getLocalTimeZone, today } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { Input } from "@/components/base/input/input";

const teeDate = today(getLocalTimeZone());

/**
 * Pick your tee time at Sagamore. The Date Picker pops a calendar for a single
 * round, while the Date Range Picker books a multi-day stay-and-play — drag from
 * arrival to your final back-nine, or tap a preset like "This week".
 *
 * Both are built on React Aria Components and take `@internationalized/date`
 * values (`CalendarDate` / `RangeValue`) for controlled defaults.
 */
const meta = {
    title: "Components/Forms/Date Picker",
    component: DatePicker,
    parameters: { layout: "centered" },
    argTypes: {
        size: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
            description: "Sizes the trigger button.",
        },
        isDisabled: {
            control: "boolean",
            description: "Greys out the picker when the course is closed.",
        },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Single-date picker — choose the day you walk the first tee. */
export const Playground: Story = {
    args: {
        size: "sm",
        defaultValue: teeDate,
    },
};

/** The trigger button scales across every size, from a tight scorecard chip to a clubhouse banner. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col items-start gap-4">
            <DatePicker {...args} size="sm" />
            <DatePicker {...args} size="md" />
            <DatePicker {...args} size="lg" />
            <DatePicker {...args} size="xl" />
        </div>
    ),
    args: {
        defaultValue: teeDate,
    },
};

/** Closed for aeration — the picker is disabled until the greens recover. */
export const Disabled: Story = {
    args: {
        defaultValue: teeDate,
        isDisabled: true,
    },
};

/** Date + time picker — pair the calendar date with a tee-off time for a full booking slot. */
export const DateTimePicker: Story = {
    render: () => (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-secondary">Tee date</span>
                <DatePicker defaultValue={teeDate} size="md" />
            </div>
            <Input type="time" label="Tee time" defaultValue="07:10" className="w-36" />
        </div>
    ),
};

type RangeStory = StoryObj<typeof DateRangePicker>;

/** Date Range Picker — book a stay-and-play from arrival through your final round, with quick presets. */
export const RangePicker: RangeStory = {
    render: (args) => <DateRangePicker {...args} />,
    args: {
        size: "sm",
        defaultValue: {
            start: teeDate,
            end: teeDate.add({ days: 2 }),
        },
    },
};

/**
 * Range Picker with presets — the popover carries a left rail of quick ranges
 * (Today, Yesterday, This / Last week, This / Last month, This / Last year, All
 * time) plus in-calendar "Last week / month / year" shortcuts. Opened by default
 * here so the presets are visible; the rail shows on wider screens (lg+).
 */
export const RangePickerWithPresets: RangeStory = {
    render: (args) => (
        <div className="min-h-[560px]">
            <DateRangePicker {...args} />
        </div>
    ),
    args: {
        size: "sm",
        defaultOpen: true,
        defaultValue: {
            start: teeDate,
            end: teeDate.add({ days: 2 }),
        },
    },
};

/** A disabled range — the back-nine getaway is fully booked. */
export const RangeDisabled: RangeStory = {
    render: (args) => <DateRangePicker {...args} />,
    args: {
        isDisabled: true,
        defaultValue: {
            start: teeDate,
            end: teeDate.add({ days: 2 }),
        },
    },
};
