import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileUpload } from "@/components/application/file-upload/file-upload-base";

const noop = () => {};

/**
 * File Upload lets members and pro-shop staff attach documents to the Sagamore
 * portal — drag a scorecard photo onto the drop zone, watch the course map
 * climb to 100%, and retry the odd handicap PDF that times out. The
 * monochromatic theme keeps the progress greyscale, with colour reserved for
 * the complete check and the failed-upload state.
 */
const meta = {
    title: "Components/Forms/File Upload",
    component: FileUpload.DropZone,
    parameters: { layout: "padded" },
    argTypes: {
        hint: { control: "text" },
        accept: { control: "text" },
        allowsMultiple: { control: "boolean" },
        isDisabled: { control: "boolean" },
    },
    args: {
        hint: "PDF, PNG or JPG (max. 10MB)",
        accept: ".pdf,image/png,image/jpeg",
        allowsMultiple: true,
        isDisabled: false,
        onDropFiles: noop,
    },
    decorators: [
        (Story) => (
            <div className="w-full max-w-lg">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FileUpload.DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drag-and-drop target for uploading scorecards and course documents. */
export const Playground: Story = {};

/** Drop zone restricted to scorecard scans and course photos. */
export const DropZone: Story = {
    args: {
        hint: "Scorecards and course photos — PDF, PNG or JPG (max. 10MB)",
        accept: ".pdf,image/png,image/jpeg",
    },
};

/**
 * A list of in-flight uploads using the progress-bar list item: one finished,
 * a couple mid-upload, and a failed handicap form offering a retry.
 */
export const ProgressBarList: Story = {
    render: () => (
        <FileUpload.List>
            <FileUpload.ListItemProgressBar
                name="championship-course-map.png"
                size={2_415_000}
                type="png"
                progress={100}
                onDelete={noop}
                onRetry={noop}
            />
            <FileUpload.ListItemProgressBar
                name="scorecard-back-nine.pdf"
                size={184_000}
                type="pdf"
                progress={64}
                onDelete={noop}
                onRetry={noop}
            />
            <FileUpload.ListItemProgressBar
                name="member-roster-2026.pdf"
                size={512_000}
                type="pdf"
                progress={28}
                onDelete={noop}
                onRetry={noop}
            />
            <FileUpload.ListItemProgressBar
                name="handicap-certificate.pdf"
                size={96_000}
                type="pdf"
                progress={0}
                failed
                onDelete={noop}
                onRetry={noop}
            />
        </FileUpload.List>
    ),
};

/**
 * The progress-fill variant, where the row itself fills as the upload climbs —
 * shown complete, mid-upload, and in a failed state.
 */
export const ProgressFillList: Story = {
    render: () => (
        <FileUpload.List>
            <FileUpload.ListItemProgressFill
                name="front-nine-scorecard.jpg"
                size={1_280_000}
                type="jpg"
                progress={100}
                onDelete={noop}
                onRetry={noop}
            />
            <FileUpload.ListItemProgressFill
                name="green-fees-summary.pdf"
                size={340_000}
                type="pdf"
                progress={45}
                onDelete={noop}
                onRetry={noop}
            />
            <FileUpload.ListItemProgressFill
                name="tournament-photos.zip"
                size={8_650_000}
                type="zip"
                progress={0}
                failed
                onDelete={noop}
                onRetry={noop}
            />
        </FileUpload.List>
    ),
};

/**
 * A full upload widget: the drop zone stacked above the live file list, the way
 * a member would see it while attaching their round to the portal.
 */
export const UploadWidget: Story = {
    render: () => (
        <FileUpload.Root>
            <FileUpload.DropZone
                hint="Scorecards and course documents — PDF, PNG or JPG (max. 10MB)"
                accept=".pdf,image/png,image/jpeg"
                onDropFiles={noop}
            />
            <FileUpload.List>
                <FileUpload.ListItemProgressBar
                    name="championship-course-map.png"
                    size={2_415_000}
                    type="png"
                    progress={100}
                    onDelete={noop}
                    onRetry={noop}
                />
                <FileUpload.ListItemProgressBar
                    name="scorecard-back-nine.pdf"
                    size={184_000}
                    type="pdf"
                    progress={72}
                    onDelete={noop}
                    onRetry={noop}
                />
                <FileUpload.ListItemProgressBar
                    name="handicap-certificate.pdf"
                    size={96_000}
                    type="pdf"
                    progress={0}
                    failed
                    onDelete={noop}
                    onRetry={noop}
                />
            </FileUpload.List>
        </FileUpload.Root>
    ),
};
