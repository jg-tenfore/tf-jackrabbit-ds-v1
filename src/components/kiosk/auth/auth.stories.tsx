import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowToLogIn } from "@/components/kiosk/auth/how-to-log-in";
import { ScanPrompt } from "@/components/kiosk/auth/scan-prompt";
import { CodeInput } from "@/components/kiosk/keyboard/code-input";
import { OnScreenKeyboard } from "@/components/kiosk/keyboard/on-screen-keyboard";
import { KioskFooterBar } from "@/components/kiosk/nav/kiosk-footer-bar";
import { EXPIRED_WALLET_CODE } from "@/data/members";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";
import { useKioskSession } from "@/providers/kiosk-session";

const meta = {
    title: "Kiosk Core/Authentication/Scan Prompt",
    component: ScanPrompt,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "The deliberate decision point in the flow: a member scans, everyone else declines. Both paths are equal-weight buttons rather than a primary/secondary pair — declining is a legitimate choice at a kiosk, and styling it as the lesser option pressures guests who have no pass. The scan itself is simulated by `KioskSessionProvider`; tap the illustration or the green drawer to run it.",
            },
        },
    },
} satisfies Meta<typeof ScanPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Resting state. Tap the illustration to run the simulated scan. */
export const Default: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: (args) => (
        <KioskScreen footer={<KioskFooterBar />}>
            <ScanPrompt {...args} onHowToLogIn={() => {}} onEnterCode={() => {}} onDecline={() => {}} />
        </KioskScreen>
    ),
};

/** An expired pass resolves to the error treatment rather than a silent no-op. */
export const ExpiredPass: Story = {
    args: {},
    decorators: [withKioskSession({ defaultWalletCode: EXPIRED_WALLET_CODE }), withKioskFrame()],
    render: (args) => (
        <KioskScreen footer={<KioskFooterBar />}>
            <ScanPrompt {...args} onHowToLogIn={() => {}} onEnterCode={() => {}} onDecline={() => {}} />
        </KioskScreen>
    ),
};

/** The three-step explainer, reached from "How do I Log In?". */
export const HowToLogInSheet: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen footer={<KioskFooterBar />}>
            <HowToLogIn onDismiss={() => {}} />
        </KioskScreen>
    ),
};

/**
 * Manual-entry fallback for a member whose pass won't read. Type **482913** to
 * resolve to a real fixture; anything else falls through to the invalid state.
 */
export const EnterCodeFallback: Story = {
    args: {},
    decorators: [withKioskSession(), withKioskFrame()],
    render: function CodeFallback() {
        return (
            <KioskScreen footer={<KioskFooterBar />}>
                <CodeEntryBody />
            </KioskScreen>
        );
    },
};

const CodeEntryBody = () => {
    const { submitManualCode, member } = useKioskSession();
    const [value, setValue] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);

    const handleContinue = () => {
        const ok = submitManualCode(value);
        setIsInvalid(!ok);
        if (!ok) setValue("");
    };

    return (
        <div className="flex h-full flex-col items-center px-8 pt-14 text-center">
            <h1 className="text-5xl font-bold text-primary">Enter your code</h1>
            <p className="mt-5 max-w-[540px] text-lg text-tertiary">
                Enter your 6-digit code using the TenFore Golf app and earn points for your next tee time.
            </p>

            <div className="mt-8 w-full px-8">
                <CodeInput value={value} length={6} isInvalid={isInvalid} />
            </div>

            <div className="mt-8 w-full px-2">
                <OnScreenKeyboard
                    value={value}
                    onChange={(next) => {
                        setValue(next);
                        setIsInvalid(false);
                    }}
                    maxLength={6}
                />
            </div>

            <div className="mt-8 flex w-full gap-4 px-8">
                <button
                    type="button"
                    className="h-20 flex-1 rounded-xl text-xl text-tertiary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
                >
                    Go Back
                </button>
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={value.length < 6}
                    className="h-20 flex-1 rounded-xl bg-brand-solid text-xl font-semibold text-white transition duration-100 ease-linear active:bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Continue
                </button>
            </div>

            {member && <p className="mt-6 text-lg font-semibold text-success-primary">Signed in as {member.firstName}</p>}
        </div>
    );
};
