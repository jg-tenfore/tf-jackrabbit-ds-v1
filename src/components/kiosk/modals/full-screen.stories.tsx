import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SlotCard } from "@/components/kiosk/booking/slot-card";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import {
    CheckoutMethodFullScreen,
    ConfirmationFullScreen,
    DestructiveConfirmFullScreen,
    InfoSheetFullScreen,
    InterstitialFullScreen,
} from "@/components/kiosk/modals/full-screen-variants";
import { KioskFullScreenModal } from "@/components/kiosk/modals/kiosk-full-screen-modal";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { TEE_TIMES } from "@/data/booking";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Overlays/Full Screen",
    component: KioskFullScreenModal,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `A **full-screen overlay**: it replaces the entire screen. No card, no visible page behind it, and the persistent footer rail is covered. It owns the whole 750x1298 canvas.

The distinction from a dialog is about **what the overlay is doing, not how big its content is**. A dialog is a step inside the current task and leaves its context on screen. A full-screen modal is a **hard stop** — the flow cannot continue until it is answered, and the surrounding context is deliberately removed so nothing competes with the question.

That is why the references use it for destroying an order, choosing where to pay, and the between-step interstitials: decisions where a half-visible screen behind would invite the user to keep poking at what they were doing.

Removing the context is the point, so this takes **no scrim and no card** — a dimmed page behind would reintroduce exactly what it is trying to strip away.

Note the actions are two centred pills, not the dialog's edge-to-edge split bar: a full-screen modal has no card edge for a bar to span.

For an overlay that keeps its context, see **Overlays/Dialog (card)**.`,
            },
        },
    },
} satisfies Meta<typeof KioskFullScreenModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Page content behind, to show that a full-screen overlay covers all of it. */
const Stage = ({ children }: { children: (open: boolean, set: (v: boolean) => void) => React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <KioskScreen footer={<KioskFooterBar />}>
            <div className="flex flex-col gap-4 p-8">
                <h1 className="text-4xl font-bold text-primary">Your Order</h1>
                <div className="grid grid-cols-2 gap-3">
                    {TEE_TIMES.slice(0, 6).map((slot) => (
                        <SlotCard key={slot.id} slot={slot} />
                    ))}
                </div>
                <KioskKey size="lg" variant="action" span={0} onPress={() => setIsOpen(true)} className="w-full">
                    Reopen full-screen modal
                </KioskKey>
            </div>
            {children(isOpen, setIsOpen)}
        </KioskScreen>
    );
};

/**
 * Destructive confirm. The action is named for what it does ("Remove"), not
 * "Confirm" — a generic verb makes the user re-derive what they are agreeing to.
 */
export const DestructiveConfirm: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage>
            {(o, s) => (
                <DestructiveConfirmFullScreen
                    isOpen={o}
                    onOpenChange={s}
                    title="Are you sure you want to cancel this order?"
                    body="The selections you have chosen will be removed."
                />
            )}
        </Stage>
    ),
};

/** Checkout method — a fork in the flow, not a detail of it. */
export const CheckoutMethod: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => <Stage>{(o, s) => <CheckoutMethodFullScreen isOpen={o} onOpenChange={s} onBack={() => s(false)} />}</Stage>,
};

/** Interstitial — a beat in the flow, with no screen behind to return to. */
export const Interstitial: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage>
            {(o, s) => (
                <InterstitialFullScreen
                    isOpen={o}
                    onOpenChange={s}
                    title="Log in below for everything for your round"
                    body="Redeem points on the TenFore Golf App."
                    primaryLabel="Scan my wallet"
                    secondaryLabel="Continue as guest"
                    onSecondary={() => s(false)}
                >
                    <div data-placeholder-asset="kiosk-and-phone-render" className="mx-auto h-56 w-full max-w-[420px] rounded-2xl bg-secondary ring-1 ring-border-secondary" />
                </InterstitialFullScreen>
            )}
        </Stage>
    ),
};

/** Info sheet — long enough that a card would scroll inside an overlay. */
export const InfoSheet: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage>
            {(o, s) => (
                <InfoSheetFullScreen isOpen={o} onOpenChange={s} title="How to log in">
                    <ol className="flex flex-col gap-8">
                        {["Open your TenFore Golf Wallet ID", "Scan your code at the kiosk below", "Check out and book a tee time."].map((step, i) => (
                            <li key={step} className="flex items-center gap-5">
                                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-primary text-2xl font-bold text-brand-secondary">
                                    {i + 1}
                                </span>
                                <span className="text-2xl text-primary">{step}</span>
                            </li>
                        ))}
                    </ol>
                </InfoSheetFullScreen>
            )}
        </Stage>
    ),
};

/** Terminal success screen for a completed booking or order. */
export const Confirmation: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage>
            {(o, s) => (
                <ConfirmationFullScreen
                    isOpen={o}
                    onOpenChange={s}
                    title="You're all set"
                    body="Thursday, January 8th at 11:30 AM · The Course at Sagamore"
                    onDone={() => s(false)}
                />
            )}
        </Stage>
    ),
};
