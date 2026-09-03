import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaymentInput } from "@/components/base/input/input-payment";

/**
 * Input Payment is the card field at green-fee checkout — it auto-detects the
 * card brand, spaces the digits in groups of four, and surfaces the brand mark
 * inside the field. Hairline border, ink focus ring, no fill.
 */
const meta = {
    title: "Components/Forms/Inputs/Input Payment",
    component: PaymentInput,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
        isDisabled: { control: "boolean" },
        isInvalid: { control: "boolean" },
    },
    args: {
        size: "md",
        label: "Card number",
        hint: "Charged when your group checks in at the starter.",
        placeholder: "1234 1234 1234 1234",
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PaymentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Pre-filled to show Visa auto-detection at the green-fee desk. */
export const VisaDetected: Story = {
    args: {
        label: "Card on file",
        defaultValue: "4111111111111111",
        hint: undefined,
    },
};

/** Required field at checkout. */
export const Required: Story = {
    args: {
        label: "Card number",
        isRequired: true,
        hint: "Required to hold the tee time.",
    },
};

/** Invalid — the card number was declined for the green fee. */
export const Invalid: Story = {
    args: {
        label: "Card number",
        defaultValue: "4000000000000002",
        isInvalid: true,
        hint: "That card was declined. Try another.",
    },
};

/** Disabled while the charge is being authorized. */
export const Disabled: Story = {
    args: {
        label: "Card number",
        defaultValue: "5500005555555559",
        isDisabled: true,
    },
};
