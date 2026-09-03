"use client";

import type { ReactNode } from "react";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    sm: {
        root: "gap-3 pb-4",
        content: "gap-1",
        titleRow: "gap-2",
        title: "text-md font-semibold text-primary",
        supportingText: "text-sm text-tertiary",
    },
    md: {
        root: "gap-4 pb-5",
        content: "gap-1",
        titleRow: "gap-2",
        title: "text-lg font-semibold text-primary",
        supportingText: "text-sm text-tertiary",
    },
    lg: {
        root: "gap-4 pb-5",
        content: "gap-1",
        titleRow: "gap-2.5",
        title: "text-xl font-semibold text-primary",
        supportingText: "text-md text-tertiary",
    },
});

interface CardHeaderProps {
    /** The size variant of the card header. */
    size?: keyof typeof styles;
    /** The main heading text. */
    title: ReactNode;
    /** Optional supporting text shown beneath the title. */
    supportingText?: ReactNode;
    /** Optional leading element such as an avatar, badge or featured icon. */
    leading?: ReactNode;
    /** Optional badge shown next to the title (e.g. a count). */
    badge?: ReactNode;
    /** Optional trailing actions slot (e.g. buttons). */
    actions?: ReactNode;
    /** Whether to render a bottom divider/border. */
    withBorder?: boolean;
    /** Additional class names for the root element. */
    className?: string;
}

export const CardHeader = ({ size = "md", title, supportingText, leading, badge, actions, withBorder = false, className }: CardHeaderProps) => {
    return (
        <header
            className={cx(
                "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
                styles[size].root,
                withBorder && "border-b border-secondary",
                className,
            )}
        >
            <div className={cx("flex min-w-0 flex-1 items-start", styles[size].content)}>
                {leading && <div className="shrink-0">{leading}</div>}

                <div className={cx("flex min-w-0 flex-1 flex-col", styles[size].content)}>
                    <div className={cx("flex items-center", styles[size].titleRow)}>
                        <h2 className={cx("min-w-0 truncate", styles[size].title)}>{title}</h2>
                        {badge && <div className="shrink-0">{badge}</div>}
                    </div>

                    {supportingText && <p className={styles[size].supportingText}>{supportingText}</p>}
                </div>
            </div>

            {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
        </header>
    );
};
