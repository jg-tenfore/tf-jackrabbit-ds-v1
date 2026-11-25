import { describe, expect, it } from "vitest";
import { doneLabel } from "@/components/kiosk/range/ball-code-screen";

describe("doneLabel", () => {
    it("says what to do for a single code", () => expect(doneLabel(0, 1)).toBe("Tap “Got it” above to finish"));
    it("counts saved codes until all are saved", () => expect(doneLabel(2, 6)).toBe("Save all 6 codes to finish · 2 of 6 saved"));
    it("becomes Done once every code is saved", () => {
        expect(doneLabel(1, 1)).toBe("Done");
        expect(doneLabel(6, 6)).toBe("Done");
    });
});
