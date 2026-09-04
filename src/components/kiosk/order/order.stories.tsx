import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { ProductDetailDialog } from "@/components/kiosk/modals/dialog-variants";
import { CheckoutMethodFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { AddedToBagScreen } from "@/components/kiosk/order/added-to-bag-screen";
import { MenuScreen } from "@/components/kiosk/order/menu-screen";
import { OrderReviewScreen, type OrderLine } from "@/components/kiosk/order/order-review-screen";
import { ProductImage } from "@/components/kiosk/store/product-image";
import { MENU_ITEMS, type MenuItem } from "@/data/menu-catalog";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Screens/Ordering",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `The chicken-sandwich path end to end: browse → item detail → added to bag → review → checkout.

The **category rail** is a third mode of the same geometry the booking rails use (\`step-rail.tsx\`), so the clip offset, width and radius stay one set of numbers rather than three copies that drift.

**Sub-filters are per category.** The reference shows beverage filters (Water, Soft Drinks, Juices) sitting under a Sandwiches heading, which only makes sense as a mock artefact — they are keyed by category here.

**Food imagery is not exported yet.** The catalogue points at \`menu-images/\`, and \`ProductImage\` renders a deliberate empty state rather than a broken-image glyph, so these screens are reviewable now and the swap is a drop-in later. The catalogue uses the same shape as the pro-shop one so both feed the same cards.`,
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

/** Browse. Tap a tile to open the item dialog. */
export const Menu: Story = {
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

/** Sold-out handling — the state a live menu hits every day. */
export const MenuWithSoldOut: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <MenuScreen soldOutIds={["turkey-club-sandwich", "grilled-cheese"]} />
        </KioskScreen>
    ),
};

/** The item dialog, opened over the menu it came from. */
export const ItemDetail: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <MenuScreen />
            <ProductDetailDialog
                isOpen
                onOpenChange={() => {}}
                name="Fried Chicken Sandwich"
                priceCents={1499}
                imageSlot={<ProductImage src={MENU_ITEMS[0].image} alt="Fried Chicken Sandwich" className="size-48" />}
                onCustomize={() => {}}
            />
        </KioskScreen>
    ),
};

/** The confirmation beat. No actions — it confirms and gets out of the way. */
export const ItemAddedToBag: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <AddedToBagScreen itemCount={1} totalCents={1499} />
        </KioskScreen>
    ),
};

/** The cart. Steppers and Remove live on each line, not behind the dialog. */
export const YourOrder: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Cart() {
        const [lines, setLines] = useState<OrderLine[]>([
            line("fried-chicken-sandwich", 1, ["No Pickles", "Extra Mayo"]),
            line("bottle-of-water", 1),
            line("mms", 1),
        ]);
        const total = lines.reduce((t, l) => t + l.item.priceCents * l.quantity, 0);
        return (
            <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={lines.length} cartTotal={total / 100} />}>
                <OrderReviewScreen
                    lines={lines}
                    onChangeQuantity={(id, q) => setLines((prev) => prev.map((l) => (l.item.id === id ? { ...l, quantity: q } : l)))}
                    onRemove={(id) => setLines((prev) => prev.filter((l) => l.item.id !== id))}
                    onOrderMore={() => {}}
                    onCompleteOrder={() => {}}
                />
            </KioskScreen>
        );
    },
};

/** Empty cart — Complete Order disables rather than failing on tap. */
export const EmptyOrder: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <OrderReviewScreen lines={[]} onOrderMore={() => {}} />
        </KioskScreen>
    ),
};

/** Checkout, reusing the full-screen modal already built for booking. */
export const Checkout: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={3} cartTotal={22.45} />}>
            <OrderReviewScreen lines={[line("fried-chicken-sandwich", 1), line("bottle-of-water", 1), line("mms", 1)]} />
            <CheckoutMethodFullScreen isOpen onOpenChange={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};
