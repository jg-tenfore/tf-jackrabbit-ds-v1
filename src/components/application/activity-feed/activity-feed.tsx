"use client";

import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface ActivityFeedItem {
    /** Unique key. */
    id: string;
    /** Leading icon shown in the node. */
    icon: ComponentType<HTMLAttributes<HTMLOrSVGElement>>;
    /** Node color theme. */
    color?: "gray" | "brand" | "success" | "warning" | "error";
    /** Main line — supports rich content (bold actor, links). */
    title: ReactNode;
    /** Optional secondary description. */
    description?: ReactNode;
    /** Right-aligned timestamp. */
    timestamp?: ReactNode;
}

const nodeColors: Record<NonNullable<ActivityFeedItem["color"]>, string> = {
    gray: "bg-secondary text-fg-quaternary",
    brand: "bg-brand-secondary text-fg-brand-primary",
    success: "bg-success-secondary text-fg-success-primary",
    warning: "bg-warning-secondary text-fg-warning-primary",
    error: "bg-error-secondary text-fg-error-primary",
};

/**
 * A vertical activity timeline: each entry is an icon node connected by a line,
 * with a title (actor + action), optional description, and a timestamp. Used for
 * audit logs, order history, and member activity.
 */
export const ActivityFeed = ({ items, className }: { items: ActivityFeedItem[]; className?: string }) => (
    <ul className={cx("flex flex-col", className)}>
        {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const Icon = item.icon;

            return (
                <li key={item.id} className="relative flex gap-3 pb-6 last:pb-0">
                    {/* Connector line */}
                    {!isLast && <span className="absolute top-9 left-4 h-[calc(100%-1.5rem)] w-px -translate-x-1/2 bg-border-secondary" aria-hidden="true" />}

                    {/* Node */}
                    <span className={cx("relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-bg-primary", nodeColors[item.color ?? "gray"])}>
                        <Icon className="size-4" aria-hidden="true" />
                    </span>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-0.5 pt-1">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm text-secondary">{item.title}</p>
                            {item.timestamp && <span className="shrink-0 text-xs text-tertiary tabular-nums">{item.timestamp}</span>}
                        </div>
                        {item.description && <p className="text-sm text-tertiary">{item.description}</p>}
                    </div>
                </li>
            );
        })}
    </ul>
);
