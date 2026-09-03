import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar, Flag01, LogOut01, Settings01, Share04, Trash01, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { DropdownAccountBreadcrumb } from "@/components/base/dropdown/dropdown-account-breadcrumb";
import { DropdownAccountButton } from "@/components/base/dropdown/dropdown-account-button";
import { DropdownAccountCardMD } from "@/components/base/dropdown/dropdown-account-card-md";
import { DropdownAccountCardSM } from "@/components/base/dropdown/dropdown-account-card-sm";
import { DropdownAccountCardXS } from "@/components/base/dropdown/dropdown-account-card-xs";
import { DropdownAvatar } from "@/components/base/dropdown/dropdown-avatar";
import { DropdownButtonAdvanced } from "@/components/base/dropdown/dropdown-button-advanced";
import { DropdownButtonLink } from "@/components/base/dropdown/dropdown-button-link";
import { DropdownButtonSimple } from "@/components/base/dropdown/dropdown-button-simple";
import { DropdownIconAdvanced } from "@/components/base/dropdown/dropdown-icon-advanced";
import { DropdownIconSimple } from "@/components/base/dropdown/dropdown-icon-simple";
import { DropdownIntegration } from "@/components/base/dropdown/dropdown-integration";
import { DropdownSearchAdvanced } from "@/components/base/dropdown/dropdown-search-advanced";
import { DropdownSearchSimple } from "@/components/base/dropdown/dropdown-search-simple";

/**
 * Dropdown menus hang off the tee-sheet row actions and the account avatar at
 * Sagamore — share a booking, edit a tee time, sign out. Built on React Aria's
 * `MenuTrigger`; compose with `Dropdown.Root / Popover / Menu / Item`.
 */
const meta = {
    title: "Components/Actions/Dropdown",
    component: Dropdown.Item,
    parameters: { layout: "centered" },
} satisfies Meta<typeof Dropdown.Item>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The dots-button menu used on each tee-time row. */
export const Playground: Story = {
    render: () => (
        <Dropdown.Root>
            <Dropdown.DotsButton />
            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item icon={Calendar} label="View tee time" />
                    <Dropdown.Item icon={Share04} label="Share booking" addon="⌘S" />
                    <Dropdown.Item icon={Settings01} label="Edit details" />
                    <Dropdown.Separator />
                    <Dropdown.Item icon={Trash01} label="Cancel booking" />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};

/** A button-triggered account menu with an avatar item. */
export const AccountMenu: Story = {
    render: () => (
        <Dropdown.Root>
            <Button color="secondary" iconTrailing={User01}>
                Olivia Rhye
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item avatarUrl="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" label="My profile" />
                    <Dropdown.Item icon={Flag01} label="My rounds" />
                    <Dropdown.Item icon={Settings01} label="Account settings" />
                    <Dropdown.Separator />
                    <Dropdown.Item icon={LogOut01} label="Sign out" />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};

/** Single-selection menu with checkmark indicators — pick a default course. */
export const SingleSelection: Story = {
    render: () => (
        <Dropdown.Root>
            <Button color="secondary">Default course</Button>
            <Dropdown.Popover>
                <Dropdown.Menu selectionMode="single" defaultSelectedKeys={["championship"]}>
                    <Dropdown.Item id="championship" label="Championship" />
                    <Dropdown.Item id="lakes" label="The Lakes" />
                    <Dropdown.Item id="executive" label="Executive 9" />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};

/** Multi-selection with checkbox indicators — filter the tee sheet. */
export const MultiSelection: Story = {
    render: () => (
        <Dropdown.Root>
            <Button color="secondary">Filters</Button>
            <Dropdown.Popover>
                <Dropdown.Menu selectionMode="multiple" defaultSelectedKeys={["twilight"]}>
                    <Dropdown.Item id="twilight" selectionIndicator="checkbox" label="Twilight rates" />
                    <Dropdown.Item id="members" selectionIndicator="checkbox" label="Members only" />
                    <Dropdown.Item id="walking" selectionIndicator="checkbox" label="Walking allowed" />
                    <Dropdown.Item id="cart" selectionIndicator="checkbox" label="Cart included" />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};

/** Secondary button trigger with sectioned items and a nested submenu. */
export const ButtonSimple: Story = {
    render: () => <DropdownButtonSimple />,
};

/** Button trigger with status dots, multi-select view options, and deep submenus. */
export const ButtonAdvanced: Story = {
    render: () => <DropdownButtonAdvanced />,
};

/** Inline link-style trigger for picking a member's booking permission. */
export const ButtonLink: Story = {
    render: () => <DropdownButtonLink />,
};

/** Dots icon trigger with sectioned items and a nested submenu — tee-sheet row. */
export const IconSimple: Story = {
    render: () => <DropdownIconSimple />,
};

/** Dots icon trigger with status dots, view toggles, and nested submenus. */
export const IconAdvanced: Story = {
    render: () => <DropdownIconAdvanced />,
};

/** Searchable multi-select menu — invite playing partners to a round. */
export const SearchSimple: Story = {
    render: () => <DropdownSearchSimple />,
};

/** Searchable menu with grouped submenus and a create action in the footer. */
export const SearchAdvanced: Story = {
    render: () => <DropdownSearchAdvanced />,
};

/** Avatar trigger opening the member account menu with profile header. */
export const Avatar: Story = {
    render: () => <DropdownAvatar />,
};

/** Account button menu with theme toggle and account switching. */
export const AccountButton: Story = {
    render: () => <DropdownAccountButton />,
};

/** Breadcrumb-style account switcher with avatar and radio selection. */
export const AccountBreadcrumb: Story = {
    render: () => <DropdownAccountBreadcrumb />,
};

/** Extra-small account card trigger with switch-account and sign-out submenu. */
export const AccountCardXS: Story = {
    render: () => <DropdownAccountCardXS />,
};

/** Small account card trigger with PRO header and account switching. */
export const AccountCardSM: Story = {
    render: () => <DropdownAccountCardSM />,
};

/** Medium account card trigger with avatar label group and company switcher. */
export const AccountCardMD: Story = {
    render: () => <DropdownAccountCardMD />,
};

/** Copy/integration menu — open the round summary in an external tool. */
export const Integration: Story = {
    render: () => <DropdownIntegration />,
};
