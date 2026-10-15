"use client";

import { Star01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export type FavoriteButtonStyle = "icon" | "labeled";

/** Two touch-sized treatments for the same save action. */
export const FavoriteButton = ({
    name,
    isFavorite,
    onToggle,
    variant = "icon",
}: {
    name: string;
    isFavorite: boolean;
    onToggle: () => void;
    variant?: FavoriteButtonStyle;
}) => (
    <button
        type="button"
        aria-label={`${isFavorite ? "Remove" : "Add"} ${name} ${isFavorite ? "from" : "to"} favorites`}
        aria-pressed={isFavorite}
        title={isFavorite ? "Remove from favorites" : "Save to favorites"}
        onClick={onToggle}
        className={cx(
            "flex h-16 shrink-0 items-center justify-center gap-3 rounded-full ring-1 transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:scale-[0.96]",
            variant === "icon" ? "w-16" : "min-w-[148px] px-5",
            isFavorite ? "bg-amber-50 text-amber-600 ring-amber-300" : "bg-primary text-fg-secondary ring-border-primary active:bg-secondary",
        )}
    >
        <Star01 aria-hidden="true" className={cx("size-7", isFavorite && "fill-amber-400 text-amber-500")} />
        {variant === "labeled" && <span className="text-xl font-semibold">{isFavorite ? "Saved" : "Save"}</span>}
    </button>
);
