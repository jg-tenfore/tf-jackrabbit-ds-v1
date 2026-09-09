import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Marquee } from "@/components/kiosk/marquee";

const meta = {
    title: "Components/Marquee",
    component: Marquee,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: `A continuously scrolling line of text, used on the attract screen.

Two identical tracks translate left by exactly their own width, so the moment the first leaves the viewport the second is where it started. That only holds while **one track is at least as wide as its container** — a short phrase leaves a gap that crosses the screen once per cycle, which the third example below shows deliberately.

Only the first track is announced; the second is the same sentence again. Motion stops entirely under \`prefers-reduced-motion\`, because a kiosk is a public screen someone cannot walk away from as easily as closing a tab.`,
            },
        },
    },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three lengths and speeds, including one deliberately too short. */
export const Playground: Story = {
    args: { items: [] },
    render: () => (
        <div className="flex w-[750px] flex-col gap-10 bg-primary-solid p-8">
            <div>
                <p className="mb-3 text-sm text-tertiary">Default — long enough to fill the track</p>
                <Marquee
                    items={["Trusted by over thousands of golfers nationwide", "Powering leagues, events, and daily play"]}
                    className="text-[30px] text-white/70"
                />
            </div>

            <div>
                <p className="mb-3 text-sm text-tertiary">Faster</p>
                <Marquee items={["Book a tee time", "Join the waitlist", "Order from the bar"]} durationMs={15000} className="text-[24px] text-white/70" />
            </div>

            <div>
                <p className="mb-3 text-sm text-tertiary">Too short — note the gap crossing once per cycle</p>
                <Marquee items={["Open today"]} className="text-[24px] text-white/70" />
            </div>
        </div>
    ),
};
