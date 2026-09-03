import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";

/**
 * `Form` is a thin wrapper over React Aria's `Form` that wires up native and
 * server-driven validation for the fields inside it. Here it powers the
 * Sagamore member sign-up — native HTML validation fires on submit.
 */
const meta = {
    title: "Components/Forms/Form",
    component: Form,
    parameters: { layout: "centered" },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A small booking-contact form. Submit with an empty field to see validation. */
export const Playground: Story = {
    render: () => (
        <Form onSubmit={(e) => e.preventDefault()} className="flex w-80 flex-col gap-4">
            <Input isRequired name="name" label="Full name" placeholder="Olivia Rhye" />
            <Input isRequired type="email" name="email" label="Email" placeholder="olivia@sagamore.golf" />
            <Button type="submit" className="mt-2">
                Reserve tee time
            </Button>
        </Form>
    ),
};

/** Validation behaviour set to native — the browser surfaces field errors. */
export const NativeValidation: Story = {
    render: () => (
        <Form validationBehavior="native" onSubmit={(e) => e.preventDefault()} className="flex w-80 flex-col gap-4">
            <Input isRequired name="member-id" label="Member ID" placeholder="SAG-00000" />
            <Input isRequired type="tel" name="phone" label="Phone" placeholder="(555) 000-0000" />
            <div className="mt-2 flex gap-3">
                <Button type="submit">Save</Button>
                <Button type="reset" color="secondary">
                    Reset
                </Button>
            </div>
        </Form>
    ),
};
