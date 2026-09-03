import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialButton } from "@/components/base/buttons/social-button";

/**
 * Social buttons let Sagamore members sign in to the tee-sheet with the account
 * they already use. Under the monochromatic theme, prefer the `gray` variant so
 * provider colors don't fight the near-black palette of the member sign-in
 * screen — though brand and color themes are available when a provider mark is
 * called for.
 */
const meta = {
    title: "Components/Actions/Social Button",
    component: SocialButton,
    parameters: { layout: "centered" },
    argTypes: {
        social: {
            control: "inline-radio",
            options: ["google", "facebook", "apple", "twitter", "figma", "dribble"],
        },
        theme: { control: "inline-radio", options: ["brand", "color", "gray"] },
        size: { control: "inline-radio", options: ["md", "lg"] },
        disabled: { control: "boolean" },
        children: { control: "text" },
    },
    args: {
        social: "google",
        theme: "gray",
        size: "lg",
        children: "Sign in with Google",
    },
} satisfies Meta<typeof SocialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every supported provider, gray theme, as they'd stack on the member sign-in screen. */
export const AllProviders: Story = {
    render: (args) => (
        <div className="grid grid-cols-2 gap-3">
            <SocialButton {...args} social="google">
                Sign in with Google
            </SocialButton>
            <SocialButton {...args} social="apple">
                Sign in with Apple
            </SocialButton>
            <SocialButton {...args} social="facebook">
                Sign in with Facebook
            </SocialButton>
            <SocialButton {...args} social="twitter">
                Sign in with X
            </SocialButton>
            <SocialButton {...args} social="figma">
                Sign in with Figma
            </SocialButton>
            <SocialButton {...args} social="dribble">
                Sign in with Dribbble
            </SocialButton>
        </div>
    ),
    args: { theme: "gray", children: undefined },
};

/** The three theme variants — brand (provider colors), color (colorful marks on gray), and gray (monochrome). */
export const Themes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-secondary">Brand</span>
                <div className="flex gap-3">
                    <SocialButton {...args} theme="brand" social="google">
                        Google
                    </SocialButton>
                    <SocialButton {...args} theme="brand" social="apple">
                        Apple
                    </SocialButton>
                    <SocialButton {...args} theme="brand" social="facebook">
                        Facebook
                    </SocialButton>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-secondary">Color</span>
                <div className="flex gap-3">
                    <SocialButton {...args} theme="color" social="google">
                        Google
                    </SocialButton>
                    <SocialButton {...args} theme="color" social="apple">
                        Apple
                    </SocialButton>
                    <SocialButton {...args} theme="color" social="facebook">
                        Facebook
                    </SocialButton>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-secondary">Gray</span>
                <div className="flex gap-3">
                    <SocialButton {...args} theme="gray" social="google">
                        Google
                    </SocialButton>
                    <SocialButton {...args} theme="gray" social="apple">
                        Apple
                    </SocialButton>
                    <SocialButton {...args} theme="gray" social="facebook">
                        Facebook
                    </SocialButton>
                </div>
            </div>
        </div>
    ),
    args: { children: undefined },
};

/** Both sizes — md and lg — including icon-only buttons (no children). */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <SocialButton {...args} size="md" social="google">
                    Sign in with Google
                </SocialButton>
                <SocialButton {...args} size="md" social="google" />
            </div>
            <div className="flex items-center gap-3">
                <SocialButton {...args} size="lg" social="google">
                    Sign in with Google
                </SocialButton>
                <SocialButton {...args} size="lg" social="google" />
            </div>
        </div>
    ),
    args: { theme: "gray", children: undefined },
};

/** A member signing in, disabled while the request is in flight. */
export const Disabled: Story = {
    args: {
        social: "google",
        theme: "gray",
        disabled: true,
        children: "Sign in with Google",
    },
};
