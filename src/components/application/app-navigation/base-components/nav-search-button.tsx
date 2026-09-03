"use client";

import { SearchLg } from "@untitledui/icons";
import { cx } from "@/utils/cx";

/**
 * A search field rendered as a button — for opening a command menu instead of
 * typing inline. Mirrors the look of the sidebar search input.
 */
export const NavSearchButton = ({ onClick, showShortcut, className }: { onClick: () => void; showShortcut?: boolean; className?: string }) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "relative flex w-full items-center gap-2.5 rounded-lg bg-primary px-3 py-2 text-md text-placeholder shadow-xs ring-1 ring-primary transition duration-100 ease-linear outline-focus-ring ring-inset hover:ring-2 hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2",
            className,
        )}
    >
        <SearchLg aria-hidden="true" className="size-5 shrink-0 text-fg-quaternary" />
        <span className="flex-1 text-left">Search</span>
        {showShortcut && (
            <kbd className="rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-secondary select-none ring-inset">⌘K</kbd>
        )}
    </button>
);
