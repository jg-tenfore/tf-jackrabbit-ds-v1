import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertTriangle, CalendarCheck01, Mail01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Input } from "@/components/base/input/input";
import { PinInput } from "@/components/base/input/pin-input";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { TfLogo } from "@/components/foundations/logo/tf-logo";

/**
 * Modals keep the pro shop tidy — they ask a golfer to confirm a booking, walk
 * through a cancellation, or read the course terms before the round, all without
 * leaving the tee sheet. Built on react-aria's `DialogTrigger`, the trigger
 * `Button` opens a `ModalOverlay` + `Modal` wrapping a `Dialog`, whose children
 * render-prop hands back a `close` function. The monochromatic Sagamore theme
 * keeps every dialog in calm greyscale.
 */
const meta = {
    title: "Components/Actions/Modal",
    component: Dialog,
    parameters: { layout: "centered" },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: confirm a 9:20 AM tee time on the Championship course. */
export const Default: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="primary">Book tee time</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <FeaturedIcon icon={CalendarCheck01} color="gray" theme="modern" size="lg" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Confirm your tee time</h2>
                                    <p className="text-sm text-tertiary">
                                        You’re booking 9:20 AM on the Championship course for a foursome. We’ll hold the
                                        slot and email your confirmation.
                                    </p>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <Button color="secondary" className="flex-1" onClick={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" className="flex-1" onClick={close}>
                                        Confirm booking
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Destructive: confirm cancelling a tee time, with an error featured icon. */
export const Destructive: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="primary-destructive">Cancel tee time</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <FeaturedIcon icon={AlertTriangle} color="error" theme="light" size="lg" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Cancel this tee time?</h2>
                                    <p className="text-sm text-tertiary">
                                        Cancelling your 9:20 AM round on the Championship course releases the slot to the
                                        waitlist. This can’t be undone within 24 hours of play.
                                    </p>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <Button color="secondary" className="flex-1" onClick={close}>
                                        Keep booking
                                    </Button>
                                    <Button color="primary-destructive" className="flex-1" onClick={close}>
                                        Cancel tee time
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Scrollable content: the full course terms scroll within a fixed-height dialog. */
export const ScrollableContent: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="secondary">Read course terms</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="flex max-h-[80vh] max-w-120 flex-col rounded-xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <>
                                <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-lg font-semibold text-primary">Course terms & etiquette</h2>
                                        <p className="text-sm text-tertiary">Please review before confirming your round.</p>
                                    </div>
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="flex flex-col gap-4 overflow-y-auto p-6 text-sm text-tertiary">
                                    <p>
                                        1. Pace of play. Sagamore expects a four-hour round. Marshals may ask groups to
                                        let faster players through and to keep pace with the group ahead.
                                    </p>
                                    <p>
                                        2. Dress code. Collared shirts are required on both courses. Denim, gym shorts,
                                        and metal spikes are not permitted in the pro shop or on the tee.
                                    </p>
                                    <p>
                                        3. Carts. Cart-path-only rules apply after rain. Keep carts thirty feet from
                                        greens and bunkers at all times, and observe the ninety-degree rule when posted.
                                    </p>
                                    <p>
                                        4. Cancellations. Tee times cancelled inside twenty-four hours of play are
                                        charged at the standard rate. Weather holds are refunded automatically.
                                    </p>
                                    <p>
                                        5. Twilight rates. Twilight pricing begins at 4:00 PM and includes a shared cart.
                                        Replay rounds on the Executive are offered at the member rate after your round.
                                    </p>
                                    <p>
                                        6. Repair the course. Replace divots, rake bunkers, and fix ball marks on the
                                        greens. Leaving the course in good shape keeps the Championship in top form.
                                    </p>
                                    <p>
                                        7. Frost delays. Morning rounds may be held for frost. The starter will radio the
                                        first tee, and your booking holds until the course opens.
                                    </p>
                                    <p>
                                        8. Guests. Each member may bring up to three guests per round. Guests must check
                                        in at the pro shop and abide by the same etiquette and dress code.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3 border-t border-secondary p-6">
                                    <Button color="secondary" onClick={close}>
                                        Close
                                    </Button>
                                    <Button color="primary" onClick={close}>
                                        Accept & continue
                                    </Button>
                                </div>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Stacked left aligned: left-aligned icon + text with full-width stacked actions. */
export const StackedLeftAligned: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="primary">Update booking</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <FeaturedIcon icon={CalendarCheck01} color="gray" theme="modern" size="lg" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Move your tee time</h2>
                                    <p className="text-sm text-tertiary">
                                        We’ll shift your foursome from 9:20 AM to 10:40 AM on the Championship course and
                                        email everyone the new confirmation.
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-col gap-3">
                                    <Button color="primary" className="w-full" onClick={close}>
                                        Confirm new time
                                    </Button>
                                    <Button color="secondary" className="w-full" onClick={close}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Destructive stacked left aligned: error icon, destructive primary, stacked actions. */
export const DestructiveStackedLeftAligned: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="primary-destructive">Cancel membership</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <FeaturedIcon icon={Trash01} color="error" theme="light" size="lg" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Cancel your membership?</h2>
                                    <p className="text-sm text-tertiary">
                                        You’ll lose member twilight rates and 14-day booking access at the end of the
                                        billing period. This can’t be undone.
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-col gap-3">
                                    <Button color="primary-destructive" className="w-full" onClick={close}>
                                        Cancel membership
                                    </Button>
                                    <Button color="secondary" className="w-full" onClick={close}>
                                        Keep membership
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Warning stacked left aligned: warning icon, left-aligned text, stacked actions. */
export const WarningStackedLeftAligned: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="secondary">Book in frost window</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <FeaturedIcon icon={AlertTriangle} color="warning" theme="light" size="lg" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Possible frost delay</h2>
                                    <p className="text-sm text-tertiary">
                                        Your 7:10 AM tee time falls in a frost window. The starter may hold the first tee
                                        until the course opens. Book anyway?
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-col gap-3">
                                    <Button color="primary" className="w-full" onClick={close}>
                                        Book anyway
                                    </Button>
                                    <Button color="secondary" className="w-full" onClick={close}>
                                        Pick another time
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Login: a sign-in form inside a modal. */
export const Login: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="primary">Log in</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <TfLogo className="h-9 w-auto" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-5 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Welcome back</h2>
                                    <p className="text-sm text-tertiary">Sign in to your Sagamore account.</p>
                                </div>
                                <form className="mt-5 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                    <Input isRequired type="email" label="Email" placeholder="member@sagamore.club" />
                                    <Input isRequired type="password" label="Password" placeholder="••••••••" />
                                    <div className="flex justify-end">
                                        <Button color="link-color" size="sm">
                                            Forgot password?
                                        </Button>
                                    </div>
                                    <Button type="submit" size="lg" className="w-full" onClick={close}>
                                        Sign in
                                    </Button>
                                </form>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Signup 02: a create-account modal with social sign-up and the member form. */
export const Signup02: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="primary">Sign up</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <TfLogo className="h-9 w-auto" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-5 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Create your account</h2>
                                    <p className="text-sm text-tertiary">Join Sagamore to book tee times and track your rounds.</p>
                                </div>
                                <form className="mt-5 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                    <Input isRequired label="Name" placeholder="Enter your name" />
                                    <Input isRequired type="email" label="Email" placeholder="you@example.com" />
                                    <Input isRequired type="password" label="Password" placeholder="Create a password" hint="Must be at least 8 characters." />
                                    <Button type="submit" size="lg" className="w-full" onClick={close}>
                                        Create account
                                    </Button>
                                </form>
                                <div className="my-5 flex items-center gap-3">
                                    <span className="h-px flex-1 bg-border-secondary" />
                                    <span className="text-sm text-tertiary">or</span>
                                    <span className="h-px flex-1 bg-border-secondary" />
                                </div>
                                <SocialButton social="google" theme="color" className="w-full">
                                    Sign up with Google
                                </SocialButton>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Verification code: six-digit code entry inside a modal. */
export const VerificationCode: Story = {
    render: () => (
        <DialogTrigger>
            <Button color="primary">Enter code</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog className="max-w-110 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                        {({ close }) => (
                            <div className="flex flex-col items-center text-center">
                                <div className="flex w-full items-start justify-between gap-4">
                                    <FeaturedIcon icon={Mail01} color="gray" theme="modern" size="lg" />
                                    <CloseButton onPress={close} label="Close" />
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Enter verification code</h2>
                                    <p className="text-sm text-tertiary">
                                        We sent a 6-digit code to <span className="font-medium text-secondary">olivia@sagamore.golf</span>.
                                    </p>
                                </div>
                                <PinInput size="xs" className="mt-6 items-center">
                                    <PinInput.Group maxLength={6} containerClassName="justify-center">
                                        <PinInput.Slot index={0} />
                                        <PinInput.Slot index={1} />
                                        <PinInput.Slot index={2} />
                                        <PinInput.Slot index={3} />
                                        <PinInput.Slot index={4} />
                                        <PinInput.Slot index={5} />
                                    </PinInput.Group>
                                </PinInput>
                                <Button size="lg" color="primary" className="mt-6 w-full" onClick={close}>
                                    Verify
                                </Button>
                                <p className="mt-5 text-sm text-tertiary">
                                    Didn&apos;t receive a code?{" "}
                                    <Button color="link-color" className="align-baseline">
                                        Click to resend
                                    </Button>
                                </p>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};
