"use client";

import { type FC, type MutableRefObject, useEffect, useRef, useState } from "react";
import { Camera01, Check, CheckCircle, Mail01, MessageTextSquare01 } from "@untitledui/icons";
import { motion, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { KioskButton } from "@/components/kiosk/kiosk-button";
import { formatBallCode, maskEmail, maskPhone } from "@/components/kiosk/range/contact";
import { ProductImage } from "@/components/kiosk/store/product-image";
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

/** The most codes one purchase can show. Quantity steppers cap to match. */
export const MAX_BALL_CODES = 6;

/** The picture above the codes, by how many buckets the order filled. */
export const ballCodeIllustration = (count: number) => `screen-assets/range/ball-code-${count <= 1 ? "one" : count === 2 ? "pair" : "team"}.webp`;

/**
 * "Here's your ball code" — the end of a range ball purchase.
 *
 * The code is the screen. It is set large and grouped in threes so it can be
 * read off the screen, photographed, or keyed into the machine from memory a
 * minute later, and the hint under it says to take a picture — the cheapest
 * backup there is. Above it, on white, a little personality: one bucket
 * bouncing with excitement, a pair of buddies for two, or the whole team for
 * three or more — the same product style as the grid, so it reads as the order
 * rather than as decoration competing with the number.
 *
 * Several buckets mean several codes, shown one card at a time at full size,
 * with the next card peeking in from the right edge so it reads as something
 * to swipe — "Bucket 2 of 3" on each. Up to six; the quantity steppers cap
 * there.
 *
 * Both copies go out **automatically**: an email and a text to whatever the
 * account has on file. The two rows below the code say where each one went,
 * masked, because this is a public screen. When the account is missing one —
 * or, for a guest, both — that row turns into an offer instead: "No phone
 * number on your account" with an Add button, which collects the number and
 * sends. Nothing about the code depends on it; the offer is there so nobody
 * walks to the range with the code only on a screen they have left behind.
 */
export const BallCodeScreen = ({
    codes,
    email,
    text,
    onAdd,
    onDone,
    info = "delivery",
    className,
}: {
    codes: BallCode[];
    email: Delivery;
    text: Delivery;
    /** Collect the missing address for a channel, then send to it. */
    onAdd?: (channel: DeliveryChannel) => void;
    onDone?: () => void;
    /**
     * What sits under the code. `delivery` (the default) is where the code was
     * sent, with Add phone / Add email. For a venue that does not send codes,
     * `machine` shows how to use the ball machine and `rules` the range rules.
     */
    info?: "delivery" | "machine" | "rules";
    className?: string;
}) => {
    const shown = codes.slice(0, MAX_BALL_CODES);
    const isMany = shown.length > 1;
    const hasNothingOnFile = email.status === "missing" && text.status === "missing";
    const [index, setIndex] = useState(0);
    const [confirmed, setConfirmed] = useState<string[]>([]);
    const jumpToRef = useRef<((i: number) => void) | null>(null);
    const current = shown[Math.min(index, shown.length - 1)];
    const savedCount = shown.filter((c) => confirmed.includes(c.code)).length;
    const allSaved = savedCount === shown.length;

    return (
        <div className={cx("flex h-full w-full flex-col items-center px-14 pt-12 text-center", className)}>
            <BrandMark />
            <h1 className="mt-5 text-[44px] leading-tight font-bold text-primary">{isMany ? "Here are your ball codes" : "Here's your ball code"}</h1>
            <p className="mt-3 max-w-[560px] text-[20px] text-tertiary">Enter it on the ball machine keypad to fill your bucket.</p>

            {/* The bucket, the code, its photo hint and the delivery rows centre
                as one block between the heading and Done. */}
            <div className="flex w-full flex-1 flex-col items-center justify-center py-6">
                {/* A bit of personality above the code: one bucket bouncing
                    with excitement, a pair of buddies, or the whole team for
                    three or more — so the picture matches the order. */}
                <ProductImage
                    src={ballCodeIllustration(shown.length)}
                    alt={shown.length === 1 ? "A bucket of range balls" : `${shown.length} buckets of range balls`}
                    className="h-[230px] w-[345px]"
                    imgClassName="object-contain"
                />

                <div className="mt-4 w-full">
                    {isMany ? (
                        <CodeCarousel codes={shown} index={index} onIndexChange={setIndex} jumpToRef={jumpToRef} />
                    ) : (
                        current && <CodeCard code={current} />
                    )}
                </div>

                {current && (
                    <GotItButton
                        isConfirmed={confirmed.includes(current.code)}
                        position={isMany ? `${index + 1} of ${shown.length}` : undefined}
                        onConfirm={() => {
                            const next = [...confirmed, current.code];
                            setConfirmed(next);
                            // With several codes, carry them straight on to the
                            // next one they have not saved yet.
                            const nextIndex = shown.findIndex((c) => !next.includes(c.code));
                            if (isMany && nextIndex >= 0) setTimeout(() => jumpToRef.current?.(nextIndex), 450);
                        }}
                    />
                )}

                {info === "delivery" ? (
                    <div className="mt-8 w-full text-left">
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
                ) : (
                    <InfoList {...(info === "machine" ? BALL_MACHINE_STEPS : RANGE_RULES)} />
                )}
            </div>

            <div className="w-full pb-10">
                {/* Done waits until every code is saved, and until then says
                    exactly what is left to do — a disabled button with no
                    reason reads as broken. */}
                <KioskButton tone="primary" size="lg" isFullWidth isDisabled={!allSaved} onPress={onDone}>
                    {doneLabel(savedCount, shown.length)}
                </KioskButton>
            </div>
        </div>
    );
};

/** Done's label: the condition for leaving, until it is met. */
export const doneLabel = (saved: number, total: number) => {
    if (saved >= total) return "Done";
    if (total === 1) return "Tap “Got it” above to finish";
    return `Save all ${total} codes to finish · ${saved} of ${total} saved`;
};

/** One code at full size, labelled with its bucket — and its place, when there are several. */
const CodeCard = ({ code: { code, bucket }, position }: { code: BallCode; position?: string }) => (
    <div className="flex flex-col items-center rounded-3xl bg-secondary py-10 ring-1 ring-border-secondary ring-inset">
        <span className="text-[20px] text-tertiary">
            {position && `${position} · `}
            {bucket.size} bucket · {ballCountLabel(bucket)}
        </span>
        <span
            aria-label={`Ball code ${code.split("").join(" ")}`}
            className="mt-1 text-[120px] leading-none font-bold tracking-[0.08em] text-primary tabular-nums"
        >
            {formatBallCode(code)}
        </span>
    </div>
);

/**
 * "Got it" — the guest confirms they have the code, by photo or memory, before
 * walking away from the screen. Done waits until every code has been confirmed
 * this way, and its label says how many are left. Once tapped this turns green
 * and stays that way for that code.
 */
const GotItButton = ({ isConfirmed, position, onConfirm }: { isConfirmed: boolean; position?: string; onConfirm: () => void }) => (
    <button
        type="button"
        onClick={isConfirmed ? undefined : onConfirm}
        aria-pressed={isConfirmed}
        className={cx(
            "mt-5 flex h-[65px] w-full items-center justify-center gap-3 rounded-lg text-[20px] font-semibold transition duration-100 ease-linear ring-inset",
            isConfirmed
                ? "ring-success-secondary bg-success-primary text-success-primary ring-1"
                : "text-brand-secondary ring-2 ring-brand active:bg-secondary",
        )}
    >
        {isConfirmed ? (
            <>
                <CheckCircle className="size-6" aria-hidden="true" />
                Code saved{position && ` · ${position}`}
            </>
        ) : (
            <>
                <Camera01 className="size-6" aria-hidden="true" />
                Got it — I snapped a photo{position && ` · ${position}`}
            </>
        )}
    </button>
);

/**
 * Several codes, one card at a time, with the **next card peeking in** from
 * the right edge. No arrows or dots: the cut-off card is the cue that there is
 * more to swipe to, which is how people already read a row of cards.
 *
 * The track bleeds to the screen edge (`-mx-14`, padded back by `px-14`), so
 * the current card keeps the full width and the peek comes out of the margin
 * rather than out of the code. Scroll-snap does the swiping on a touch panel;
 * for a mouse in a demo, click-and-drag scrolls it too, and lets go onto the
 * nearest card.
 *
 * Until someone touches it, the row gives a little **nudge** every few
 * seconds — slides a card-width's hint to the left and back — so the peeking
 * card reads as "there's another one", not as a layout glitch. It stops for
 * good on the first touch, and never runs under reduced motion.
 */
const PEEK_GAP = 16;

const CodeCarousel = ({
    codes,
    index,
    onIndexChange,
    jumpToRef,
}: {
    codes: BallCode[];
    index: number;
    onIndexChange: (index: number) => void;
    /** Filled with a function that scrolls to a card, for the "Got it" hand-off. */
    jumpToRef?: MutableRefObject<((i: number) => void) | null>;
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ x: number; left: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const reduceMotion = useReducedMotion();
    const shouldNudge = !hasInteracted && !reduceMotion && index === 0;

    const cardStep = (el: HTMLDivElement) => (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
    const settle = (el: HTMLDivElement) => {
        const step = cardStep(el) + PEEK_GAP;
        el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: "smooth" });
    };
    useEffect(() => {
        if (!jumpToRef) return;
        jumpToRef.current = (i: number) => {
            const el = trackRef.current;
            if (!el) return;
            setHasInteracted(true);
            const card = el.querySelector<HTMLElement>("[aria-roledescription='slide']");
            el.scrollTo({ left: i * ((card?.offsetWidth ?? el.clientWidth) + PEEK_GAP), behavior: "smooth" });
        };
        return () => {
            jumpToRef.current = null;
        };
    }, [jumpToRef]);

    return (
        <div
            ref={trackRef}
            aria-roledescription="carousel"
            aria-label="Ball codes — swipe for the next one"
            onScroll={(e) => {
                const el = e.currentTarget;
                const next = Math.round(el.scrollLeft / (cardStep(el) + PEEK_GAP));
                if (next !== index) onIndexChange(Math.min(next, codes.length - 1));
            }}
            onPointerDown={(e) => {
                setHasInteracted(true);
                if (e.pointerType !== "mouse") return;
                drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDragging(true);
            }}
            onPointerMove={(e) => {
                if (!drag.current) return;
                e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
            }}
            onPointerUp={(e) => {
                if (!drag.current) return;
                drag.current = null;
                setIsDragging(false);
                settle(e.currentTarget);
            }}
            onPointerCancel={(e) => {
                drag.current = null;
                setIsDragging(false);
                settle(e.currentTarget);
            }}
            style={{ gap: PEEK_GAP }}
            className={cx(
                "-mx-14 scrollbar-hide flex scroll-px-14 overflow-x-auto overscroll-x-contain px-14 select-none",
                // Snap off while a mouse drags, or it fights the pointer.
                isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory",
            )}
        >
            {codes.map((code, i) => (
                <motion.div
                    key={code.code}
                    aria-roledescription="slide"
                    aria-label={`Code ${i + 1} of ${codes.length}`}
                    className="w-full shrink-0 snap-start"
                    // Every card moves together, so the row slides as one.
                    animate={shouldNudge ? { x: [0, -64, 0, -18, 0] } : { x: 0 }}
                    transition={
                        shouldNudge
                            ? { duration: 1.4, times: [0, 0.35, 0.6, 0.8, 1], ease: "easeInOut", delay: 0.9, repeat: Infinity, repeatDelay: 3.2 }
                            : { duration: 0.2 }
                    }
                >
                    <CodeCard code={code} position={`Bucket ${i + 1} of ${codes.length}`} />
                </motion.div>
            ))}
        </div>
    );
};

/** Sample copy; a course replaces it with its own machine and its own rules. */
export const BALL_MACHINE_STEPS = {
    title: "How to use the ball machine",
    numbered: true,
    items: [
        "Set an empty bucket under the chute.",
        "Type your code on the keypad and press the green button.",
        "Wait until the balls stop, then lift the bucket out.",
        "Got more than one code? Do one bucket at a time.",
    ],
};

export const RANGE_RULES = {
    title: "Driving range rules",
    numbered: false,
    items: [
        "Hit from the mats only, between the markers.",
        "Never walk onto the range to get balls.",
        "Range balls stay at the range.",
        "Put your bucket back in the rack when you're done.",
    ],
};

/**
 * The machine steps or the range rules, in the same outlined list the delivery
 * rows use, so the screen keeps one shape whichever it shows. Steps are
 * numbered because their order matters; rules are not.
 */
const InfoList = ({ title, items, numbered }: { title: string; items: string[]; numbered: boolean }) => (
    <section className="mt-8 w-full text-left">
        <h2 className="mb-3 text-[22px] font-semibold text-primary">{title}</h2>
        <ol className="divide-y divide-border-secondary rounded-2xl ring-1 ring-border-secondary ring-inset">
            {items.map((item, i) => (
                <li key={item} className="flex min-h-[72px] items-center gap-4 px-6 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-[18px] font-semibold text-secondary">
                        {numbered ? i + 1 : <Check className="size-5 text-fg-success-secondary" aria-hidden="true" />}
                    </span>
                    <span className="text-[19px] text-secondary">{item}</span>
                </li>
            ))}
        </ol>
    </section>
);

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
