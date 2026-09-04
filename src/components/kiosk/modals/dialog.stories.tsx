import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { ChoiceDialog, ProductDetailDialog, QuantityStepper, RatePickerDialog } from "@/components/kiosk/modals/dialog-variants";
import { KioskDialog } from "@/components/kiosk/modals/kiosk-dialog";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { RATES_FOR_TIME, TEE_TIMES } from "@/data/booking";
import { SlotCard } from "@/components/kiosk/booking/slot-card";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Overlays/Dialog (card)",
    component: KioskDialog,
    parameters: {
        // "centered" wraps the story in a padded box. At the kiosk viewport
        // (750x1298) a full-canvas frame then overflows by exactly that padding
        // — 32px — and the preview scrolls sideways on a panel that cannot.
        layout: "fullscreen",
        docs: {
            description: {
                component: `A **card overlay**: a rounded card that sits *on* the current screen. The page stays visible around and beneath it, including the persistent footer rail, so the user can see what they were doing and that they have not left it.

Use a dialog when the overlay is a **step inside the current task** — choosing a rate for the tee time you just tapped, setting a quantity for the item you just picked. Backing out should cost nothing and return you to exactly where you were.

**There is no scrim by default.** Every card overlay in \`references/flows\` sits on an undimmed page — the standby card overlays the hero photograph at full brightness. \`scrim\` is available for pages that are genuinely distracting behind, but it is not the house style, and turning it on makes a dialog read as a full-screen takeover when it is not one.

For an overlay that replaces the screen entirely, see **Overlays/Full Screen**.`,
            },
        },
    },
} satisfies Meta<typeof KioskDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Real page content behind the card, so the "sits on the page" behaviour is visible. */
const Stage = ({ children }: { children: (open: boolean, set: (v: boolean) => void) => React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <KioskScreen footer={<KioskFooterBar />}>
            <div className="flex flex-col gap-4 p-8">
                <h1 className="text-4xl font-bold text-primary">Book a time</h1>
                <div className="grid grid-cols-2 gap-3">
                    {TEE_TIMES.slice(0, 8).map((slot) => (
                        <SlotCard key={slot.id} slot={slot} />
                    ))}
                </div>
                <KioskKey size="lg" variant="action" span={0} onPress={() => setIsOpen(true)} className="w-full">
                    Reopen dialog
                </KioskKey>
            </div>
            {children(isOpen, setIsOpen)}
        </KioskScreen>
    );
};

/** Rate picker. The tee sheet behind is the context for the choice. */
export const RatePicker: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => <Stage>{(o, s) => <RatePickerDialog isOpen={o} onOpenChange={s} time="11:30 AM" rates={RATES_FOR_TIME("11:30 AM")} />}</Stage>,
};

/** Product detail. Closing returns the shopper to their scroll position. */
export const ProductDetail: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage>{(o, s) => <ProductDetailDialog isOpen={o} onOpenChange={s} name="Fried Chicken Sandwich" priceCents={1499} onCustomize={() => {}} />}</Stage>
    ),
};

/** Choice. Actions stack because they are forward paths, not opposites. */
export const Choice: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage>
            {(o, s) => (
                <ChoiceDialog
                    isOpen={o}
                    onOpenChange={s}
                    title="Join Standby"
                    body="To get in tee time, please join the queue and we will provide additional information."
                    choices={[{ label: "Get in line", isPrimary: true }, { label: "Check my wait time" }]}
                    footnote="Availability and pricing are subject to change."
                />
            )}
        </Stage>
    ),
};

/**
 * The opt-in scrim, for comparison. Note how much closer this reads to a
 * full-screen takeover — which is exactly why it is off by default.
 */
export const WithScrim: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage>
            {(o, s) => (
                <KioskDialog isOpen={o} onOpenChange={s} scrim title="Scrim enabled" subtitle="Compare against the stories above.">
                    <p className="text-center text-lg text-tertiary">The page behind is dimmed, so the card stops reading as part of this screen.</p>
                </KioskDialog>
            )}
        </Stage>
    ),
};

/** The stepper in isolation. */
export const Stepper: Story = {
    args: {},
    render: function StepperOnly() {
        const [qty, setQty] = useState(1);
        return (
            <div className="w-[500px] p-8">
                <QuantityStepper value={qty} onChange={setQty} />
            </div>
        );
    },
};
