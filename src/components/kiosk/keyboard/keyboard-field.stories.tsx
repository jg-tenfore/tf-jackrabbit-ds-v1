import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KeyboardField } from "@/components/kiosk/keyboard/keyboard-field";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Keyboard/Keyboard Field",
    component: KeyboardField,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "The composition screens actually use. It exists because the display and the keyboard have to agree — a phone field shows `(555) 123-4567` while storing `5551234567`, and an email field is worth ~15 keypresses of one-tap domain completion. Wiring that per call site would guarantee it drifts. The display is deliberately not a real `<input>`: there is no native keyboard to summon, and a focused input would fight the on-screen keys for focus while risking the OS keyboard covering the UI.",
            },
        },
    },
    argTypes: { kind: { control: "inline-radio", options: ["text", "email", "phone", "numeric"] } },
} satisfies Meta<typeof KeyboardField>;

export default meta;
type Story = StoryObj<typeof meta>;

const Harness = (props: Partial<Parameters<typeof KeyboardField>[0]>) => {
    const [value, setValue] = useState("");
    return (
        <KioskScreen>
            <div className="py-10">
                <KeyboardField label="Full name" value={value} onChange={setValue} onSubmit={() => {}} {...props} />
            </div>
        </KioskScreen>
    );
};

/** Free text — name entry for a tee time or a waitlist. */
export const Text: Story = {
    args: { label: "Full name", value: "", onChange: () => {} },
    decorators: [withKioskFrame()],
    render: () => <Harness label="Full name" placeholder="Enter your name" kind="text" />,
};

/** Type past the `@` — domain chips appear and complete the address in one tap. */
export const Email: Story = {
    args: { label: "Email", value: "", onChange: () => {} },
    decorators: [withKioskFrame()],
    render: () => (
        <Harness label="Email address" kind="email" placeholder="you@example.com" hint="Type the @ to see one-tap domain completions." />
    ),
};

/** Numeric pad with progressive formatting; the shape confirms the digit count. */
export const Phone: Story = {
    args: { label: "Phone", value: "", onChange: () => {} },
    decorators: [withKioskFrame()],
    render: () => <Harness label="Mobile number" kind="phone" placeholder="(555) 123-4567" hint="We'll text you when your table is ready." />,
};

/** Error state — the display ring and the message share one invalid signal. */
export const Invalid: Story = {
    args: { label: "Email", value: "", onChange: () => {} },
    decorators: [withKioskFrame()],
    render: function InvalidField() {
        const [value, setValue] = useState("justin@");
        return (
            <KioskScreen>
                <div className="py-10">
                    <KeyboardField
                        label="Email address"
                        kind="email"
                        value={value}
                        onChange={setValue}
                        errorMessage="Enter a complete email address."
                        onSubmit={() => {}}
                    />
                </div>
            </KioskScreen>
        );
    },
};
