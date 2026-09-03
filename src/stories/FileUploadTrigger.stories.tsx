import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UploadCloud02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";

/**
 * The file-upload trigger wraps any pressable element and opens the native file
 * dialog. At Sagamore it backs the scorecard photo upload and the member
 * profile-picture picker. It renders no UI of its own — pass it one child.
 */
const meta = {
    title: "Components/Forms/File Upload Trigger",
    component: FileTrigger,
    parameters: { layout: "centered" },
    argTypes: {
        allowsMultiple: { control: "boolean" },
        acceptDirectory: { control: "boolean" },
    },
    args: {
        onSelect: () => {},
        children: <Button iconLeading={UploadCloud02}>Upload scorecard</Button>,
    },
} satisfies Meta<typeof FileTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Wraps a button to upload a scorecard photo. */
export const Playground: Story = {
    render: (args) => (
        <FileTrigger {...args} acceptedFileTypes={["image/*"]} onSelect={() => {}}>
            <Button iconLeading={UploadCloud02}>Upload scorecard</Button>
        </FileTrigger>
    ),
};

/** Restrict to images and allow several files for a round photo album. */
export const MultipleImages: Story = {
    render: () => (
        <FileTrigger acceptedFileTypes={["image/png", "image/jpeg"]} allowsMultiple onSelect={() => {}}>
            <Button color="secondary" iconLeading={UploadCloud02}>
                Add round photos
            </Button>
        </FileTrigger>
    ),
};

/** Any pressable element works — here a plain link-style button. */
export const CustomTrigger: Story = {
    render: () => (
        <FileTrigger onSelect={() => {}}>
            <Button color="link-color">Choose a profile picture</Button>
        </FileTrigger>
    ),
};
