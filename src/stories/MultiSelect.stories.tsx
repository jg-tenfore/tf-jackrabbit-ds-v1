import { useState } from "react";
import { Coins03, Flag01, MarkerPin01, Trophy01, Umbrella03 } from "@untitledui/icons";
import type { Selection } from "react-aria-components";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MultiSelect } from "@/components/base/select/multi-select";
import type { SelectItemType } from "@/components/base/select/select";
import { GOLFERS } from "@/data/sagamore";

/**
 * MultiSelect lets a member tick off more than one thing in a single field — the
 * playing partners in a foursome, the course features they care about, the
 * clubhouse amenities to lay on after the round. Built on react-aria: pass an
 * `items` array of `SelectItemType` plus a render function child returning a
 * `<MultiSelect.Item>` for each one. Selection is a `Selection` set driven by
 * `selectedKeys` / `defaultSelectedKeys`; the trigger collapses the picks into a
 * tidy "{n} selected" count. A search box and a Reset / Select all footer come
 * along for free. Monochromatic theme keeps the trigger to a hairline ring with
 * an ink focus state.
 */
const meta = {
    title: "Components/Forms/Multi-Select",
    component: MultiSelect,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        isDisabled: { control: "boolean" },
        isRequired: { control: "boolean" },
        showSearch: { control: "boolean" },
        showFooter: { control: "boolean" },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
    },
    args: {
        label: "Playing partners",
        placeholder: "Add to your group",
        hint: "Groups of up to four off the first tee.",
        size: "md",
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Portrait avatars borrowed from the Tenfore Golf roster for the avatar variant.
const PARTNER_AVATARS = [
    "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
    "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
    "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
];

// The member roster as plain options — name plus their handicap as support text.
const partnerItems: SelectItemType[] = GOLFERS.map((golfer) => ({
    id: golfer.id,
    label: golfer.name,
    supportingText: `HCP ${golfer.handicap}`,
}));

// The same roster with portrait avatars for the avatar variant.
const partnerAvatarItems: SelectItemType[] = GOLFERS.map((golfer, index) => ({
    id: golfer.id,
    label: golfer.name,
    supportingText: `${golfer.membership === "member" ? "Member" : "Guest"} · HCP ${golfer.handicap}`,
    avatarUrl: PARTNER_AVATARS[index],
}));

// Course features a member might filter on, each with a leading icon.
const featureItems: SelectItemType[] = [
    { id: "links", label: "Links layout", supportingText: "Open, windswept holes", icon: Flag01 },
    { id: "water", label: "Water hazards", supportingText: "Ponds and creeks in play", icon: Umbrella03 },
    { id: "elevation", label: "Elevation changes", supportingText: "Hilly, walkable terrain", icon: MarkerPin01 },
    { id: "signature", label: "Signature hole", supportingText: "The Redan 7th", icon: Trophy01 },
];

// Clubhouse amenities for the post-round add-ons.
const amenityItems: SelectItemType[] = [
    { id: "cart", label: "Riding cart" },
    { id: "caddie", label: "Caddie" },
    { id: "rangefinder", label: "Rangefinder" },
    { id: "lockers", label: "Locker room" },
    { id: "lunch", label: "Lunch at the turn" },
];

/** Build a foursome — tick the members joining your round. */
export const Playground: Story = {
    args: {
        items: partnerItems,
        children: (item: SelectItemType) => <MultiSelect.Item id={item.id} label={item.label} supportingText={item.supportingText} />,
    },
    render: (args) => {
        const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["g-1"]));
        return (
            <MultiSelect
                {...args}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onReset={() => setSelectedKeys(new Set())}
                onSelectAll={() => setSelectedKeys("all")}
            />
        );
    },
};

/** Amenities preselected via `defaultSelectedKeys` — cart and lunch already ticked. */
export const Preselected: Story = {
    args: {
        label: "Add-ons",
        placeholder: "Choose amenities",
        hint: "Anything you'd like waiting in the clubhouse.",
        defaultSelectedKeys: new Set(["cart", "lunch"]),
        items: amenityItems,
        children: (item: SelectItemType) => <MultiSelect.Item id={item.id} label={item.label} />,
    },
};

/** Each option carries a leading icon — handy for filtering on course features. */
export const WithIcons: Story = {
    args: {
        label: "Course features",
        placeholder: "Filter by feature",
        hint: "Match a layout to your game.",
        defaultSelectedKeys: new Set(["signature"]),
        items: featureItems,
        children: (item: SelectItemType) => (
            <MultiSelect.Item id={item.id} label={item.label} supportingText={item.supportingText} icon={item.icon} />
        ),
    },
};

/** Partners shown with avatar photos and their membership / handicap. */
export const WithAvatars: Story = {
    args: {
        label: "Playing partners",
        placeholder: "Add to your group",
        hint: "Caddies match you up on the first tee.",
        defaultSelectedKeys: new Set(["g-1", "g-2"]),
        items: partnerAvatarItems,
        children: (item: SelectItemType) => (
            <MultiSelect.Item id={item.id} label={item.label} supportingText={item.supportingText} avatarUrl={item.avatarUrl} />
        ),
    },
};

/** The three trigger sizes — sm, md, and lg — stacked for comparison. */
export const Sizes: Story = {
    args: {
        items: amenityItems,
        children: (item: SelectItemType) => <MultiSelect.Item id={item.id} label={item.label} />,
    },
    render: () => (
        <div className="flex flex-col gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
                <MultiSelect
                    key={size}
                    size={size}
                    label={`Add-ons (${size})`}
                    placeholder="Choose amenities"
                    defaultSelectedKeys={new Set(["cart"])}
                    items={amenityItems}
                >
                    {(item: SelectItemType) => <MultiSelect.Item id={item.id} label={item.label} />}
                </MultiSelect>
            ))}
        </div>
    ),
};

/** A short list with no search box or footer — set `showSearch` and `showFooter` false. */
export const Minimal: Story = {
    args: {
        label: "Add-ons",
        placeholder: "Choose amenities",
        hint: "Just the essentials.",
        showSearch: false,
        showFooter: false,
        items: amenityItems,
        children: (item: SelectItemType) => <MultiSelect.Item id={item.id} label={item.label} />,
    },
};

/** A custom trigger count via `selectedCountFormatter`, with green-fee supporting text. */
export const CustomCount: Story = {
    args: {
        label: "Playing partners",
        placeholder: "Add to your group",
        hint: "Up to four in a group.",
        defaultSelectedKeys: new Set(["g-1", "g-3"]),
        items: partnerItems,
        selectedCountFormatter: (count: number) => `${count} in the group`,
        supportingText: (
            <span className="inline-flex items-center gap-1">
                <Coins03 data-icon className="size-4" aria-hidden="true" />
                green fees apply
            </span>
        ),
        children: (item: SelectItemType) => <MultiSelect.Item id={item.id} label={item.label} supportingText={item.supportingText} />,
    },
};

/** Disabled trigger — used when the group is locked in at check-in. */
export const Disabled: Story = {
    args: {
        isDisabled: true,
        defaultSelectedKeys: new Set(["g-1", "g-2"]),
        items: partnerItems,
        children: (item: SelectItemType) => <MultiSelect.Item id={item.id} label={item.label} supportingText={item.supportingText} />,
    },
};
