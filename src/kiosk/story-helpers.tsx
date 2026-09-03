import type { Decorator } from "@storybook/nextjs-vite";
import { KioskFrame } from "@/kiosk/kiosk-frame";
import type { KioskTarget } from "@/kiosk/constants";
import { KioskSessionProvider } from "@/providers/kiosk-session";
import type { Member } from "@/data/members";

/**
 * Story decorators for kiosk QA.
 *
 * Keeping these here (rather than inline in each story) means every component
 * is reviewed inside the exact same 750x1298 canvas, so a spacing regression
 * shows up as a real pixel difference rather than a story-setup difference.
 */

/** Render the story inside the kiosk canvas, optionally scaled to a real panel. */
export const withKioskFrame =
    (options: { target?: KioskTarget; chrome?: boolean; overlaySrc?: string } = {}): Decorator =>
    (Story) => (
        <KioskFrame {...options}>
            <Story />
        </KioskFrame>
    );

/** Provide a kiosk session. Pass a member to start from a signed-in state. */
export const withKioskSession =
    (options: { member?: Member | null; defaultWalletCode?: string } = {}): Decorator =>
    (Story) => (
        <KioskSessionProvider initialMember={options.member ?? null} defaultWalletCode={options.defaultWalletCode}>
            <Story />
        </KioskSessionProvider>
    );

/**
 * A reference export served from `references/flows` via staticDirs.
 * Use with `withKioskFrame({ overlaySrc })` to diff a build against its design.
 */
export const referenceExport = (path: string) => `/reference-flows/${path}`;
