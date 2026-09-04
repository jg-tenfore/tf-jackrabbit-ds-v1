import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { MANUAL_ENTRY_CODES } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Screens/Entry",
    component: EntryScreen,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**Enter your code**, **Enter your email** and **Enter your name** are one layout with different fields, so they share a single \`EntryScreen\` template: brand mark, title, subtitle, field, keyboard, Go Back / Continue.

The field is a **slot**, not a \`type\` prop. The three fields have genuinely different shapes — six segmented cells, a wide pill, a free-text line — and expressing them through one union would push the differences *into* the template instead of removing them.

\`showSignInPanel\` follows the references: code and email keep the green scan panel because the user is mid-authentication and scanning is still a faster way out; **name entry drops it**, because by then they have chosen to continue as a guest and re-offering the scan reopens a settled decision.

Fields are display-only, like everywhere else in this kiosk — characters arrive from the on-screen keyboard, so a focused \`<input>\` would fight it for focus and risk the OS keyboard covering the UI.`,
            },
        },
    },
} satisfies Meta<typeof EntryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Six-digit member code. Try **482913** — it resolves to a real fixture. */
export const EnterYourCode: Story = {
    args: { title: "", field: null, value: "", onChange: () => {} },
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Code() {
        const [value, setValue] = useState("");
        const [isInvalid, setIsInvalid] = useState(false);
        return (
            <KioskScreen scroll={false} footer={<GlobalNav />}>
                <EntryScreen
                    title="Enter your code"
                    subtitle="Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time."
                    field={<CodeInput value={value} length={6} isMasked isInvalid={isInvalid} />}
                    value={value}
                    onChange={(next) => {
                        setValue(next);
                        setIsInvalid(false);
                    }}
                    maxLength={6}
                    isContinueDisabled={value.length < 6}
                    onContinue={() => setIsInvalid(!MANUAL_ENTRY_CODES[value])}
                    onBack={() => {}}
                    showSignInPanel
                    onHowToLogIn={() => {}}
                />
            </KioskScreen>
        );
    },
};

/** Email entry. The keyboard swaps to the layout carrying `@`, `.` and `.com`. */
export const EnterYourEmail: Story = {
    args: { title: "", field: null, value: "", onChange: () => {} },
    decorators: [withKioskSession(), withKioskFrame()],
    render: function Email() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false} footer={<GlobalNav />}>
                <EntryScreen
                    title="Enter your email"
                    subtitle="Enter your email address to get started."
                    field={<EntryTextField value={value} placeholder="you@example.com" />}
                    value={value}
                    onChange={setValue}
                    layout="email"
                    onContinue={() => {}}
                    onBack={() => {}}
                    showSignInPanel
                    onHowToLogIn={() => {}}
                />
            </KioskScreen>
        );
    },
};

/** Name entry — no sign-in panel, since guest checkout is already chosen. */
export const EnterYourName: Story = {
    args: { title: "", field: null, value: "", onChange: () => {} },
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

/** Rejected code — the cells and the ring share one invalid signal. */
export const InvalidCode: Story = {
    args: { title: "", field: null, value: "", onChange: () => {} },
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <EntryScreen
                title="Enter your code"
                subtitle="That code wasn't recognised. Check the app and try again."
                field={<CodeInput value="482911" length={6} isInvalid />}
                value="482911"
                onChange={() => {}}
                maxLength={6}
                onContinue={() => {}}
                onBack={() => {}}
                showSignInPanel
            />
        </KioskScreen>
    ),
};
