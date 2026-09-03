import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar, Flag06, SearchLg } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";

/**
 * EmptyState fills the quiet moments in the Sagamore booking flow — a tee sheet
 * with nothing open, a saved-rounds list before the member's first booking. It
 * is a compound component: compose `Header`, `FeaturedIcon`, `Content`, `Title`,
 * `Description`, and `Footer`. Monochromatic, so the featured icon stays `gray`.
 */
const meta = {
    title: "Components/Feedback & Status/EmptyState",
    component: EmptyState,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    },
    args: {
        size: "md",
    },
    render: (args) => (
        <EmptyState {...args}>
            <EmptyState.Header>
                <EmptyState.FeaturedIcon color="gray" icon={SearchLg} />
            </EmptyState.Header>
            <EmptyState.Content>
                <EmptyState.Title>No tee times available</EmptyState.Title>
                <EmptyState.Description>
                    There are no open slots on The Championship for this date. Try a
                    different day or join the waitlist.
                </EmptyState.Description>
            </EmptyState.Content>
            <EmptyState.Footer>
                <Button color="secondary" iconLeading={Calendar}>
                    Change date
                </Button>
                <Button color="primary">Join waitlist</Button>
            </EmptyState.Footer>
        </EmptyState>
    ),
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Before a member has booked anything — their saved rounds list is empty. */
export const SavedRounds: Story = {
    render: (args) => (
        <EmptyState {...args}>
            <EmptyState.Header>
                <EmptyState.FeaturedIcon color="gray" icon={Flag06} />
            </EmptyState.Header>
            <EmptyState.Content>
                <EmptyState.Title>No saved rounds yet</EmptyState.Title>
                <EmptyState.Description>
                    Your booked rounds at Sagamore will appear here. Reserve a tee
                    time to get started.
                </EmptyState.Description>
            </EmptyState.Content>
            <EmptyState.Footer>
                <Button color="primary">Book a tee time</Button>
            </EmptyState.Footer>
        </EmptyState>
    ),
};

/** Edge case: a footerless, minimal empty state — just icon, title, copy. */
export const MinimalNoFooter: Story = {
    args: { size: "sm" },
    render: (args) => (
        <EmptyState {...args}>
            <EmptyState.Header pattern="none">
                <EmptyState.FeaturedIcon color="gray" icon={SearchLg} />
            </EmptyState.Header>
            <EmptyState.Content>
                <EmptyState.Title>No results</EmptyState.Title>
                <EmptyState.Description>
                    No tee times match your filters — try clearing the rate or holes
                    filter.
                </EmptyState.Description>
            </EmptyState.Content>
        </EmptyState>
    ),
};
