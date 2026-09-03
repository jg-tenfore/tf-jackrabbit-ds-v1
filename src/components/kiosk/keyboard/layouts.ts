/**
 * On-screen keyboard layouts.
 *
 * A kiosk has no physical keyboard, so every text entry point drives one of
 * these. Keys are described as data (not markup) so one renderer handles all of
 * them and adding a layout is a data change, not a component.
 *
 * Layouts are also where "button real estate" is actually spent: fewer columns
 * means bigger keys, so a layout that drops unnecessary keys is a usability
 * win, not just a visual one. `numeric` is 3 columns precisely so its keys can
 * be 234px wide rather than 64px.
 */
export type KeyAction = "backspace" | "shift" | "space" | "clear" | "enter";

export interface KeyDef {
    /** The characters committed on press. Omitted for action keys. */
    value?: string;
    /** Visible label. Falls back to `value`. */
    label?: string;
    action?: KeyAction;
    /** Relative width — 1 is a standard key. */
    span?: number;
}

export type KeyRow = KeyDef[];
export type KeyboardLayout = KeyRow[];

const chars = (source: string): KeyRow => source.split("").map((value) => ({ value }));

/**
 * Full alphanumeric — names and free text.
 *
 * Shift and Delete get 1.5 spans: both are high-cost to miss (a wrong Delete
 * destroys work, a missed Shift silently corrupts a name), so they buy extra
 * target area from the letters around them.
 */
export const QWERTY_LAYOUT: KeyboardLayout = [
    chars("1234567890"),
    chars("QWERTYUIOP"),
    chars("ASDFGHJKL"),
    [{ action: "shift", label: "Shift", span: 1.5 }, ...chars("ZXCVBNM"), { action: "backspace", label: "Delete", span: 1.5 }],
    [
        { action: "space", label: "Space", span: 5 },
        { action: "clear", label: "Clear", span: 5 },
    ],
];

/**
 * Email variant — the bottom row trades Space (never valid in an address) for
 * the punctuation that dominates email entry, so `@` and `.com` are one press
 * instead of a hunt.
 */
export const EMAIL_LAYOUT: KeyboardLayout = [
    chars("1234567890"),
    chars("QWERTYUIOP"),
    chars("ASDFGHJKL"),
    [{ action: "shift", label: "Shift", span: 1.5 }, ...chars("ZXCVBNM"), { action: "backspace", label: "Delete", span: 1.5 }],
    [
        { value: "@", span: 2 },
        { value: ".", span: 2 },
        { value: ".com", span: 3 },
        { action: "clear", label: "Clear", span: 3 },
    ],
];

/**
 * Numeric keypad — verification codes, member numbers, quantities.
 *
 * Three columns rather than a number row: at 750px that is a 234px key instead
 * of a 64px one, roughly 12x the target area for the same screen space. When
 * only digits are valid, spending the width on fewer, larger keys is free.
 */
export const NUMERIC_LAYOUT: KeyboardLayout = [
    chars("123"),
    chars("456"),
    chars("789"),
    [
        { action: "clear", label: "Clear" },
        { value: "0" },
        { action: "backspace", label: "Delete" },
    ],
];

/** Phone keypad — same geometry as numeric; formatting is applied downstream. */
export const PHONE_LAYOUT: KeyboardLayout = NUMERIC_LAYOUT;

export const LAYOUTS = {
    qwerty: QWERTY_LAYOUT,
    email: EMAIL_LAYOUT,
    numeric: NUMERIC_LAYOUT,
    phone: PHONE_LAYOUT,
} as const;

export type LayoutName = keyof typeof LAYOUTS;

/** Widest row in a layout — drives how much real estate each key can claim. */
export const columnsIn = (layout: KeyboardLayout) =>
    Math.max(...layout.map((row) => row.reduce((total, key) => total + (key.span ?? 1), 0)));
