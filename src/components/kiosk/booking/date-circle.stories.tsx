import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateCircle } from "@/components/kiosk/booking/date-circle";

const day = (offset: number, extra: { isAvailable?: boolean; hasInventory?: boolean } = {}) => {
    const date = new Date(2026, 0, 8 + offset);
    return { date, hasInventory: true, ...extra };
};

const meta = {
    title: "Components/Kiosk Booking/Date Circle",
    component: DateCircle,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `One date in a picker — the circular target the whole booking flow turns on.

It carries **four independent signals** at once, which is why it is a component rather than a styled button repeated in two places:

| Signal | Reads as |
|---|---|
| available | white with a ring; unavailable is filled grey and disabled |
| selected | brand ring plus a check badge |
| inventory | a dot under the numeral — "bookable" and "has slots left" are different facts, and a day can be one without the other |
| muted | in range and bookable, but outside the month being browsed |

**Two sizes, and the reason matters.** \`md\` is the week strip, where five circles have the row to themselves. \`sm\` is the month grid, where seven columns share the same width — at \`md\` the selected badge overhangs its column and collides with the next date. Sizing the circle is what fixes that; shrinking the badge alone just makes it hard to see.`,
            },
        },
    },
} satisfies Meta<typeof DateCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every state at both sizes, side by side. */
export const AllStates: Story = {
    args: { day: day(0), isSelected: false, onSelect: () => {} },
    render: () => (
        <div className="flex flex-col gap-10 bg-primary p-8">
            {(["md", "sm"] as const).map((size) => (
                <div key={size} className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-tertiary uppercase">{size === "md" ? "md — week strip" : "sm — month grid"}</p>
                    <div className="flex items-start gap-6">
                        <Labelled label="Available">
                            <DateCircle size={size} day={day(0)} isSelected={false} onSelect={() => {}} />
                        </Labelled>
                        <Labelled label="Selected">
                            <DateCircle size={size} day={day(1)} isSelected onSelect={() => {}} />
                        </Labelled>
                        <Labelled label="No inventory">
                            <DateCircle size={size} day={day(2, { hasInventory: false })} isSelected={false} onSelect={() => {}} />
                        </Labelled>
                        <Labelled label="Unavailable">
                            <DateCircle size={size} day={day(3, { isAvailable: false })} isSelected={false} onSelect={() => {}} />
                        </Labelled>
                        <Labelled label="Muted">
                            <DateCircle size={size} day={day(4)} isSelected={false} isMuted onSelect={() => {}} />
                        </Labelled>
                        <Labelled label="With weekday">
                            <DateCircle size={size} day={day(5)} isSelected={false} showWeekday onSelect={() => {}} />
                        </Labelled>
                    </div>
                </div>
            ))}
        </div>
    ),
};

/**
 * The collision the `sm` size exists to prevent.
 *
 * Seven columns at the month grid's width, with the selected badge overhanging.
 * At `md` it laps into the neighbouring date; at `sm` it clears.
 */
export const MonthColumnFit: Story = {
    args: { day: day(0), isSelected: false, onSelect: () => {} },
    render: () => (
        <div className="flex flex-col gap-8 bg-primary p-8">
            {(["md", "sm"] as const).map((size) => (
                <div key={size} className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-tertiary uppercase">{size} in a 7-column grid</p>
                    <div className="grid w-[490px] grid-cols-7 justify-items-center gap-y-4 ring-1 ring-border-secondary">
                        {Array.from({ length: 7 }, (_, i) => (
                            <DateCircle key={i} size={size} day={day(i)} isSelected={i === 3} onSelect={() => {}} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
};

const Labelled = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-2">
        {children}
        <span className="text-xs text-tertiary">{label}</span>
    </div>
);
