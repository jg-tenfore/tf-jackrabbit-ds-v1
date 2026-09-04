import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DueBar, PriceBreakdown, VenueSummary } from "@/components/kiosk/booking/booking-summary";
import { GroupSizeSelector, SegmentedSelector, TransportSelector } from "@/components/kiosk/booking/segmented-selector";
import { SlotCard, TimeSlotCard } from "@/components/kiosk/booking/slot-card";
import { TeeTimeBooking } from "@/components/kiosk/booking/tee-time-booking";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { TEE_TIMES, VENUE } from "@/data/booking";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Booking/Tee Time",
    component: TeeTimeBooking,
    parameters: {
        // "centered" wraps the story in a padded box. At the kiosk viewport
        // (750x1298) a full-canvas frame then overflows by exactly that padding
        // — 32px — and the preview scrolls sideways on a panel that cannot.
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The tee sheet. Slots are a two-column grid because a 6-minute cadence yields ~90 tee times in a morning and one column would make the page a mile long. Tapping a slot opens the rate picker rather than booking directly — the same time is sold at several rates, so the time is the filter and the rate is the actual choice. The filter rail is pinned to the left edge and clipped by the canvas, matching the references.",
            },
        },
    },
} satisfies Meta<typeof TeeTimeBooking>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full tee sheet. Tap any slot to open the rate picker. */
export const BookATime: Story = {
    args: { slots: TEE_TIMES },
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen scroll={false} footer={<KioskFooterBar />}>
            <TeeTimeBooking {...args} />
        </KioskScreen>
    ),
};

/** A single slot card in isolation — available, selected and sold out. */
export const SlotCards: Story = {
    args: { slots: [] },
    render: () => (
        <div className="flex w-[420px] flex-col gap-4 p-8">
            <SlotCard slot={TEE_TIMES[0]} />
            <SlotCard slot={TEE_TIMES[1]} isSelected />
            <SlotCard slot={{ ...TEE_TIMES[2], isAvailable: false }} />
            <div className="grid grid-cols-3 gap-3 pt-4">
                <TimeSlotCard time="6:00 AM" />
                <TimeSlotCard time="6:30 AM" isSelected />
                <TimeSlotCard time="7:00 AM" isAvailable={false} />
            </div>
        </div>
    ),
};

/** The joined selectors: continuous bars with no dead gaps between targets. */
export const Selectors: Story = {
    args: { slots: [] },
    render: function SelectorSet() {
        const [size, setSize] = useState<number | null>(2);
        const [transport, setTransport] = useState<"walking" | "cart" | null>("cart");
        const [duration, setDuration] = useState<number | null>(2);
        return (
            <div className="flex w-[686px] flex-col gap-10 p-8">
                <GroupSizeSelector value={size} onChange={setSize} max={8} isOpenEnded />
                <TransportSelector value={transport} onChange={setTransport} />
                <SegmentedSelector
                    label="Duration"
                    size="lg"
                    value={duration}
                    onChange={setDuration}
                    options={[1, 2, 3].map((h) => ({ value: h, label: `${h} ${h === 1 ? "hour" : "hours"}` }))}
                />
            </div>
        );
    },
};

/** The review composition: venue facts, fee breakdown, and the pinned due bar. */
export const ReviewSummary: Story = {
    args: { slots: [] },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen footer={<><DueBar dueNow="$20.74" dueLater="$1.71" total="$55.22" /><KioskFooterBar /></>}>
            <div className="flex flex-col gap-8 px-16 py-12">
                <VenueSummary
                    venueName={VENUE.name}
                    address={VENUE.address}
                    resource="Caddy Cove"
                    date="Thursday, January 8th, 2026"
                    duration="2 hours"
                    startTime="3:00PM"
                />
                <GroupSizeSelector value={2} onChange={() => {}} max={6} />
                <PriceBreakdown
                    lines={[
                        { label: "Reservation Fees", value: "$92.00" },
                        { label: "Convenience Fee", value: "$5.00" },
                        { label: "Estimate Taxes", value: "$1.71" },
                        { label: "Total", value: "$55.22", isTotal: true },
                    ]}
                    footnote="*Morbi leo risus, porta ac consectetur ac, vestibulum at eros."
                />
            </div>
        </KioskScreen>
    ),
};
