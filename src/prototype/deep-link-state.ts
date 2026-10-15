import { PICKLEBALL_CONFIG, SIMULATOR_CONFIG } from "@/components/kiosk/booking/activity-config";
import { TEE_TIMES } from "@/data/booking";
import { MENU_CATEGORIES, MENU_DESTINATIONS, MENU_ITEMS, type MenuItem } from "@/data/menu-catalog";
import { collectionItems } from "@/data/menu-collections";
import { PRO_SHOP_PRODUCTS } from "@/data/pro-shop-catalog";
import { COURSES } from "@/data/sagamore";
import type { BookingDraft, CartLine } from "./prototype-state";
import type { ScreenLink } from "./screen-links";
import type { BookingChoice } from "./screens/booking-screens";

/** Fresh links supply prerequisites; ordinary navigation keeps the live session. */
export const deepLinkState = (link: ScreenLink) => {
    const catalog: MenuItem[] = [...MENU_ITEMS, ...PRO_SHOP_PRODUCTS];
    const item =
        collectionItems(link.category ?? "", catalog).find((item) => item.id === link.item) ?? catalog.find((item) => item.id === link.item) ?? MENU_ITEMS[0];
    const categoryId = [...MENU_CATEGORIES, ...MENU_DESTINATIONS].find((category) => category.id === link.category)?.id ?? item.category;
    const config = link.activity === "pickleball" ? PICKLEBALL_CONFIG : SIMULATOR_CONFIG;
    const isTeeTime = link.activity === "tee-time";
    const teeRate = TEE_TIMES[1];
    const choice: BookingChoice = {
        activity: link.activity,
        teeRate: isTeeTime ? teeRate : null,
        durationHours: isTeeTime ? null : config.defaultDuration,
    };
    const booking: BookingDraft | null = link.screen.startsWith("booking-")
        ? {
              kind: link.activity,
              resourceLabel: isTeeTime ? COURSES[0].name : config.resources[0].name,
              date: new Date(),
              startTime: isTeeTime ? teeRate.time : "10:00 AM",
              durationLabel: isTeeTime ? undefined : `${config.defaultDuration} ${config.defaultDuration === 1 ? "hour" : "hours"}`,
              groupSize: 2,
              priceCents: (isTeeTime ? teeRate.priceCents * 2 : config.hourlyRateCents * config.defaultDuration) + 500,
          }
        : null;
    const needsCart = ["added-to-bag", "order-review", "takeout-choice", "enter-name", "checkout-method", "follow-instructions", "order-successful"].includes(
        link.screen,
    );
    const lines: CartLine[] = needsCart
        ? [
              {
                  lineId: "demo-item",
                  kind: "menu",
                  name: item.name,
                  priceCents: item.priceCents,
                  quantity: 1,
                  image: item.image,
              },
          ]
        : [];

    return { item, categoryId, choice, booking, lines };
};
