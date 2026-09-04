import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductDetailDialog } from "@/components/kiosk/modals/dialog-variants";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { ProductCard } from "@/components/kiosk/store/product-card";
import { ProductGrid } from "@/components/kiosk/store/product-grid";
import { ProductImage } from "@/components/kiosk/store/product-image";
import { PRO_SHOP_CATEGORIES, PRO_SHOP_PRODUCTS } from "@/data/pro-shop-catalog";
import type { ProShopProduct } from "@/data/pro-shop-types";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Store/Pro Shop Grid",
    component: ProductGrid,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `Real product imagery, served the way the deployed prototype will serve it.

The raw capture in \`references/pos-item-imagery\` is ~134MB — 188 full-resolution PNGs averaging 725KB, with up to 13 gallery shots per product. \`node scripts/build-pos-images.mjs\` curates that down to one hero per product at 800px WebP: **1.2MB total, 23x smaller**, for images that never render above 400px on a 750px canvas. Output goes to \`public/pos-images/\`, which Storybook serves in dev and copies into the static build.

Catalog paths are stored **base-relative** (\`pos-images/pro-shop/x.webp\`, no leading slash) and resolved through \`assetUrl()\`. That is what makes them work on GitHub Pages, which serves this project from \`/tf-jackrabbit-ds-v1/\` — a rooted path would work locally and 404 after deploy, which is the worst time to find out.

Two columns at 750px gives each tile ~340px. Three would shrink the pack shot below the point where one white box is distinguishable from another, which is the entire basis of scanning a shop grid.`,
            },
        },
    },
} satisfies Meta<typeof ProductGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full catalog — 27 products from the PGA Tour Superstore capture. */
export const ProShop: Story = {
    args: { products: PRO_SHOP_PRODUCTS },
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Shop() {
        const [selected, setSelected] = useState<ProShopProduct | null>(null);
        return (
            <KioskScreen scroll={false} footer={<KioskFooterBar cartCount={2} cartTotal={109.98} />}>
                <div className="flex h-full flex-col gap-5 pt-12">
                    <h1 className="px-8 text-5xl font-bold text-primary">Pro Shop</h1>
                    <ProductGrid products={PRO_SHOP_PRODUCTS} categories={PRO_SHOP_CATEGORIES} onSelect={setSelected} />
                </div>

                {selected && (
                    <ProductDetailDialog
                        isOpen={Boolean(selected)}
                        onOpenChange={(open) => !open && setSelected(null)}
                        name={selected.name}
                        priceCents={selected.priceCents}
                        imageSlot={<ProductImage src={selected.image} alt={selected.name} className="size-56" />}
                        onConfirm={() => setSelected(null)}
                    />
                )}
            </KioskScreen>
        );
    },
};

/** Out-of-stock handling — the edge case a live catalog hits constantly. */
export const WithOutOfStock: Story = {
    args: { products: PRO_SHOP_PRODUCTS },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<KioskFooterBar />}>
            <div className="flex h-full flex-col gap-5 pt-12">
                <h1 className="px-8 text-5xl font-bold text-primary">Pro Shop</h1>
                <ProductGrid
                    products={PRO_SHOP_PRODUCTS}
                    categories={PRO_SHOP_CATEGORIES}
                    unavailableIds={[PRO_SHOP_PRODUCTS[1]?.id, PRO_SHOP_PRODUCTS[4]?.id].filter(Boolean) as string[]}
                />
            </div>
        </KioskScreen>
    ),
};

/**
 * Missing-image fallback. A kiosk showing a broken-image glyph looks
 * unattended, and product photography is the asset class most likely to be
 * incomplete while a catalog is filled in — so the empty state is deliberate.
 */
export const MissingImagery: Story = {
    args: { products: [] },
    render: () => (
        <div className="grid w-[720px] grid-cols-2 gap-4 p-8">
            <ProductCard product={PRO_SHOP_PRODUCTS[0]} />
            <ProductCard product={{ ...PRO_SHOP_PRODUCTS[0], id: "no-image", name: "Awaiting photography", image: "" }} />
            <ProductCard product={{ ...PRO_SHOP_PRODUCTS[2], id: "bad-path", name: "Broken path", image: "pos-images/pro-shop/does-not-exist.webp" }} />
            <ProductCard product={PRO_SHOP_PRODUCTS[3]} isUnavailable />
        </div>
    ),
};

/** Every product in the catalog, for reviewing the imagery set as a whole. */
export const AllProducts: Story = {
    args: { products: PRO_SHOP_PRODUCTS },
    render: () => (
        <div className="grid w-[1100px] grid-cols-4 gap-4 p-8">
            {PRO_SHOP_PRODUCTS.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    ),
};
