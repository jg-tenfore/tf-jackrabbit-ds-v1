"use client";

import type { FC, ReactNode } from "react";
import { isValidElement } from "react";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

export type AlertColor = "gray" | "brand" | "success" | "warning" | "error";

export interface AlertProps {
    /** The color/intent of the alert. Drives the featured icon color. */
    color?: AlertColor;
    /** Heading text for the alert. */
    title?: ReactNode;
    /** Supporting text. Use this or `children`. */
    description?: ReactNode;
    /** Supporting content. Falls back to `description` when omitted. */
    children?: ReactNode;
    /**
     * Leading visual. Pass an icon component (FC) to wrap it in a `FeaturedIcon`,
     * or pass a ReactNode (e.g. your own `FeaturedIcon`) to render it as-is.
     * Set to `false` to hide the leading icon entirely.
     */
    icon?: FC<{ className?: string }> | ReactNode | false;
    /** Inline actions rendered below the text (e.g. link buttons). */
    actions?: ReactNode;
    /** When provided, renders a dismiss button that calls this handler. */
    onClose?: () => void;
    /** Accessible label for the dismiss button. */
    closeLabel?: string;
    className?: string;
}

/**
 * The native Tenfore Golf alert: a white card with a subtle ring and shadow, a
 * colored featured icon conveying intent, a semibold title, supporting text,
 * optional inline actions, and a dismiss button.
 */
export const Alert = ({ color = "gray", title, description, children, icon: Icon, actions, onClose, closeLabel = "Dismiss", className }: AlertProps) => {
    const content = children ?? description;
    const showLeading = Icon !== false;

    return (
        <div role="alert" className={cx("flex w-full gap-4 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary outline-hidden", className)}>
            {showLeading && (
                <>
                    {/* FC icon → wrap in FeaturedIcon. */}
                    {isReactComponent(Icon) && <FeaturedIcon icon={Icon} color={color} theme="outline" size="md" className="shrink-0" />}
                    {/* Pre-built node (e.g. a custom FeaturedIcon) → render as-is. */}
                    {isValidElement(Icon) && <div className="shrink-0">{Icon}</div>}
                </>
            )}

            <div className="flex flex-1 flex-col gap-3 pt-0.5">
                <div className="flex flex-col gap-1">
                    {title && <p className="text-sm font-semibold text-primary">{title}</p>}
                    {content && <div className="text-sm text-tertiary">{content}</div>}
                </div>

                {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
            </div>

            {onClose && <CloseButton size="sm" label={closeLabel} onPress={onClose} className="-m-2 shrink-0" />}
        </div>
    );
};
