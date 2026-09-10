"use client";

import { type ReactNode, useEffect, useState } from "react";
import { KIOSK_HEIGHT, KIOSK_WIDTH } from "@/kiosk/constants";
import { KioskFrame } from "@/kiosk/kiosk-frame";

/**
 * Fits the kiosk panel into whatever window the prototype is opened in.
 *
 * `KioskFrame` already scales the design canvas onto a physical panel, but a
 * panel is a fixed size and a browser window is not: at 1298px tall the canvas
 * is taller than most laptop viewports, so without this the checkout button
 * sits below the fold on the machine every stakeholder will actually review it
 * on. One more uniform scale on the outside solves that, and composing two
 * scales is preferable to teaching the frame about viewports — the frame models
 * hardware, and a browser window is not hardware.
 *
 * `design` is the target on purpose. Scaling 750→1080→window would compound two
 * factors for no gain when the second one can just land on the window directly.
 *
 * Deliberately uncapped, so a real kiosk running this in fullscreen fills its
 * panel rather than floating at 750px in the middle of it. Nothing here is
 * raster, so scaling up stays sharp.
 */
export const PrototypeViewport = ({ children }: { children: ReactNode }) => {
    // Starts at 0 and paints nothing: a first frame at scale 1 would flash a
    // clipped canvas before the measurement lands.
    const [scale, setScale] = useState(0);

    useEffect(() => {
        const fit = () => setScale(Math.min(window.innerWidth / KIOSK_WIDTH, window.innerHeight / KIOSK_HEIGHT));
        fit();
        window.addEventListener("resize", fit);
        return () => window.removeEventListener("resize", fit);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
            <div
                className="shrink-0 origin-center"
                style={{ width: KIOSK_WIDTH, height: KIOSK_HEIGHT, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
            >
                <KioskFrame target="design">{children}</KioskFrame>
            </div>
        </div>
    );
};
