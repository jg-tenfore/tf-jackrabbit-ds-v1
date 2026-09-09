import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { MANUAL_ENTRY_CODES } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "Auth w Existing User",
    component: EntryScreen,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/1-1-User Account Authentication with Existing User\`** — a member who has an account but is not scanning it.

**Enter your code** and **Enter your email** are one layout with different fields, so they share a single \`EntryScreen\` template: brand mark, title, subtitle, field, keyboard, Go Back / Continue.

The field is a **slot**, not a \`type\` prop. The three fields have genuinely different shapes — six segmented cells, a wide pill, a free-text line — and expressing them through one union would push the differences *into* the template instead of removing them.

The green scan band belongs to **\`GlobalNav\`**, not to this template: \`<GlobalNav isPromptExpanded />\` draws the band and the matching short wallet drawer from one flag. The screens used to render the band themselves, which left the band open above a drawer still drawing its *collapsed* 214px card — two halves of one control in different states.

Code and email pass \`isPromptExpanded\` because the user is mid-authentication and scanning is still a faster way out; **name entry does not**, because by then they have chosen to continue as a guest and re-offering the scan reopens a settled decision.

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
            <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
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
            <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
                <EntryScreen
                    title="Enter your email"
                    subtitle="Enter your email address to get started."
                    field={<EntryTextField value={value} placeholder="you@example.com" />}
                    value={value}
                    onChange={setValue}
                    layout="email"
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
        <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
            <EntryScreen
                title="Enter your code"
                subtitle="That code wasn't recognised. Check the app and try again."
                field={<CodeInput value="482911" length={6} isInvalid />}
                value="482911"
                onChange={() => {}}
                maxLength={6}
                onContinue={() => {}}
                onBack={() => {}}
            />
        </KioskScreen>
    ),
};
