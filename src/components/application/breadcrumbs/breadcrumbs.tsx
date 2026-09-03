"use client";

import type { FC, ReactNode } from "react";
import { Fragment, isValidElement } from "react";
import { ChevronRight, HomeLine, SlashDivider } from "@untitledui/icons";
import type { BreadcrumbProps as AriaBreadcrumbProps, BreadcrumbsProps as AriaBreadcrumbsProps, LinkProps as AriaLinkProps } from "react-aria-components";
import { Breadcrumb as AriaBreadcrumb, Breadcrumbs as AriaBreadcrumbs, Link as AriaLink } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

type IconType = FC<{ className?: string }> | ReactNode;

export type BreadcrumbDivider = "chevron" | "slash";

export type BreadcrumbType = "text" | "button";

const styles = sortCx({
    /** Wrapping nav + ordered list. */
    list: "flex items-center gap-1.5",
    /** The divider icon between items. */
    divider: "size-4 shrink-0 text-fg-quaternary",
    /** Shared item label styles per type. */
    item: {
        text: cx(
            "flex items-center gap-1.5 rounded-sm text-sm font-semibold outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
            // Muted link by default, brightening on hover.
            "text-quaternary hover:text-secondary",
        ),
        button: cx(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
            "text-quaternary hover:bg-primary_hover hover:text-secondary",
        ),
    },
    /** The current (last) item is not a link. */
    current: {
        text: "flex items-center gap-1.5 text-sm font-semibold text-secondary",
        button: "flex items-center gap-1.5 rounded-md bg-primary_hover px-2 py-1 text-sm font-semibold text-secondary",
    },
    /** Leading icon inside an item. */
    icon: "size-4 shrink-0 text-fg-quaternary transition-inherit-all",
});

const dividers: Record<BreadcrumbDivider, FC<{ className?: string }>> = {
    chevron: ChevronRight,
    slash: SlashDivider,
};

export interface BreadcrumbItemData {
    /** The label shown for this crumb. */
    label: ReactNode;
    /** Destination for the crumb. Omitted for non-interactive crumbs. */
    href?: AriaLinkProps["href"];
    /** Optional leading icon (component reference or element). */
    icon?: IconType;
    /** Marks this crumb as the current page. The last item is current by default. */
    current?: boolean;
}

interface BreadcrumbLabelProps {
    icon?: IconType;
    children: ReactNode;
}

const BreadcrumbLabel = ({ icon: Icon, children }: BreadcrumbLabelProps) => (
    <>
        {isValidElement(Icon) && Icon}
        {isReactComponent(Icon) && <Icon data-icon className={styles.icon} />}
        {children}
    </>
);

interface BreadcrumbItemProps extends Omit<AriaBreadcrumbProps, "children" | "className"> {
    /** Additional classes for the crumb wrapper. */
    className?: string;
    /** Destination for the crumb. When omitted the crumb renders as plain text. */
    href?: AriaLinkProps["href"];
    /** Options for the configured client side router. */
    routerOptions?: AriaLinkProps["routerOptions"];
    /** Optional leading icon (component reference or element). */
    icon?: IconType;
    /** Marks this crumb as the current page (rendered as non-link text). */
    current?: boolean;
    /** Visual style of the crumb. */
    type?: BreadcrumbType;
    children: ReactNode;
}

export const BreadcrumbItem = ({ href, routerOptions, icon, current, type = "text", className, children, ...otherProps }: BreadcrumbItemProps) => {
    const isCurrent = current || !href;

    return (
        <AriaBreadcrumb {...otherProps} className={cx("flex items-center gap-1.5", className)}>
            {isCurrent ? (
                <span aria-current="page" className={styles.current[type]}>
                    <BreadcrumbLabel icon={icon}>{children}</BreadcrumbLabel>
                </span>
            ) : (
                <AriaLink href={href} routerOptions={routerOptions} className={styles.item[type]}>
                    <BreadcrumbLabel icon={icon}>{children}</BreadcrumbLabel>
                </AriaLink>
            )}
        </AriaBreadcrumb>
    );
};

interface BreadcrumbsProps<T extends object> extends Omit<AriaBreadcrumbsProps<T>, "children" | "className" | "items"> {
    /** Additional classes for the nav element. */
    className?: string;
    /** The crumbs to render. When omitted, pass compound `Breadcrumbs.Item` children. */
    items?: BreadcrumbItemData[];
    /** The divider rendered between crumbs. */
    divider?: BreadcrumbDivider;
    /** Shows a leading home icon on the first crumb. */
    showHomeIcon?: boolean;
    /** Visual style applied to every crumb. */
    type?: BreadcrumbType;
    /** Compound children, used when `items` is not provided. */
    children?: ReactNode;
}

const BreadcrumbsComponent = <T extends object>({
    items,
    divider = "chevron",
    showHomeIcon = false,
    type = "text",
    className,
    children,
    ...otherProps
}: BreadcrumbsProps<T>) => {
    const DividerIcon = dividers[divider];

    const renderedChildren = items
        ? items.map((item, index) => {
              const isLast = index === items.length - 1;
              const icon = showHomeIcon && index === 0 && !item.icon ? HomeLine : item.icon;

              return (
                  <Fragment key={index}>
                      <BreadcrumbItem href={item.href} icon={icon} current={item.current ?? isLast} type={type}>
                          {item.label}
                      </BreadcrumbItem>
                      {!isLast && <DividerIcon aria-hidden="true" className={styles.divider} />}
                  </Fragment>
              );
          })
        : children;

    return (
        <AriaBreadcrumbs aria-label="Breadcrumb" {...otherProps} className={cx(styles.list, className)}>
            {renderedChildren}
        </AriaBreadcrumbs>
    );
};

const Breadcrumbs = BreadcrumbsComponent as typeof BreadcrumbsComponent & {
    Item: typeof BreadcrumbItem;
    /** Divider icon, exported for manual composition between compound items. */
    Divider: FC<{ divider?: BreadcrumbDivider; className?: string }>;
};

const BreadcrumbDividerIcon: FC<{ divider?: BreadcrumbDivider; className?: string }> = ({ divider = "chevron", className }) => {
    const DividerIcon = dividers[divider];
    return <DividerIcon aria-hidden="true" className={cx(styles.divider, className)} />;
};

Breadcrumbs.Item = BreadcrumbItem;
Breadcrumbs.Divider = BreadcrumbDividerIcon;

export { Breadcrumbs };
