"use client";

import { useState } from "react";
import { AddContactScreen } from "@/components/kiosk/range/add-contact-screen";
import { type BallCode, BallCodeScreen, type Delivery, type DeliveryChannel, deliveriesFor } from "@/components/kiosk/range/ball-code-screen";
import { BucketDetailDialog } from "@/components/kiosk/range/bucket-detail-dialog";
import { BucketPickerScreen } from "@/components/kiosk/range/bucket-picker-screen";
import { RANGE_BUCKETS, type RangeBucket } from "@/data/range-catalog";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { useNavigation } from "@/prototype/navigation";
import { usePrototype } from "@/prototype/prototype-state";
import { useEndSession } from "@/prototype/session-lifecycle";
import { useKioskSession } from "@/providers/kiosk-session";
import { BrowseNav, setOrderFlow } from "./order-screens";

/**
 * "Grab a bucket of balls" — the range grid. Tapping a card opens the item
 * detail sheet; Add puts the buckets in the same cart as everything else and
 * shows the usual "added to bag" beat, which returns here. The bag in the rail
 * goes on to the order review, so a bucket and a sandwich are paid for once.
 */
export const RangeBallsRoute = () => {
    const { go } = useNavigation();
    const { addRangeBuckets } = usePrototype();
    const [open, setOpen] = useState<RangeBucket | null>(null);

    return (
        <KioskScreen scroll={false} footer={<BrowseNav />}>
            {/* Buckets only: they are what the ball code flow issues codes for. */}
            <BucketPickerScreen items={RANGE_BUCKETS} onSelect={(item) => setOpen(RANGE_BUCKETS.find((b) => b.id === item.id) ?? null)} />
            {open && (
                <BucketDetailDialog
                    item={open}
                    onClose={() => setOpen(null)}
                    onAdd={(quantity) => {
                        addRangeBuckets(open, quantity);
                        setOrderFlow({ returnTo: "range-balls" });
                        go("added-to-bag");
                    }}
                />
            )}
        </KioskScreen>
    );
};

/** Sample codes. A real install gets them from the ball machine's system. */
const sampleCode = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * "Here's your ball code" — after paying at the kiosk.
 *
 * One code per bucket, issued once when the screen opens. Email and text go to
 * whatever the signed-in account has on file; a guest, or an account missing
 * one, gets Add phone / Add email, which collects the address on the shared
 * entry screen and comes back marked sent.
 *
 * Done ends the session — unless the same order had food in it, in which case
 * the range lines are settled and the order carries on to its usual sign-off.
 */
export const BallCodeRoute = () => {
    const { lines, clearRangeLines } = usePrototype();
    const { member } = useKioskSession();
    const { replace } = useNavigation();
    const endSession = useEndSession();

    const [codes] = useState<BallCode[]>(() =>
        lines
            .filter((l) => l.kind === "range")
            .flatMap((l) => {
                const bucket = RANGE_BUCKETS.find((b) => b.id === l.rangeBucketId) ?? RANGE_BUCKETS[1];
                return Array.from({ length: l.quantity }, () => ({ code: sampleCode(), bucket }));
            }),
    );
    const [email, setEmail] = useState<Delivery>(() => deliveriesFor(member).email);
    const [text, setText] = useState<Delivery>(() => deliveriesFor(member).text);
    const [adding, setAdding] = useState<DeliveryChannel | null>(null);
    const [value, setValue] = useState("");

    const close = () => {
        setAdding(null);
        setValue("");
    };

    if (adding) {
        return (
            <KioskScreen scroll={false}>
                <AddContactScreen
                    channel={adding}
                    value={value}
                    onChange={setValue}
                    onBack={close}
                    onSend={() => {
                        (adding === "text" ? setText : setEmail)({ status: "sent", to: value });
                        close();
                    }}
                />
            </KioskScreen>
        );
    }

    return (
        <KioskScreen scroll={false}>
            <BallCodeScreen
                codes={codes}
                email={email}
                text={text}
                onAdd={setAdding}
                onDone={() => {
                    if (lines.some((l) => l.kind === "menu")) {
                        clearRangeLines();
                        replace("order-successful");
                    } else {
                        endSession();
                    }
                }}
            />
        </KioskScreen>
    );
};
