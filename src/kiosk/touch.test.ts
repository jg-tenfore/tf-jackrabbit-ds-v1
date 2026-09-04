import { describe, expect, it } from "vitest";
import { KIOSK_WIDTH } from "@/kiosk/constants";
import { KEY_GAP, KEYBOARD_INSET, KEY_SIZES, PANEL_WIDTHS_MM, TOUCH_FLOOR_MM, maxKeyWidthForColumns, meetsTouchFloor, mmToPx, pxToMm } from "@/kiosk/touch";

describe("touch target maths", () => {
    it("round-trips mm and px", () => {
        expect(pxToMm(mmToPx(11))).toBeCloseTo(11, 0);
    });

    it("reports smaller physical size on a smaller panel", () => {
        // The same pixel count is physically smaller on the 21.5" panel, which
        // is why the smallest panel is the binding constraint for sizing.
        expect(pxToMm(64, "21.5in")).toBeLessThan(pxToMm(64, "32in"));
    });

    it("keeps every key size above the minimum touch floor on the smallest panel", () => {
        for (const px of Object.values(KEY_SIZES)) {
            expect(meetsTouchFloor(px, "minimum")).toBe(true);
        }
    });

    it("keeps the default and larger sizes above the primary-action floor", () => {
        for (const size of ["md", "lg", "xl"] as const) {
            expect(pxToMm(KEY_SIZES[size])).toBeGreaterThanOrEqual(TOUCH_FLOOR_MM.primary);
        }
    });

    it("derives the md key size from a full 10-column row", () => {
        // md is not a round number picked by eye: it is exactly the widest key
        // that fits a QWERTY row edge to edge. If the canvas, inset or gap
        // change, this is the assertion that should fail first.
        expect(maxKeyWidthForColumns(10)).toBe(KEY_SIZES.md);
    });

    it("gives a 3-column pad far more target area than a 10-column row", () => {
        const three = maxKeyWidthForColumns(3);
        const ten = maxKeyWidthForColumns(10);
        // Area scales with the square, which is the whole argument for dropping
        // keys a layout does not need.
        expect((three * three) / (ten * ten)).toBeGreaterThan(10);
    });

    it("fits its own column arithmetic back inside the canvas", () => {
        for (const columns of [3, 4, 6, 10]) {
            const total = maxKeyWidthForColumns(columns) * columns + KEY_GAP * (columns - 1) + KEYBOARD_INSET * 2;
            expect(total).toBeLessThanOrEqual(KIOSK_WIDTH);
        }
    });

    it("orders the known panels from smallest to largest", () => {
        const widths = Object.values(PANEL_WIDTHS_MM);
        expect([...widths].sort((a, b) => a - b)).toEqual(widths);
    });
});
