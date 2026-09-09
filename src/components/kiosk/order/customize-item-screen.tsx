"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Minus, Plus } from "@untitledui/icons";
import { BrandMark } from "@/components/kiosk/brand-mark";
import { ProductImage } from "@/components/kiosk/store/product-image";
import type { MenuItem } from "@/data/menu-catalog";
import {
    MODIFIER_LABELS,
    MODIFIER_LEVELS,
    type Modifier,
    type ModifierLevel,
    SANDWICH_MODIFIERS,
    defaultLevels,
} from "@/data/modifiers";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const centsToUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/**
 * "Customize it" — add and remove ingredients before the item goes in the bag.
 *
 * Each row is a **level**, not a quantity: none / regular / extra. The control
 * looks like a stepper but its middle segment shows a word, because "2 mustard"
 * means nothing to a kitchen while "Extra" does.
 *
 * Only **deviations from the default** are coloured red. An untouched sandwich
 * shows no red anywhere, so a glance down the list tells you what was changed
 * rather than making you read every row. That is also what `summariseModifiers`
 * puts on the order line: "No Pickles, Extra Mayo" and nothing when unchanged.
 *
 * Two escape hatches sit above the list, and they are not the same thing. **Make
 * it plain** is a destination — strip it to the bread and the protein. **Start
 * fresh** is an undo — put it back how it arrived. A user who has made six
 * changes and wants out needs the second; a user who wants a plain sandwich
 * needs the first, and conflating them would silently do the wrong one.
 *
 * The list scrolls with explicit chevrons beside it rather than only by drag. A
 * kiosk has no scrollbar to reveal that there is more below, and a standing user
 * with a tray in one hand is not reliably going to flick a list.
 */
export const CustomizeItemScreen = ({
    item,
    modifiers = SANDWICH_MODIFIERS,
    onSave,
    onCancel,
    className,
}: {
    item: MenuItem;
    modifiers?: Modifier[];
    onSave?: (levels: Record<string, ModifierLevel>) => void;
    onCancel?: () => void;
    className?: string;
}) => {
    const [levels, setLevels] = useState<Record<string, ModifierLevel>>(() => defaultLevels(modifiers));
    const [list, setList] = useState<HTMLDivElement | null>(null);

    const step = (id: string, direction: 1 | -1) =>
        setLevels((prev) => {
            const index = MODIFIER_LEVELS.indexOf(prev[id]);
            const next = Math.min(MODIFIER_LEVELS.length - 1, Math.max(0, index + direction));
            return { ...prev, [id]: MODIFIER_LEVELS[next] };
        });

    // "Plain" is every removable ingredient off. Bun stays: a sandwich without
    // it is a different order, not a plainer one.
    const makePlain = () =>
        setLevels(Object.fromEntries(modifiers.map((m) => [m.id, m.id === "bun" ? "regular" : "none"])));

    const scrollList = (direction: 1 | -1) => list?.scrollBy({ top: direction * 240, behavior: "smooth" });

    return (
        <div className={cx("flex h-full w-full flex-col pt-[70px]", className)}>
            <div className="flex flex-col items-center">
                <BrandMark />
                <h1 className="mt-4 text-[48px] leading-tight font-bold text-primary">Customize it</h1>
            </div>

            <div className="mt-7 px-20">
                <div className="rounded-2xl p-5 ring-1 ring-border-secondary ring-inset">
                    <div className="flex items-center gap-4">
                        <ProductImage src={item.image} alt={item.name} className="size-14 shrink-0" />
                        <div>
                            <p className="text-[20px] font-bold text-primary">{item.name}</p>
                            <p className="text-[18px] text-secondary tabular-nums">{centsToUsd(item.priceCents)}</p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <PresetButton title="Make it plain" body="No Mustard, No Ketchup, No Pickle" onPress={makePlain} />
                        <PresetButton
                            title="Start fresh"
                            body="Clear any changes you've made"
                            onPress={() => setLevels(defaultLevels(modifiers))}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex min-h-0 flex-1 gap-3 px-20">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl ring-1 ring-border-secondary ring-inset">
                    <p className="shrink-0 border-b border-secondary px-5 py-4 text-[18px] text-primary">Comes with</p>

                    <div ref={setList} className="min-h-0 flex-1 divide-y divide-border-secondary overflow-y-auto scrollbar-hide">
                        {modifiers.map((modifier) => (
                            <ModifierRow
                                key={modifier.id}
                                modifier={modifier}
                                level={levels[modifier.id]}
                                onStep={(direction) => step(modifier.id, direction)}
                            />
                        ))}
                    </div>
                </div>

                <ScrollRail onScroll={scrollList} />
            </div>

            <div className="shrink-0 px-16 pt-5 pb-8">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-[56px] flex-1 rounded-lg text-[19px] text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                    >
                        Cancel Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave?.(levels)}
                        className="h-[56px] flex-[1.6] rounded-lg bg-brand-solid text-[19px] font-bold text-white transition duration-100 ease-linear active:bg-brand-solid_hover"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

/** The two escape hatches. Body text explains which is which — see the screen doc. */
const PresetButton = ({ title, body, onPress }: { title: string; body: string; onPress?: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        className="rounded-xl px-4 py-3 text-left ring-1 ring-border-secondary ring-inset transition duration-100 ease-linear active:bg-secondary"
    >
        <span className="block text-[17px] font-bold text-primary">{title}</span>
        <span className="mt-1 block text-[14px] leading-snug text-tertiary">{body}</span>
    </button>
);

const ModifierRow = ({
    modifier,
    level,
    onStep,
}: {
    modifier: Modifier;
    level: ModifierLevel;
    onStep: (direction: 1 | -1) => void;
}) => {
    const isChanged = level !== modifier.defaultLevel;

    return (
        <div className="flex items-center gap-4 px-5 py-4">
            <img
                src={assetUrl(`screen-assets/modifiers/${modifier.icon}`)}
                alt=""
                aria-hidden="true"
                className="size-12 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
                <p className="text-[18px] font-bold text-primary">{modifier.label}</p>
                <p className="text-[14px] text-tertiary tabular-nums">{modifier.calories} cal</p>
            </div>

            {/* One control, three segments. The middle is a label rather than a
                button: tapping the word would have no obvious meaning, and the
                two arrows already cover every move. */}
            <div className="flex h-[44px] shrink-0 items-stretch rounded-lg ring-1 ring-border-primary ring-inset">
                <StepButton icon={Minus} label={`Less ${modifier.label}`} onPress={() => onStep(-1)} isDisabled={level === "none"} />
                <span
                    aria-live="polite"
                    className={cx(
                        "flex w-[88px] items-center justify-center border-x border-secondary text-[15px] font-semibold",
                        // Red marks a deviation, not a level — an untouched item
                        // shows none at all, so what changed is visible at a glance.
                        isChanged ? "text-error-primary" : "text-primary",
                    )}
                >
                    {MODIFIER_LABELS[level]}
                </span>
                <StepButton icon={Plus} label={`More ${modifier.label}`} onPress={() => onStep(1)} isDisabled={level === "extra"} />
            </div>
        </div>
    );
};

const StepButton = ({
    icon: Icon,
    label,
    onPress,
    isDisabled,
}: {
    icon: typeof Minus;
    label: string;
    onPress: () => void;
    isDisabled: boolean;
}) => (
    <button
        type="button"
        onClick={onPress}
        disabled={isDisabled}
        aria-label={label}
        className="flex w-[46px] items-center justify-center text-fg-quaternary transition duration-100 ease-linear active:bg-secondary disabled:opacity-30"
    >
        <Icon className="size-5" aria-hidden="true" />
    </button>
);

/**
 * The list's scroll control.
 *
 * Explicit rather than a scrollbar: a kiosk panel has no scrollbar to reveal
 * that there is more below, and the drag that would work is not a gesture a
 * standing user with a tray in one hand reliably performs.
 */
const ScrollRail = ({ onScroll }: { onScroll: (direction: 1 | -1) => void }) => (
    <div className="flex w-9 shrink-0 flex-col items-center justify-between py-1">
        <RailButton icon={ChevronUp} label="Scroll up" onPress={() => onScroll(-1)} />
        <div aria-hidden="true" className="my-2 w-2 flex-1 rounded-full bg-secondary" />
        <RailButton icon={ChevronDown} label="Scroll down" onPress={() => onScroll(1)} />
    </div>
);

const RailButton = ({ icon: Icon, label, onPress }: { icon: typeof ChevronUp; label: string; onPress: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        aria-label={label}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary ring-1 ring-border-secondary transition duration-100 ease-linear active:bg-secondary"
    >
        <Icon className="size-4 text-fg-quaternary" aria-hidden="true" />
    </button>
);
