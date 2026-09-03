/**
 * The Jackrabbit kiosk design canvas.
 *
 * Every screen in `references/flows` is exported at exactly 750x1298, so that
 * is the coordinate space we author against — a component placed at x=64 in
 * Figma sits at x=64 here, which makes side-by-side QA against the exports
 * pixel-exact.
 *
 * Physical kiosk hardware is taller and denser (1080x1920 is the common
 * portrait panel). Rather than re-authoring for each panel, `KioskFrame`
 * transform-scales this canvas to fill the target. See `kiosk-frame.tsx`.
 */
export const KIOSK_WIDTH = 750;
export const KIOSK_HEIGHT = 1298;
export const KIOSK_ASPECT = KIOSK_WIDTH / KIOSK_HEIGHT;

/** Known physical panels we expect to deploy onto, in device pixels. */
export const KIOSK_TARGETS = {
    /** 1:1 with the Figma exports — the default for component QA. */
    design: { label: "Design canvas", width: 750, height: 1298 },
    /** Most common portrait kiosk panel. */
    fhd: { label: "1080 x 1920 (FHD portrait)", width: 1080, height: 1920 },
    /** Tall retail/QSR panel. */
    tall: { label: "1080 x 2560 (tall portrait)", width: 1080, height: 2560 },
} as const;

export type KioskTarget = keyof typeof KIOSK_TARGETS;

/**
 * Touch target floor. Kiosks are used standing, often in gloves and sunlight,
 * so we hold a larger minimum than the 44px web/mobile convention.
 */
export const KIOSK_MIN_TOUCH_TARGET = 64;
