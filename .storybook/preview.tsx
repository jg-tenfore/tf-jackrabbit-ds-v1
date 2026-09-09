import type { Preview } from "@storybook/nextjs-vite";
import { RouterProvider } from "react-aria-components";
import { KIOSK_HEIGHT, KIOSK_WIDTH } from "../src/kiosk/constants";

// The full Untitled UI + Tailwind v4 pipeline. theme.css carries the TenFore
// green brand ramp, ported unchanged from the Buck design system.
import "../src/styles/globals.css";

const preview: Preview = {
    parameters: {
        layout: "centered",
        options: {
            storySort: {
                method: "alphabetical",
                order: [
                    "Introduction",
                    // Tokens first — everything below is expressed in them.
                    "Foundations",
                    ["Colors", "Typography", "Spacing", "Radius", "Border", "Effect Styles", "Touch Targets", "Icons", "Logos"],
                    // Every reusable part: the ported Untitled UI library plus
                    // the kiosk-native primitives, which sit first because they
                    // are what the flows below are actually assembled from.
                    "Components",
                    [
                        "Kiosk Frame",
                        "Kiosk Keyboard",
                        "Kiosk Overlays",
                        "Kiosk Booking",
                        "Kiosk Store",
                        "Marquee",
                        "Actions",
                        "Forms",
                        "Feedback & Status",
                        "Layout & Structure",
                        "Media & Visuals",
                        "Navigation",
                    ],
                    // Persistent chrome that frames every screen.
                    "App Chrome",
                    // The flows, in the order a guest meets them. Each is a
                    // folder in references/flows, and each story in it is one
                    // screen of that flow assembled from the components above —
                    // so a component change shows up in every screen that uses
                    // it, which is the whole point of keeping them separate.
                    "Welcome Screen",
                    "Interstitials",
                    "Auth w New User",
                    "Auth w Existing User",
                    "Order Sandwich",
                    "Order Sandwich Guest",
                    "Book Tee Time",
                    "Book Activity",
                    "Waitlist Reg",
                    "Standby",
                ],
            },
        },
        controls: {
            matchers: { color: /(background|color)$/i, date: /Date$/i },
        },
        a11y: { test: "todo" },
        // Every reference export is 750x1298, so that is the default viewport.
        viewport: {
            options: {
                kiosk: { name: "Kiosk design canvas (750x1298)", styles: { width: `${KIOSK_WIDTH}px`, height: `${KIOSK_HEIGHT}px` } },
                kioskFhd: { name: "Kiosk FHD (1080x1920)", styles: { width: "1080px", height: "1920px" } },
                kioskTall: { name: "Kiosk tall (1080x2560)", styles: { width: "1080px", height: "2560px" } },
            },
        },
        backgrounds: {
            options: {
                paper: { name: "Paper", value: "#ffffff" },
                canvas: { name: "Canvas", value: "#fafafa" },
                ink: { name: "Ink", value: "#161616" },
            },
        },
    },
    initialGlobals: {
        backgrounds: { value: "canvas" },
        viewport: { value: "kiosk", isRotated: false },
    },
    decorators: [
        // Kiosk screens have no browser to navigate, so swallow react-aria link
        // navigation rather than letting the preview iframe route away.
        (Story) => (
            <RouterProvider navigate={() => {}}>
                <div className="font-body text-primary antialiased">
                    <Story />
                </div>
            </RouterProvider>
        ),
    ],
};

export default preview;
