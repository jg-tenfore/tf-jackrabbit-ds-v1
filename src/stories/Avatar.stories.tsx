import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Building05, Flag03, User01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { AvatarProfilePhoto } from "@/components/base/avatar/avatar-profile-photo";
import { AvatarAddButton } from "@/components/base/avatar/base-components/avatar-add-button";
import { AvatarCompanyIcon } from "@/components/base/avatar/base-components/avatar-company-icon";
import { GOLFERS } from "@/data/sagamore";

const OLIVIA = "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80";
const PHOENIX = "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80";
const LANA = "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80";

/**
 * Avatars represent golfers in a group booking — the foursome on a tee time,
 * the member profile, the playing partners on a saved round. We lead with
 * initials (monochromatic, no photos required), but the same component takes
 * a photo, an icon, a status dot, a verified tick, or a company badge.
 */
const meta = {
    title: "Components/Media & Visuals/Avatar",
    component: Avatar,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
        status: { control: "inline-radio", options: [undefined, "online", "offline"] },
        verified: { control: "boolean" },
        border: { control: "boolean" },
        rounded: { control: "boolean" },
        initials: { control: "text" },
        src: { control: "text" },
    },
    args: {
        size: "md",
        initials: "MA",
        alt: "Marcus Avery",
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every size from xs through 2xl, the full ladder used across the club app. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex items-center gap-3">
            <Avatar {...args} size="xs" />
            <Avatar {...args} size="sm" />
            <Avatar {...args} size="md" />
            <Avatar {...args} size="lg" />
            <Avatar {...args} size="xl" />
            <Avatar {...args} size="2xl" />
        </div>
    ),
};

/** A member photo when one is on file, falling back to initials or the default icon. */
export const Variants: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar size="lg" src={OLIVIA} alt="Olivia Rhye" />
            <Avatar size="lg" initials="MA" alt="Marcus Avery" />
            <Avatar size="lg" placeholderIcon={Flag03} alt="House player" />
            <Avatar size="lg" alt="Empty profile" />
        </div>
    ),
};

/** On the tee sheet, a green dot marks members who are checked in and ready to play. */
export const WithStatus: Story = {
    render: (args) => (
        <div className="flex items-center gap-3">
            <Avatar {...args} src={OLIVIA} alt="Olivia Rhye" status="online" />
            <Avatar {...args} initials="PR" alt="Priya Raghavan" status="offline" />
        </div>
    ),
};

/** Verified members — those with a confirmed club account — earn a blue tick. */
export const Verified: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Avatar size="xs" src={PHOENIX} alt="Phoenix Baker" verified />
            <Avatar size="sm" src={PHOENIX} alt="Phoenix Baker" verified />
            <Avatar size="md" src={PHOENIX} alt="Phoenix Baker" verified />
            <Avatar size="lg" src={PHOENIX} alt="Phoenix Baker" verified />
            <Avatar size="xl" src={PHOENIX} alt="Phoenix Baker" verified />
        </div>
    ),
};

/** A custom badge slot — here a company crest for a corporate-outing guest. */
export const WithBadge: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar
                size="lg"
                src={LANA}
                alt="Lana Steiner"
                badge={<AvatarCompanyIcon size="lg" src={OLIVIA} alt="Sponsoring club" />}
            />
            <Avatar
                size="lg"
                initials="DW"
                alt="Dale Whitmore"
                badge={
                    <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-primary ring-[1.5px] ring-bg-primary">
                        <Building05 className="size-3 text-fg-quaternary" />
                    </span>
                }
            />
        </div>
    ),
};

/** Avatar paired with a member's name and email — the standard roster row. */
export const LabelGroup: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <AvatarLabelGroup size="sm" src={OLIVIA} alt="Olivia Rhye" title="Olivia Rhye" subtitle="olivia@sagamore.club" />
            <AvatarLabelGroup size="md" initials="MA" alt="Marcus Avery" title="Marcus Avery" subtitle="Handicap 8.4 · Member" />
            <AvatarLabelGroup size="lg" src={LANA} alt="Lana Steiner" title="Lana Steiner" subtitle="lana@sagamore.club" status="online" />
        </div>
    ),
};

/** Large profile-photo treatment for the member account page. */
export const ProfilePhoto: Story = {
    render: () => (
        <div className="flex items-end gap-6">
            <AvatarProfilePhoto size="sm" src={OLIVIA} alt="Olivia Rhye" />
            <AvatarProfilePhoto size="md" src={PHOENIX} alt="Phoenix Baker" verified />
            <AvatarProfilePhoto size="lg" src={LANA} alt="Lana Steiner" status="online" />
        </div>
    ),
};

/** Profile photo fallbacks — initials and the default placeholder icon. */
export const ProfilePhotoPlaceholders: Story = {
    render: () => (
        <div className="flex items-end gap-6">
            <AvatarProfilePhoto size="md" initials="MA" alt="Marcus Avery" />
            <AvatarProfilePhoto size="md" placeholderIcon={User01} alt="New member" />
        </div>
    ),
};

/** The foursome on a championship tee time, drawn from Sagamore data. */
export const Foursome: Story = {
    render: () => (
        <div className="flex items-center -space-x-2">
            {GOLFERS.map((golfer) => (
                <div key={golfer.id} className="rounded-full ring-2 ring-white">
                    <Avatar size="md" initials={golfer.initials} alt={golfer.name} />
                </div>
            ))}
        </div>
    ),
};

/** A stacked group with an overflow count and an add-button to invite playing partners. */
export const AvatarGroup: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
                <Avatar size="md" src={OLIVIA} alt="Olivia Rhye" className="ring-2 ring-bg-primary" />
                <Avatar size="md" src={PHOENIX} alt="Phoenix Baker" className="ring-2 ring-bg-primary" />
                <Avatar size="md" src={LANA} alt="Lana Steiner" className="ring-2 ring-bg-primary" />
                <Avatar size="md" initials="+5" alt="Five more golfers" className="ring-2 ring-bg-primary" />
            </div>
            <AvatarAddButton size="md" title="Invite a playing partner" />
        </div>
    ),
};

/** A pending-invite avatar using the error-colored count badge for outstanding RSVPs. */
export const WithCount: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar size="lg" src={OLIVIA} alt="Olivia Rhye" count={3} />
            <Avatar size="lg" initials="PR" alt="Priya Raghavan" count={8} />
        </div>
    ),
};
