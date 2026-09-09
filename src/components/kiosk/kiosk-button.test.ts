import { describe, expect, it } from "vitest";
import { BUTTON_SIZES, buttonSizeMm } from "@/components/kiosk/kiosk-button";
import { TOUCH_FLOOR_MM } from "@/kiosk/touch";

/**
 * These assert arithmetic, not markup.
 *
 * The button's whole justification is that its sizes come from the touch scale
 * rather than being picked by eye, and a comment claiming that rots the first
 * time someone nudges a number. This fails instead.
 */
describe("KioskButton sizes", () => {
    it("every size clears the absolute touch floor", () => {
        for (const size of Object.keys(BUTTON_SIZES) as (keyof typeof BUTTON_SIZES)[]) {
            expect(buttonSizeMm(size), `${size} is below the ${TOUCH_FLOOR_MM.minimum}mm minimum`).toBeGreaterThanOrEqual(TOUCH_FLOOR_MM.minimum);
        }
    });

    it("lg and xl clear the higher floor a primary action wants", () => {
        expect(buttonSizeMm("lg")).toBeGreaterThanOrEqual(TOUCH_FLOOR_MM.primary);
        expect(buttonSizeMm("xl")).toBeGreaterThanOrEqual(TOUCH_FLOOR_MM.primary);
    });

    it("the scale rises monotonically", () => {
        const px = Object.values(BUTTON_SIZES);
        for (let i = 1; i < px.length; i++) expect(px[i]).toBeGreaterThan(px[i - 1]);
    });
});
