"use client";

import { cx } from "@/utils/cx";

export interface SegmentOption<T extends string | number> {
    value: T;
    label: string;
    isDisabled?: boolean;
}

/**
 * The joined selector used for Group Size, Transportation and Duration.
 *
 * Segments are butted together with shared borders rather than spaced, which is
 * how the references draw them — and on a kiosk that is the right call: a
 * continuous bar has no dead gaps between targets, so a press landing between
 * two segments still lands on one of them instead of nothing.
 *
 * Selection is a solid brand fill. Unlike the date picker, nothing else here
 * competes for fill, so the strongest available signal is free to use.
 */
export const SegmentedSelector = <T extends string | number>({
    options,
    value,
    onChange,
    size = "md",
    label,
    className,
}: {
    options: SegmentOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
    size?: "md" | "lg";
    label?: string;
    className?: string;
}) => (
    <div className={cx("flex w-full flex-col gap-4", className)}>
        {label && <h3 className="text-2xl font-bold text-primary">{label}</h3>}

        <div
            role="group"
            aria-label={label}
            className="flex w-full overflow-hidden rounded-lg ring-1 ring-border-primary"
        >
            {options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        disabled={option.isDisabled}
                        onClick={() => onChange(option.value)}
                        aria-pressed={isSelected}
                        className={cx(
                            "flex flex-1 items-center justify-center font-medium transition duration-100 ease-linear",
                            size === "lg" ? "h-24 text-3xl" : "h-20 text-2xl",
                            index > 0 && "border-l border-secondary",
                            isSelected ? "bg-brand-solid text-white" : "bg-primary text-primary active:bg-secondary",
                            option.isDisabled && "cursor-not-allowed opacity-50",
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    </div>
);

/** Group size 1..max, with the tail rendered as "N+" when the range is open. */
export const GroupSizeSelector = ({
    value,
    onChange,
    max = 6,
    isOpenEnded = false,
    label = "Group Size",
}: {
    value: number | null;
    onChange: (value: number) => void;
    max?: number;
    isOpenEnded?: boolean;
    label?: string;
}) => (
    <SegmentedSelector
        label={label}
        value={value}
        onChange={onChange}
        options={Array.from({ length: max }, (_, i) => ({
            value: i + 1,
            label: isOpenEnded && i === max - 1 ? `${i + 1}+` : String(i + 1),
        }))}
    />
);

/** Walking or riding — the only two options a course offers. */
export const TransportSelector = ({
    value,
    onChange,
    label = "Transportation",
}: {
    value: "walking" | "cart" | null;
    onChange: (value: "walking" | "cart") => void;
    label?: string;
}) => (
    <SegmentedSelector
        label={label}
        value={value}
        onChange={onChange}
        options={[
            { value: "walking", label: "Walking" },
            { value: "cart", label: "Cart" },
        ]}
    />
);
