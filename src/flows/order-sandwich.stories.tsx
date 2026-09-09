import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { OrderSummaryNav } from "@/components/kiosk/app-chrome/order-summary-nav";
import { SignedOutCard } from "@/components/kiosk/app-chrome/wallet-drawer";
import { ProductDetailDialog } from "@/components/kiosk/modals/dialog-variants";
import { CheckoutMethodFullScreen, DestructiveConfirmFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { AddedToBagScreen } from "@/components/kiosk/order/added-to-bag-screen";
import { MenuScreen } from "@/components/kiosk/order/menu-screen";
import { HomeScreen } from "@/components/kiosk/screens/home-screen";
import { OrderReviewScreen, type OrderLine } from "@/components/kiosk/order/order-review-screen";
import { CustomizeItemScreen } from "@/components/kiosk/order/customize-item-screen";
import { FollowInstructionsScreen } from "@/components/kiosk/order/follow-instructions-screen";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { TakeoutChoiceScreen } from "@/components/kiosk/order/takeout-choice-screen";
import { ProductImage } from "@/components/kiosk/store/product-image";
import { MENU_ITEMS, type MenuItem } from "@/data/menu-catalog";
import { MEMBERS } from "@/data/members";
import { PRO_SHOP_PRODUCTS } from "@/data/pro-shop-catalog";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "User Flows/Order Sandwich",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `The chicken-sandwich path end to end, **signed in throughout**: store home → browse → item detail → customize → added to bag → review → takeout → checkout → receipt.

Every story here runs with a member in the session, because that is what this reference folder documents. The rail therefore carries the identity card rather than the wallet drawer on every screen — a difference that is not cosmetic: a signed-in user shown a "log in" prompt at checkout is a bug, so the drawer is driven off the session rather than a prop.

The **category rail** is a third mode of the same geometry the booking rails use (\`step-rail.tsx\`), so the clip offset, width and radius stay one set of numbers rather than three copies that drift.

**Sub-filters are per category.** The reference shows beverage filters (Water, Soft Drinks, Juices) sitting under a Sandwiches heading, which only makes sense as a mock artefact — they are keyed by category here.

**Food and merchandise share one catalogue shape.** \`MenuItem\` is \`ProShopProduct\` plus calories, so a sleeve of golf balls and a chicken sandwich feed the same card — which is what lets the store home screen put both in one grid. Anything without a shot yet renders \`ProductImage\`'s deliberate empty state rather than a broken-image glyph.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const line = (id: string, quantity: number, modifiers?: string[]): OrderLine => ({
    item: MENU_ITEMS.find((i) => i.id === id)!,
    quantity,
    modifiers,
});

/** Merchandise with real pack shots, so the featured row is reviewable today. */
const FEATURED = ["titleist-pro-v1-sleeve", "taylormade-tp5-sleeve", "titleist-avx-sleeve"]
    .map((id) => PRO_SHOP_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRO_SHOP_PRODUCTS)[number] => Boolean(p));

/**
 * The store landing — where "Shop Food & Gear" arrives.
 *
 * A merchandising screen, not a browse one: the rail already answers "where do
 * I go", so this answers "what is worth buying today" with a promo, four
 * shortcuts and one featured row, then gets out of the way.
 *
 * The greeting is a **prop, not the clock**. Deriving it from `Date` would make
 * this story render differently depending on when a screenshot was taken, which
 * turns a pixel diff into a coin flip.
 *
 * The reference draws the featured row as "New Hats". There is no hat
 * photography in the catalogue yet, and three empty states would say nothing
 * about the layout, so it is fed the sleeves that do have shots — the row is
 * data, and swapping it is a one-line change once the hats land.
 */
export const StoreHome: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
            <HomeScreen featuredTitle="New Arrivals" featuredItems={FEATURED} />
        </KioskScreen>
    ),
};

/** Browse. Tap a tile to open the item dialog. */
export const Menu: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: function Browse() {
        const [selected, setSelected] = useState<MenuItem | null>(null);
        return (
            <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
                <MenuScreen onSelectItem={setSelected} />
                {selected && (
                    <ProductDetailDialog
                        isOpen
                        onOpenChange={(open) => !open && setSelected(null)}
                        name={selected.name}
                        priceCents={selected.priceCents}
                        imageSlot={<ProductImage src={selected.image} alt={selected.name} className="size-48" />}
                        onCustomize={() => {}}
                        onConfirm={() => setSelected(null)}
                    />
                )}
            </KioskScreen>
        );
    },
};

/** Sold-out handling — the state a live menu hits every day. */
export const MenuWithSoldOut: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
            <MenuScreen soldOutIds={["soft-pretzel", "hot-dog"]} />
        </KioskScreen>
    ),
};

/** The item dialog, opened over the menu it came from. */
export const ItemDetail: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
            <MenuScreen />
            <ProductDetailDialog
                isOpen
                onOpenChange={() => {}}
                name={MENU_ITEMS[0].name}
                priceCents={MENU_ITEMS[0].priceCents}
                imageSlot={<ProductImage src={MENU_ITEMS[0].image} alt={MENU_ITEMS[0].name} className="size-48" />}
                onCustomize={() => {}}
            />
        </KioskScreen>
    ),
};

/**
 * A second category, reached from the rail.
 *
 * Worth its own story rather than being read as "Menu with a different prop":
 * Beverages is the category that actually exercises the sub-filter row (Water,
 * Soft Drinks, Juices, Energy Drinks), and it is the one where the grid runs
 * past the fold — both of which Sandwiches leaves untested.
 */
export const MenuBeverages: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
            <MenuScreen initialCategoryId="beverages" />
        </KioskScreen>
    ),
};

/**
 * The same dialog for something with nothing to customize.
 *
 * `Customize Ingredients` is absent rather than disabled. A greyed control
 * invites a tap and then explains nothing; a bottle of water has no
 * ingredients to argue about, so the row simply is not there and the quantity
 * stepper takes the space.
 */
export const ItemDetailNoCustomize: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => {
        const water = MENU_ITEMS.find((i) => i.id === "bottle-of-water")!;
        return (
            <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={1} cartTotal={14.99} />}>
                <MenuScreen initialCategoryId="beverages" />
                <ProductDetailDialog
                    isOpen
                    onOpenChange={() => {}}
                    name={water.name}
                    priceCents={water.priceCents}
                    imageSlot={<ProductImage src={water.image} alt={water.name} className="size-48" />}
                />
            </KioskScreen>
        );
    },
};

/** The confirmation beat. No actions — it confirms and gets out of the way. */
export const ItemAddedToBag: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <AddedToBagScreen itemCount={1} totalCents={1499} />
        </KioskScreen>
    ),
};

/**
 * The cart, with the totals rail beneath it.
 *
 * `OrderSummaryNav` carries Sub Total / Tax / Total and the commit button, so
 * the screen's own totals block is switched off — two of them on one screen is
 * not a redundancy a user forgives.
 */
export const YourOrder: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: function Cart() {
        const [lines, setLines] = useState<OrderLine[]>([
            line("cheeseburger", 1, ["No Pickles", "Extra Mayo"]),
            line("bottle-of-water", 1),
            line("snickers", 1),
        ]);
        const subtotal = lines.reduce((t, l) => t + l.item.priceCents * l.quantity, 0);
        const tax = Math.round(subtotal * 0.0825);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <OrderSummaryNav
                        subtotalCents={subtotal}
                        taxCents={tax}
                        onCompleteOrder={() => {}}
                        onOrderMore={() => {}}
                        onStartOver={() => {}}
                    />
                }
            >
                <OrderReviewScreen
                    lines={lines}
                    showTotals={false}
                    onChangeQuantity={(id, q) => setLines((prev) => prev.map((l) => (l.item.id === id ? { ...l, quantity: q } : l)))}
                    onRemove={(id) => setLines((prev) => prev.filter((l) => l.item.id !== id))}
                    onViewDetails={() => {}}
                />
            </KioskScreen>
        );
    },
};

/**
 * The order **as it is first opened** — one line, and the tax on it.
 *
 * Kept separate from the three-line cart because the single-line case is where
 * the layout is least forgiving: nothing below the row holds the totals block
 * down, so any drift in the review screen's flex behaviour shows here first and
 * nowhere else.
 */
export const SingleItemOrder: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => {
        const lines = [line("chicken-sandwich", 1, ["No Pickles", "Extra Mayo"])];
        const subtotal = lines.reduce((t, l) => t + l.item.priceCents * l.quantity, 0);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <OrderSummaryNav
                        subtotalCents={subtotal}
                        taxCents={Math.round(subtotal * 0.0825)}
                        onCompleteOrder={() => {}}
                        onOrderMore={() => {}}
                        onStartOver={() => {}}
                    />
                }
            >
                <OrderReviewScreen lines={lines} showTotals={false} onViewDetails={() => {}} />
            </KioskScreen>
        );
    },
};

/**
 * Removing one line — a card-weight decision, not an order-weight one.
 *
 * It borrows the destructive full screen the cancel path uses, but the copy is
 * scoped to the item: "this item from your cart", not "the selections you have
 * chosen". One line is a tap away from being re-added, so the wording should
 * not imply the session is at stake.
 */
export const RemoveItemConfirm: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={3} cartTotal={22.45} />}>
            <OrderReviewScreen lines={[line("chicken-sandwich", 1, ["No Pickles", "Extra Mayo"]), line("bottle-of-water", 1), line("mms", 1)]} />
            <DestructiveConfirmFullScreen
                isOpen
                onOpenChange={() => {}}
                title="Remove item?"
                body="Are you sure you want to remove this item from your cart?"
                confirmLabel="Remove"
                onConfirm={() => {}}
            />
        </KioskScreen>
    ),
};

/**
 * Empty cart — Complete Order disables rather than failing on tap.
 *
 * The totals rail stays, showing $0.00 across all three rows. Hiding it would
 * make the screen change shape as the last item is removed, and the numbers
 * going to zero is the clearest possible confirmation that the removal worked.
 */
export const EmptyOrder: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen
            scroll={false}
            footer={<OrderSummaryNav subtotalCents={0} taxCents={0} isCompleteDisabled onOrderMore={() => {}} onStartOver={() => {}} />}
        >
            <OrderReviewScreen lines={[]} showTotals={false} />
        </KioskScreen>
    ),
};

/** Checkout, reusing the full-screen modal already built for booking. */
export const Checkout: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={3} cartTotal={22.45} />}>
            <OrderReviewScreen lines={[line("cheeseburger", 1), line("bottle-of-water", 1), line("snickers", 1)]} />
            <CheckoutMethodFullScreen isOpen onOpenChange={() => {}} onBack={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};

/**
 * Cancelling the order — the one hard stop in the ordering flow.
 *
 * Shown over the order it would destroy rather than on its own, because that is
 * where a user meets it: the screen behind is the thing being described by "the
 * selections you have chosen". Full screen rather than a dialog, since leaving
 * the order half-visible behind a scrim invites poking at what is about to be
 * thrown away.
 *
 * Cancel comes first and Remove is the red one — the destructive option should
 * never be the one a hurried thumb finds by default.
 */
export const CancelOrder: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={3} cartTotal={22.45} />}>
            <OrderReviewScreen lines={[line("cheeseburger", 1), line("bottle-of-water", 1), line("snickers", 1)]} />
            <DestructiveConfirmFullScreen
                isOpen
                onOpenChange={() => {}}
                title="Are you sure you want to cancel this order?"
                body="The selections you have chosen will be removed."
                confirmLabel="Remove"
                onConfirm={() => {}}
            />
        </KioskScreen>
    ),
};

/**
 * The last question before checkout.
 *
 * Two equal cards, neither primary: either answer is normal at a golf course
 * and the kiosk has no basis for a guess. The illustrations do the
 * discriminating — "For Here" and "To Go" are four short words that look alike
 * at a glance, while a table of beers and a loaded cart are told apart before
 * either label is read.
 *
 * Shown logged in, as the reference draws it: by this point in the flow the
 * rail is carrying the identity card rather than the wallet drawer.
 */
export const TakeoutChoice: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <TakeoutChoiceScreen onChoose={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The last screen of a session.
 *
 * The whole surface is the dismiss target — no button, because there is no
 * decision left, and a user who walks away gets the same result when the
 * session times out.
 *
 * The rail is at its **third and last state**: no Start Over, no drawer, no
 * identity card, just the sign-off tick. Everything the rail spends a session
 * offering is now moot, and leaving Start Over on a finished order would invite
 * a tap that does nothing.
 *
 * **Copy note:** the subtitle reads "The selections you have chosen will be
 * removed." because that is what the reference draws, but it is the cancel
 * screen's line and on a successful order it reads as a warning. It is a prop,
 * so swapping it is a one-line change.
 */
export const OrderSuccessful: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
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
            <OrderSuccessfulScreen onDismiss={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The hand-off to the card reader, between checkout and the receipt.
 *
 * Deliberately empty below the sentence: no spinner, no progress bar, no
 * button. Each of those would pull the eye back to the screen the user is
 * being told to stop looking at, and a spinner would imply this panel is
 * doing the work and worth waiting on — when the thing that needs attention
 * is a separate piece of hardware.
 *
 * The rail is unchanged from the order review, and shows the **identity card**
 * rather than the wallet drawer because the session is signed in. That comes
 * off the session, not a prop: a signed-in user being shown a "log in" prompt
 * is not a state any screen should be able to ask for.
 */
export const FollowInstructions: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen
            scroll={false}
            footer={
                <OrderSummaryNav
                    subtotalCents={1499}
                    taxCents={124}
                    onCompleteOrder={() => {}}
                    onOrderMore={() => {}}
                    onStartOver={() => {}}
                />
            }
        >
            <FollowInstructionsScreen />
        </KioskScreen>
    ),
};

/**
 * Customizing an item before it goes in the bag.
 *
 * Each row is a **level**, not a quantity — none / regular / extra. The control
 * looks like a stepper but its middle segment shows a word, because "2 mustard"
 * means nothing to a kitchen while "Extra" does.
 *
 * Only **deviations from the default** are red. An untouched sandwich shows no
 * red at all, so a glance down the list says what was changed rather than making
 * you read every row — and that same set is what becomes "No Pickles, Extra
 * Mayo" on the order line.
 *
 * The two presets are deliberately different things. **Make it plain** is a
 * destination; **Start fresh** is an undo. Conflating them would silently do the
 * wrong one for half the people who tap.
 */
export const CustomizeItem: Story = {
    decorators: [withKioskSession({ member: MEMBERS[0] }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={1} cartTotal={13.99} />}>
            <CustomizeItemScreen
                item={MENU_ITEMS.find((i) => i.id === "chicken-sandwich")!}
                onSave={() => {}}
                onCancel={() => {}}
            />
        </KioskScreen>
    ),
};
