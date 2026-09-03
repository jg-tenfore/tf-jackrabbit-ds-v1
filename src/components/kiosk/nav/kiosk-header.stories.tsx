import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KioskHeader } from "@/components/kiosk/nav/kiosk-header";

const meta = {
    title: "Kiosk Core/Global Nav/Header",
    component: KioskHeader,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "The persistent top rail: brand mark left, live conditions right. Conditions are the one piece of ambient information the kiosk always shows — a golfer checks the weather before anything else. `over` floats it on a hero image; `solid` gives it an opaque bar for content screens.",
            },
        },
    },
    argTypes: {
        variant: { control: "inline-radio", options: ["over", "solid"] },
        temperature: { control: { type: "number", min: -20, max: 120 } },
        windSummary: { control: "text" },
    },
} satisfies Meta<typeof KioskHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Floated over the hero photograph, as on the Welcome and Home screens. */
export const OverHero: Story = {
    args: { variant: "over", temperature: 74, windSummary: "12mph NE" },
    render: (args) => (
        <div className="w-[750px] bg-gradient-to-b from-[#1d2b1f] to-[#3f5a3d] pb-16" data-placeholder-asset="course-hero-photo">
            <KioskHeader {...args} />
        </div>
    ),
};

/** Opaque bar for content screens where there is no hero behind it. */
export const Solid: Story = {
    args: { variant: "solid", temperature: 74, windSummary: "12mph NE" },
    render: (args) => (
        <div className="w-[750px] bg-primary">
            <KioskHeader {...args} />
        </div>
    ),
};
