import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs } from "@/components/application/tabs/tabs";
import { COURSES, TEE_TIMES, formatPrice, RATE_LABELS, STATUS_LABELS } from "@/data/sagamore";

/**
 * Tabs let golfers switch between tee sheets without leaving the page — flipping
 * between today and the weekend, or between the Championship and Executive
 * courses. The monochromatic theme renders every variant in greyscale.
 */
const meta = {
    title: "Components/Navigation/Tabs",
    component: Tabs,
    parameters: { layout: "centered" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default tee-sheet switcher: today, tomorrow, and the weekend. */
export const Playground: Story = {
    render: () => (
        <Tabs className="w-100">
            <Tabs.List type="button-border" size="md">
                <Tabs.Item id="today">Today</Tabs.Item>
                <Tabs.Item id="tomorrow">Tomorrow</Tabs.Item>
                <Tabs.Item id="weekend">This weekend</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel id="today" className="pt-4 text-sm text-secondary">
                6 tee times open on the Championship today.
            </Tabs.Panel>
            <Tabs.Panel id="tomorrow" className="pt-4 text-sm text-secondary">
                Tomorrow’s sheet opens at 6:00 AM — book early for morning frost delays.
            </Tabs.Panel>
            <Tabs.Panel id="weekend" className="pt-4 text-sm text-secondary">
                Weekend rates apply Saturday and Sunday until noon.
            </Tabs.Panel>
        </Tabs>
    ),
};

/** Underline tabs switching between the two Sagamore courses, with slot counts. */
export const CourseSwitcher: Story = {
    render: () => (
        <Tabs className="w-120">
            <Tabs.List type="underline" size="md">
                <Tabs.Item id="championship" badge={4}>
                    The Championship
                </Tabs.Item>
                <Tabs.Item id="executive" badge={2}>
                    The Executive
                </Tabs.Item>
            </Tabs.List>
            {COURSES.map((course) => (
                <Tabs.Panel key={course.id} id={course.id} className="pt-4 text-sm text-secondary">
                    <p className="font-semibold text-primary">
                        {course.name} — {course.holes} holes, par {course.par}
                    </p>
                    <p className="mt-1">{course.description}</p>
                </Tabs.Panel>
            ))}
        </Tabs>
    ),
};

/** Pill-style tabs filtering the tee sheet by rate type. */
export const RateFilter: Story = {
    render: () => (
        <Tabs className="w-120">
            <Tabs.List type="button-minimal" size="sm">
                <Tabs.Item id="standard">{RATE_LABELS.standard}</Tabs.Item>
                <Tabs.Item id="twilight">{RATE_LABELS.twilight}</Tabs.Item>
                <Tabs.Item id="member">{RATE_LABELS.member}</Tabs.Item>
                <Tabs.Item id="replay">{RATE_LABELS.replay}</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel id="standard" className="pt-4 text-sm text-secondary">
                {TEE_TIMES.filter((t) => t.rate === "standard").map((t) => (
                    <div key={t.id}>
                        {t.label} · {formatPrice(t.price)} · {STATUS_LABELS[t.status]}
                    </div>
                ))}
            </Tabs.Panel>
            <Tabs.Panel id="twilight" className="pt-4 text-sm text-secondary">
                Twilight pricing begins at 4:00 PM — carts included.
            </Tabs.Panel>
            <Tabs.Panel id="member" className="pt-4 text-sm text-secondary">
                Member tee times are complimentary and open seven days ahead.
            </Tabs.Panel>
            <Tabs.Panel id="replay" className="pt-4 text-sm text-secondary">
                Replay the Executive after your round for a reduced rate.
            </Tabs.Panel>
        </Tabs>
    ),
};

/**
 * Edge case: a disabled tab. The maintenance window on the back nine can't be
 * booked, so its tab is disabled while the others stay live.
 */
export const WithDisabledTab: Story = {
    render: () => (
        <Tabs className="w-100" disabledKeys={["maintenance"]}>
            <Tabs.List type="button-gray" size="md">
                <Tabs.Item id="front">Front nine</Tabs.Item>
                <Tabs.Item id="back">Back nine</Tabs.Item>
                <Tabs.Item id="maintenance">Aeration (closed)</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel id="front" className="pt-4 text-sm text-secondary">
                Holes 1–9 are open and walking the full loop.
            </Tabs.Panel>
            <Tabs.Panel id="back" className="pt-4 text-sm text-secondary">
                Holes 10–18 are cart-path only after recent rain.
            </Tabs.Panel>
            <Tabs.Panel id="maintenance" className="pt-4 text-sm text-secondary">
                Greens are being aerated this week — back online Friday.
            </Tabs.Panel>
        </Tabs>
    ),
};
