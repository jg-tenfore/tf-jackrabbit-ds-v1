"use client";

import { type ReactNode, useState } from "react";
import { UNSAFE_PortalProvider } from "react-aria";
import { KIOSK_HEIGHT, KIOSK_TARGETS, KIOSK_WIDTH, type KioskTarget } from "@/kiosk/constants";
import { cx } from "@/utils/cx";

interface KioskFrameProps {
    children: ReactNode;
    /**
     * Which physical panel to render for. "design" (the default) renders the
     * canvas 1:1 at 750x1298 so exports can be diffed against it directly.
     */
    target?: KioskTarget;
    /** Draw a bezel + stand around the canvas, as the kiosk appears in situ. */
    chrome?: boolean;
    /** Overlay a reference export at 50% opacity to diff against. */
    overlaySrc?: string;
    className?: string;
}

/**
 * Wraps a kiosk screen in its fixed 750x1298 design canvas.
 *
 * The canvas is always laid out at 750x1298 CSS pixels — children never need to
 * know what panel they are on. To fill a larger physical screen we apply a
 * `scale()` transform and then reserve the *scaled* box in normal flow, so the
 * frame occupies the right space in Storybook's layout without the transform
 * leaking into sibling elements.
 *
 * Scaling (rather than reflowing) is deliberate: the reference designs are
 * pixel-specified, and a uniform scale preserves them exactly. 750x1298 and
 * 1080x1920 differ slightly in aspect (0.578 vs 0.563), so we scale by the
 * smaller axis ratio and letterbox the remainder rather than distorting.
 *
 * The frame is also the **portal container** for every React Aria overlay
 * inside it. By default they portal to `document.body`, which for a full-screen
 * modal means `absolute inset-0` resolves against the browser window instead of
 * the canvas: on a 900x1400 Storybook viewport the modal laid itself out at
 * 900x1400, pushing its footer 100px below the visible canvas and centring its
 * content on the wrong axis. Anchoring the portal here keeps overlays inside the
 * canvas they belong to, and inherits its scale transform on real panels.
 */
export const KioskFrame = ({ children, target = "design", chrome = false, overlaySrc, className }: KioskFrameProps) => {
    const { width: targetWidth, height: targetHeight } = KIOSK_TARGETS[target];
    // State rather than a ref: the container has to exist *before* an overlay
    // that is open on first paint reads it, and a ref set during commit does not
    // trigger the re-render that would let it.
    const [canvas, setCanvas] = useState<HTMLDivElement | null>(null);

    // Uniform scale — never stretch. The tighter axis wins so the canvas always
    // fits fully inside the panel; leftover space letterboxes as background.
    const scale = Math.min(targetWidth / KIOSK_WIDTH, targetHeight / KIOSK_HEIGHT);

    return (
        <div
            className={cx(
                "relative flex items-center justify-center overflow-hidden bg-primary",
                chrome && "rounded-[32px] bg-secondary-solid p-6 shadow-2xl",
                className,
            )}
            // The outer box reserves the real panel size in layout flow.
            style={{ width: targetWidth, height: targetHeight }}
            data-kiosk-frame
            data-kiosk-target={target}
        >
            <div
                className="relative shrink-0 overflow-hidden bg-primary"
                style={{
                    width: KIOSK_WIDTH,
                    height: KIOSK_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                }}
                data-kiosk-canvas
                ref={setCanvas}
            >
                <UNSAFE_PortalProvider getContainer={() => canvas}>{children}</UNSAFE_PortalProvider>

                {overlaySrc && (
                    <img
                        src={overlaySrc}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-50 mix-blend-difference"
                    />
                )}
            </div>
        </div>
    );
};

/**
 * The inner layout every kiosk screen uses: a fixed header rail, a scrollable
 * body, and a pinned footer rail. Screens supply the three slots; the frame
 * owns the geometry so headers and footers land identically on every screen.
 */
interface KioskScreenProps {
    header?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    /** Let the body scroll (default) or lock it for full-bleed screens. */
    scroll?: boolean;
    className?: string;
}

// overflow-x-hidden: a kiosk panel has no way to scroll sideways, so any
// horizontal overflow is a defect rather than something to expose.
export const KioskScreen = ({ header, footer, children, scroll = true, className }: KioskScreenProps) => (
    <div className={cx("flex h-full w-full flex-col overflow-x-hidden bg-primary", className)}>
        {header && <div className="relative z-20 shrink-0">{header}</div>}

        <div className={cx("relative min-h-0 flex-1", scroll ? "overflow-y-auto scrollbar-hide" : "overflow-hidden")}>{children}</div>

        {footer && <div className="relative z-30 shrink-0">{footer}</div>}
    </div>
);
