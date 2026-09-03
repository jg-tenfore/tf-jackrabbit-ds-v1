import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/base/badges/badges";

/**
 * Badges carry the metadata on every tee time — rate type, holes, spots
 * remaining, course status. Monochromatic: we use the neutral `gray` colour so
 * the whole tee sheet stays calm and minimal.
 */
const meta = {
    title: "Components/Feedback & Status/Badge",
    component: Badge,
    parameters: { layout: "centered" },
    argTypes: {
        type: { control: "inline-radio", options: ["pill-color", "color", "modern"] },
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        children: { control: "text" },
    },
    args: {
        type: "pill-color",
        size: "md",
        color: "gray",
        children: "Members only",
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The three badge shapes. Note `modern` styles itself and takes no colour. */
export const Types: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2">
            <Badge type="pill-color" size="md" color="gray">
                Twilight rate
            </Badge>
            <Badge type="color" size="md" color="gray">
                9 holes
            </Badge>
            <Badge type="modern" size="md">
                Cart included
            </Badge>
        </div>
    ),
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-2">
            <Badge {...args} size="sm">
                Small
            </Badge>
            <Badge {...args} size="md">
                Medium
            </Badge>
            <Badge {...args} size="lg">
                Large
            </Badge>
        </div>
    ),
};

/** The real set of tags shown on a Sagamore tee-time row. */
export const TeeTimeTags: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2">
            <Badge type="pill-color" size="md" color="gray">
                Members only
            </Badge>
            <Badge type="modern" size="md">
                18 holes
            </Badge>
            <Badge type="modern" size="md">
                1 spot left
            </Badge>
            <Badge type="modern" size="md">
                Cart incl.
            </Badge>
        </div>
    ),
};
