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
                order: ["Introduction", "Foundations", "Kiosk Core", ["Kiosk Frame", "Keyboard", "Global Nav", "Authentication"], "Components", "Screens"],
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
