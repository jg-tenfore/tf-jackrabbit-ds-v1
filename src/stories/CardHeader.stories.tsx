import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flag01, Plus, RefreshCw01 } from "@untitledui/icons";
import { CardHeader } from "@/components/application/card-header/card-header";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

/**
 * The Card Header sits at the top of a card or section — a tee sheet, a member
 * list, a round history. It pairs a title (with an optional count badge and
 * leading element) against a trailing actions slot. The monochromatic
 * "Sagamore" theme keeps everything greyscale.
 */
const meta = {
    title: "Components/Layout & Structure/Card Headers",
    component: CardHeader,
    parameters: { layout: "padded" },
    argTypes: {
        size: { control: "radio", options: ["sm", "md", "lg"] },
        withBorder: { control: "boolean" },
        title: { control: "text" },
        supportingText: { control: "text" },
    },
    args: {
        size: "md",
        withBorder: true,
        title: "Tee sheet — today",
        supportingText: "Every booked tee time across all 18 holes.",
    },
    decorators: [
        (Story) => (
            <div className="w-full max-w-3xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Just a title and supporting text — the bare scorecard. */
export const Simple: Story = {
    args: {
        withBorder: false,
        title: "Course conditions",
        supportingText: "Greens running at 11 on the stimp. Cart path only on 4 and 12.",
    },
};

/** Title on the left, a button group of actions tucked on the right. */
export const WithActions: Story = {
    args: {
        title: "Recent rounds",
        supportingText: "Scores posted by members over the last seven days.",
        actions: (
            <>
                <Button size="md" color="secondary" iconLeading={RefreshCw01}>
                    Refresh
                </Button>
                <Button size="md" color="link-color">
                    View all
                </Button>
            </>
        ),
    },
};

/** A count badge sits beside the title — 240 members on the roster. */
export const WithBadge: Story = {
    args: {
        title: "Members",
        supportingText: "Active memberships at Sagamore this season.",
        badge: (
            <Badge size="md" color="gray" type="pill-color">
                240
            </Badge>
        ),
        actions: (
            <Button size="md" color="primary" iconLeading={Plus}>
                Add member
            </Button>
        ),
    },
};

/** A leading AvatarLabelGroup — the head pro fronting the lesson schedule. */
export const WithAvatar: Story = {
    args: {
        title: "",
        supportingText: "",
        withBorder: true,
        leading: (
            <AvatarLabelGroup
                size="md"
                src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
                alt="Olivia Rhye"
                title="Olivia Rhye"
                subtitle="Head professional · Lessons & fittings"
            />
        ),
        actions: (
            <Button size="md" color="secondary">
                Book a lesson
            </Button>
        ),
    },
};

/** All three sizes, with a leading featured icon and a count badge. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-10">
            {(["sm", "md", "lg"] as const).map((size) => (
                <CardHeader
                    key={size}
                    size={size}
                    withBorder
                    leading={<FeaturedIcon icon={Flag01} color="gray" theme="modern" size={size === "lg" ? "lg" : "md"} />}
                    title={`Front nine — ${size}`}
                    supportingText="Pin positions and pace-of-play notes for the front side."
                    badge={
                        <Badge size="sm" color="gray" type="pill-color">
                            9
                        </Badge>
                    }
                    actions={
                        <Button size="md" color="link-color">
                            View all
                        </Button>
                    }
                />
            ))}
        </div>
    ),
};
