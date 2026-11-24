"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STANDBY_COLUMNS, type StandbyColumn, type StandbyEntry } from "@/components/kiosk/screens/standby-board-screen";

/** Parties that walk up while the board is running, in order, then round again. */
const ARRIVALS: StandbyEntry[] = [
    { name: "Ava P.", partySize: 2 },
    { name: "Mason D.", partySize: 4 },
    { name: "Sofia L.", partySize: 1 },
    { name: "James K.", partySize: 3 },
    { name: "Chloe B.", partySize: 2 },
    { name: "Owen H.", partySize: 4 },
    { name: "Grace N.", partySize: 2 },
    { name: "Caleb V.", partySize: 1 },
];

/** Long enough to watch one change finish before the next starts. */
const STEP_MS = 2400;

const withIds = (columns: StandbyColumn[]) => columns.map((c) => ({ ...c, entries: c.entries.map((e) => ({ ...e, id: e.id ?? e.name })) }));

/**
 * Plays the four things that happen to a standby list, in turn, forever: a
 * party joins, the first ready party tees off, the front of Up Next is called,
 * and the front of the line moves up. One of each per cycle keeps every column
 * the same length, so the loop never drifts into an overflowing board.
 *
 * `joined` puts a party at the back of Received before the loop starts — the
 * prototype's own entry, which then works its way up the board. `keepId` holds
 * that party once it reaches Ready instead of teeing it off, so someone
 * watching their own name does not see it vanish mid-demo.
 *
 * The counters live outside the state updater because React may run an updater
 * twice in development; anything it increments would skip.
 */
export const useLiveStandby = ({ joined, keepId, stepMs = STEP_MS }: { joined?: StandbyEntry; keepId?: string; stepMs?: number } = {}) => {
    const [columns, setColumns] = useState(() => {
        const [received, upNext, ready] = withIds(DEFAULT_STANDBY_COLUMNS);
        return joined ? [{ ...received, entries: [...received.entries, joined] }, upNext, ready] : [received, upNext, ready];
    });

    useEffect(() => {
        let step = 0;
        let arrivals = 0;
        const timer = setInterval(() => {
            const event = step++ % 4;
            const arrival = ARRIVALS[arrivals % ARRIVALS.length];
            const arrivalId = `${arrival.name}-${arrivals}`;
            if (event === 0) arrivals++;

            setColumns(([received, upNext, ready]) => {
                if (event === 0) return [{ ...received, entries: [...received.entries, { ...arrival, id: arrivalId }] }, upNext, ready];
                if (event === 1) {
                    const leaving = ready.entries.findIndex((e) => e.id !== keepId);
                    if (leaving < 0) return [received, upNext, ready];
                    return [received, upNext, { ...ready, entries: ready.entries.filter((_, i) => i !== leaving) }];
                }
                if (event === 2) {
                    const [called, ...rest] = upNext.entries;
                    if (!called) return [received, upNext, ready];
                    return [received, { ...upNext, entries: rest }, { ...ready, entries: [...ready.entries, called] }];
                }
                const [front, ...rest] = received.entries;
                if (!front) return [received, upNext, ready];
                return [{ ...received, entries: rest }, { ...upNext, entries: [...upNext.entries, front] }, ready];
            });
        }, stepMs);
        return () => clearInterval(timer);
    }, [keepId, stepMs]);

    return columns;
};

/** Where a party joining now lands: behind everyone the board numbers. */
export const nextPlaceInLine = (columns: StandbyColumn[] = DEFAULT_STANDBY_COLUMNS) =>
    columns.filter((c) => c.numbered).reduce((n, c) => n + c.entries.length, 0) + 1;

/** "Justin Girard" → "Justin G." — the only shape a name takes on the public board. */
export const boardName = (fullName: string) => {
    const [rawFirst, ...rest] = fullName.trim().split(/\s+/);
    // The keyboard types lowercase unless shifted; the board should not.
    const first = rawFirst ? rawFirst[0].toUpperCase() + rawFirst.slice(1) : "";
    const last = rest.at(-1);
    return last ? `${first} ${last[0].toUpperCase()}.` : first;
};
