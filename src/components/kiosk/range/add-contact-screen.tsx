"use client";

import type { DeliveryChannel } from "@/components/kiosk/range/ball-code-screen";
import { formatPhoneInput, isValidEmail, isValidPhone } from "@/components/kiosk/range/contact";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";

/**
 * "Text me my ball code" / "Email me my ball code". The numeric keypad for a
 * phone, the email layout for an address; Send stays off until the entry is
 * valid, so a half-typed number never gets a code sent nowhere.
 */
export const AddContactScreen = ({
    channel,
    value,
    onChange,
    onBack,
    onSend,
}: {
    channel: DeliveryChannel;
    value: string;
    onChange: (next: string) => void;
    onBack: () => void;
    onSend: () => void;
}) => {
    const isText = channel === "text";
    return (
        <EntryScreen
            title={isText ? "Text me my ball code" : "Email me my ball code"}
            subtitle={isText ? "We'll text your code to this number." : "We'll email your code to this address."}
            field={<EntryTextField value={value} placeholder={isText ? "Enter your phone number" : "Enter your email"} />}
            value={value}
            onChange={(next) => onChange(isText ? formatPhoneInput(next) : next)}
            layout={isText ? "numeric" : "email"}
            continueLabel="Send"
            isContinueDisabled={isText ? !isValidPhone(value) : !isValidEmail(value)}
            onBack={onBack}
            onContinue={onSend}
        />
    );
};
