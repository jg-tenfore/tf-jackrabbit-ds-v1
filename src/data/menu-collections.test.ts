import { describe, expect, it } from "vitest";
import { MENU_ITEMS } from "./menu-catalog";
import { DEMO_FAVORITE_IDS, DEMO_RECENT_IDS, collectionItems, menuCollection } from "./menu-collections";

describe("menu collections", () => {
    it.each(["deals", "members"])("offers real, lower-priced catalog items in %s without changing the catalog", (section) => {
        const items = collectionItems(section);
        expect(items.length).toBeGreaterThanOrEqual(4);
        for (const item of items) {
            const original = MENU_ITEMS.find((original) => original.id === item.id)!;
            expect(item.priceCents).toBeLessThan(original.priceCents);
            expect(item.originalPriceCents).toBe(original.priceCents);
            expect(original.originalPriceCents).toBeUndefined();
        }
    });

    it("shows saved items and recents as independent groups, with newest saved first", () => {
        const collection = menuCollection("recent", MENU_ITEMS, ["coffee", ...DEMO_FAVORITE_IDS], DEMO_RECENT_IDS);
        expect(collection.groups[0].items.map((item) => item.id)).toEqual(["coffee", ...DEMO_FAVORITE_IDS]);
        expect(collection.groups[1].items.map((item) => item.id)).toEqual(DEMO_RECENT_IDS);
    });

    it("removes an unsaved item and allows an empty favorites list", () => {
        expect(menuCollection("recent", MENU_ITEMS, [], DEMO_RECENT_IDS).groups[0].items).toEqual([]);
        expect(menuCollection("recent", MENU_ITEMS, ["coffee"], []).groups[0].items.map((item) => item.id)).toEqual(["coffee"]);
    });
});
