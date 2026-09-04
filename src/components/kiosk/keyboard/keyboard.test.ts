import { describe, expect, it } from "vitest";
import { formatPhone, suggestDomains } from "@/components/kiosk/keyboard/keyboard-field";
import { LAYOUTS, columnsIn } from "@/components/kiosk/keyboard/layouts";

describe("formatPhone", () => {
    it("formats progressively as digits arrive", () => {
        // The shape confirms the digit count as the user types, which is the
        // cheapest error check available at a kiosk.
        expect(formatPhone("")).toBe("");
        expect(formatPhone("55")).toBe("55");
        expect(formatPhone("555")).toBe("555");
        expect(formatPhone("5551")).toBe("(555) 1");
        expect(formatPhone("555123")).toBe("(555) 123");
        expect(formatPhone("5551234567")).toBe("(555) 123-4567");
    });

    it("ignores non-digits and caps at ten", () => {
        expect(formatPhone("(555) 123-4567")).toBe("(555) 123-4567");
        expect(formatPhone("55512345678901")).toBe("(555) 123-4567");
    });
});

describe("suggestDomains", () => {
    it("suggests nothing before an @", () => {
        expect(suggestDomains("justin")).toEqual([]);
        expect(suggestDomains("")).toEqual([]);
    });

    it("offers every domain immediately after the @", () => {
        expect(suggestDomains("justin@").length).toBeGreaterThan(0);
    });

    it("narrows as the domain is typed", () => {
        expect(suggestDomains("justin@gm")).toEqual(["gmail.com"]);
    });

    it("stops suggesting once the domain is complete", () => {
        // Nothing left to complete, so the bar should disappear rather than
        // offering the user their own input back.
        expect(suggestDomains("justin@gmail.com")).toEqual([]);
    });

    it("is case-insensitive", () => {
        expect(suggestDomains("justin@GM")).toEqual(["gmail.com"]);
    });
});

describe("keyboard layouts", () => {
    it("keeps qwerty at 10 columns, which the md key size is derived from", () => {
        expect(columnsIn(LAYOUTS.qwerty)).toBe(10);
    });

    it("keeps the numeric pad at 3 columns", () => {
        expect(columnsIn(LAYOUTS.numeric)).toBe(3);
    });

    it("gives every layout a backspace", () => {
        for (const layout of Object.values(LAYOUTS)) {
            const actions = layout.flat().map((key) => key.action);
            expect(actions).toContain("backspace");
        }
    });

    it("drops space from the email layout, where it is never valid", () => {
        const actions = LAYOUTS.email.flat().map((key) => key.action);
        expect(actions).not.toContain("space");
        expect(LAYOUTS.email.flat().some((key) => key.value === "@")).toBe(true);
    });
});
