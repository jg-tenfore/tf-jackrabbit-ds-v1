import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "User Flows/Standby",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**\`references/flows/6-standbyUserflows\`** — not yet built.

The category exists so the flow has a place in the running order and the gap is visible rather than implied. The components this flow will be assembled from already live under **Components** — the booking pickers, date picker, step rail and keyboard — so building it is composition rather than new primitives.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Placeholder. The screens for this flow have not been built yet. */
export const NotYetBuilt: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav />}>
            <div className="flex h-full flex-col items-center justify-center gap-3 px-16 text-center">
                <p className="text-[28px] font-bold text-primary">Standby</p>
                <p className="text-[18px] text-tertiary">references/flows/6-standbyUserflows</p>
            </div>
        </KioskScreen>
    ),
};
