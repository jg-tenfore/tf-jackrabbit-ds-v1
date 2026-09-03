"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    /** Outer container that stacks the toolbar row and the applied-tags row. */
    root: "flex w-full flex-col gap-3",
    /** The main toolbar row: search on the left, filters/actions on the right. */
    toolbar: {
        base: "flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
        compact: "gap-2 sm:gap-2",
    },
    /** Search slot — grows to fill available space, but stays usable on mobile. */
    search: {
        base: "w-full sm:max-w-xs sm:flex-1",
        compact: "sm:max-w-56",
    },
    /** Filters + actions cluster — sits to the right and wraps gracefully. */
    cluster: {
        base: "flex flex-wrap items-center gap-3 sm:ml-auto",
        compact: "gap-2",
    },
    /** Applied-filter tags row with the trailing clear-all affordance. */
    applied: {
        base: "flex w-full flex-wrap items-center gap-2",
    },
});

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Search field slot — typically an `<Input icon={SearchLg} />`. */
    search?: ReactNode;
    /** Filter controls slot — Selects, a ButtonGroup segmented control, etc. */
    filters?: ReactNode;
    /** Action controls slot — e.g. a "Filters" button or "Add tee time" button. */
    actions?: ReactNode;
    /** Applied-filter tags slot — typically a `TagGroup`/`TagList`. */
    appliedTags?: ReactNode;
    /**
     * Compact mode tightens gaps and narrows the search field for dense layouts
     * such as embedded table headers.
     */
    compact?: boolean;
    /**
     * Escape hatch: arbitrary children rendered inside the toolbar cluster when
     * the named slots are not flexible enough.
     */
    children?: ReactNode;
    ref?: Ref<HTMLDivElement>;
    className?: string;
}

export const FilterBar = ({ search, filters, actions, appliedTags, compact = false, children, className, ref, ...props }: FilterBarProps) => {
    const hasCluster = filters || actions || children;

    return (
        <div ref={ref} className={cx(styles.root, className)} {...props}>
            <div className={cx(styles.toolbar.base, compact && styles.toolbar.compact)}>
                {search && <div className={cx(styles.search.base, compact && styles.search.compact)}>{search}</div>}

                {hasCluster && (
                    <div className={cx(styles.cluster.base, compact && styles.cluster.compact)}>
                        {filters}
                        {children}
                        {actions}
                    </div>
                )}
            </div>

            {appliedTags && <div className={styles.applied.base}>{appliedTags}</div>}
        </div>
    );
};

FilterBar.displayName = "FilterBar";
