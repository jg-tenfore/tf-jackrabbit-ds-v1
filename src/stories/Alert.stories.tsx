import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircle, AlertTriangle, CalendarCheck01, CheckCircle, InfoCircle, Tool01 } from "@untitledui/icons";
import { Alert } from "@/components/application/alerts/alert";
import { Button } from "@/components/base/buttons/button";

/**
 * Alerts surface time-sensitive course news to golfers — a confirmed tee time,
 * an aeration closure, or a failed payment. They lead with a featured icon, pair
 * a title with supporting text, and can carry inline actions or a dismiss
 * button. The monochromatic theme renders the `brand`/`gray` colors in greyscale
 * while success, warning, and error keep their hues so intent stays legible.
 */
const meta = {
    title: "Components/Feedback & Status/Alerts",
    component: Alert,
    parameters: { layout: "centered" },
    argTypes: {
        color: { control: "select", options: ["gray", "brand", "success", "warning", "error"] },
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default alert: tweak color, theme, title, and description live. */
export const Playground: Story = {
    args: {
        color: "success",
        icon: CalendarCheck01,
        title: "Tee time confirmed",
        description: "You're booked on the Championship at 7:10 AM Saturday. A cart is included — arrive 20 minutes early.",
    },
    render: (args) => (
        <div className="w-[28rem]">
            <Alert {...args} />
        </div>
    ),
};

/** One alert per color, showing the full intent spectrum on the tee sheet. */
export const Colors: Story = {
    render: () => (
        <div className="flex w-[28rem] flex-col gap-4">
            <Alert color="brand" icon={InfoCircle} title="New booking window open" description="Members can now reserve tee times seven days ahead." />
            <Alert color="gray" icon={CalendarCheck01} title="Round added to your calendar" description="We sent an invite to your inbox for Saturday morning." />
            <Alert color="success" icon={CheckCircle} title="Tee time confirmed" description="You're on the Championship at 7:10 AM. See you at the first tee." />
            <Alert
                color="warning"
                icon={Tool01}
                title="Course closed for aeration"
                description="The back nine is closed through Friday while greens recover. Front nine play continues as scheduled."
            />
            <Alert color="error" icon={AlertCircle} title="Payment failed" description="We couldn't charge your card for the Saturday booking. Update your payment method to hold the slot." />
        </div>
    ),
};

/** A warning with inline actions plus a dismiss button — the closure with next steps. */
export const WithActions: Story = {
    render: () => (
        <div className="w-[28rem]">
            <Alert
                color="warning"
                icon={AlertTriangle}
                title="Course closed for aeration"
                description="The Championship greens are being aerated this week. Want to play the Executive instead, or rebook for next weekend?"
                onClose={() => console.log("alert dismissed")}
                actions={
                    <>
                        <Button size="sm" color="link-gray">
                            Dismiss
                        </Button>
                        <Button size="sm" color="link-color">
                            View open tee times
                        </Button>
                    </>
                }
            />
        </div>
    ),
};

/** Dismissible error: a failed payment the golfer can clear once resolved. */
export const Dismissible: Story = {
    render: () => (
        <div className="w-[28rem]">
            <Alert
                color="error"
                icon={AlertCircle}
                title="Payment failed"
                description="Your card was declined for the Saturday 7:10 AM booking. We'll hold the slot for 10 minutes while you retry."
                onClose={() => console.log("alert dismissed")}
                closeLabel="Dismiss payment alert"
            />
        </div>
    ),
};

/** Minimal: no leading icon, just a title and a line of supporting text. */
export const Minimal: Story = {
    render: () => (
        <div className="w-[28rem]">
            <Alert
                icon={false}
                color="gray"
                title="Frost delay in effect"
                description="The first tee is held until 7:30 AM while the greens thaw. Grab a coffee in the clubhouse."
            />
        </div>
    ),
};
