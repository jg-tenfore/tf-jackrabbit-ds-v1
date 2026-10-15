import { MENU_CATEGORIES, MENU_ITEMS, type MenuItem } from "./menu-catalog";
import { PRO_SHOP_PRODUCTS } from "./pro-shop-catalog";

export const DEMO_FAVORITE_IDS = ["bottle-of-water", "chicken-sandwich"];
export const DEMO_RECENT_IDS = ["cheeseburger", "coffee", "soft-pretzel"];

const OFFERS: Record<string, Record<string, number>> = {
    deals: { cheeseburger: 1299, "bottle-of-water": 200, "soft-pretzel": 549, "sports-drink": 350, "grilled-cheese": 849, cookie: 275 },
    members: { "chicken-sandwich": 1199, coffee: 250, "pulled-pork-sandwich": 1249, "fruit-cup": 499, "iced-tea": 300, "french-fries": 499 },
};

export const collectionItems = (section: string, items: MenuItem[] = MENU_ITEMS): MenuItem[] => {
    const offers = OFFERS[section];
    if (!offers) return items;
    return Object.entries(offers).flatMap(([id, priceCents]) => {
        const item = items.find((item) => item.id === id);
        return item
            ? [
                  {
                      ...item,
                      priceCents,
                      originalPriceCents: item.priceCents,
                      offerLabel: section === "members" ? "Member price" : `Save $${((item.priceCents - priceCents) / 100).toFixed(2)}`,
                  },
              ]
            : [];
    });
};

const itemsByIds = (items: MenuItem[], ids: string[]) =>
    ids.flatMap((id) => {
        const item = items.find((item) => item.id === id) ?? PRO_SHOP_PRODUCTS.find((item) => item.id === id);
        return item ? [item] : [];
    });

export interface MenuCollection {
    title: string;
    subtitle: string;
    groups: { id: string; title?: string; items: MenuItem[] }[];
}

export const menuCollection = (section: string, items: MenuItem[], favorites: string[], recent: string[]): MenuCollection => {
    if (section === "recent")
        return {
            title: "Recent & Favs",
            subtitle: "Your go-to picks, ready for another round.",
            groups: [
                { id: "favorites", title: "Your favorites", items: itemsByIds(items, favorites) },
                { id: "recent", title: "Recently ordered", items: itemsByIds(items, recent) },
            ],
        };
    const title =
        section === "deals"
            ? "Deals"
            : section === "members"
              ? "Members"
              : section === "home"
                ? "Home"
                : (MENU_CATEGORIES.find((c) => c.id === section)?.label ?? "Menu");
    return {
        title,
        subtitle:
            section === "deals"
                ? "A little more for your next round."
                : section === "members"
                  ? "Member picks. A few extra perks."
                  : section === "home"
                    ? "A few favorites from around the course."
                    : "Browse between categories below",
        groups: [
            {
                id: section,
                items:
                    section === "home"
                        ? itemsByIds(items, ["cheeseburger", "chicken-sandwich", "bottle-of-water", "soft-pretzel"])
                        : OFFERS[section]
                          ? collectionItems(section, items)
                          : items.filter((item) => item.category === section),
            },
        ],
    };
};
