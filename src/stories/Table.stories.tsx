import { useState } from "react";
import type { Selection, SortDescriptor } from "react-aria-components";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";

/**
 * The morning tee sheet, rendered. Each row is a booked block on the first tee at
 * Sagamore — time, the member up next, holes they've signed up for, and where
 * their round stands. Built on react-aria-components, so keyboard nav, selection,
 * and column sorting all come for free. Keep it monochromatic; let the starter's
 * board do the talking.
 */
const meta = {
    title: "Components/Layout & Structure/Table",
    component: Table,
    parameters: {
        layout: "padded",
    },
    argTypes: {
        size: {
            control: "radio",
            options: ["4xs", "3xs", "2xs", "xs", "sm", "md"],
            description: "Row density — md/sm are standard; xs → 4xs are progressively denser for numeric tables.",
        },
        selectionMode: {
            control: "radio",
            options: ["none", "single", "multiple"],
            description: "Whether starters can check off rows.",
        },
    },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

type TeeStatus = "On the tee" | "Out on the course" | "Holed out" | "No-show";

const statusColor: Record<TeeStatus, "brand" | "success" | "gray" | "warning"> = {
    "On the tee": "brand",
    "Out on the course": "success",
    "Holed out": "gray",
    "No-show": "warning",
};

interface TeeTime {
    id: string;
    time: string;
    player: string;
    avatar?: string;
    holes: "9" | "18";
    status: TeeStatus;
}

const teeTimes: TeeTime[] = [
    { id: "1", time: "7:10 AM", player: "Bobby Jones", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", holes: "18", status: "Out on the course" },
    { id: "2", time: "7:20 AM", player: "Patty Berg", holes: "18", status: "On the tee" },
    { id: "3", time: "7:30 AM", player: "Walter Hagen", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", holes: "9", status: "Holed out" },
    { id: "4", time: "7:40 AM", player: "Mickey Wright", holes: "18", status: "No-show" },
    { id: "5", time: "7:50 AM", player: "Gene Sarazen", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", holes: "9", status: "On the tee" },
];

/** Renders a player cell with avatar (where available) and name. */
const PlayerCell = ({ row }: { row: TeeTime }) => (
    <div className="flex items-center gap-3">
        <Avatar size="sm" src={row.avatar} alt={row.player} initials={row.player.charAt(0)} />
        <span className="text-sm font-medium text-primary">{row.player}</span>
    </div>
);

/** The full tee sheet — time, member, holes, status, and a quiet actions column. */
export const Playground: Story = {
    args: {
        size: "md",
        "aria-label": "Morning tee sheet",
    },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.Head label="Time" isRowHeader className="w-28" />
                <Table.Head label="Player" />
                <Table.Head label="Holes" className="w-24" />
                <Table.Head label="Status" className="w-44" />
                <Table.Head label="" className="w-16" />
            </Table.Header>
            <Table.Body items={teeTimes}>
                {(row) => (
                    <Table.Row id={row.id}>
                        <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                        <Table.Cell>
                            <PlayerCell row={row} />
                        </Table.Cell>
                        <Table.Cell>{row.holes}</Table.Cell>
                        <Table.Cell>
                            <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                {row.status}
                            </BadgeWithDot>
                        </Table.Cell>
                        <Table.Cell className="text-right" />
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    ),
};

/** Same sheet, but the starter can sort by tee time — click the Time column header. */
export const Sortable: Story = {
    args: {
        "aria-label": "Sortable tee sheet",
    },
    render: (args) => {
        const SortableTable = () => {
            const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
                column: "time",
                direction: "ascending",
            });

            const sorted = [...teeTimes].sort((a, b) => {
                const cmp = a.time.localeCompare(b.time);
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            });

            return (
                <Table {...args} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                    <Table.Header>
                        <Table.Head id="time" label="Time" isRowHeader allowsSorting className="w-28" />
                        <Table.Head id="player" label="Player" />
                        <Table.Head id="holes" label="Holes" className="w-24" />
                        <Table.Head id="status" label="Status" className="w-44" />
                    </Table.Header>
                    <Table.Body items={sorted}>
                        {(row) => (
                            <Table.Row id={row.id}>
                                <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                                <Table.Cell>
                                    <PlayerCell row={row} />
                                </Table.Cell>
                                <Table.Cell>{row.holes}</Table.Cell>
                                <Table.Cell>
                                    <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                        {row.status}
                                    </BadgeWithDot>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            );
        };

        return <SortableTable />;
    },
};

/** Every row ends in a dots menu — edit the booking, copy the link, or scratch it. */
export const WithRowActions: Story = {
    args: {
        "aria-label": "Tee sheet with row actions",
    },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.Head label="Time" isRowHeader className="w-28" />
                <Table.Head label="Player" />
                <Table.Head label="Holes" className="w-24" />
                <Table.Head label="Status" className="w-44" />
                <Table.Head label="" className="w-16" />
            </Table.Header>
            <Table.Body items={teeTimes}>
                {(row) => (
                    <Table.Row id={row.id}>
                        <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                        <Table.Cell>
                            <PlayerCell row={row} />
                        </Table.Cell>
                        <Table.Cell>{row.holes}</Table.Cell>
                        <Table.Cell>
                            <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                {row.status}
                            </BadgeWithDot>
                        </Table.Cell>
                        <Table.Cell className="px-4">
                            <div className="flex justify-end">
                                <TableRowActionsDropdown />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    ),
};

/** The tee sheet tucked into a titled card, with selectable rows for the starter. */
export const WithCardWrapper: Story = {
    args: {
        "aria-label": "Tee sheet card",
        selectionMode: "multiple",
    },
    render: (args) => {
        const CardTable = () => {
            const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["2"]));

            return (
                <TableCard.Root>
                    <TableCard.Header
                        title="Morning tee sheet"
                        badge="5 bookings"
                        description="First tee, front nine. Saturday, June 18."
                    />
                    <Table {...args} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                        <Table.Header>
                            <Table.Head label="Time" isRowHeader className="w-28" />
                            <Table.Head label="Player" />
                            <Table.Head label="Holes" className="w-24" />
                            <Table.Head label="Status" className="w-44" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={teeTimes}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                                    <Table.Cell>
                                        <PlayerCell row={row} />
                                    </Table.Cell>
                                    <Table.Cell>{row.holes}</Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                            {row.status}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                    <Table.Cell className="px-4">
                                        <div className="flex justify-end">
                                            <TableRowActionsDropdown />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            );
        };

        return <CardTable />;
    },
};

// ---------------------------------------------------------------------------
// Additional variations (Buck table patterns)
// ---------------------------------------------------------------------------

type MemberStatus = "Active" | "Past due" | "Cancelled";

const memberStatusColor: Record<MemberStatus, "success" | "warning" | "gray"> = {
    Active: "success",
    "Past due": "warning",
    Cancelled: "gray",
};

interface Member {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    plan: "Annual" | "Seasonal" | "Trial";
    status: MemberStatus;
    usage: number;
    spend: string;
}

const members: Member[] = [
    { id: "1", name: "Olivia Chen", email: "olivia@example.com", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", plan: "Annual", status: "Active", usage: 82, spend: "$2,480" },
    { id: "2", name: "Marcus Bennett", email: "marcus@example.com", plan: "Seasonal", status: "Active", usage: 64, spend: "$1,120" },
    { id: "3", name: "Priya Nair", email: "priya@example.com", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", plan: "Annual", status: "Past due", usage: 48, spend: "$2,480" },
    { id: "4", name: "James Park", email: "james@example.com", plan: "Trial", status: "Active", usage: 12, spend: "$0" },
    { id: "5", name: "Dana Lee", email: "dana@example.com", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", plan: "Seasonal", status: "Cancelled", usage: 0, spend: "$640" },
];

/** Two-line user cell (avatar + name + email), a plan badge, status, and a right-aligned amount. */
export const CustomersTable: Story = {
    args: { "aria-label": "Members" },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.Head label="Member" isRowHeader />
                <Table.Head label="Plan" className="w-32" />
                <Table.Head label="Status" className="w-36" />
                <Table.Head label="Lifetime spend" className="w-40 text-right" />
                <Table.Head label="" className="w-16" />
            </Table.Header>
            <Table.Body items={members}>
                {(row) => (
                    <Table.Row id={row.id}>
                        <Table.Cell>
                            <div className="flex items-center gap-3">
                                <Avatar size="md" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-primary">{row.name}</span>
                                    <span className="text-sm text-tertiary">{row.email}</span>
                                </div>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge size="sm" type="pill-color" color="gray">
                                {row.plan}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <BadgeWithDot size="sm" type="pill-color" color={memberStatusColor[row.status]}>
                                {row.status}
                            </BadgeWithDot>
                        </Table.Cell>
                        <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.spend}</Table.Cell>
                        <Table.Cell className="px-4">
                            <div className="flex justify-end">
                                <TableRowActionsDropdown />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    ),
};

/** A progress column — e.g. how much of a membership's rounds allowance is used. */
export const WithProgress: Story = {
    args: { "aria-label": "Membership usage" },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.Head label="Member" isRowHeader />
                <Table.Head label="Plan" className="w-32" />
                <Table.Head label="Rounds used" className="w-64" />
            </Table.Header>
            <Table.Body items={members}>
                {(row) => (
                    <Table.Row id={row.id}>
                        <Table.Cell>
                            <div className="flex items-center gap-3">
                                <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                <span className="text-sm font-medium text-primary">{row.name}</span>
                            </div>
                        </Table.Cell>
                        <Table.Cell>{row.plan}</Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-40 overflow-hidden rounded-full bg-quaternary">
                                    <div className="h-full rounded-full bg-brand-solid" style={{ width: `${row.usage}%` }} />
                                </div>
                                <span className="text-sm text-tertiary tabular-nums">{row.usage}%</span>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    ),
};

/** Table in a card with a pagination footer. */
export const WithPagination: Story = {
    args: { "aria-label": "Members with pagination" },
    render: (args) => (
        <TableCard.Root>
            <TableCard.Header title="Members" badge="248 total" description="All active and lapsed memberships." />
            <Table {...args}>
                <Table.Header>
                    <Table.Head label="Member" isRowHeader />
                    <Table.Head label="Plan" className="w-32" />
                    <Table.Head label="Status" className="w-36" />
                    <Table.Head label="Lifetime spend" className="w-40 text-right" />
                </Table.Header>
                <Table.Body items={members}>
                    {(row) => (
                        <Table.Row id={row.id}>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Avatar size="md" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-primary">{row.name}</span>
                                        <span className="text-sm text-tertiary">{row.email}</span>
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>{row.plan}</Table.Cell>
                            <Table.Cell>
                                <BadgeWithDot size="sm" type="pill-color" color={memberStatusColor[row.status]}>
                                    {row.status}
                                </BadgeWithDot>
                            </Table.Cell>
                            <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.spend}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                    Previous
                </Button>
                <span className="text-sm text-tertiary">Page 1 of 50</span>
                <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                    Next
                </Button>
            </div>
        </TableCard.Root>
    ),
};

// A dense, numbers-only dataset — daily revenue by category at Sagamore — so the
// row density is easy to judge on real tabular figures (right-aligned, tabular-nums).
interface DayStat {
    id: string;
    date: string;
    rounds: number;
    green: string;
    cart: string;
    range: string;
    fnb: string;
    shop: string;
    total: string;
}

const dayStats: DayStat[] = [
    { id: "1", date: "Jun 1", rounds: 142, green: "$6,390", cart: "$1,704", range: "$384", fnb: "$2,110", shop: "$1,240", total: "$11,828" },
    { id: "2", date: "Jun 2", rounds: 128, green: "$5,760", cart: "$1,536", range: "$420", fnb: "$1,980", shop: "$980", total: "$10,676" },
    { id: "3", date: "Jun 3", rounds: 156, green: "$7,020", cart: "$1,872", range: "$512", fnb: "$2,640", shop: "$1,520", total: "$13,564" },
    { id: "4", date: "Jun 4", rounds: 173, green: "$7,785", cart: "$2,076", range: "$588", fnb: "$3,120", shop: "$1,840", total: "$15,409" },
    { id: "5", date: "Jun 5", rounds: 165, green: "$7,425", cart: "$1,980", range: "$544", fnb: "$2,880", shop: "$1,610", total: "$14,439" },
    { id: "6", date: "Jun 6", rounds: 98, green: "$4,410", cart: "$1,176", range: "$288", fnb: "$1,440", shop: "$720", total: "$8,034" },
    { id: "7", date: "Jun 7", rounds: 84, green: "$3,780", cart: "$1,008", range: "$240", fnb: "$1,160", shop: "$560", total: "$6,748" },
    { id: "8", date: "Jun 8", rounds: 149, green: "$6,705", cart: "$1,788", range: "$432", fnb: "$2,260", shop: "$1,330", total: "$12,515" },
    { id: "9", date: "Jun 9", rounds: 137, green: "$6,165", cart: "$1,644", range: "$396", fnb: "$2,040", shop: "$1,150", total: "$11,395" },
    { id: "10", date: "Jun 10", rounds: 168, green: "$7,560", cart: "$2,016", range: "$560", fnb: "$2,920", shop: "$1,680", total: "$14,736" },
    { id: "11", date: "Jun 11", rounds: 181, green: "$8,145", cart: "$2,172", range: "$604", fnb: "$3,260", shop: "$1,920", total: "$16,101" },
    { id: "12", date: "Jun 12", rounds: 159, green: "$7,155", cart: "$1,908", range: "$528", fnb: "$2,760", shop: "$1,490", total: "$13,841" },
    { id: "13", date: "Jun 13", rounds: 112, green: "$5,040", cart: "$1,344", range: "$336", fnb: "$1,680", shop: "$860", total: "$9,260" },
    { id: "14", date: "Jun 14", rounds: 145, green: "$6,525", cart: "$1,740", range: "$408", fnb: "$2,180", shop: "$1,270", total: "$12,123" },
];

const NumericHead = () => (
    <Table.Header>
        <Table.Head label="Date" isRowHeader className="w-24" />
        <Table.Head label="Rounds" className="text-right" />
        <Table.Head label="Green fees" className="text-right" />
        <Table.Head label="Carts" className="text-right" />
        <Table.Head label="Range" className="text-right" />
        <Table.Head label="F&B" className="text-right" />
        <Table.Head label="Pro shop" className="text-right" />
        <Table.Head label="Total" className="text-right" />
    </Table.Header>
);

const NumericRows = ({ items = dayStats }: { items?: DayStat[] }) => (
    <Table.Body items={items}>
        {(row) => (
            <Table.Row id={row.id}>
                <Table.Cell className="font-medium whitespace-nowrap text-primary">{row.date}</Table.Cell>
                <Table.Cell className="text-right tabular-nums text-secondary">{row.rounds}</Table.Cell>
                <Table.Cell className="text-right tabular-nums text-secondary">{row.green}</Table.Cell>
                <Table.Cell className="text-right tabular-nums text-secondary">{row.cart}</Table.Cell>
                <Table.Cell className="text-right tabular-nums text-secondary">{row.range}</Table.Cell>
                <Table.Cell className="text-right tabular-nums text-secondary">{row.fnb}</Table.Cell>
                <Table.Cell className="text-right tabular-nums text-secondary">{row.shop}</Table.Cell>
                <Table.Cell className="text-right font-medium tabular-nums text-primary">{row.total}</Table.Cell>
            </Table.Row>
        )}
    </Table.Body>
);

/**
 * Compact rows — a dense, numbers-only revenue table. Defaults to the tightest
 * `size="4xs"` (**24px** rows, `text-xs`), but flip `size` in the Controls tab
 * through `4xs → 3xs → 2xs → xs → sm → md` to feel each density. Set `size` once
 * on the `Table` and the header, rows, and cells all inherit it.
 */
export const CompactRows: Story = {
    args: { "aria-label": "Daily revenue (compact)", size: "4xs" },
    render: (args) => (
        <Table {...args}>
            <NumericHead />
            <NumericRows items={dayStats.slice(0, 5)} />
        </Table>
    ),
};

// Every density mode, tightest → roomiest, each labeled with its row height.
const DENSITY_MODES: { size: "4xs" | "3xs" | "2xs" | "xs" | "sm" | "md"; label: string; height: string; note?: string }[] = [
    { size: "4xs", label: "4xs", height: "24px", note: "text-xs" },
    { size: "3xs", label: "3xs", height: "28px", note: "text-xs" },
    { size: "2xs", label: "2xs", height: "36px" },
    { size: "xs", label: "xs", height: "44px" },
    { size: "sm", label: "sm", height: "56px" },
    { size: "md", label: "md", height: "72px", note: "default" },
];

/**
 * Every density mode side by side on the same dense numeric dataset — 5 rows per
 * mode — so you can eyeball the difference before rolling it out. From the
 * tightest `4xs` (24px) up to the default `md` (72px).
 */
export const DensityComparison: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <div className="flex flex-col gap-5">
            {DENSITY_MODES.map((mode) => (
                <div key={mode.size} className="flex flex-col gap-1.5">
                    <p className="text-sm font-semibold text-primary">
                        size=&quot;{mode.label}&quot;{" "}
                        <span className="font-normal text-tertiary">
                            · {mode.height} rows{mode.note ? ` (${mode.note})` : ""}
                        </span>
                    </p>
                    <Table aria-label={`Daily revenue ${mode.label}`} size={mode.size}>
                        <NumericHead />
                        <NumericRows items={dayStats.slice(0, 3)} />
                    </Table>
                </div>
            ))}
        </div>
    ),
};
