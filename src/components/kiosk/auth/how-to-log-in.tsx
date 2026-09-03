"use client";

import { cx } from "@/utils/cx";

interface HowToLogInProps {
    onDismiss?: () => void;
    className?: string;
}

const STEPS = [
    { title: "Open your TenFore Golf Wallet ID", asset: "app-wallet-screenshot", note: "Download the TenFore Golf App" },
    { title: "Scan your code at the kiosk below", asset: "kiosk-scan-illustration" },
    { title: "Check out products from your proshop and book a tee time.", asset: "tenfore-logo-lockup" },
];

/**
 * The "How to log in" explainer.
 *
 * Reached from the drawer or the scan prompt, for the member who has the app
 * but has never used a kiosk. Three steps, numbered, each paired with an image —
 * a standing user reading at arm's length gets almost nothing from prose.
 */
export const HowToLogIn = ({ onDismiss, className }: HowToLogInProps) => (
    <div className={cx("flex h-full flex-col items-center px-16 pt-14", className)}>
        <div data-placeholder-asset="tenfore-mark" className="mb-6 flex size-12 items-center justify-center rounded-full text-brand-secondary ring-2 ring-brand">
            <span className="text-base font-bold">TF</span>
        </div>

        <h1 className="text-5xl font-bold text-primary">How to log in</h1>

        <ol className="mt-12 flex w-full flex-col gap-10">
            {STEPS.map((step, index) => (
                <li key={step.title} className="flex items-center gap-6">
                    <span
                        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-primary text-2xl font-bold text-brand-secondary"
                        aria-hidden="true"
                    >
                        {index + 1}
                    </span>

                    <div className="flex flex-1 flex-col gap-1">
                        <p className="text-2xl font-semibold text-primary">{step.title}</p>
                        {step.note && <p className="text-base text-tertiary">{step.note}</p>}
                    </div>

                    <div
                        data-placeholder-asset={step.asset}
                        aria-hidden="true"
                        className="size-28 shrink-0 rounded-full bg-secondary ring-1 ring-border-secondary"
                    />
                </li>
            ))}
        </ol>

        <button
            type="button"
            onClick={onDismiss}
            className="mt-14 h-20 w-[300px] rounded-xl text-xl font-semibold text-primary ring-1 ring-border-primary ring-inset transition duration-100 ease-linear active:bg-secondary"
        >
            Ok, I got it
        </button>
    </div>
);
