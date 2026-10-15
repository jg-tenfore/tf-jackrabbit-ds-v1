import { describe, expect, it } from "vitest";
import { deepLinkState } from "./deep-link-state";
import { readScreenLink, screenLinkUrl, screenStack } from "./screen-links";

const base = "https://jg-tenfore.github.io/tf-jackrabbit-ds-v1/prototype/";

describe("prototype feedback links", () => {
    it("round-trips an item link without losing the Pages subpath or unrelated parameters", () => {
        const link = { screen: "item-detail", item: "chicken-sandwich", category: null, activity: "tee-time" } as const;
        const url = screenLinkUrl(new URL(`${base}?review=design#notes`), link);
        expect(url.pathname).toBe("/tf-jackrabbit-ds-v1/prototype/");
        expect(url.searchParams.get("review")).toBe("design");
        expect(url.hash).toBe("#notes");
        expect(readScreenLink(url)).toEqual(link);
    });

    it("removes stale item and activity parameters when leaving those screens", () => {
        const url = screenLinkUrl(new URL(`${base}?screen=booking-review&activity=pickleball&item=hot-dog`), {
            screen: "enter-email",
            item: "hot-dog",
            category: "sandwiches",
            activity: "pickleball",
        });
        expect(url.search).toBe("?screen=enter-email");
    });

    it("normalizes unknown screens and invalid activity, item, and category values", () => {
        expect(readScreenLink(new URL(`${base}?screen=unknown`)).screen).toBe("attract");
        const link = readScreenLink(new URL(`${base}?screen=booking-duration&activity=unknown&item=unknown&category=unknown`));
        const seed = deepLinkState(link);
        expect(link.activity).toBe("simulator");
        expect(seed.item.id).toBe("cheeseburger");
        expect(seed.categoryId).toBe("sandwiches");
        expect(seed.booking?.kind).toBe("simulator");
    });

    it.each(["tee-time", "simulator", "pickleball"])("opens a usable %s review without walking through earlier steps", (activity) => {
        const seed = deepLinkState(readScreenLink(new URL(`${base}?screen=booking-review&activity=${activity}`)));
        expect(seed.booking?.kind).toBe(activity);
        expect(seed.booking?.resourceLabel).toBeTruthy();
        expect(seed.booking?.startTime).toBeTruthy();
        expect(seed.booking?.priceCents).toBeGreaterThan(500);
        expect(seed.choice.activity).toBe(activity);
        expect(seed.lines).toEqual([]);
    });

    it("seeds the checkout cart but leaves ordinary entry and browsing screens empty", () => {
        const seed = (screen: string) => deepLinkState(readScreenLink(new URL(`${base}?screen=${screen}`)));
        expect(seed("checkout-method").lines).toHaveLength(1);
        expect(seed("enter-name").lines[0].priceCents).toBeGreaterThan(0);
        expect(seed("menu").lines).toEqual([]);
        expect(seed("attract").lines).toEqual([]);
    });

    it("gives direct item and code entries a usable Back path", () => {
        expect(screenStack("customize")).toEqual(["attract", "menu", "item-detail", "customize"]);
        expect(screenStack("enter-code").slice(-2)).toEqual(["enter-email", "enter-code"]);
    });

    it("shares the favorite-button version and the collection behind an item", () => {
        const link = readScreenLink(new URL(`${base}?screen=item-detail&item=chicken-sandwich&category=members&favoriteStyle=labeled`));
        const roundTrip = readScreenLink(screenLinkUrl(new URL(base), link));
        expect(roundTrip).toEqual(link);
        const seed = deepLinkState(roundTrip);
        expect(seed.categoryId).toBe("members");
        expect(seed.item.priceCents).toBe(1199);
        expect(seed.item.originalPriceCents).toBe(1399);
    });
});
