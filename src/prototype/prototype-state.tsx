"use client";

import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import type { MenuItem } from "@/data/menu-catalog";
import type { ModifierLevel } from "@/data/modifiers";
import type { ProShopProduct } from "@/data/pro-shop-types";

/**
 * The prototype's session — one cart, one identity, one booking in progress.
 *
 * Deliberately real rather than scripted. A scripted prototype survives exactly
 * the path it was recorded on, and the first stakeholder who taps out of order
 * sees it fall apart; totals that never reflect what was chosen also make the
 * checkout screens meaningless as a review artefact. So the cart accumulates,
 * the maths is real, and modifiers carry from the customize screen onto the
 * order line.
 *
 * State lives here rather than in the URL because a kiosk has no address bar
 * and no back button — the screen a user is on is a fact about the session, not
 * a location. `KioskSessionProvider` still owns scan state; this sits beside it
 * and owns everything a session accumulates.
 *
 * A session ends **only** on Start Over or a completed order. No idle timer: a
 * demo that resets itself mid-sentence is worse than one left on a checkout.
 */

/** Everything the kiosk can sell, in one shape the cart can total. */
export interface CartLine {
    /** Unique per line, not per product — two sandwiches customised differently are two lines. */
    lineId: string;
    kind: "menu" | "pro-shop" | "booking";
    name: string;
    priceCents: number;
    quantity: number;
    image?: string;
    /** Menu lines only: the deviations chosen on the customize screen. */
    modifiers?: string[];
    /**
     * Menu lines only: the full level map behind those labels.
     *
     * Kept alongside the labels rather than instead of them because the two
     * answer different questions and neither derives from the other cheaply.
     * "No Pickles" is what a receipt prints, but it cannot be turned back into
     * a stepper position — so re-opening a line to edit it needs this, and a
     * real POS would need it too.
     */
    levels?: Record<string, ModifierLevel>;
    /** Booking lines only: what was reserved, for the review screen. */
    bookingDetail?: string;
}

export interface BookingDraft {
    kind: "tee-time" | "simulator" | "pickleball";
    resourceLabel: string;
    date: Date;
    startTime: string;
    /** Simulator and pickleball only. */
    durationLabel?: string;
    groupSize: number;
    priceCents: number;
}

interface PrototypeValue {
    lines: CartLine[];
    subtotalCents: number;
    taxCents: number;
    totalCents: number;
    itemCount: number;

    booking: BookingDraft | null;
    setBooking: (draft: BookingDraft | null) => void;
    /** Commits the in-progress booking to the cart and clears the draft. */
    confirmBooking: () => void;

    addMenuItem: (item: MenuItem, levels?: Record<string, ModifierLevel>, modifierLabels?: string[]) => void;
    addProShopItem: (product: ProShopProduct) => void;
    setQuantity: (lineId: string, quantity: number) => void;
    removeLine: (lineId: string) => void;
    /** Start Over and order completion both land here. */
    resetOrder: () => void;
}

const PrototypeContext = createContext<PrototypeValue | null>(null);

/** 8.25%, matching the fixture the order screens have used since they were built. */
const TAX_RATE = 0.0825;

let lineCounter = 0;
const nextLineId = () => `line-${++lineCounter}`;

/** Identity of a menu line: the item plus the deviations chosen on it. */
const lineSignature = (name: string, modifierLabels: string[] = []) => `${name}|${modifierLabels.join(",")}`;

export const PrototypeProvider = ({ children }: { children: ReactNode }) => {
    const [lines, setLines] = useState<CartLine[]>([]);
    const [booking, setBooking] = useState<BookingDraft | null>(null);

    const addMenuItem = useCallback((item: MenuItem, levels?: Record<string, ModifierLevel>, modifierLabels: string[] = []) => {
        setLines((prev) => {
            // An identical item with identical modifiers increments rather than
            // adding a second line — two "No Pickles" burgers are quantity 2,
            // but one plain and one customised are genuinely two lines.
            //
            // Keyed on the labels rather than the level map because the labels
            // are already the canonical list of deviations, in list order: two
            // level maps that differ only where both sides match the default
            // are the same sandwich and should merge.
            const signature = lineSignature(item.name, modifierLabels);
            const existing = prev.find((l) => l.kind === "menu" && lineSignature(l.name, l.modifiers) === signature);
            if (existing) return prev.map((l) => (l.lineId === existing.lineId ? { ...l, quantity: l.quantity + 1 } : l));
            return [
                ...prev,
                {
                    lineId: nextLineId(),
                    kind: "menu",
                    name: item.name,
                    priceCents: item.priceCents,
                    quantity: 1,
                    image: item.image,
                    modifiers: modifierLabels.length ? modifierLabels : undefined,
                    levels,
                },
            ];
        });
    }, []);

    const addProShopItem = useCallback((product: ProShopProduct) => {
        setLines((prev) => {
            const existing = prev.find((l) => l.kind === "pro-shop" && l.name === product.name);
            if (existing) return prev.map((l) => (l.lineId === existing.lineId ? { ...l, quantity: l.quantity + 1 } : l));
            return [...prev, { lineId: nextLineId(), kind: "pro-shop", name: product.name, priceCents: product.priceCents, quantity: 1, image: product.image }];
        });
    }, []);

    /**
     * Moves the in-progress booking into the cart.
     *
     * Reads `booking` from the closure rather than from a `setBooking` updater.
     * An updater must be pure — React is free to call it more than once for a
     * single update, and does exactly that in development — so appending a cart
     * line from inside one booked the same tee time twice for one tap. It only
     * showed up in dev, which is worse than showing up everywhere: production
     * looked correct while every local run was wrong.
     */
    const confirmBooking = useCallback(() => {
        if (!booking) return;

        const detail = [booking.resourceLabel, booking.durationLabel, booking.startTime].filter(Boolean).join(" · ");
        setLines((prev) => [
            ...prev,
            {
                lineId: nextLineId(),
                kind: "booking",
                name: booking.kind === "tee-time" ? "Tee Time" : booking.kind === "simulator" ? "Simulator Bay" : "Pickleball Court",
                priceCents: booking.priceCents,
                quantity: 1,
                bookingDetail: detail,
            },
        ]);
        setBooking(null);
    }, [booking]);

    const setQuantity = useCallback((lineId: string, quantity: number) => {
        setLines((prev) => (quantity <= 0 ? prev.filter((l) => l.lineId !== lineId) : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))));
    }, []);

    const removeLine = useCallback((lineId: string) => setLines((prev) => prev.filter((l) => l.lineId !== lineId)), []);

    const resetOrder = useCallback(() => {
        setLines([]);
        setBooking(null);
    }, []);

    const value = useMemo<PrototypeValue>(() => {
        const subtotalCents = lines.reduce((total, l) => total + l.priceCents * l.quantity, 0);
        const taxCents = Math.round(subtotalCents * TAX_RATE);
        return {
            lines,
            subtotalCents,
            taxCents,
            totalCents: subtotalCents + taxCents,
            itemCount: lines.reduce((n, l) => n + l.quantity, 0),
            booking,
            setBooking,
            confirmBooking,
            addMenuItem,
            addProShopItem,
            setQuantity,
            removeLine,
            resetOrder,
        };
    }, [lines, booking, confirmBooking, addMenuItem, addProShopItem, setQuantity, removeLine, resetOrder]);

    return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
};

export const usePrototype = () => {
    const value = useContext(PrototypeContext);
    if (!value) throw new Error("usePrototype must be used inside a PrototypeProvider");
    return value;
};
