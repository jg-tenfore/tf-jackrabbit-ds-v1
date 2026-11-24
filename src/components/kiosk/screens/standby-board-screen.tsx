"use client";

import { Home02, Users01 } from "@untitledui/icons";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { KioskButton } from "@/components/kiosk/kiosk-button";
import { useCourseBrand } from "@/providers/course-brand";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/standby/${file}`);

export interface StandbyEntry {
    /**
     * Stable identity for the party. Falls back to the name; a live board should
     * pass the booking id, since two "Liam S." parties can be waiting at once.
     */
    id?: string;
    /** First name plus last initial — see the note on privacy below. */
    name: string;
    /** Players in the party, as chosen on the Group Size step (1–8+). */
    partySize: number;
}

export interface StandbyColumn {
    id: string;
    label: string;
    /** Filename under `screen-assets/standby/`. */
    icon: string;
    /** In list order: the first entry is next. */
    entries: StandbyEntry[];
    /**
     * Number the rows with each party's place in line. On for the columns that
     * are still waiting, off once a party is ready — at that point it is simply
     * their turn. Numbering runs on from the column to the right, so Up Next
     * holds 1 and 2 and Received carries on from 3.
     */
    numbered?: boolean;
}

export const DEFAULT_STANDBY_COLUMNS: StandbyColumn[] = [
    {
        id: "received",
        label: "Received",
        icon: "status-received.svg",
        numbered: true,
        entries: [
            { name: "Liam S.", partySize: 4 },
            { name: "Noah T.", partySize: 2 },
            { name: "Ethan R.", partySize: 1 },
            { name: "Oliver J.", partySize: 3 },
            { name: "Lucas M.", partySize: 4 },
        ],
    },
    {
        id: "up-next",
        label: "Up Next",
        icon: "status-up-next.svg",
        numbered: true,
        entries: [
            { name: "Mia K.", partySize: 2 },
            { name: "Henry W.", partySize: 4 },
        ],
    },
    {
        id: "ready",
        label: "Ready",
        icon: "status-ready.svg",
        entries: [
            { name: "Weston F.", partySize: 2 },
            { name: "Lisa G.", partySize: 4 },
            { name: "Jarrette S.", partySize: 1 },
        ],
    },
];

/**
 * Arrivals and departures fade; everything else glides. 350ms is long enough to
 * catch from across the room without making the board feel busy, and the
 * layout glide is a touch longer so the gap a departure leaves closes after the
 * fade has mostly happened rather than racing it.
 */
const FADE = { duration: 0.35, ease: "easeOut" } as const;
const GLIDE = { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const;

/** The Group Size picker tops out at "8+", so the board does too. */
const partyLabel = (size: number) => (size >= 8 ? "8+ players" : size === 1 ? "1 player" : `${size} players`);

/**
 * Where each numbered column's count starts. The line runs right to left —
 * Up Next is ahead of Received — so offsets accumulate from the right.
 */
const startPositions = (columns: StandbyColumn[]) => {
    const starts: number[] = new Array(columns.length).fill(1);
    let next = 1;
    for (let i = columns.length - 1; i >= 0; i--) {
        if (!columns[i].numbered) continue;
        starts[i] = next;
        next += columns[i].entries.length;
    }
    return starts;
};

/**
 * The standby board — who is waiting, and who is up.
 *
 * This is the one screen in the kiosk nobody is standing at. It is read from
 * across the pro shop by people waiting for their name, so it inverts the usual
 * hierarchy: no controls in the body, and names as large as three columns allow.
 *
 * Names are **first name plus last initial**, which is the whole reason this can
 * be a public board at all. A full name on a screen anyone can photograph is a
 * different thing entirely, so the shape is enforced here in the fixture rather
 * than left to whatever the booking system happens to return.
 *
 * Three statuses, left to right in the order a party moves through them:
 * **Received**, **Up Next** (the parties the starter is lining up, so they know
 * to start heading over) and **Ready**. Each is distinguished by **icon as well
 * as colour** — a ball on a tee, a clock running forward, a golfer mid-swing —
 * because the board is read at distance and at an angle, and every heading is
 * the same green.
 *
 * Each row carries the **party size** and, while waiting, the **place in line**.
 * Together they answer what someone glancing up actually wants to know — "how
 * far back are we, and is that a fourball ahead of us or a single" — without a
 * name ever growing past first name and initial. The count sits on its own line
 * under the name, with the same people icon the tee-time slots use for players,
 * so it reads as "players" rather than as a second number competing with the
 * position. A rule drops from each status icon down the left of its names, so
 * the three lists read as three separate lists even at an angle; the place
 * numbers sit on it — and so three columns never have to squeeze a name and a count
 * onto one line.
 *
 * The board is **live**: a party that joins, moves column or tees off fades in
 * or out, and the rest of its column glides to close the gap, so a change
 * catches the eye without the whole list jumping. Place numbers update with it.
 * Under `prefers-reduced-motion` the changes simply happen, as on the marquee —
 * a public screen is not something a viewer can opt out of by closing a tab.
 */
export const StandbyBoardScreen = ({
    heading = "Players currently in Standby...",
    columns = DEFAULT_STANDBY_COLUMNS,
    onHome,
    homeLabel = "Back to Home",
    hero = "band",
    highlightId,
    className,
}: {
    heading?: string;
    columns?: StandbyColumn[];
    /**
     * Ends the card with a single "back to home" action, for a board shown
     * without the app's footer. Leave unset when the screen has a footer of its
     * own — two ways home on one screen is one too many.
     */
    onHome?: () => void;
    homeLabel?: string;
    /**
     * How much of the photo to show. `band` keeps the card high, for a screen
     * with a footer to make room for. `tall` is for a board with no footer:
     * the photo takes about half the screen and the card starts lower, which
     * still leaves room for eight parties in a column.
     */
    hero?: "band" | "tall";
    /**
     * The entry id of the party looking at the board — the one that just
     * joined on this kiosk. Its name goes brand green with a "You" tag, so it
     * can be found at a glance among a dozen others.
     */
    highlightId?: string;
    className?: string;
}) => {
    const isTall = hero === "tall";
    const brand = useCourseBrand();
    const starts = startPositions(columns);

    return (
        <MotionConfig reducedMotion="user">
            <div className={cx("relative flex h-full w-full flex-col", className)}>
                {/* The photo band sits behind the top of the card rather than filling
            the screen: the card has to start high enough to hold five names, and
            a full-bleed photo behind white text would leave the names on grass. */}
                <div className={cx("absolute inset-x-0 top-0 overflow-hidden", isTall ? "h-[640px]" : "h-[420px]")}>
                    <img
                        src={assetUrl(
                            brand?.standbyImage ?? (isTall ? "screen-assets/standby/hero-first-tee-tall.jpg" : "screen-assets/standby/hero-first-tee.jpg"),
                        )}
                        alt=""
                        aria-hidden="true"
                        className="size-full object-cover"
                    />
                    {/* Flat on the band, where the heading covers most of the photo. On the
                    tall hero the shade is only needed behind the type, so it eases off
                    toward the card and lets the scene read. */}
                    <div
                        aria-hidden="true"
                        className={cx("absolute inset-0", isTall ? "bg-gradient-to-b from-black/65 via-black/30 via-45% to-black/10" : "bg-black/55")}
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center pt-[60px]">
                    {brand ? (
                        <img src={assetUrl(brand.markOnDark.src)} alt={brand.name} className={cx("object-contain", brand.markOnDark.className)} />
                    ) : (
                        <img src={ASSET("wordmark-dark-bg.svg")} alt="TenFore Golf" className="h-[52px] w-[264px] object-contain" />
                    )}
                    <h1 className="mt-8 px-16 text-center text-[38px] leading-tight font-bold text-white">{heading}</h1>
                </div>

                <div className={cx("relative z-10 min-h-0 flex-1 px-6", isTall ? "mt-[250px]" : "mt-8")}>
                    <div className={cx("flex h-full flex-col rounded-t-3xl bg-primary px-7 pt-9 shadow-[0_-8px_32px_rgba(0,0,0,0.18)]", onHome && "pb-10")}>
                        <div className="grid grid-cols-3 gap-5">
                            {columns.map((column, columnIndex) => (
                                <div key={column.id} className="flex min-w-0 flex-col">
                                    <div className="flex items-center gap-3">
                                        <img src={ASSET(column.icon)} alt="" aria-hidden="true" className="size-12 shrink-0" />
                                        <h2 className="text-[24px] font-bold whitespace-nowrap text-brand-secondary">{column.label}</h2>
                                    </div>

                                    {/* popLayout takes a leaving row out of flow at once, so
                                its neighbours glide into the gap while it fades. That
                                needs the list to be the positioning context. */}
                                    <ol className="relative mt-7 flex flex-col gap-5">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            {column.entries.map((entry, index) => (
                                                <motion.li
                                                    key={entry.id ?? entry.name}
                                                    layout="position"
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: 1, y: 0, transition: FADE }}
                                                    exit={{ opacity: 0, transition: FADE }}
                                                    transition={{ layout: GLIDE }}
                                                    className="relative flex flex-col pl-[60px]"
                                                >
                                                    {/* The column's rule, one segment per row so it grows,
                                                    shrinks and fades with the rows instead of jumping. It
                                                    runs from the gap above (the first row's reaches up to
                                                    the icon) through the gap below, which leaves a short
                                                    tail under the last name. Centred under the icon. */}
                                                    <span
                                                        aria-hidden="true"
                                                        className={cx(
                                                            "absolute -bottom-5 left-[22.5px] w-[3px] bg-border-primary",
                                                            index === 0 ? "-top-7" : "-top-5",
                                                        )}
                                                    />
                                                    {/* Place in line sits on the rule, masking it, the way the
                                                    reference's member stars do. */}
                                                    {column.numbered && (
                                                        <span className="absolute -top-px left-6 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-[19px] font-semibold text-tertiary tabular-nums">
                                                            {starts[columnIndex] + index}
                                                        </span>
                                                    )}
                                                    <div className="flex min-w-0 flex-col">
                                                        <span
                                                            className={cx(
                                                                "truncate text-[24px] leading-tight font-bold",
                                                                highlightId && entry.id === highlightId ? "text-brand-secondary" : "text-primary",
                                                            )}
                                                        >
                                                            {entry.name}
                                                        </span>
                                                        <span className="mt-1 flex items-center gap-1.5 text-[18px] font-medium whitespace-nowrap text-tertiary tabular-nums">
                                                            {/* "You" takes the icon's place rather than adding to the
                                                            line: a third-width column has room for one or the other. */}
                                                            {highlightId && entry.id === highlightId ? (
                                                                <span className="rounded-full bg-brand-solid px-2 py-0.5 text-[13px] leading-none font-semibold text-white">
                                                                    You
                                                                </span>
                                                            ) : (
                                                                <Users01 className="size-[18px] shrink-0 text-fg-quaternary" aria-hidden="true" />
                                                            )}
                                                            {partyLabel(entry.partySize)}
                                                        </span>
                                                    </div>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </ol>
                                </div>
                            ))}
                        </div>

                        {onHome && (
                            // mt-auto pins it to the foot of the card however short
                            // the lists are, so the board never ends in dead space.
                            <div className="mt-auto border-t border-secondary pt-8">
                                <KioskButton tone="quiet" size="lg" isFullWidth onPress={onHome}>
                                    <span className="flex items-center gap-3 text-secondary">
                                        <Home02 className="size-6 text-fg-quaternary" aria-hidden="true" />
                                        {homeLabel}
                                    </span>
                                </KioskButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
};
