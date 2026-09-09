import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
    // This app *is* the prototype — Storybook is the sibling deploy at the root
    // and carries the design-system name. Naming both the same thing makes two
    // open tabs indistinguishable.
    title: "JackRabbit Kiosk Prototype",
    description: "Clickable prototype for the TenFore Golf self-service kiosk.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="font-body text-primary antialiased">{children}</body>
        </html>
    );
}
