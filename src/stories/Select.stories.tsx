import { useListData } from "react-stately";
import { Flag01, MarkerPin01, User01 } from "@untitledui/icons";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "@/components/base/select/select";
import type { SelectItemType } from "@/components/base/select/select";
import { NativeSelect } from "@/components/base/select/select-native";
import { TagSelect } from "@/components/base/select/tag-select";
import { COURSES, GOLFERS, RATE_LABELS, STATUS_LABELS, TEE_TIMES } from "@/data/sagamore";

/**
 * Select drives the structured choices in the Sagamore booking flow — which
 * course to play, which tee time to take, who is in the group. Built on
 * react-aria: pass an `items` array of `SelectItemType` plus a render function
 * child that returns a `<Select.Item>` for each item. The compound API exposes
 * `Select.Item` for options and `Select.ComboBox` for the searchable variant.
 * Monochromatic theme keeps the trigger to a hairline ring with an ink focus
 * state.
 */
const meta = {
    title: "Components/Forms/Select",
    component: Select,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        isDisabled: { control: "boolean" },
        isRequired: { control: "boolean" },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
    },
    args: {
        label: "Course",
        placeholder: "Choose a course",
        hint: "18-hole championship or a quick 9-hole loop.",
        size: "md",
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// A small roster of caddies with portrait avatars for the avatar variant.
const CADDIE_AVATARS = [
    "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
    "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
    "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
];

const courseItems: SelectItemType[] = COURSES.map((course) => ({
    id: course.id,
    label: course.name,
    supportingText: `${course.holes} holes · Par ${course.par}`,
}));

const teeTimeItems: SelectItemType[] = TEE_TIMES.filter((tee) => tee.courseId === "championship").map((tee) => ({
    id: tee.id,
    label: tee.label,
    supportingText: RATE_LABELS[tee.rate],
    isDisabled: tee.status === "full" || tee.status === "maintenance",
}));

const caddieItems: SelectItemType[] = GOLFERS.map((golfer, index) => ({
    id: golfer.id,
    label: golfer.name,
    supportingText: `${golfer.membership === "member" ? "Member" : "Guest"} · HCP ${golfer.handicap}`,
    avatarUrl: CADDIE_AVATARS[index],
}));

/** Pick a course — The Championship (18) or The Executive (9). */
export const Playground: Story = {
    args: {
        items: courseItems,
        children: (item: SelectItemType) => <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} />,
    },
};

/** Choosing a slot off the tee sheet, with the rate shown as supporting text. */
export const TeeTime: Story = {
    args: {
        label: "Tee time",
        placeholder: "Select a tee time",
        hint: "Times shown are course-local.",
        items: teeTimeItems,
        children: (item: SelectItemType) => (
            <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} isDisabled={item.isDisabled} />
        ),
    },
};

/** Group size, with a default already selected. */
export const Players: Story = {
    args: {
        label: "Players",
        placeholder: "How many in your group?",
        hint: "Groups of up to four.",
        defaultSelectedKey: "2",
        items: [
            { id: "1", label: "1 player" },
            { id: "2", label: "2 players" },
            { id: "3", label: "3 players" },
            { id: "4", label: "4 players" },
        ],
        children: (item: SelectItemType) => <Select.Item id={item.id} label={item.label} />,
    },
};

/** Each option carries a leading icon — handy for booking-type menus. */
export const WithIcons: Story = {
    args: {
        label: "Booking type",
        placeholder: "What are you booking?",
        hint: "Pick the kind of round you have in mind.",
        items: [
            { id: "round", label: "Round of golf", supportingText: "Reserve a tee time", icon: Flag01 },
            { id: "range", label: "Driving range", supportingText: "Bay or grass tees", icon: MarkerPin01 },
            { id: "lesson", label: "Lesson with a pro", supportingText: "30 or 60 minutes", icon: User01 },
        ],
        children: (item: SelectItemType) => (
            <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} icon={item.icon} />
        ),
    },
};

/** Caddies shown with avatar photos and their membership / handicap. */
export const WithAvatars: Story = {
    args: {
        label: "Request a caddie",
        placeholder: "Choose a caddie",
        hint: "Caddies are matched to your group on the first tee.",
        icon: User01,
        items: caddieItems,
        children: (item: SelectItemType) => (
            <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} avatarUrl={item.avatarUrl} />
        ),
    },
};

// Render-only stories still need to satisfy Select's required `children` prop,
// even though `render` controls what is actually displayed.
const renderPlaceholder = { children: () => null } satisfies Partial<Story["args"]>;

/** The three trigger sizes — sm, md, and lg — stacked for comparison. */
export const Sizes: Story = {
    args: renderPlaceholder,
    render: () => (
        <div className="flex flex-col gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
                <Select
                    key={size}
                    size={size}
                    label={`Course (${size})`}
                    placeholder="Choose a course"
                    items={courseItems}
                    defaultSelectedKey="championship"
                >
                    {(item: SelectItemType) => <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} />}
                </Select>
            ))}
        </div>
    ),
};

/** Disabled trigger — used when a course is closed for the season. */
export const Disabled: Story = {
    args: {
        isDisabled: true,
        defaultSelectedKey: "executive",
        items: courseItems,
        children: (item: SelectItemType) => <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} />,
    },
};

/**
 * `Select.ComboBox` is the searchable variant — type to filter the tee sheet.
 * It shares the same `Select.Item` render pattern and shows a ⌘K shortcut hint.
 */
export const SearchableComboBox: Story = {
    args: renderPlaceholder,
    render: () => (
        <Select.ComboBox
            label="Find a tee time"
            placeholder="Search the tee sheet"
            hint="Filter by time or rate."
            items={teeTimeItems}
        >
            {(item: SelectItemType) => (
                <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} isDisabled={item.isDisabled} />
            )}
        </Select.ComboBox>
    ),
};

/** ComboBox over the caddie roster, searching across names and handicaps. */
export const ComboBoxWithAvatars: Story = {
    args: renderPlaceholder,
    render: () => (
        <Select.ComboBox label="Find a caddie" placeholder="Search caddies" shortcut={false} icon={User01} items={caddieItems}>
            {(item: SelectItemType) => (
                <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} avatarUrl={item.avatarUrl} />
            )}
        </Select.ComboBox>
    ),
};

/**
 * The native `<select>` element — lightweight, OS-rendered dropdown for simple
 * choices like booking status. Takes a flat `options` array rather than the
 * react-aria item/render pattern.
 */
export const Native: Story = {
    args: renderPlaceholder,
    render: () => (
        <NativeSelect
            label="Tee-sheet filter"
            hint="Filter the sheet by slot status."
            defaultValue="available"
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
        />
    ),
};

/**
 * `TagSelect` is the multi-tag variant: chosen items become removable chips in
 * the field while the rest stay searchable. Here it builds a playing group from
 * the member roster. Selection state lives in `useListData`.
 */
export const Tags: Story = {
    args: renderPlaceholder,
    render: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const selectedItems = useListData<SelectItemType>({
            initialItems: [{ id: GOLFERS[0].id, label: GOLFERS[0].name, avatarUrl: CADDIE_AVATARS[0] }],
        });

        return (
            <TagSelect
                label="Playing group"
                placeholder="Add members"
                items={GOLFERS.map((golfer, index) => ({
                    id: golfer.id,
                    label: golfer.name,
                    supportingText: `HCP ${golfer.handicap}`,
                    avatarUrl: CADDIE_AVATARS[index],
                }))}
                selectedItems={selectedItems}
            >
                {(item: SelectItemType) => (
                    <Select.Item id={item.id} label={item.label} supportingText={item.supportingText} avatarUrl={item.avatarUrl} />
                )}
            </TagSelect>
        );
    },
};
