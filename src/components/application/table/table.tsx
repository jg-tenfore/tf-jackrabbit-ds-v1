"use client";

import type { ComponentPropsWithRef, HTMLAttributes, ReactNode, Ref, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { createContext, isValidElement, useContext } from "react";
import { ArrowDown, ChevronSelectorVertical, Copy01, Edit01, HelpCircle, Trash01 } from "@untitledui/icons";
import type {
    CellProps as AriaCellProps,
    ColumnProps as AriaColumnProps,
    RowProps as AriaRowProps,
    TableHeaderProps as AriaTableHeaderProps,
    TableProps as AriaTableProps,
} from "react-aria-components";
import {
    Cell as AriaCell,
    Collection as AriaCollection,
    Column as AriaColumn,
    Group as AriaGroup,
    Row as AriaRow,
    Table as AriaTable,
    TableBody as AriaTableBody,
    TableHeader as AriaTableHeader,
    useTableOptions,
} from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

export const TableRowActionsDropdown = () => (
    <Dropdown.Root>
        <Dropdown.DotsButton />

        <Dropdown.Popover className="w-min">
            <Dropdown.Menu>
                <Dropdown.Item icon={Edit01}>
                    <span className="pr-4">Edit</span>
                </Dropdown.Item>
                <Dropdown.Item icon={Copy01}>
                    <span className="pr-4">Copy link</span>
                </Dropdown.Item>
                <Dropdown.Item icon={Trash01}>
                    <span className="pr-4">Delete</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

/**
 * Row density. `md` (default) and `sm` are the standard Untitled UI sizes; `xs`
 * through `4xs` are progressively tighter modes for dense numeric tables
 * (reports, ledgers, spreadsheets) where you want as many rows in view as
 * possible. `3xs`/`4xs` also drop to `text-xs` to shrink the rows further.
 */
export type TableSize = "4xs" | "3xs" | "2xs" | "xs" | "sm" | "md";

// Per-size styling. Kept as lookup maps (instead of ternaries) so every density
// tier stays in sync across the header, rows, cells, and selection column.
const tableRowHeight: Record<TableSize, string> = { "4xs": "h-6", "3xs": "h-7", "2xs": "h-9", xs: "h-11", sm: "h-14", md: "h-18" };
const tableHeaderHeight: Record<TableSize, string> = { "4xs": "h-6", "3xs": "h-6", "2xs": "h-7", xs: "h-8", sm: "h-9", md: "h-11" };
const tableCellPadding: Record<TableSize, string> = {
    "4xs": "px-2.5 py-0.5",
    "3xs": "px-3 py-1",
    "2xs": "px-3 py-1.5",
    xs: "px-4 py-2",
    sm: "px-5 py-3",
    md: "px-6 py-4",
};
// Cell text size — the tightest tiers shrink to text-xs to pack rows in.
const tableCellText: Record<TableSize, string> = { "4xs": "text-xs", "3xs": "text-xs", "2xs": "text-sm", xs: "text-sm", sm: "text-sm", md: "text-sm" };
const tableCardHeaderPadding: Record<TableSize, string> = {
    "4xs": "py-2 md:px-2.5",
    "3xs": "py-2 md:px-3",
    "2xs": "py-2.5 md:px-3",
    xs: "py-3 md:px-4",
    sm: "py-4 md:px-5",
    md: "py-5 md:px-6",
};
const tableSelectColWidth: Record<TableSize, string> = {
    "4xs": "w-6 md:pl-2.5",
    "3xs": "w-7 md:pl-3",
    "2xs": "w-7 md:pl-3",
    xs: "w-8 md:pl-4",
    sm: "w-9 md:pl-5",
    md: "w-11 md:pl-6",
};
const tableSelectCellPad: Record<TableSize, string> = { "4xs": "md:pl-2.5", "3xs": "md:pl-3", "2xs": "md:pl-3", xs: "md:pl-4", sm: "md:pl-5", md: "md:pl-6" };

// Default is intentionally empty (no size) so a standalone <Table size="…"> is
// honored: TableRoot only inherits from context when a wrapping TableCard.Root
// actually set one. A concrete default here would override every Table's size.
const TableContext = createContext<{ size?: TableSize }>({});

const TableCardRoot = ({ children, className, size = "md", ...props }: HTMLAttributes<HTMLDivElement> & { size?: TableSize }) => {
    return (
        <TableContext.Provider value={{ size }}>
            <div {...props} className={cx("overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary", className)}>
                {children}
            </div>
        </TableContext.Provider>
    );
};

interface TableCardHeaderProps {
    /** The title of the table card header. */
    title: string;
    /** The badge displayed next to the title. */
    badge?: ReactNode;
    /** The description of the table card header. */
    description?: string;
    /** The content displayed after the title and badge. */
    contentTrailing?: ReactNode;
    /** The class name of the table card header. */
    className?: string;
}

const TableCardHeader = ({ title, badge, description, contentTrailing, className }: TableCardHeaderProps) => {
    const { size = "md" } = useContext(TableContext);

    return (
        <div
            className={cx(
                "relative flex flex-col items-start gap-4 border-b border-secondary bg-primary px-4 md:flex-row",
                tableCardHeaderPadding[size],
                className,
            )}
        >
            <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <h2 className="text-md font-semibold text-primary">{title}</h2>
                    {badge ? (
                        isValidElement(badge) ? (
                            badge
                        ) : (
                            <Badge color="gray" size="sm" type="modern">
                                {badge}
                            </Badge>
                        )
                    ) : null}
                </div>
                {description && <p className="text-sm text-tertiary">{description}</p>}
            </div>
            {contentTrailing}
        </div>
    );
};

interface TableRootProps extends AriaTableProps, Omit<ComponentPropsWithRef<"table">, "className" | "slot" | "style"> {
    size?: TableSize;
}

const TableRoot = ({ className, size = "md", ...props }: TableRootProps) => {
    const context = useContext(TableContext);

    return (
        <TableContext.Provider value={{ size: context?.size ?? size }}>
            <div className="overflow-x-auto">
                <AriaTable className={(state) => cx("w-full overflow-x-hidden", typeof className === "function" ? className(state) : className)} {...props} />
            </div>
        </TableContext.Provider>
    );
};
TableRoot.displayName = "Table";

interface TableHeaderProps<T extends object>
    extends AriaTableHeaderProps<T>, Omit<ComponentPropsWithRef<"thead">, "children" | "className" | "slot" | "style"> {
    bordered?: boolean;
    size?: TableSize;
}

const TableHeader = <T extends object>({ columns, children, bordered = true, className, size: sizeProp, ...props }: TableHeaderProps<T>) => {
    const context = useContext(TableContext);
    const { selectionBehavior, selectionMode } = useTableOptions();

    const size = sizeProp ?? context.size ?? "md";

    return (
        <AriaTableHeader
            {...props}
            className={(state) =>
                cx(
                    "relative bg-secondary",
                    tableHeaderHeight[size],

                    // Row border—using an "after" pseudo-element to avoid the border taking up space.
                    bordered &&
                        "[&>tr>th]:after:pointer-events-none [&>tr>th]:after:absolute [&>tr>th]:after:inset-x-0 [&>tr>th]:after:bottom-0 [&>tr>th]:after:h-px [&>tr>th]:after:bg-border-secondary [&>tr>th]:focus-visible:after:bg-transparent",

                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {selectionBehavior === "toggle" && (
                <AriaColumn className={cx("relative py-2 pr-0 pl-4", tableSelectColWidth[size])}>
                    {selectionMode === "multiple" && (
                        <div className="flex items-start">
                            <Checkbox slot="selection" size="md" />
                        </div>
                    )}
                </AriaColumn>
            )}
            <AriaCollection items={columns}>{children}</AriaCollection>
        </AriaTableHeader>
    );
};

TableHeader.displayName = "TableHeader";

interface TableHeadProps extends AriaColumnProps, Omit<ThHTMLAttributes<HTMLTableCellElement>, "children" | "className" | "style" | "id"> {
    label?: string;
    tooltip?: string;
}

const TableHead = ({ className, tooltip, label, children, ...props }: TableHeadProps) => {
    const { selectionBehavior } = useTableOptions();

    return (
        <AriaColumn
            {...props}
            className={(state) =>
                cx(
                    "relative p-0 px-6 py-2 outline-hidden focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-bg-primary focus-visible:ring-inset",
                    selectionBehavior === "toggle" && "nth-2:pl-3",
                    state.allowsSorting && "cursor-pointer",
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {(state) => (
                <AriaGroup className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                        {label && <span className="text-xs font-semibold whitespace-nowrap text-quaternary">{label}</span>}
                        {typeof children === "function" ? children(state) : children}
                    </div>

                    {tooltip && (
                        <Tooltip title={tooltip} placement="top">
                            <TooltipTrigger className="cursor-pointer text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover">
                                <HelpCircle className="size-4" />
                            </TooltipTrigger>
                        </Tooltip>
                    )}

                    {state.allowsSorting &&
                        (state.sortDirection ? (
                            <ArrowDown className={cx("size-3 stroke-[3px] text-fg-quaternary", state.sortDirection === "ascending" && "rotate-180")} />
                        ) : (
                            <ChevronSelectorVertical size={12} strokeWidth={3} className="text-fg-quaternary" />
                        ))}
                </AriaGroup>
            )}
        </AriaColumn>
    );
};
TableHead.displayName = "TableHead";

interface TableRowProps<T extends object>
    extends AriaRowProps<T>, Omit<ComponentPropsWithRef<"tr">, "children" | "className" | "onClick" | "slot" | "style" | "id"> {
    highlightSelectedRow?: boolean;
    size?: TableSize;
}

const TableRow = <T extends object>({ columns, children, className, highlightSelectedRow = true, size: sizeProp, ...props }: TableRowProps<T>) => {
    const context = useContext(TableContext);
    const { selectionBehavior } = useTableOptions();

    const size = sizeProp ?? context.size ?? "md";

    return (
        <AriaRow
            {...props}
            className={(state) =>
                cx(
                    "relative outline-focus-ring transition-colors after:pointer-events-none hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2",
                    tableRowHeight[size],
                    highlightSelectedRow && "selected:bg-secondary",

                    // Row border—using an "after" pseudo-element to avoid the border taking up space.
                    "[&>td]:after:absolute [&>td]:after:inset-x-0 [&>td]:after:bottom-0 [&>td]:after:h-px [&>td]:after:w-full [&>td]:after:bg-border-secondary last:[&>td]:after:hidden [&>td]:focus-visible:after:opacity-0 focus-visible:[&>td]:after:opacity-0",

                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {selectionBehavior === "toggle" && (
                <AriaCell className={cx("relative py-2 pr-0 pl-4", tableSelectCellPad[size])}>
                    <div className="flex items-end">
                        <Checkbox slot="selection" size="md" />
                    </div>
                </AriaCell>
            )}
            <AriaCollection items={columns}>{children}</AriaCollection>
        </AriaRow>
    );
};

TableRow.displayName = "TableRow";

interface TableCellProps extends AriaCellProps, Omit<TdHTMLAttributes<HTMLTableCellElement>, "children" | "className" | "style" | "id"> {
    ref?: Ref<HTMLTableCellElement>;
    size?: TableSize;
}

const TableCell = ({ className, children, size: sizeProp, ...props }: TableCellProps) => {
    const context = useContext(TableContext);
    const { selectionBehavior } = useTableOptions();

    const size = sizeProp ?? context.size ?? "md";

    return (
        <AriaCell
            {...props}
            className={(state) =>
                cx(
                    "relative text-tertiary outline-focus-ring focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-2",
                    tableCellText[size],
                    tableCellPadding[size],

                    selectionBehavior === "toggle" && "nth-2:pl-3",

                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {children}
        </AriaCell>
    );
};
TableCell.displayName = "TableCell";

const TableCard = {
    Root: TableCardRoot,
    Header: TableCardHeader,
};

const Table = TableRoot as typeof TableRoot & {
    Body: typeof AriaTableBody;
    Cell: typeof TableCell;
    Head: typeof TableHead;
    Header: typeof TableHeader;
    Row: typeof TableRow;
};
Table.Body = AriaTableBody;
Table.Cell = TableCell;
Table.Head = TableHead;
Table.Header = TableHeader;
Table.Row = TableRow;

export { Table, TableCard };
