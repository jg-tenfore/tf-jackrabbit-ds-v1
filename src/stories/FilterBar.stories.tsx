import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FilterFunnel01, Flag05, MarkerPin01, SearchLg } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Tag, TagGroup, TagList } from "@/components/base/tags/tags";
import { FilterBar } from "@/components/application/filter-bar/filter-bar";

/**
 * The Filter Bar is the toolbar that sits above a tee sheet, member roster, or
 * results table. It composes the existing base components — a search Input, a
 * couple of filter Selects or a segmented ButtonGroup, a "Filters" button, and
 * an optional row of applied-filter Tags with a "Clear all" action. Everything
 * stays greyscale to match the monochromatic Sagamore clubhouse theme.
 */
const meta = {
    title: "Components/Layout & Structure/Filter Bars",
    component: FilterBar,
    parameters: { layout: "padded" },
    argTypes: {
        compact: { control: "boolean" },
        search: { control: false },
        filters: { control: false },
        actions: { control: false },
        appliedTags: { control: false },
    },
    args: {
        compact: false,
    },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const courses = [
    { id: "north", label: "North Course" },
    { id: "south", label: "South Course" },
    { id: "links", label: "The Links" },
    { id: "par3", label: "Par-3 Short Course" },
];

/** Bare playground — wire up the slots you need and tweak `compact` in controls. */
export const Playground: Story = {
    args: {
        search: <Input icon={SearchLg} placeholder="Search the sheet…" aria-label="Search" />,
        filters: (
            <Select aria-label="Course" placeholder="All courses" items={courses}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        ),
        actions: (
            <Button color="secondary" iconLeading={FilterFunnel01}>
                Filters
            </Button>
        ),
    },
};

/**
 * The everyday tee-sheet toolbar: search by member, pick a course, choose how
 * many holes the group is playing, then open advanced Filters.
 */
export const TeeSheetFilters: Story = {
    render: (args) => {
        const [holes, setHoles] = useState<Set<string>>(new Set(["18"]));

        return (
            <FilterBar
                {...args}
                search={<Input icon={SearchLg} placeholder="Search members…" aria-label="Search members" />}
                filters={
                    <>
                        <Select aria-label="Course" placeholder="All courses" icon={MarkerPin01} items={courses}>
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>

                        <ButtonGroup selectedKeys={holes} onSelectionChange={(keys) => setHoles(keys as Set<string>)}>
                            <ButtonGroupItem id="9">9 holes</ButtonGroupItem>
                            <ButtonGroupItem id="18">18 holes</ButtonGroupItem>
                        </ButtonGroup>
                    </>
                }
                actions={
                    <Button color="secondary" iconLeading={FilterFunnel01}>
                        Filters
                    </Button>
                }
            />
        );
    },
};

/**
 * After a few filters are applied, surface them as removable Tag chips with a
 * "Clear all" link — so the starter can see exactly which groups are showing.
 */
export const WithAppliedTags: Story = {
    render: (args) => {
        const [tags, setTags] = useState([
            { id: "north", label: "North Course" },
            { id: "morning", label: "Before 10:00 AM" },
            { id: "members", label: "Members only" },
            { id: "18", label: "18 holes" },
        ]);

        const removeTag = (id: string) => setTags((prev) => prev.filter((t) => t.id !== id));

        return (
            <FilterBar
                {...args}
                search={<Input icon={SearchLg} placeholder="Search members…" aria-label="Search members" />}
                filters={
                    <Select aria-label="Course" placeholder="All courses" icon={Flag05} items={courses}>
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                }
                actions={
                    <Button color="secondary" iconLeading={FilterFunnel01}>
                        Filters
                    </Button>
                }
                appliedTags={
                    tags.length > 0 && (
                        <>
                            <TagGroup label="Applied filters" onRemove={(keys) => [...keys].forEach((k) => removeTag(String(k)))}>
                                <TagList items={tags} className="flex flex-wrap items-center gap-2">
                                    {(item) => (
                                        <Tag id={item.id} onClose={removeTag}>
                                            {item.label}
                                        </Tag>
                                    )}
                                </TagList>
                            </TagGroup>

                            <Button color="link-gray" size="sm" onClick={() => setTags([])}>
                                Clear all
                            </Button>
                        </>
                    )
                }
            />
        );
    },
};

/**
 * Compact density for embedding inside a table header — tighter gaps and a
 * narrower search field, fewer controls to keep the row slim.
 */
export const Compact: Story = {
    args: {
        compact: true,
        search: <Input size="sm" icon={SearchLg} placeholder="Search…" aria-label="Search" />,
        filters: (
            <Select size="sm" aria-label="Course" placeholder="All courses" items={courses}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        ),
        actions: (
            <Button size="sm" color="secondary" iconLeading={FilterFunnel01}>
                Filters
            </Button>
        ),
    },
};
