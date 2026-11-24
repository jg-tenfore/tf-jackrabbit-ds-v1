"use client";

import { BookingReviewSection } from "@/components/kiosk/booking/booking-review-sections";
import { VenueSummary } from "@/components/kiosk/booking/booking-summary";
import { GroupSizeSelector, TransportSelector } from "@/components/kiosk/booking/segmented-selector";
import { KioskButton } from "@/components/kiosk/kiosk-button";

export type Transport = "walking" | "cart";

/**
 * Group Size, Transportation and Subcourse for a waitlist entry.
 *
 * Group Size is where the standby board's "4 players" comes from, so it runs
 * 1–8 with the last segment open-ended ("8+"), matching what the board can
 * display. The caller owns Continue, which should wait for all three answers.
 *
 * The Select Subcourse picker is not built yet, so its button stands in by
 * choosing "Main Course Only".
 */
export const WaitlistGroupSizeScreen = ({
    groupSize,
    onGroupSizeChange,
    transport,
    onTransportChange,
    subcourse,
    onSelectSubcourse,
}: {
    groupSize: number | null;
    onGroupSizeChange: (size: number) => void;
    transport: Transport | null;
    onTransportChange: (transport: Transport) => void;
    subcourse: string | null;
    onSelectSubcourse: () => void;
}) => (
    <div className="flex flex-col">
        <BookingReviewSection className="border-t-0 pt-10">
            <VenueSummary
                venueName="Falls Road Golf Course"
                address="MCG Golf Courses"
                date="Thursday, January 8th, 2026"
                duration="2 hours"
                startTime="6:00AM – 9:00AM"
            />
        </BookingReviewSection>
        <BookingReviewSection>
            <GroupSizeSelector value={groupSize} onChange={onGroupSizeChange} max={8} isOpenEnded />
        </BookingReviewSection>
        <BookingReviewSection>
            <TransportSelector value={transport} onChange={onTransportChange} />
        </BookingReviewSection>
        <BookingReviewSection>
            <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-primary">Subcourse</h3>
                <KioskButton size="xl" isFullWidth onPress={onSelectSubcourse} className="text-primary">
                    {subcourse ?? "Select Subcourse"}
                </KioskButton>
            </div>
        </BookingReviewSection>
    </div>
);
