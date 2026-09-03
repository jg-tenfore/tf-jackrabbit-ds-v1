import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { TfLogo } from "@/components/foundations/logo/tf-logo";
import { TfLogoMark } from "@/components/foundations/logo/tf-logo-mark";

/**
 * The Tenfore logo. The full-colour mark (green leaf + black lettering) is the
 * default; monochrome `black` and `white` variants cover light and dark
 * surfaces where the colour mark can't be used.
 */
const meta = {
    title: "Foundations/Logos",
    component: TfLogo,
    parameters: { layout: "fullscreen" },
    argTypes: {
        variant: { control: "inline-radio", options: ["color", "black", "white"] },
    },
} satisfies Meta<typeof TfLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

const Card = ({ children, caption, className }: { children: ReactNode; caption: string; className?: string }) => (
    <div className="space-y-3">
        <div className={`flex items-center justify-center rounded-xl p-8 ring-1 ring-border-secondary ${className ?? ""}`}>{children}</div>
        <p className="text-xs text-tertiary">{caption}</p>
    </div>
);

const Page = ({ children }: { children: ReactNode }) => <div className="space-y-8 bg-primary p-8 text-primary">{children}</div>;

/** The full-colour logo across sizes. */
export const Full: Story = {
    render: () => (
        <Page>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Card caption="Color — h-8">
                    <TfLogo variant="color" className="h-8 w-auto" />
                </Card>
                <Card caption="Color — h-10">
                    <TfLogo variant="color" className="h-10 w-auto" />
                </Card>
                <Card caption="Color — h-12">
                    <TfLogo variant="color" className="h-12 w-auto" />
                </Card>
            </div>
        </Page>
    ),
};

/** Monochrome treatments — black for light surfaces, white for dark. */
export const Monochrome: Story = {
    render: () => (
        <Page>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card caption="Black — on bg-primary" className="bg-primary">
                    <TfLogo variant="black" className="h-10 w-auto" />
                </Card>
                <Card caption="White — on bg-primary-solid" className="bg-primary-solid">
                    <TfLogo variant="white" className="h-10 w-auto" />
                </Card>
            </div>
        </Page>
    ),
};

/** The icon-only mark (square) across variants and sizes — for collapsed nav, favicons, avatars. */
export const IconMark: Story = {
    render: () => (
        <Page>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Card caption="Color — size-12" className="bg-primary">
                    <TfLogoMark variant="color" className="size-12" />
                </Card>
                <Card caption="Black — size-12" className="bg-primary">
                    <TfLogoMark variant="black" className="size-12" />
                </Card>
                <Card caption="White — size-12 on bg-primary-solid" className="bg-primary-solid">
                    <TfLogoMark variant="white" className="size-12" />
                </Card>
            </div>
            <div className="flex flex-wrap items-end gap-6">
                <Card caption="size-6" className="bg-primary">
                    <TfLogoMark variant="color" className="size-6" />
                </Card>
                <Card caption="size-8" className="bg-primary">
                    <TfLogoMark variant="color" className="size-8" />
                </Card>
                <Card caption="size-10" className="bg-primary">
                    <TfLogoMark variant="color" className="size-10" />
                </Card>
                <Card caption="size-16" className="bg-primary">
                    <TfLogoMark variant="color" className="size-16" />
                </Card>
            </div>
        </Page>
    ),
};

/** The logo reading on dark surfaces — colour mark and white mono. */
export const OnDark: Story = {
    render: () => (
        <Page>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card caption="Color on bg-primary-solid" className="bg-primary-solid">
                    <TfLogo variant="color" className="h-10 w-auto" />
                </Card>
                <Card caption="White on bg-primary-solid" className="bg-primary-solid">
                    <TfLogo variant="white" className="h-10 w-auto" />
                </Card>
            </div>
        </Page>
    ),
};

/** The logo on light surfaces — colour mark and black mono. */
export const OnLight: Story = {
    render: () => (
        <Page>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card caption="Color on bg-primary" className="bg-primary">
                    <TfLogo variant="color" className="h-10 w-auto" />
                </Card>
                <Card caption="Black on bg-secondary" className="bg-secondary">
                    <TfLogo variant="black" className="h-10 w-auto" />
                </Card>
            </div>
        </Page>
    ),
};

/** Minimum clear space — keep padding equal to the mark height around the logo. */
export const Clearspace: Story = {
    render: () => (
        <Page>
            <div className="max-w-md">
                <Card caption="Minimum clear space — keep padding equal to the mark height" className="bg-primary p-16">
                    <div className="ring-1 ring-dashed ring-border-secondary">
                        <TfLogo variant="color" className="h-10 w-auto" />
                    </div>
                </Card>
            </div>
        </Page>
    ),
};

/** Every variant on its appropriate surface. */
export const AllLogos: Story = {
    render: () => (
        <Page>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Card caption="Color — bg-primary" className="bg-primary">
                    <TfLogo variant="color" className="h-10 w-auto" />
                </Card>
                <Card caption="Black — bg-primary" className="bg-primary">
                    <TfLogo variant="black" className="h-10 w-auto" />
                </Card>
                <Card caption="White — bg-primary-solid" className="bg-primary-solid">
                    <TfLogo variant="white" className="h-10 w-auto" />
                </Card>
                <Card caption="Mark · Color — bg-primary" className="bg-primary">
                    <TfLogoMark variant="color" className="size-10" />
                </Card>
                <Card caption="Mark · Black — bg-primary" className="bg-primary">
                    <TfLogoMark variant="black" className="size-10" />
                </Card>
                <Card caption="Mark · White — bg-primary-solid" className="bg-primary-solid">
                    <TfLogoMark variant="white" className="size-10" />
                </Card>
            </div>
        </Page>
    ),
};
