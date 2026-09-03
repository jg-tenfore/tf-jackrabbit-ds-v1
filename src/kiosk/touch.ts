/**
 * Touch ergonomics for the JackRabbit kiosk.
 *
 * Everything here is finger-driven — no cursor, no stylus, no physical
 * keyboard — so target size is a correctness concern, not a style choice. This
 * module turns published touch guidance into design-canvas pixels so component
 * sizing can be argued from millimetres rather than eyeballed.
 *
 * ## Why millimetres
 *
 * A finger pad contacts roughly 10-14mm of glass, and the contact centroid is
 * offset from where the user believes they are pointing. Pixel sizes cannot
 * express that: 64px is generous on a 21" panel and cramped on a 55" one. The
 * physical size is what actually determines whether a key is hittable.
 *
 * Reference points:
 *   - ISO 9241-411        >= 9mm for finger input
 *   - Material Design      48dp (~9mm) minimum
 *   - Apple HIG            44pt (~7mm) minimum — phone-scale, a floor not a goal
 *   - Kiosk practice       11mm+ for primary actions; users stand, are rushed,
 *                          and are often wearing golf gloves
 *
 * We hold **11mm as the floor for any key** and 14mm for primary actions, which
 * is above every reference above. Standing users at arm's length, in sunlight,
 * in gloves, get no benefit from scraping a minimum.
 */

import { KIOSK_WIDTH } from "@/kiosk/constants";

/**
 * Physical width of the panel the canvas is displayed on, in millimetres.
 *
 * Portrait 16:9 panels, width = diagonal * 9 / sqrt(9^2 + 16^2).
 * The *smallest* panel is the binding constraint — a key sized for the 32"
 * is undersized on the 21.5".
 */
export const PANEL_WIDTHS_MM = {
    /** 21.5" portrait — the smallest panel we expect to ship on. */
    "21.5in": 268,
    /** 32" portrait. */
    "32in": 398,
    /** 43" portrait, large-format lobby unit. */
    "43in": 535,
} as const;

export type PanelSize = keyof typeof PANEL_WIDTHS_MM;

/** The panel every size decision in this library is validated against. */
export const REFERENCE_PANEL: PanelSize = "21.5in";

/** Design-canvas pixels per millimetre on a given panel. */
export const pxPerMm = (panel: PanelSize = REFERENCE_PANEL) => KIOSK_WIDTH / PANEL_WIDTHS_MM[panel];

/** Convert design-canvas pixels to millimetres on a given panel. */
export const pxToMm = (px: number, panel: PanelSize = REFERENCE_PANEL) => px / pxPerMm(panel);

/** Convert millimetres to design-canvas pixels on a given panel. */
export const mmToPx = (mm: number, panel: PanelSize = REFERENCE_PANEL) => Math.round(mm * pxPerMm(panel));

/**
 * Target floors in millimetres, and their pixel equivalents on the reference
 * panel. On the 21.5" panel 1mm is ~2.8 design px, so 11mm is ~31px — meaning
 * our 64px default key is ~23mm, comfortably double the floor. That headroom is
 * intentional: it is what lets a key stay hittable when a user is mid-stride.
 */
export const TOUCH_FLOOR_MM = {
    /** Absolute minimum for any interactive element. */
    minimum: 11,
    /** Primary actions — Continue, Confirm, the wallet drawer. */
    primary: 14,
    /** Clear space between adjacent independent targets. */
    gap: 2,
} as const;

/**
 * The keyboard key size scale, in design-canvas pixels.
 *
 * Sizes are chosen from the row arithmetic, not picked round: a QWERTY row is
 * 10 keys, so at 750px wide with 16px side padding and 8px gaps each key gets
 * (750 - 32 - 72) / 10 = 64px. That is why `md` is 64 — it is the largest key
 * that fits the widest row full-bleed, which is exactly the "maximise button
 * real estate" constraint.
 */
export const KEY_SIZES = {
    /** 56px (~20mm) — only when a full QWERTY must share the screen with content. */
    sm: 56,
    /** 64px (~23mm) — the default. Fills a 10-key row edge to edge at 750px. */
    md: 64,
    /** 80px (~29mm) — numeric pads, where 3 columns leave real estate spare. */
    lg: 80,
    /** 96px (~34mm) — single-purpose pads (PIN, phone) with nothing competing. */
    xl: 96,
} as const;

export type KeySize = keyof typeof KEY_SIZES;

/** Gap between keys, in design-canvas pixels (~2.9mm — above the 2mm floor). */
export const KEY_GAP = 8;

/** Horizontal padding of a full-bleed keyboard within the 750px canvas. */
export const KEYBOARD_INSET = 16;

/**
 * Largest key height that fits `columns` keys across the full canvas width.
 * Use when adding a layout to check whether it can afford a bigger size.
 */
export const maxKeyWidthForColumns = (columns: number) =>
    Math.floor((KIOSK_WIDTH - KEYBOARD_INSET * 2 - KEY_GAP * (columns - 1)) / columns);

/** Whether a pixel dimension clears the touch floor on the reference panel. */
export const meetsTouchFloor = (px: number, tier: keyof typeof TOUCH_FLOOR_MM = "minimum") => pxToMm(px) >= TOUCH_FLOOR_MM[tier];
