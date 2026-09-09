import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { OrderSummaryNav } from "@/components/kiosk/app-chrome/order-summary-nav";
import { ProductDetailDialog } from "@/components/kiosk/modals/dialog-variants";
import { CheckoutMethodFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { FollowInstructionsScreen } from "@/components/kiosk/order/follow-instructions-screen";
import { MenuScreen } from "@/components/kiosk/order/menu-screen";
import { HomeScreen } from "@/components/kiosk/screens/home-screen";
import { OrderReviewScreen, type OrderLine } from "@/components/kiosk/order/order-review-screen";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { TakeoutChoiceScreen } from "@/components/kiosk/order/takeout-choice-screen";
import { ProductImage } from "@/components/kiosk/store/product-image";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { MENU_ITEMS, type MenuItem } from "@/data/menu-catalog";
import { PRO_SHOP_PRODUCTS } from "@/data/pro-shop-catalog";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Order Sandwich Guest",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/2-2-order-a-chickenSandwich-guestLogin\`** — the same order placed without an account.

It diverges from the signed-in flow in two places. A guest gives a **name** instead of identifying themselves, so the kitchen has something to call out; and the rail keeps offering the **wallet drawer** through checkout, reading "Scan or tap to" rather than "Tap your wallet below" — by then the wallet is a way to pay, not a way to identify yourself, and a guest who scans there still gets their points.

Name entry drops the green scan panel that code and email entry keep: by that point the user has chosen to continue as a guest, and re-offering the scan reopens a settled decision.

**Every story here is signed out.** No \`member\` is passed to \`withKioskSession\`, so the rail resolves the drawer from the session rather than a prop — the guest state cannot be faked onto a signed-in session, and the signed-in state cannot leak into this flow.

**Screens the reference draws that are not restated here**, because they are pixel-identical to the signed-in flow and already exist elsewhere in Storybook: the welcome screen and its scrolled carousel (\`Welcome Screen / Get Started\`), the wallet interstitial (\`Interstitials / Log In Below For Everything\`), the "Do you want to log in?" branch point (\`Auth w New User / Do You Want To Log In\`), and the three rail-less screens shared with \`Order Sandwich\` — the item dialog, "Customize it", and "Item added to bag".`,
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

const totals = (lines: OrderLine[]) => {
    const subtotalCents = lines.reduce((total, l) => total + l.item.priceCents * l.quantity, 0);
    return { subtotalCents, taxCents: Math.round(subtotalCents * 0.0825) };
};

/**
 * The featured row the reference labels "New Hats". There is no hat
 * photography in the catalogue yet, so the row is fed the sleeves that do have
 * pack shots — it is data, and swapping it is a one-line change.
 */
const FEATURED = ["titleist-pro-v1-sleeve", "taylormade-tp5-sleeve", "titleist-avx-sleeve"]
    .map((id) => PRO_SHOP_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRO_SHOP_PRODUCTS)[number] => Boolean(p));

/**
 * Where "Start Order" lands a guest.
 *
 * The same landing surface the signed-in flow opens onto, with the rail in its
 * signed-out state: the wallet drawer sits where the identity card would, so
 * the invitation to log in is present on the first browse screen without
 * blocking anything. The bag row is drawn at zero — an order has been started
 * and is still empty, which is a different thing from having no order.
 */
export const StoreHome: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
            <HomeScreen featuredTitle="New Arrivals" featuredItems={FEATURED} />
        </KioskScreen>
    ),
};

/** Browsing a category as a guest. Tap a tile to open the item dialog. */
export const SandwichesMenu: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
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

/**
 * A second category, reached from the rail after the sandwich is in the bag.
 *
 * Worth its own story rather than an argument on the last one: Beverages is
 * the only category whose sub-filters the reference actually draws, so it is
 * where a filter-row regression would show.
 */
export const BeveragesMenu: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={1} cartTotal={13.99} />}>
            <MenuScreen initialCategoryId="beverages" />
        </KioskScreen>
    ),
};

/** The item dialog over the beverage grid it came from, rail still signed out. */
export const WaterItemDetail: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => {
        const water = MENU_ITEMS.find((i) => i.id === "bottle-of-water")!;
        return (
            <KioskScreen scroll={false} footer={<GlobalNav />}>
                <MenuScreen initialCategoryId="beverages" />
                <ProductDetailDialog
                    isOpen
                    onOpenChange={() => {}}
                    name={water.name}
                    priceCents={water.priceCents}
                    imageSlot={<ProductImage src={water.image} alt={water.name} className="size-48" />}
                    onConfirm={() => {}}
                />
            </KioskScreen>
        );
    },
};

/**
 * Guest checkout. Order More fills the left gutter the totals column leaves
 * empty, and the wallet drawer returns in its compact form — captioned "Scan or
 * tap to" rather than "Tap your wallet below", because at this point the wallet
 * is a way to pay rather than a way to say who you are.
 */
export const GuestCheckout: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Cart() {
        const lines = [line("chicken-sandwich", 1, ["No Pickles", "Extra Mayo"])];
        const { subtotalCents, taxCents } = totals(lines);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <OrderSummaryNav
                        subtotalCents={subtotalCents}
                        taxCents={taxCents}
                        onCompleteOrder={() => {}}
                        onOrderMore={() => {}}
                        onStartOver={() => {}}
                        showWalletDrawer
                    />
                }
            >
                <OrderReviewScreen lines={lines} showTotals={false} onViewDetails={() => {}} />
            </KioskScreen>
        );
    },
};

/**
 * The same review with the order filled out — a sandwich, a drink and a snack.
 *
 * Three lines is where the review screen's geometry is actually tested: the
 * list has to end above the totals rail rather than sliding under it, and the
 * compact drawer has to stay clear of Complete Order.
 */
export const GuestCheckoutFullOrder: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Cart() {
        const [lines, setLines] = useState<OrderLine[]>([
            line("chicken-sandwich", 1, ["No Pickles", "Extra Mayo"]),
            line("bottle-of-water", 1),
            line("mms", 1),
        ]);
        const { subtotalCents, taxCents } = totals(lines);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <OrderSummaryNav
                        subtotalCents={subtotalCents}
                        taxCents={taxCents}
                        onCompleteOrder={() => {}}
                        onOrderMore={() => {}}
                        onStartOver={() => {}}
                        showWalletDrawer
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
 * The last question before checkout, asked of a guest.
 *
 * The signed-in flow draws this with the identity card in the corner; here the
 * drawer is still on offer, and the rail carries nothing but Start Over beside
 * it — there is no cart row, because the order is already settled and the only
 * thing left is to answer the question.
 */
export const TakeoutChoice: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <TakeoutChoiceScreen onChoose={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * Name entry — the guest flow's one genuinely new question.
 *
 * No sign-in panel, unlike code and email entry: guest checkout is already
 * chosen, and re-offering the scan here reopens a settled decision. The rail is
 * gone entirely, so the keyboard has the room it needs.
 */
export const EnterYourName: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Name() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false}>
                <EntryScreen
                    title="Enter your name"
                    subtitle="Enter your full name for your food order."
                    field={<EntryTextField value={value} placeholder="Enter your Full Name" />}
                    value={value}
                    onChange={setValue}
                    onContinue={() => {}}
                    onBack={() => {}}
                />
            </KioskScreen>
        );
    },
};

/**
 * Choosing where to pay.
 *
 * The full-screen modal from the booking flow, unchanged — paying is the same
 * question whether or not you are signed in, and the reference draws it with
 * the rail covered rather than adapted. `onStartOver` is deliberately not
 * passed: the guest reference drops it here, leaving Go Back as the only way
 * out of the question.
 */
export const CheckoutMethod: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={3} cartTotal={22.45} />}>
            <OrderReviewScreen lines={[line("chicken-sandwich", 1), line("bottle-of-water", 1), line("mms", 1)]} />
            <CheckoutMethodFullScreen isOpen onOpenChange={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The hand-off to the card reader.
 *
 * The rail is unchanged from the review screen, compact drawer included — a
 * guest can still scan here and have the points land on the order being paid
 * for, which is the last moment that is possible.
 */
export const FollowInstructions: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Payment() {
        const lines = [line("chicken-sandwich", 1)];
        const { subtotalCents, taxCents } = totals(lines);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <OrderSummaryNav
                        subtotalCents={subtotalCents}
                        taxCents={taxCents}
                        onCompleteOrder={() => {}}
                        onOrderMore={() => {}}
                        onStartOver={() => {}}
                        showWalletDrawer
                    />
                }
            >
                <FollowInstructionsScreen />
            </KioskScreen>
        );
    },
};

/**
 * The last screen of a guest session.
 *
 * No rail at all — the signed-in flow ends on a "Logged out" card, but a guest
 * never logged in, so there is nothing to report. The whole surface is the
 * dismiss target, and a user who simply walks away gets the same result when
 * the session times out.
 */
export const OrderComplete: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <OrderSuccessfulScreen onDismiss={() => {}} />
        </KioskScreen>
    ),
};
