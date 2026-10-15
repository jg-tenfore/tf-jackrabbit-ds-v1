import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { ProductDetailDialog } from "@/components/kiosk/modals/dialog-variants";
import { MenuScreen } from "@/components/kiosk/order/menu-screen";
import { ProductImage } from "@/components/kiosk/store/product-image";
import type { MenuItem } from "@/data/menu-catalog";
import { DEMO_FAVORITE_IDS, DEMO_RECENT_IDS } from "@/data/menu-collections";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Components/Kiosk Store/Menu Collections",
    component: MenuScreen,
    parameters: { layout: "fullscreen" },
    decorators: [withKioskSession(), withKioskFrame()],
} satisfies Meta<typeof MenuScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The section links, favorite star, and recent items all work in this preview. */
const ShoppingPreview = ({ initialCategoryId }: { initialCategoryId?: string }) => {
    const [selected, setSelected] = useState<MenuItem | null>(null);
    const [favorites, setFavorites] = useState(DEMO_FAVORITE_IDS);
    const [recent, setRecent] = useState(DEMO_RECENT_IDS);
    const [cart, setCart] = useState({ count: 0, total: 0 });

    return (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={cart.count} cartTotal={cart.total / 100} />}>
            <MenuScreen initialCategoryId={initialCategoryId} favoriteIds={favorites} recentIds={recent} onSelectItem={setSelected} />
            {selected && (
                <ProductDetailDialog
                    key={selected.id}
                    isOpen
                    onOpenChange={(open) => !open && setSelected(null)}
                    name={selected.name}
                    priceCents={selected.priceCents}
                    imageSlot={<ProductImage src={selected.image} alt={selected.name} className="size-48" />}
                    isFavorite={favorites.includes(selected.id)}
                    onFavoriteChange={(saved) =>
                        setFavorites((ids) => (saved ? [selected.id, ...ids.filter((id) => id !== selected.id)] : ids.filter((id) => id !== selected.id)))
                    }
                    onConfirm={(quantity) => {
                        setRecent((ids) => [selected.id, ...ids.filter((id) => id !== selected.id)].slice(0, 8));
                        setCart((cart) => ({ count: cart.count + quantity, total: cart.total + selected.priceCents * quantity }));
                        setSelected(null);
                    }}
                />
            )}
        </KioskScreen>
    );
};

export const Deals: Story = { args: { initialCategoryId: "deals" }, render: (args) => <ShoppingPreview {...args} /> };
export const Members: Story = { args: { initialCategoryId: "members" }, render: (args) => <ShoppingPreview {...args} /> };
export const RecentAndFavorites: Story = { args: { initialCategoryId: "recent" }, render: (args) => <ShoppingPreview {...args} /> };
