import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarHeart01, Flag06, ShoppingBag03, Trophy01, Users01 } from "@untitledui/icons";
import { HeaderNavigationBase } from "@/components/application/app-navigation/header-navigation";
import { Header } from "@/components/marketing/header-navigation/header";

/**
 * Header navigation patterns for Sagamore — the member-facing top nav that
 * surfaces the tee sheet, courses, members and pro shop. The Tenfore logo is
 * wired into each header. Two variants are shown: the application header
 * (`HeaderNavigationBase`) and the marketing-style `Header`.
 */
const meta = {
    title: "Components/Navigation/Header Navigations",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const golfNavItems = [
    {
        label: "Tee sheet",
        href: "/tee-sheet",
        icon: CalendarHeart01,
        items: [
            { label: "Today", href: "/tee-sheet/today" },
            { label: "Upcoming", href: "/tee-sheet/upcoming" },
            { label: "My bookings", href: "/tee-sheet/bookings" },
        ],
    },
    { label: "Courses", href: "/courses", icon: Flag06 },
    { label: "Members", href: "/members", icon: Users01 },
    { label: "Competitions", href: "/competitions", icon: Trophy01 },
    { label: "Pro shop", href: "/pro-shop", icon: ShoppingBag03 },
];

/** Application header (`HeaderNavigationBase`) with the Tee sheet item active and its sub-nav revealed. */
export const AppHeader: Story = {
    render: () => (
        <div className="w-full">
            <HeaderNavigationBase activeUrl="/tee-sheet/today" items={golfNavItems} />
        </div>
    ),
};

/** Marketing-style `Header` voiced for the Sagamore membership site. */
export const MarketingHeader: Story = {
    render: () => (
        <div className="w-full">
            <Header
                items={[
                    { label: "Courses", href: "/courses" },
                    { label: "Membership", href: "/membership" },
                    { label: "Events", href: "/events" },
                    { label: "Pro shop", href: "/pro-shop" },
                    { label: "About", href: "/about" },
                ]}
            />
        </div>
    ),
};
