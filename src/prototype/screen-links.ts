/** Query-string routes work on localhost and the static GitHub Pages export. */
export const SCREEN_IDS = [
    "attract",
    "get-started",
    "do-you-want-to-log-in",
    "wallet-interstitial",
    "how-to-log-in",
    "enter-code",
    "enter-email",
    "home",
    "menu",
    "item-detail",
    "customize",
    "added-to-bag",
    "pro-shop",
    "booking-when",
    "booking-duration",
    "booking-resource",
    "booking-review",
    "order-review",
    "takeout-choice",
    "enter-name",
    "checkout-method",
    "follow-instructions",
    "order-successful",
] as const;

export type ScreenId = (typeof SCREEN_IDS)[number];
export type Activity = "tee-time" | "simulator" | "pickleball";

export interface ScreenLink {
    screen: ScreenId;
    item: string | null;
    category: string | null;
    activity: Activity;
    favoriteStyle?: "icon" | "labeled";
}

export const readScreenLink = (url: URL): ScreenLink => {
    const screen = SCREEN_IDS.find((id) => id === url.searchParams.get("screen")) ?? "attract";
    const activity = url.searchParams.get("activity");
    return {
        ...(url.searchParams.get("favoriteStyle") === "labeled" ? { favoriteStyle: "labeled" as const } : {}),
        screen,
        item: url.searchParams.get("item"),
        category: url.searchParams.get("category"),
        // Duration is only a step for a bay or court.
        activity: activity === "simulator" || activity === "pickleball" ? activity : screen === "booking-duration" ? "simulator" : "tee-time",
    };
};

/** Keep unrelated query parameters, the deployment subpath, and any fragment. */
export const screenLinkUrl = (current: URL, link: ScreenLink): URL => {
    const url = new URL(current);
    url.searchParams.set("screen", link.screen);
    for (const key of ["item", "category", "activity"]) url.searchParams.delete(key);
    if (["item-detail", "customize", "added-to-bag"].includes(link.screen) && link.item) url.searchParams.set("item", link.item);
    if (["menu", "item-detail", "customize", "added-to-bag"].includes(link.screen) && link.category) url.searchParams.set("category", link.category);
    if (link.screen.startsWith("booking-")) url.searchParams.set("activity", link.activity);
    if (link.favoriteStyle === "labeled") url.searchParams.set("favoriteStyle", "labeled");
    else if (link.favoriteStyle === "icon") url.searchParams.delete("favoriteStyle");
    return url;
};

/** Direct entries still have a useful in-prototype Back destination. */
export const screenStack = (screen: ScreenId): ScreenId[] => {
    if (screen === "attract") return ["attract"];
    const parents: Partial<Record<ScreenId, ScreenId>> = {
        "item-detail": "menu",
        customize: "item-detail",
        "added-to-bag": "menu",
        "enter-email": "do-you-want-to-log-in",
        "enter-code": "enter-email",
        "booking-duration": "booking-when",
        "booking-resource": "booking-when",
        "booking-review": "booking-resource",
        "takeout-choice": "order-review",
        "enter-name": "takeout-choice",
        "checkout-method": "enter-name",
        "follow-instructions": "checkout-method",
    };
    return [...screenStack(parents[screen] ?? "attract"), screen];
};
