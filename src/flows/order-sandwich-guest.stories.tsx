import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { OrderSummaryNav } from "@/components/kiosk/app-chrome/order-summary-nav";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
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

Name entry drops the green scan panel that code and email entry keep: by that point the user has chosen to continue as a guest, and re-offering the scan reopens a settled decision.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Name entry — no sign-in panel, since guest checkout is already chosen. */
export const EnterYourName: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Name() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false} footer={<GlobalNav />}>
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
 * Guest checkout. Order More fills the left gutter the totals column leaves
 * empty, and the wallet drawer returns in its compact form.
 */
export const GuestCheckout: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<OrderSummaryNav subtotalCents={1499} taxCents={124} onCompleteOrder={() => {}} onOrderMore={() => {}} onStartOver={() => {}} showWalletDrawer />}>
            <div className="flex h-full items-center justify-center px-16 text-center text-[19px] text-tertiary">Order review area</div>
        </KioskScreen>
    ),
};
