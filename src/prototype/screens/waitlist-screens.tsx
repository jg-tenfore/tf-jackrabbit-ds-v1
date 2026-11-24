"use client";

import { useState } from "react";
import { BookingActionBar, StepFooter } from "@/components/kiosk/booking/booking-review-sections";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { StandbyBoardScreen } from "@/components/kiosk/screens/standby-board-screen";
import { type Transport, WaitlistGroupSizeScreen } from "@/components/kiosk/waitlist/group-size-screen";
import { PlaceInLine } from "@/components/kiosk/waitlist/place-in-line";
import { boardName, nextPlaceInLine, useLiveStandby } from "@/components/kiosk/waitlist/use-live-standby";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { useNavigation } from "@/prototype/navigation";
import { usePrototype } from "@/prototype/prototype-state";
import { useEndSession } from "@/prototype/session-lifecycle";
import { useKioskSession } from "@/providers/kiosk-session";
import { assetUrl } from "@/utils/asset-url";
import { PrototypeGlobalNav } from "./booking-screens";

/**
 * Join Waitlist, step one: party size, transport, subcourse.
 *
 * A signed-in member is already named, so Continue goes straight to the
 * confirmation; a guest is asked for a name next, because the board needs one.
 */
export const WaitlistGroupSizeRoute = () => {
    const { go, goBack, canGoBack, reset } = useNavigation();
    const { setWaitlist } = usePrototype();
    const { member } = useKioskSession();
    const [groupSize, setGroupSize] = useState<number | null>(2);
    const [transport, setTransport] = useState<Transport | null>("cart");
    const [subcourse, setSubcourse] = useState<string | null>(null);

    return (
        <KioskScreen
            footer={
                <StepFooter>
                    <BookingActionBar
                        onBack={() => (canGoBack ? goBack() : reset())}
                        onBook={() => {
                            if (!groupSize) return;
                            setWaitlist({
                                id: "you",
                                name: member ? boardName(`${member.firstName} ${member.lastName}`) : "",
                                partySize: groupSize,
                                place: nextPlaceInLine(),
                            });
                            go(member ? "waitlist-added" : "waitlist-name");
                        }}
                        bookLabel="Continue"
                        isBookDisabled={!groupSize || !transport || !subcourse}
                    />
                    <PrototypeGlobalNav />
                </StepFooter>
            }
        >
            <WaitlistGroupSizeScreen
                groupSize={groupSize}
                onGroupSizeChange={setGroupSize}
                transport={transport}
                onTransportChange={setTransport}
                subcourse={subcourse}
                onSelectSubcourse={() => setSubcourse("Main Course Only")}
            />
        </KioskScreen>
    );
};

/** A guest's name, shortened to first name and initial before it reaches the board. */
export const WaitlistNameRoute = () => {
    const { go, goBack, canGoBack } = useNavigation();
    const { waitlist, setWaitlist } = usePrototype();
    const [value, setValue] = useState("");

    return (
        <KioskScreen scroll={false}>
            <EntryScreen
                title="Enter your name"
                subtitle="You'll show on the standby board as your first name and last initial."
                illustration={
                    <img
                        src={assetUrl("screen-assets/waitlist/participant-avatar.svg")}
                        alt=""
                        aria-hidden="true"
                        className="h-[82px] w-[64px] object-contain"
                    />
                }
                field={<EntryTextField value={value} placeholder="Enter your full name" />}
                value={value}
                onChange={setValue}
                isContinueDisabled={!value.trim()}
                onContinue={() => {
                    setWaitlist({ id: "you", partySize: 2, place: nextPlaceInLine(), ...waitlist, name: boardName(value) });
                    go("waitlist-added");
                }}
                onBack={() => (canGoBack ? goBack() : go("waitlist-group-size"))}
            />
        </KioskScreen>
    );
};

/** "All set!" with the place in line and party size the board will show. */
export const WaitlistAddedRoute = () => {
    const { replace } = useNavigation();
    const { waitlist } = usePrototype();

    return (
        <KioskScreen scroll={false}>
            <OrderSuccessfulScreen
                heading="All set! We will be in touch with next steps!"
                subtitle="You have been added to the waitlist."
                illustrationSrc={assetUrl("screen-assets/waitlist/confirmation.svg")}
                dismissLabel="Tap anywhere to see the standby board"
                onDismiss={() => replace("standby-board")}
            >
                <PlaceInLine place={waitlist?.place ?? nextPlaceInLine()} partySize={waitlist?.partySize ?? 2} />
                <p className="mt-4 text-[18px] text-tertiary">Watch for your name on the standby board.</p>
            </OrderSuccessfulScreen>
        </KioskScreen>
    );
};

/**
 * The live standby board, with this kiosk's party at the back of Received
 * and marked "You". It works its way up as the board moves, and is held once
 * it reaches Ready instead of teeing off mid-demo. Back to Home ends the
 * session.
 */
export const StandbyBoardRoute = () => {
    const { waitlist } = usePrototype();
    const endSession = useEndSession();
    const joined = waitlist?.name ? { id: waitlist.id, name: waitlist.name, partySize: waitlist.partySize } : undefined;
    const columns = useLiveStandby({ joined, keepId: joined?.id });

    return (
        <KioskScreen scroll={false}>
            <StandbyBoardScreen columns={columns} highlightId={joined?.id} onHome={endSession} hero="tall" />
        </KioskScreen>
    );
};
