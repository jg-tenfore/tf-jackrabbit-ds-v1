import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KioskDatePicker, type DayAvailability } from "@/components/kiosk/booking/kiosk-date-picker";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Booking/Date Picker",
    component: KioskDatePicker,
    parameters: {
        // "centered" wraps the story in a padded box. At the kiosk viewport
        // (750x1298) a full-canvas frame then overflows by exactly that padding
        // — 32px — and the preview scrolls sideways on a panel that cannot.
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Every booking surface opens on the same question — which day? — so this is one component rather than a calendar per flow. Two states: a **week** strip (the default, because kiosk bookings are overwhelmingly for today or tomorrow, and a strip answers that in one tap without opening anything) and a **month** grid for genuine advance booking. It deliberately does not reuse the ported `Components/Forms/Date Picker`: that is a desktop popover with day cells far below the kiosk touch floor.",
            },
        },
    },
    argTypes: { mode: { control: "inline-radio", options: ["week", "month"] }, stripLength: { control: { type: "number", min: 3, max: 10 } } },
} satisfies Meta<typeof KioskDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Harness = (props: Partial<Parameters<typeof KioskDatePicker>[0]>) => {
    const [date, setDate] = useState(new Date());
    return (
        <KioskScreen>
            <div className="px-10 py-12">
                <KioskDatePicker selected={date} onSelect={setDate} {...props} />
            </div>
        </KioskScreen>
    );
};

/** The default. Tap the chevron to expand to the month. */
export const WeekStrip: Story = {
    args: { selected: new Date(), onSelect: () => {} },
    decorators: [withKioskFrame()],
    render: () => <Harness />,
};

/** Full month grid, with a Today shortcut back to the current date. */
export const MonthGrid: Story = {
    args: { selected: new Date(), onSelect: () => {} },
    decorators: [withKioskFrame()],
    render: () => <Harness mode="month" />,
};

/**
 * Sold-out and closed days stay visible but unpressable — absence is
 * information, and removing them would silently reflow the strip.
 */
export const WithUnavailableDays: Story = {
    args: { selected: new Date(), onSelect: () => {} },
    decorators: [withKioskFrame()],
    render: function Unavailable() {
        const today = new Date();
        const days: DayAvailability[] = Array.from({ length: 14 }, (_, i) => {
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            return { date, isAvailable: i !== 2 && i !== 3, hasInventory: i % 4 !== 1 };
        });
        const [selected, setSelected] = useState(today);
        return (
            <KioskScreen>
                <div className="px-10 py-12">
                    <KioskDatePicker selected={selected} onSelect={setSelected} days={days} />
                </div>
            </KioskScreen>
        );
    },
};
