import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SlotCard } from "@/components/kiosk/booking/slot-card";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { CheckoutMethodFullScreen, ConfirmationFullScreen, DestructiveConfirmFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { KioskFullScreenModal } from "@/components/kiosk/modals/kiosk-full-screen-modal";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { TEE_TIMES } from "@/data/booking";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Components/Kiosk Overlays/Full Screen",
    component: KioskFullScreenModal,
    parameters: {
        // "centered" wraps the story in a padded box. At the kiosk viewport
        // (750x1298) a full-canvas frame then overflows by exactly that padding
        // — 32px — and the preview scrolls sideways on a panel that cannot.
        layout: "fullscreen",
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
        <KioskScreen footer={<GlobalNav />}>
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
