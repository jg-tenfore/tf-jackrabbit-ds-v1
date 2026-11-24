import { describe, expect, it } from "vitest";
import { formatBallCode, formatPhoneInput, isValidEmail, isValidPhone, maskEmail, maskPhone } from "@/components/kiosk/range/contact";

describe("maskEmail", () => {
    it("keeps the first letter and the domain", () => expect(maskEmail("justin.girard@example.com")).toBe("j•••@example.com"));
    it("hides the length of the local part", () => expect(maskEmail("a@example.com")).toBe("a•••@example.com"));
    it("returns something that is not an email unchanged", () => expect(maskEmail("nope")).toBe("nope"));
});

describe("maskPhone", () => {
    it("keeps only the last four digits", () => expect(maskPhone("(240) 555-0148")).toBe("(•••) •••-0148"));
    it("ignores formatting", () => expect(maskPhone("+1 240.555.0148")).toBe("(•••) •••-0148"));
});

describe("validation", () => {
    it("accepts ten digits, with or without a leading 1", () => {
        expect(isValidPhone("(240) 555-0148")).toBe(true);
        expect(isValidPhone("12405550148")).toBe(true);
    });
    it("rejects a short number", () => expect(isValidPhone("555-0148")).toBe(false));
    it("accepts a plain email and rejects a missing TLD", () => {
        expect(isValidEmail("dana@example.com")).toBe(true);
        expect(isValidEmail("dana@example")).toBe(false);
    });
});

describe("formatting", () => {
    it("formats a phone number as it is typed", () => {
        expect(formatPhoneInput("240")).toBe("240");
        expect(formatPhoneInput("2405")).toBe("(240) 5");
        expect(formatPhoneInput("2405550148")).toBe("(240) 555-0148");
        expect(formatPhoneInput("24055501489")).toBe("(240) 555-0148");
    });
    it("groups a ball code in threes", () => {
        expect(formatBallCode("482193")).toBe("482 193");
        expect(formatBallCode("48219")).toBe("482 19");
    });
});
