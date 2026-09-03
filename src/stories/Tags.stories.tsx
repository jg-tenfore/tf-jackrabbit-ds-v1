import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag, TagGroup, TagList } from "@/components/base/tags/tags";

/**
 * Tags label and filter tee-time attributes at Sagamore — rate type, holes,
 * playing partners. They support dots, counts, avatars, removal, and single or
 * multiple selection. Monochromatic and calm by default.
 */
const meta = {
    title: "Components/Forms/Tags",
    component: Tag,
    parameters: { layout: "centered" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A basic, non-selectable set of tee-time attributes. */
export const Playground: Story = {
    render: () => (
        <TagGroup label="Tee-time attributes">
            <TagList className="flex flex-wrap gap-2">
                <Tag id="members" dot>
                    Members only
                </Tag>
                <Tag id="holes" count={18}>
                    Holes
                </Tag>
                <Tag id="cart">Cart included</Tag>
            </TagList>
        </TagGroup>
    ),
};

/** Avatars on tags identify the playing group. */
export const WithAvatars: Story = {
    render: () => (
        <TagGroup label="Playing group">
            <TagList className="flex flex-wrap gap-2">
                <Tag id="olivia" avatarSrc="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80">
                    Olivia
                </Tag>
                <Tag id="phoenix" avatarSrc="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80">
                    Phoenix
                </Tag>
                <Tag id="lana" avatarSrc="https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80">
                    Lana
                </Tag>
            </TagList>
        </TagGroup>
    ),
};

/** Removable filter chips — the X calls `onClose` with the tag id. */
export const Removable: Story = {
    render: () => {
        const [tags, setTags] = useState([
            { id: "twilight", label: "Twilight" },
            { id: "walking", label: "Walking" },
            { id: "9holes", label: "9 holes" },
        ]);

        return (
            <TagGroup label="Active filters">
                <TagList className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                        <Tag key={t.id} id={t.id} onClose={(id) => setTags((prev) => prev.filter((x) => x.id !== id))}>
                            {t.label}
                        </Tag>
                    ))}
                </TagList>
            </TagGroup>
        );
    },
};

/** Multiple-selection mode renders a checkbox inside each tag. */
export const Selectable: Story = {
    render: () => (
        <TagGroup label="Filter by rate" selectionMode="multiple" defaultSelectedKeys={["twilight"]}>
            <TagList className="flex flex-wrap gap-2">
                <Tag id="standard">Standard</Tag>
                <Tag id="twilight">Twilight</Tag>
                <Tag id="member">Member</Tag>
                <Tag id="replay">Replay</Tag>
            </TagList>
        </TagGroup>
    ),
};

/** All three sizes. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
                <TagGroup key={size} label={`Size ${size}`} size={size}>
                    <TagList className="flex flex-wrap gap-2">
                        <Tag id="members" dot>
                            Members only
                        </Tag>
                        <Tag id="holes" count={18}>
                            Holes
                        </Tag>
                        <Tag id="cart">Cart included</Tag>
                    </TagList>
                </TagGroup>
            ))}
        </div>
    ),
};
