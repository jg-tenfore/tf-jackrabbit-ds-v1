"use client";

import type { FC } from "react";
import { Camera01, CheckCircle, Mail01, MessageTextSquare01 } from "@untitledui/icons";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { KioskButton } from "@/components/kiosk/kiosk-button";
import { formatBallCode, maskEmail, maskPhone } from "@/components/kiosk/range/contact";
import { type RangeBucket, ballCountLabel } from "@/data/range-catalog";
import { cx } from "@/utils/cx";

export type DeliveryChannel = "email" | "text";

/**
 * Where one copy of the code went. `to` is the raw address — the screen masks
 * it, so callers never have to remember to.
 */
export type Delivery = { status: "sent"; to: string } | { status: "missing" };

export interface BallCode {
    code: string;
    bucket: RangeBucket;
}

/**
 * "Here's your ball code" — the end of a range ball purchase.
 *
 * The code is the screen. It is set large and grouped in threes so it can be
 * read off the screen, photographed, or keyed into the machine from memory a
 * minute later, and the hint under it says to take a picture — the
 * cheapest backup there is.
 *
 * Both copies go out **automatically**: an email and a text to whatever the
 * account has on file. The two rows below the code say where each one went,
 * masked, because this is a public screen. When the account is missing one —
 * or, for a guest, both — that row turns into an offer instead: "No phone
 * number on your account" with an Add button, which collects the number and
 * sends. Nothing about the code depends on it; the offer is there so nobody
 * walks to the range with the code only on a screen they have left behind.
 *
 * Several buckets mean several codes, each labelled with its bucket, stacked
 * and set smaller so two still fit above the delivery rows.
 */
export const BallCodeScreen = ({
    codes,
    email,
    text,
    onAdd,
    onDone,
    className,
}: {
    codes: BallCode[];
    email: Delivery;
    text: Delivery;
    /** Collect the missing address for a channel, then send to it. */
    onAdd?: (channel: DeliveryChannel) => void;
    onDone?: () => void;
    className?: string;
}) => {
    const isMany = codes.length > 1;
    const hasNothingOnFile = email.status === "missing" && text.status === "missing";

    return (
        <div className={cx("flex h-full w-full flex-col items-center px-14 pt-12 text-center", className)}>
            <BrandMark />
            <h1 className="mt-5 text-[44px] leading-tight font-bold text-primary">{isMany ? "Here are your ball codes" : "Here's your ball code"}</h1>
            <p className="mt-3 max-w-[560px] text-[20px] text-tertiary">Enter it on the ball machine keypad to fill your bucket.</p>

            {/* The code, its photo hint and the delivery rows centre as one block
                between the heading and Done, so a one-code screen does not end
                in a slab of empty panel above the button. */}
            <div className="flex w-full flex-1 flex-col items-center justify-center py-8">
                <ol className={cx("flex w-full flex-col", isMany ? "gap-4" : "gap-0")}>
                    {codes.map(({ code, bucket }, index) => (
                        <li
                            key={code}
                            className={cx(
                                "flex flex-col items-center rounded-3xl bg-secondary ring-1 ring-border-secondary ring-inset",
                                isMany ? "py-6" : "py-12",
                            )}
                        >
                            <span className="text-[20px] text-tertiary">
                                {isMany && `Bucket ${index + 1} of ${codes.length} · `}
                                {bucket.size} bucket · {ballCountLabel(bucket)}
                            </span>
                            <span
                                aria-label={`Ball code ${code.split("").join(" ")}`}
                                className={cx(
                                    "mt-1 leading-none font-bold tracking-[0.08em] text-primary tabular-nums",
                                    isMany ? "text-[72px]" : "text-[120px]",
                                )}
                            >
                                {formatBallCode(code)}
                            </span>
                        </li>
                    ))}
                </ol>

                <p className="mt-5 flex items-center gap-2 text-[20px] text-tertiary">
                    <Camera01 className="size-6 text-fg-quaternary" aria-hidden="true" />
                    Snap a photo of your code, just in case.
                </p>

                <div className="mt-10 w-full text-left">
                    {hasNothingOnFile && <p className="mb-3 text-[20px] text-secondary">Want a copy? Send it to your phone or email.</p>}
                    <ul className="divide-y divide-border-secondary rounded-2xl ring-1 ring-border-secondary ring-inset">
                        <DeliveryRow
                            icon={MessageTextSquare01}
                            label="Text"
                            delivery={text}
                            mask={maskPhone}
                            missing="No phone number on your account"
                            addLabel="Add phone"
                            onAdd={() => onAdd?.("text")}
                        />
                        <DeliveryRow
                            icon={Mail01}
                            label="Email"
                            delivery={email}
                            mask={maskEmail}
                            missing="No email on your account"
                            addLabel="Add email"
                            onAdd={() => onAdd?.("email")}
                        />
                    </ul>
                </div>
            </div>

            <div className="w-full pb-10">
                <KioskButton tone="primary" size="lg" isFullWidth onPress={onDone}>
                    Done
                </KioskButton>
            </div>
        </div>
    );
};

const DeliveryRow = ({
    icon: Icon,
    label,
    delivery,
    mask,
    missing,
    addLabel,
    onAdd,
}: {
    icon: FC<{ className?: string }>;
    label: string;
    delivery: Delivery;
    mask: (to: string) => string;
    missing: string;
    addLabel: string;
    onAdd: () => void;
}) => (
    <li className="flex min-h-[104px] items-center gap-4 px-6 py-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Icon className="size-7 text-fg-tertiary" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[22px] font-semibold text-primary">{label}</span>
            <span className="truncate text-[19px] text-tertiary">{delivery.status === "sent" ? `Sent to ${mask(delivery.to)}` : missing}</span>
        </div>
        {delivery.status === "sent" ? (
            <span className="flex shrink-0 items-center gap-1.5 text-[18px] font-semibold text-success-primary">
                <CheckCircle className="size-6" aria-hidden="true" />
                Sent
            </span>
        ) : (
            <KioskButton tone="primary" size="md" onPress={onAdd} className="w-[150px]">
                {addLabel}
            </KioskButton>
        )}
    </li>
);

/** What an account has on file, as the two deliveries the screen shows. */
export const deliveriesFor = (contact: { email?: string; phone?: string } | null | undefined): { email: Delivery; text: Delivery } => ({
    email: contact?.email ? { status: "sent", to: contact.email } : { status: "missing" },
    text: contact?.phone ? { status: "sent", to: contact.phone } : { status: "missing" },
});
