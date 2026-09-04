import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "JackRabbit Kiosk Design System",
    description: "Component library for the TenFore Golf self-service kiosk.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="font-body text-primary antialiased">{children}</body>
        </html>
    );
}
