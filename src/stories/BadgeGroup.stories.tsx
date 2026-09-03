import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "@untitledui/icons";
import { BadgeGroup } from "@/components/base/badges/badge-groups";

/**
 * Badge groups pair a small pill addon with a label — perfect for the little
 * "what's new on the tee sheet" callouts pinned above the Sagamore booking flow.
 * The addon carries the tag ("New", "Updated") and the label spells out the
 * change. Everything renders in clubhouse greyscale via the monochromatic theme.
 */
const meta = {
    title: "Components/Feedback & Status/Badge Group",
    component: BadgeGroup,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["md", "lg"] },
        color: { control: "inline-radio", options: ["gray", "brand", "success", "warning", "error"] },
        theme: { control: "inline-radio", options: ["light", "modern"] },
        align: { control: "inline-radio", options: ["leading", "trailing"] },
        addonText: { control: "text" },
        children: { control: "text" },
    },
    args: {
        addonText: "New",
        children: "Twilight rate",
        size: "md",
        color: "gray",
        theme: "light",
        align: "leading",
    },
} satisfies Meta<typeof BadgeGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default pro-shop callout — tweak the addon, label, theme, and alignment live. */
export const Playground: Story = {};

/** Every exported variant: the light theme and the modern (dotted) theme side by side. */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <BadgeGroup theme="light" color="gray" addonText="New" iconTrailing={ArrowRight}>
                Twilight rate
            </BadgeGroup>
            <BadgeGroup theme="modern" color="gray" addonText="New" iconTrailing={ArrowRight}>
                Twilight rate
            </BadgeGroup>
        </div>
    ),
};

/** Leading vs. trailing addon placement — same callout, addon swapped left to right. */
export const Alignments: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <BadgeGroup align="leading" color="gray" addonText="Updated" iconTrailing={ArrowRight}>
                18 holes
            </BadgeGroup>
            <BadgeGroup align="trailing" color="gray" addonText="Updated" iconTrailing={ArrowRight}>
                18 holes
            </BadgeGroup>
        </div>
    ),
};

/** Both sizes — md for inline tee-sheet notes, lg for top-of-page announcements. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <BadgeGroup size="md" color="gray" addonText="New" iconTrailing={ArrowRight}>
                Twilight rate
            </BadgeGroup>
            <BadgeGroup size="lg" color="gray" addonText="New" iconTrailing={ArrowRight}>
                Twilight rate
            </BadgeGroup>
        </div>
    ),
};

/** Course-status pills across every color — neutral gray leads, semantics follow. */
export const Colors: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <BadgeGroup color="gray" addonText="Status" iconTrailing={ArrowRight}>
                Walking only
            </BadgeGroup>
            <BadgeGroup color="brand" addonText="Featured" iconTrailing={ArrowRight}>
                Championship course
            </BadgeGroup>
            <BadgeGroup color="success" addonText="Open" iconTrailing={ArrowRight}>
                All 18 in play
            </BadgeGroup>
            <BadgeGroup color="warning" addonText="Cart path" iconTrailing={ArrowRight}>
                Wet conditions
            </BadgeGroup>
            <BadgeGroup color="error" addonText="Closed" iconTrailing={ArrowRight}>
                Greens aeration
            </BadgeGroup>
        </div>
    ),
};
