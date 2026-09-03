import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarDate, Flag01, Sun, Moon01 } from "@untitledui/icons";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";

/**
 * Button groups switch between mutually-exclusive views on the Sagamore tee
 * sheet — holes played, time of day, course. Single-selection, segmented, and
 * near-black in the selected state under the monochromatic theme.
 */
const meta = {
    title: "Components/Actions/Button Group",
    component: ButtonGroup,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    },
    args: {
        size: "md",
    },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pick how many holes to book. */
export const Playground: Story = {
    render: (args) => (
        <ButtonGroup {...args} defaultSelectedKeys={["18"]}>
            <ButtonGroupItem id="9">9 holes</ButtonGroupItem>
            <ButtonGroupItem id="18">18 holes</ButtonGroupItem>
            <ButtonGroupItem id="27">27 holes</ButtonGroupItem>
        </ButtonGroup>
    ),
};

/** Leading icons label the round type. */
export const WithIcons: Story = {
    render: (args) => (
        <ButtonGroup {...args} defaultSelectedKeys={["all"]}>
            <ButtonGroupItem id="all" iconLeading={Flag01}>
                All day
            </ButtonGroupItem>
            <ButtonGroupItem id="am" iconLeading={Sun}>
                Morning
            </ButtonGroupItem>
            <ButtonGroupItem id="pm" iconLeading={Moon01}>
                Twilight
            </ButtonGroupItem>
        </ButtonGroup>
    ),
};

/** Icon-only group — calendar view switcher on the booking page. */
export const IconOnly: Story = {
    render: (args) => (
        <ButtonGroup {...args} defaultSelectedKeys={["day"]} aria-label="Calendar view">
            <ButtonGroupItem id="day" iconLeading={Sun} aria-label="Day" />
            <ButtonGroupItem id="week" iconLeading={CalendarDate} aria-label="Week" />
            <ButtonGroupItem id="month" iconLeading={Flag01} aria-label="Month" />
        </ButtonGroup>
    ),
};

/** The three sizes stacked. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
                <ButtonGroup key={size} size={size} defaultSelectedKeys={["18"]}>
                    <ButtonGroupItem id="9">9 holes</ButtonGroupItem>
                    <ButtonGroupItem id="18">18 holes</ButtonGroupItem>
                    <ButtonGroupItem id="27">27 holes</ButtonGroupItem>
                </ButtonGroup>
            ))}
        </div>
    ),
};
