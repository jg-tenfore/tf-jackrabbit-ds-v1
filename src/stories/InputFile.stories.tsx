import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputFile } from "@/components/base/input/input-file";

/**
 * Input File is how a member attaches a signed scorecard or handicap card —
 * a read-only field paired with a quiet Upload button. Hairline border, ink
 * button, no fill.
 */
const meta = {
    title: "Components/Forms/Inputs/Input File",
    component: InputFile,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
        buttonText: { control: "text" },
        isDisabled: { control: "boolean" },
        isInvalid: { control: "boolean" },
        isLoading: { control: "boolean" },
    },
    args: {
        size: "md",
        label: "Scorecard",
        hint: "Upload a photo or PDF of your signed scorecard.",
        placeholder: "Choose a file",
        buttonText: "Upload",
    },
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InputFile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Restricted to images and PDFs for the scorecard upload. */
export const ScorecardUpload: Story = {
    args: {
        label: "Signed scorecard",
        acceptedFileTypes: ["image/png", "image/jpeg", "application/pdf"],
        buttonText: "Attach",
    },
};

/** Allows multiple files — a stack of round scorecards. */
export const MultipleFiles: Story = {
    args: {
        label: "Tournament scorecards",
        hint: "Add every round from the member-guest.",
        allowsMultiple: true,
    },
};

/** Loading spinner while the scorecard uploads. */
export const Loading: Story = {
    args: {
        label: "Scorecard",
        isLoading: true,
    },
};

/** Invalid — the attached file isn't an accepted format. */
export const Invalid: Story = {
    args: {
        label: "Scorecard",
        isInvalid: true,
        hint: "Please upload an image or PDF.",
    },
};

/** Disabled until the round is signed off by the marshal. */
export const Disabled: Story = {
    args: {
        label: "Scorecard",
        isDisabled: true,
    },
};
