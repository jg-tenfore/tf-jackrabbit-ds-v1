import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flag01, HomeLine } from "@untitledui/icons";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";

/**
 * Breadcrumbs trace a golfer's path through the clubhouse — from the front door
 * down to a single hole or a booking confirmation. The current page sits at the
 * end as plain text while every prior crumb is a muted link that brightens on
 * hover. The monochromatic Sagamore theme keeps every divider in greyscale.
 */
const meta = {
    title: "Components/Navigation/Breadcrumbs",
    component: Breadcrumbs,
    parameters: { layout: "centered" },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

const courseTrail = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Championship", href: "/courses/championship" },
    { label: "Hole 7" },
];

/** Default trail down to a single hole on the Championship course. */
export const Playground: Story = {
    args: {
        items: courseTrail,
        divider: "chevron",
        type: "text",
        showHomeIcon: false,
    },
};

/** Chevron dividers — the default Tenfore Golf separator. */
export const ChevronDivider: Story = {
    args: {
        items: courseTrail,
        divider: "chevron",
    },
};

/** Slash dividers for a more compact, typographic trail. */
export const SlashDivider: Story = {
    args: {
        items: [
            { label: "Dashboard", href: "/" },
            { label: "Tee sheet", href: "/tee-sheet" },
            { label: "Booking" },
        ],
        divider: "slash",
    },
};

/** A leading home icon anchors the trail at the clubhouse front door. */
export const WithHomeIcon: Story = {
    args: {
        items: courseTrail,
        divider: "chevron",
        showHomeIcon: true,
    },
};

/** Button-style crumbs with hover backgrounds, useful in toolbars. */
export const ButtonStyle: Story = {
    args: {
        items: courseTrail,
        divider: "chevron",
        type: "button",
        showHomeIcon: true,
    },
};

/** Per-crumb icons via the compound API instead of the `items` array. */
export const CompoundWithIcons: Story = {
    render: () => (
        <Breadcrumbs divider="chevron">
            <Breadcrumbs.Item href="/" icon={HomeLine}>
                Home
            </Breadcrumbs.Item>
            <Breadcrumbs.Divider divider="chevron" />
            <Breadcrumbs.Item href="/courses">Courses</Breadcrumbs.Item>
            <Breadcrumbs.Divider divider="chevron" />
            <Breadcrumbs.Item icon={Flag01} current>
                Hole 7
            </Breadcrumbs.Item>
        </Breadcrumbs>
    ),
};
