/**
 * Contact helpers for anything the kiosk sends after a purchase.
 *
 * The screen confirms where a code went, but it is a public screen: anyone in
 * line behind the member can read it. So an address on file is never shown in
 * full — enough to recognise ("j•••@example.com", "(•••) •••-0148"), not enough
 * to harvest.
 */

const DOT = "•";

/** "justin.girard@example.com" → "j•••@example.com". */
export const maskEmail = (email: string) => {
    const [local, domain] = email.trim().split("@");
    if (!local || !domain) return email;
    return `${local[0]}${DOT.repeat(3)}@${domain}`;
};

/** Any US number → "(•••) •••-0148". Only the last four digits survive. */
export const maskPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 4) return phone;
    return `(${DOT.repeat(3)}) ${DOT.repeat(3)}-${digits.slice(-4)}`;
};

/** Ten digits, optionally with a leading US 1. */
export const isValidPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
};

/** Deliberately loose: something@something.tld. The server is the real check. */
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

/** "2405550148" → "(240) 555-0148", formatting as digits arrive. */
export const formatPhoneInput = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/** "482193" → "482 193". Groups of three read back correctly at a glance. */
export const formatBallCode = (code: string) => code.replace(/\s/g, "").replace(/(\d{3})(?=\d)/g, "$1 ");
