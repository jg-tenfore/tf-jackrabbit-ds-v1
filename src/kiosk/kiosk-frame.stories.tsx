import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KioskHeader } from "@/components/kiosk/nav/kiosk-header";
import { KIOSK_HEIGHT, KIOSK_WIDTH } from "@/kiosk/constants";
import { KioskFrame, KioskScreen } from "@/kiosk/kiosk-frame";
import { referenceExport } from "@/kiosk/story-helpers";

const meta = {
    title: "Kiosk Core/Kiosk Frame",
    component: KioskFrame,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `Every screen in \`references/flows\` is exported at exactly ${KIOSK_WIDTH}x${KIOSK_HEIGHT}, so that is the coordinate space we author against — an element at x=64 in Figma sits at x=64 here, which makes side-by-side QA pixel-exact. Physical panels are larger, so \`KioskFrame\` transform-scales the canvas to fill them rather than reflowing. Scale is uniform (never stretched); 750x1298 and 1080x1920 differ slightly in aspect, so the leftover axis letterboxes.`,
            },
        },
    },
    argTypes: {
        target: { control: "inline-radio", options: ["design", "fhd", "tall"] },
        chrome: { control: "boolean" },
    },
} satisfies Meta<typeof KioskFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoScreen = () => (
    <KioskScreen header={<KioskHeader variant="solid" />}>
        <div className="flex h-full flex-col items-center justify-center gap-4 p-16 text-center">
            <p className="text-4xl font-bold text-primary">
                {KIOSK_WIDTH} x {KIOSK_HEIGHT}
            </p>
            <p className="text-lg text-tertiary">Author against this canvas. The frame handles the panel.</p>
        </div>
    </KioskScreen>
);

/** 1:1 with the Figma exports — the default for component QA. */
export const DesignCanvas: Story = {
    args: { target: "design", children: null },
    render: (args) => (
        <KioskFrame {...args}>
            <DemoScreen />
        </KioskFrame>
    ),
};

/** Same markup, scaled to the most common portrait kiosk panel. */
export const FullHdPanel: Story = {
    args: { target: "fhd", children: null },
    render: (args) => (
        <KioskFrame {...args}>
            <DemoScreen />
        </KioskFrame>
    ),
};

/** Bezel and shadow, for reviewing a screen as it appears in situ. */
export const WithChrome: Story = {
    args: { target: "design", chrome: true, children: null },
    render: (args) => (
        <KioskFrame {...args}>
            <DemoScreen />
        </KioskFrame>
    ),
};

/**
 * Pixel-diff harness. `overlaySrc` lays a reference export over the built
 * screen in `mix-blend-difference` — anything that lines up goes black, so
 * misalignment is the only thing you see.
 */
export const ReferenceOverlay: Story = {
    args: {
        target: "design",
        overlaySrc: referenceExport("0-0-Homescreen/Kiosk.png"),
        children: null,
    },
    render: (args) => (
        <KioskFrame {...args}>
            <DemoScreen />
        </KioskFrame>
    ),
};
