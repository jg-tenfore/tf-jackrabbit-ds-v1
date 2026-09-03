import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";

/**
 * The Slideout Menu glides in from the right edge of the clubhouse, a quiet panel for
 * tidying up a tee time without leaving the page. It is built on react-aria-components:
 * `SlideoutMenu.Trigger` wraps the opening Button, and the drawer renders a `close`
 * render prop so Save and Cancel can latch the panel shut. The drawer always slides from
 * the right; its width is set by `max-w-100` and can be widened via `className`.
 */
const meta = {
    title: "Components/Actions/Slideout Menu",
    component: SlideoutMenu,
    parameters: { layout: "centered" },
    argTypes: {
        isDismissable: {
            control: "boolean",
            description: "Allow closing the drawer by clicking the overlay.",
        },
    },
} satisfies Meta<typeof SlideoutMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A right-side "Edit booking" drawer with a few fields and Save/Cancel in the footer. */
export const Default: Story = {
    args: { children: null },
    render: () => (
        <SlideoutMenu.Trigger>
            <Button color="secondary">Edit booking</Button>
            <SlideoutMenu isDismissable>
                {({ close }) => (
                    <>
                        <SlideoutMenu.Header onClose={close}>
                            <h2 className="text-lg font-semibold text-primary">Edit booking</h2>
                            <p className="mt-1 text-sm text-tertiary">Adjust the details for this tee time at Sagamore.</p>
                        </SlideoutMenu.Header>

                        <SlideoutMenu.Content>
                            <Input label="Member name" placeholder="Olivia Rhye" defaultValue="Olivia Rhye" />
                            <Input label="Tee time" placeholder="8:40 AM" defaultValue="8:40 AM" />
                            <Input label="Players" placeholder="4" defaultValue="4" />
                            <Input label="Note for the starter" placeholder="Walking, no cart" />
                        </SlideoutMenu.Content>

                        <SlideoutMenu.Footer className="flex justify-end gap-3">
                            <Button color="secondary" onClick={close}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={close}>
                                Save changes
                            </Button>
                        </SlideoutMenu.Footer>
                    </>
                )}
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
    ),
};

/** A wider "Tee sheet filters" drawer with toggles and checkboxes; width widened via className. */
export const Filters: Story = {
    args: { children: null },
    render: () => (
        <SlideoutMenu.Trigger>
            <Button color="secondary">Tee sheet filters</Button>
            <SlideoutMenu isDismissable className="max-w-110">
                {({ close }) => (
                    <>
                        <SlideoutMenu.Header onClose={close}>
                            <h2 className="text-lg font-semibold text-primary">Tee sheet filters</h2>
                            <p className="mt-1 text-sm text-tertiary">Narrow the front-desk view to the bookings that matter.</p>
                        </SlideoutMenu.Header>

                        <SlideoutMenu.Content>
                            <Toggle label="Open slots only" hint="Hide tee times that are already booked." defaultSelected />
                            <Toggle label="Members only" hint="Exclude guest and outing bookings." />
                            <Toggle label="Carts requested" />

                            <div className="flex flex-col gap-3 border-t border-secondary pt-5">
                                <p className="text-sm font-medium text-secondary">Course</p>
                                <Checkbox label="Highlands (18)" defaultSelected />
                                <Checkbox label="Meadows (9)" />
                                <Checkbox label="Practice range" />
                            </div>
                        </SlideoutMenu.Content>

                        <SlideoutMenu.Footer className="flex justify-end gap-3">
                            <Button color="link-gray" onClick={close}>
                                Clear all
                            </Button>
                            <Button color="primary" onClick={close}>
                                Apply filters
                            </Button>
                        </SlideoutMenu.Footer>
                    </>
                )}
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
    ),
};
