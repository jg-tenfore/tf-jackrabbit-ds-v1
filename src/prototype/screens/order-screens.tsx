"use client";

import { type ReactNode, useEffect, useState, useSyncExternalStore } from "react";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { OrderSummaryNav } from "@/components/kiosk/app-chrome/order-summary-nav";
import { SignedOutCard } from "@/components/kiosk/app-chrome/wallet-drawer";
import { ProductDetailDialog } from "@/components/kiosk/modals/dialog-variants";
import { CheckoutMethodFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { AddedToBagScreen } from "@/components/kiosk/order/added-to-bag-screen";
import { CustomizeItemScreen } from "@/components/kiosk/order/customize-item-screen";
import { FollowInstructionsScreen } from "@/components/kiosk/order/follow-instructions-screen";
import { MenuScreen } from "@/components/kiosk/order/menu-screen";
import { type OrderLine, OrderReviewScreen } from "@/components/kiosk/order/order-review-screen";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { TakeoutChoiceScreen } from "@/components/kiosk/order/takeout-choice-screen";
import { ProductGrid } from "@/components/kiosk/store/product-grid";
import { ProductImage } from "@/components/kiosk/store/product-image";
import { MENU_ITEMS, type MenuItem } from "@/data/menu-catalog";
import { SANDWICH_MODIFIERS, summariseModifiers } from "@/data/modifiers";
import { PRO_SHOP_CATEGORIES, PRO_SHOP_PRODUCTS } from "@/data/pro-shop-catalog";
import type { ProShopProduct } from "@/data/pro-shop-types";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { type ScreenId, useNavigation } from "@/prototype/navigation";
import { type CartLine, usePrototype } from "@/prototype/prototype-state";
import { registerSessionReset, useEndSession } from "@/prototype/session-lifecycle";

/**
 * The food and pro-shop half of the clickable prototype.
 *
 * One export per screen, each taking no props: every route reads the cart from
 * `usePrototype()` and where it is from `useNavigation()`. That is what keeps
 * the app shell a lookup table — it maps a `ScreenId` to a component and does
 * nothing else — and it is why a screen can be dropped into the flow at any
 * point without a parent having to hand it the right props.
 *
 * These compose the Storybook components unchanged. Nothing here re-implements
 * a layout: if a screen looks wrong in the prototype it looks wrong in the
 * design system too, which is the whole point of building the prototype out of
 * the same modules rather than a parallel set of "prototype" ones.
 */

/* -------------------------------------------------------------------------- */
/* Flow state                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Which item the detail and customize screens are about, and where the "added
 * to bag" beat should hand back to.
 *
 * Deliberately **not** in `prototype-state.tsx`. That module owns what a
 * session *accumulates* — the cart, the identity, the booking. This is transient
 * pointer state that is meaningless the moment the flow leaves: it is a fact
 * about which card was tapped, not about what the user is buying.
 *
 * A module-scoped store rather than a React context so no provider has to be
 * mounted for these routes to work. The shell is being assembled from several
 * directions and a route that throws because a provider is missing is a bad
 * trade for state that is three fields wide. `useSyncExternalStore` gives the
 * same re-render guarantees a context would, and the same snapshot on the
 * server, which a static export needs.
 */
interface OrderFlowState {
    /** The item the detail dialog and the customize screen are about. */
    item: MenuItem | null;
    /** Menu category being browsed, so the detail screen re-renders it behind. */
    categoryId: string;
    /** Where "Item added to bag!" hands back to — the grid it was added from. */
    returnTo: ScreenId;
}

const INITIAL_FLOW: OrderFlowState = { item: null, categoryId: "sandwiches", returnTo: "menu" };

let flow: OrderFlowState = INITIAL_FLOW;
const flowListeners = new Set<() => void>();

const setFlow = (patch: Partial<OrderFlowState>) => {
    flow = { ...flow, ...patch };
    flowListeners.forEach((listener) => listener());
};

// Transient, but not immortal: without this the next customer opens the menu
// in the category the last one was browsing. See session-lifecycle.
registerSessionReset(() => setFlow(INITIAL_FLOW));

const subscribeFlow = (listener: () => void) => {
    flowListeners.add(listener);
    return () => {
        flowListeners.delete(listener);
    };
};

const snapshotFlow = () => flow;

const useOrderFlow = () => useSyncExternalStore(subscribeFlow, snapshotFlow, snapshotFlow);

/* -------------------------------------------------------------------------- */
/* Shared wiring                                                               */
/* -------------------------------------------------------------------------- */

/** Cents to the dollars `GlobalNav` draws beside the bag. */
const toDollars = (cents: number) => cents / 100;

/**
 * Start Over, everywhere it appears.
 *
 * Empties the cart *and* unwinds the navigation stack. Doing only one of the
 * two is the classic prototype bug: a session that looks reset but still totals
 * $34.45 on the next screen, or an empty cart still sitting on a checkout.
 */

/**
 * Only sandwiches have an ingredient list to argue about.
 *
 * `Customize Ingredients` is absent rather than disabled for everything else —
 * a greyed control invites a tap and then explains nothing, and a bottle of
 * water has no modifiers, so the row simply is not there.
 */
const canCustomize = (item: MenuItem) => item.category === "sandwiches";

/** The rail as it appears on every browse screen: bag, running total, Start Over. */
const BrowseNav = () => {
    const { itemCount, totalCents } = usePrototype();
    const { go } = useNavigation();
    const startOver = useEndSession();

    return (
        <GlobalNav
            // Always on: once the user is browsing, an order exists even at
            // zero, and the reference draws the bag with a 0 badge for exactly
            // that state.
            hasOrder
            cartCount={itemCount}
            cartTotal={toDollars(totalCents)}
            onViewOrder={() => go("order-review")}
            onStartOver={startOver}
            onHowToLogIn={() => go("how-to-log-in")}
        />
    );
};

/* -------------------------------------------------------------------------- */
/* Menu                                                                        */
/* -------------------------------------------------------------------------- */

/** Browse a category. Tapping a tile opens the item detail over this screen. */
export const MenuRoute = () => {
    const { go } = useNavigation();
    const { categoryId } = useOrderFlow();

    return (
        <KioskScreen scroll={false} footer={<BrowseNav />}>
            <MenuScreen
                initialCategoryId={categoryId}
                onCategoryChange={(id) => setFlow({ categoryId: id })}
                onSelectItem={(item) => {
                    setFlow({ item, categoryId: item.category, returnTo: "menu" });
                    go("item-detail");
                }}
            />
        </KioskScreen>
    );
};

/**
 * The product dialog, over the menu it came from.
 *
 * The menu behind is re-rendered rather than kept alive, so it is fed the
 * selected item's category — the grid a user tapped from is by definition the
 * category that item is in, which makes the continuity exact without the shell
 * having to keep unmounted screens around.
 *
 * With no item selected there is nothing to show, so it degrades to the menu
 * rather than rendering an empty dialog.
 */
export const ItemDetailRoute = () => {
    const { item } = useOrderFlow();
    const { go, goBack } = useNavigation();
    const { addMenuItem } = usePrototype();

    if (!item) return <MenuRoute />;

    return (
        <KioskScreen scroll={false} footer={<BrowseNav />}>
            <MenuScreen initialCategoryId={item.category} onCategoryChange={(id) => setFlow({ categoryId: id })} />

            <ProductDetailDialog
                isOpen
                onOpenChange={(open) => !open && goBack()}
                name={item.name}
                priceCents={item.priceCents}
                imageSlot={<ProductImage src={item.image} alt={item.name} className="size-48" />}
                onCustomize={canCustomize(item) ? () => go("customize") : undefined}
                onConfirm={(quantity) => {
                    // The dialog's stepper is a count of *this* item, so it adds
                    // that many rather than one — the cart collapses them into a
                    // single line with a quantity of its own.
                    for (let i = 0; i < quantity; i++) addMenuItem(item);
                    go("added-to-bag");
                }}
            />
        </KioskScreen>
    );
};

/**
 * Modifier levels, then into the bag.
 *
 * `summariseModifiers` turns the level map into the deviations only — "No
 * Pickles, Extra Mayo", and nothing at all for an untouched sandwich — and
 * those labels travel onto the cart line, which is what makes the order review
 * show what was actually ordered instead of a generic product name.
 */
export const CustomizeRoute = () => {
    const { item } = useOrderFlow();
    const { go, goBack } = useNavigation();
    const { addMenuItem } = usePrototype();

    if (!item) return <MenuRoute />;

    return (
        <KioskScreen scroll={false} footer={<BrowseNav />}>
            <CustomizeItemScreen
                item={item}
                onCancel={goBack}
                onSave={(levels) => {
                    addMenuItem(item, levels, summariseModifiers(SANDWICH_MODIFIERS, levels));
                    go("added-to-bag");
                }}
            />
        </KioskScreen>
    );
};

/**
 * "Item added to bag!" — the confirmation beat.
 *
 * The screen carries no controls by design: it is a transition, not a decision.
 * That leaves the prototype needing a way out, so the beat **times out** back to
 * the grid it was added from, and a tap anywhere skips the wait. Adding buttons
 * instead would have meant editing a component whose whole argument is that it
 * has none.
 *
 * The count and total are the real ones. Nothing here is passed in: it reads the
 * cart, so the number on this screen is the number the rail shows a moment later.
 */
const ADDED_TO_BAG_DWELL_MS = 1800;

export const AddedToBagRoute = () => {
    const { itemCount, totalCents } = usePrototype();
    const { replace } = useNavigation();
    const { returnTo } = useOrderFlow();

    useEffect(() => {
        const timer = setTimeout(() => replace(returnTo), ADDED_TO_BAG_DWELL_MS);
        return () => clearTimeout(timer);
    }, [replace, returnTo]);

    return (
        <KioskScreen scroll={false}>
            {/* A button, not a div with onClick: the whole surface is one
                control, exactly as on the sign-off screen, and it should be
                reachable and announced as one. */}
            <button type="button" aria-label="Continue shopping" onClick={() => replace(returnTo)} className="h-full w-full">
                <AddedToBagScreen itemCount={itemCount} totalCents={totalCents} />
            </button>
        </KioskScreen>
    );
};

/* -------------------------------------------------------------------------- */
/* Pro shop                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The merchandise grid.
 *
 * The detail dialog is **local state**, not a screen. `ScreenId` has no
 * pro-shop detail entry, and it should not: the dialog is a step inside
 * browsing rather than a place, and closing it has to return to the exact
 * scroll position the grid was at — which a route change would throw away.
 */
export const ProShopRoute = () => {
    const { go } = useNavigation();
    const { addProShopItem } = usePrototype();
    const [selected, setSelected] = useState<ProShopProduct | null>(null);

    return (
        <KioskScreen scroll={false} footer={<BrowseNav />}>
            <div className="flex h-full flex-col gap-5 pt-12">
                <h1 className="px-8 text-5xl font-bold text-primary">Pro Shop</h1>
                <ProductGrid products={PRO_SHOP_PRODUCTS} categories={PRO_SHOP_CATEGORIES} onSelect={setSelected} />
            </div>

            {selected && (
                <ProductDetailDialog
                    isOpen
                    onOpenChange={(open) => !open && setSelected(null)}
                    name={selected.name}
                    priceCents={selected.priceCents}
                    imageSlot={<ProductImage src={selected.image} alt={selected.name} className="size-56" />}
                    onConfirm={(quantity) => {
                        for (let i = 0; i < quantity; i++) addProShopItem(selected);
                        setSelected(null);
                        setFlow({ returnTo: "pro-shop" });
                        go("added-to-bag");
                    }}
                />
            )}
        </KioskScreen>
    );
};

/* -------------------------------------------------------------------------- */
/* Checkout                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A cart line as the review screen wants it.
 *
 * `OrderReviewScreen` is keyed on `item.id` and hands that id back to its
 * quantity and remove callbacks, so the **line id** goes in as the item id.
 * Using the product id instead would make two differently-customised
 * cheeseburgers the same row, and removing one would remove both.
 *
 * A booking has no photograph and no modifiers, so what it reserved is rendered
 * in the modifier slot — that line is already the right shape for "one short
 * qualifying line under the name".
 */
const toOrderLine = (line: CartLine): OrderLine => ({
    item: {
        id: line.lineId,
        name: line.name,
        brand: "",
        model: line.name,
        packaging: "single",
        category: line.kind,
        priceCents: line.priceCents,
        image: line.image,
    },
    quantity: line.quantity,
    modifiers: line.modifiers ?? (line.bookingDetail ? [line.bookingDetail] : undefined),
});

/**
 * The cart, with whatever overlay the current step puts on top of it.
 *
 * Shared by the review and the checkout-method screens because the checkout
 * fork is drawn *over* the order it is about — the same surface, one step
 * further on. Rebuilding it under the modal would let the two drift.
 *
 * `showTotals` is off: `OrderSummaryNav` in the footer draws the same three
 * numbers and the same commit button, and two totals blocks on one screen is
 * not a redundancy a user forgives.
 */
const OrderReviewSurface = ({ overlay }: { overlay?: ReactNode }) => {
    const { lines, subtotalCents, taxCents, setQuantity, removeLine } = usePrototype();
    const { go } = useNavigation();
    const startOver = useEndSession();

    return (
        <KioskScreen
            scroll={false}
            footer={
                <OrderSummaryNav
                    subtotalCents={subtotalCents}
                    taxCents={taxCents}
                    isCompleteDisabled={lines.length === 0}
                    onCompleteOrder={() => go("takeout-choice")}
                    onOrderMore={() => go("menu")}
                    onStartOver={startOver}
                    // Ignored when signed in, where the identity card takes the
                    // corner instead — see OrderSummaryNav.
                    showWalletDrawer
                />
            }
        >
            <OrderReviewScreen
                lines={lines.map(toOrderLine)}
                taxCents={taxCents}
                showTotals={false}
                onChangeQuantity={setQuantity}
                onRemove={removeLine}
                onViewDetails={(item) => {
                    // The row carries a line id, not a product id, so the
                    // catalogue is matched by name. A pro-shop line or a booking
                    // has no menu detail to open and correctly does nothing.
                    const menuItem = MENU_ITEMS.find((candidate) => candidate.name === item.name);
                    if (!menuItem) return;
                    setFlow({ item: menuItem, categoryId: menuItem.category, returnTo: "menu" });
                    go("item-detail");
                }}
            />

            {overlay}
        </KioskScreen>
    );
};

/** "Your Order" — the cart, with the totals rail beneath it. */
export const OrderReviewRoute = () => <OrderReviewSurface />;

/**
 * For here or to go.
 *
 * Two equal cards, neither primary — either answer is normal at a golf course
 * and the kiosk has no basis for a guess. The rail is the bare `GlobalNav`: the
 * order is settled by this point, so the bag row would be offering a trip back
 * into a decision already made.
 */
export const TakeoutChoiceRoute = () => {
    const { go, goBack } = useNavigation();
    const startOver = useEndSession();

    return (
        <KioskScreen scroll={false} footer={<GlobalNav onStartOver={startOver} onHowToLogIn={() => go("how-to-log-in")} />}>
            <TakeoutChoiceScreen onChoose={() => go("checkout-method")} onBack={goBack} />
        </KioskScreen>
    );
};

/**
 * Where to pay, over the order it is about.
 *
 * Paying here hands off to the integrated terminal. Paying at the counter ends
 * the kiosk's involvement entirely — there is no terminal beat to show, so it
 * goes straight to the sign-off, which is what the person will see before they
 * walk to the till.
 */
export const CheckoutMethodRoute = () => {
    const { go, goBack } = useNavigation();
    const startOver = useEndSession();

    return (
        <OrderReviewSurface
            overlay={
                <CheckoutMethodFullScreen
                    isOpen
                    onOpenChange={(open) => !open && goBack()}
                    onPayHere={() => go("follow-instructions")}
                    onPayAtCounter={() => go("order-successful")}
                    onBack={goBack}
                    onStartOver={startOver}
                />
            }
        />
    );
};

/**
 * The terminal hand-off.
 *
 * Deliberately empty below the sentence — no spinner, no progress bar — because
 * the thing that needs attention is a separate piece of hardware. What stands in
 * for the terminal answering is a timer, and Complete Order on the unchanged
 * rail skips the wait for anyone demoing this who does not want to stand there.
 */
const TERMINAL_DWELL_MS = 2600;

export const FollowInstructionsRoute = () => {
    const { subtotalCents, taxCents } = usePrototype();
    const { replace } = useNavigation();
    const startOver = useEndSession();

    useEffect(() => {
        const timer = setTimeout(() => replace("order-successful"), TERMINAL_DWELL_MS);
        return () => clearTimeout(timer);
    }, [replace]);

    return (
        <KioskScreen
            scroll={false}
            footer={
                <OrderSummaryNav
                    subtotalCents={subtotalCents}
                    taxCents={taxCents}
                    onCompleteOrder={() => replace("order-successful")}
                    onStartOver={startOver}
                />
            }
        >
            <FollowInstructionsScreen />
        </KioskScreen>
    );
};

/**
 * The sign-off, and the end of the session.
 *
 * The whole surface is the dismiss target, and dismissing empties the cart
 * before unwinding to the attract screen — in that order, so nothing renders a
 * stale total on the way out.
 *
 * The rail is at its last state: no Start Over, no drawer, just the sign-off
 * card. Everything the rail spends a session offering is moot once the order is
 * placed, and leaving Start Over on a finished order invites a tap that does
 * nothing.
 */
export const OrderSuccessfulRoute = () => {
    const endSession = useEndSession();

    return (
        <KioskScreen
            scroll={false}
            footer={
                <div className="relative h-[110px] w-full bg-primary">
                    <div className="absolute right-16 bottom-0">
                        <SignedOutCard />
                    </div>
                </div>
            }
        >
            <OrderSuccessfulScreen subtitle="Your order is on its way to the kitchen." onDismiss={endSession} />
        </KioskScreen>
    );
};
