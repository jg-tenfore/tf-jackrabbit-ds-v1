import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateSelector } from "@/components/booking/date-selector";

/**
 * A horizontal strip of selectable date chips for picking a day — styled after
 * the OpenTable/Resy date row. Each chip shows the weekday and day number, today
 * is marked with a dot, and the strip scrolls horizontally when it overflows.
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 */
const meta = {
    title: "Components/Forms/Date Selector",
    component: DateSelector,
    parameters: { layout: "padded" },
    argTypes: {
        days: {
            control: { type: "number", min: 3, max: 21 },
            description: "Number of day chips in the strip.",
        },
    },
} satisfies Meta<typeof DateSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default 7-day strip, controlled — pick a day and it echoes the selection. */
export const Playground: Story = {
    args: { days: 7, "aria-label": "Select a tee-time date" },
    render: (args) => {
        const Demo = () => {
            const [date, setDate] = useState<Date>();
            return (
                <div className="flex max-w-2xl flex-col gap-4">
                    <DateSelector {...args} value={date} onChange={setDate} />
                    <p className="text-sm text-tertiary">
                        Selected:{" "}
                        <span className="font-medium text-primary">
                            {date ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "None"}
                        </span>
                    </p>
                </div>
            );
        };
        return <Demo />;
    },
};

/** Two weeks of chips — the strip scrolls horizontally when it runs out of room. */
export const TwoWeeks: Story = {
    args: { days: 14 },
    render: (args) => (
        <div className="max-w-2xl">
            <DateSelector {...args} defaultValue={new Date()} />
        </div>
    ),
};

/** Preselected day via `defaultValue` (uncontrolled) — here, two days out. */
export const Preselected: Story = {
    render: () => {
        const preset = new Date();
        preset.setDate(preset.getDate() + 2);
        return (
            <div className="max-w-2xl">
                <DateSelector defaultValue={preset} />
            </div>
        );
    },
};
