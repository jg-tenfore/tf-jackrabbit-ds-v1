/**
 * On-screen keyboard layouts.
 *
 * A kiosk has no physical keyboard, so every text entry point drives one of
 * these layouts. Keys are described as data (not markup) so the same renderer
 * handles all of them and a new layout is a data change, not a component.
 */
export type KeyAction = "backspace" | "shift" | "space" | "clear" | "enter";

export interface KeyDef {
    /** The character committed on press. Omitted for action keys. */
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

/** Full alphanumeric — the default for names, emails and free text. */
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
 * Email variant — swaps the bottom row for the punctuation that dominates
 * email entry, so a member never has to hunt for "@" or type ".com".
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

/** Numeric keypad — verification codes, member numbers, quantities. */
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

/** Phone keypad — numeric plus the separators a US number may be typed with. */
export const PHONE_LAYOUT: KeyboardLayout = [
    chars("123"),
    chars("456"),
    chars("789"),
    [
        { action: "clear", label: "Clear" },
        { value: "0" },
        { action: "backspace", label: "Delete" },
    ],
];

export const LAYOUTS = {
    qwerty: QWERTY_LAYOUT,
    email: EMAIL_LAYOUT,
    numeric: NUMERIC_LAYOUT,
    phone: PHONE_LAYOUT,
} as const;

export type LayoutName = keyof typeof LAYOUTS;
