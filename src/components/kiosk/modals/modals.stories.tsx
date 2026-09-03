import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KioskKey } from "@/components/kiosk/keyboard/kiosk-key";
import { KioskModal } from "@/components/kiosk/modals/kiosk-modal";
import {
    CheckoutMethodModal,
    ChoiceModal,
    DestructiveConfirmModal,
    InfoSheetModal,
    ProductDetailModal,
    QuantityStepper,
    RatePickerModal,
} from "@/components/kiosk/modals/modal-variants";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { RATES_FOR_TIME } from "@/data/booking";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Modals",
    component: KioskModal,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "Every overlay in the references is the same anatomy with different content: a centered card over a dimmed ground, an optional close, a title block, a body, and a footer of large actions. They are therefore **one `KioskModal` plus thin variants** — building them separately would reimplement overlay, dismissal and focus containment six times and let them diverge on exactly the details that break most. Focus containment comes from React Aria rather than being hand-rolled: a kiosk runs unattended for hours, and a modal that leaks focus leaves the previous customer's session reachable behind the overlay.",
            },
        },
    },
} satisfies Meta<typeof KioskModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Modals mount inside the kiosk canvas, so the overlay dims the panel only. */
const Stage = ({ trigger, children }: { trigger: string; children: (open: boolean, set: (v: boolean) => void) => React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <KioskScreen footer={<KioskFooterBar />}>
            <div className="flex h-full items-center justify-center p-16">
                <KioskKey size="xl" variant="action" span={0} onPress={() => setIsOpen(true)} className="w-full">
                    {trigger}
                </KioskKey>
            </div>
            {children(isOpen, setIsOpen)}
        </KioskScreen>
    );
};

/** Rate picker — a single-select list, because exactly one rate gets booked. */
export const RatePicker: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage trigger="Open rate picker">
            {(open, set) => <RatePickerModal isOpen={open} onOpenChange={set} time="11:30 AM" rates={RATES_FOR_TIME("11:30 AM")} />}
        </Stage>
    ),
};

/** Product detail — the whole decision commits in one confirm. */
export const ProductDetail: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage trigger="Open product detail">
            {(open, set) => (
                <ProductDetailModal
                    isOpen={open}
                    onOpenChange={set}
                    name="Fried Chicken Sandwich"
                    priceCents={1499}
                    onCustomize={() => {}}
                />
            )}
        </Stage>
    ),
};

/** Destructive confirm — the confirm carries the risk, so it carries the tone. */
export const DestructiveConfirm: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage trigger="Open cancel confirm">
            {(open, set) => (
                <DestructiveConfirmModal
                    isOpen={open}
                    onOpenChange={set}
                    title="Are you sure you want to cancel this order?"
                    body="The selections you have chosen will be removed."
                />
            )}
        </Stage>
    ),
};

/** Choice — actions stack because they are not opposites. */
export const Choice: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage trigger="Open standby choice">
            {(open, set) => (
                <ChoiceModal
                    isOpen={open}
                    onOpenChange={set}
                    title="Join Standby"
                    body="To get in tee time, please join the queue and we will provide additional information."
                    choices={[
                        { label: "Get in line", isPrimary: true },
                        { label: "Check my wait time" },
                    ]}
                    footnote="Availability and pricing are subject to change."
                />
            )}
        </Stage>
    ),
};

/** Checkout method — the "Or" divider shows the nesting rather than flattening it. */
export const CheckoutMethod: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage trigger="Open checkout method">
            {(open, set) => <CheckoutMethodModal isOpen={open} onOpenChange={set} onBack={() => set(false)} />}
        </Stage>
    ),
};

/** Info sheet — a dismissible explainer with one acknowledgement. */
export const InfoSheet: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <Stage trigger="Open info sheet">
            {(open, set) => (
                <InfoSheetModal isOpen={open} onOpenChange={set} title="How to log in">
                    <ol className="flex flex-col gap-6 text-left">
                        {["Open your TenFore Golf Wallet ID", "Scan your code at the kiosk below", "Check out and book a tee time."].map((step, i) => (
                            <li key={step} className="flex items-center gap-4">
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-brand-secondary">
                                    {i + 1}
                                </span>
                                <span className="text-xl text-primary">{step}</span>
                            </li>
                        ))}
                    </ol>
                </InfoSheetModal>
            )}
        </Stage>
    ),
};

/** The stepper in isolation — ends get the reachable real estate, count is read-only. */
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
