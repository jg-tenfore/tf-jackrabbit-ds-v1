/**
 * Ingredient modifiers for the customize screen.
 *
 * A modifier is a **level**, not a quantity: none / regular / extra. The
 * reference draws it as a stepper, but the middle segment shows a word rather
 * than a number precisely because "2 mustard" means nothing to a kitchen while
 * "Extra" does.
 *
 * `regular` is the default for anything the item comes with and `none` for
 * anything that has to be asked for. Deviation from that default is what the
 * screen colours red — not the level itself — so a sandwich left alone shows no
 * red at all and a glance tells you what was changed.
 */
export type ModifierLevel = "none" | "regular" | "extra";

/** In stepper order, so + and − are simple index moves. */
export const MODIFIER_LEVELS: ModifierLevel[] = ["none", "regular", "extra"];

export const MODIFIER_LABELS: Record<ModifierLevel, string> = {
    none: "None",
    regular: "Regular",
    extra: "Extra",
};

export interface Modifier {
    id: string;
    label: string;
    calories: number;
    /** Filename under `screen-assets/modifiers/`. */
    icon: string;
    /** What the item ships with when nothing has been touched. */
    defaultLevel: ModifierLevel;
    /**
     * True when the supplied artwork is drawn struck through — i.e. it depicts
     * the *absence* of the ingredient rather than the ingredient. Two of the
     * exports are like this, so those rows are honest about it rather than
     * quietly showing "no lettuce" next to the word Regular.
     */
    iconIsNegated?: boolean;
}

/**
 * The set a sandwich can be built from.
 *
 * One list rather than "comes with" and "add extras" as separate sections: the
 * reference draws a single scrolling list under one heading, and the default
 * level already says which is which — the things it comes with start at
 * Regular, the rest at None.
 */
export const SANDWICH_MODIFIERS: Modifier[] = [
    { id: "mustard", label: "Mustard", calories: 5, icon: "mustard.svg", defaultLevel: "regular" },
    { id: "mayo", label: "Mayo", calories: 5, icon: "mayo.svg", defaultLevel: "regular" },
    { id: "pickles", label: "Pickles", calories: 5, icon: "pickles.svg", defaultLevel: "regular" },
    { id: "lettuce", label: "Lettuce", calories: 5, icon: "lettuce.svg", defaultLevel: "regular", iconIsNegated: true },
    { id: "cheese", label: "Cheese", calories: 60, icon: "cheese.svg", defaultLevel: "regular" },
    { id: "bun", label: "Bun", calories: 120, icon: "bun.svg", defaultLevel: "regular", iconIsNegated: true },
    { id: "bacon", label: "Bacon", calories: 90, icon: "bacon.svg", defaultLevel: "none" },
    { id: "onions", label: "Onions", calories: 10, icon: "onions.svg", defaultLevel: "none" },
    { id: "onion-rings", label: "Onion Rings", calories: 150, icon: "onion-rings.svg", defaultLevel: "none" },
    { id: "triple-meat", label: "Triple Meat", calories: 320, icon: "triple-meat.svg", defaultLevel: "none" },
    { id: "blue-cheese", label: "Blue Cheese", calories: 70, icon: "blue-cheese.svg", defaultLevel: "none" },
    { id: "mozzarella", label: "Mozzarella", calories: 65, icon: "mozzarella.svg", defaultLevel: "none" },
];

/** The starting state for an item: every modifier at its default. */
export const defaultLevels = (modifiers: Modifier[]): Record<string, ModifierLevel> =>
    Object.fromEntries(modifiers.map((m) => [m.id, m.defaultLevel]));

/**
 * The short summary an order line shows, e.g. "No Pickles, Extra Mayo".
 *
 * Only deviations, in list order. An unchanged sandwich summarises as nothing
 * at all, which is what lets the order review stay quiet for most lines.
 */
export const summariseModifiers = (modifiers: Modifier[], levels: Record<string, ModifierLevel>): string[] =>
    modifiers
        .filter((m) => levels[m.id] !== m.defaultLevel)
        .map((m) => `${levels[m.id] === "none" ? "No" : "Extra"} ${m.label}`);
