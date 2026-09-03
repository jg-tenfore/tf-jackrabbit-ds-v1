import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PaginationPageDefault } from "@/components/application/pagination/pagination";

/**
 * Pagination walks golfers through long lists of tee-time results — a busy
 * Saturday sheet can run dozens of pages. The monochromatic theme keeps the
 * current page marker greyscale rather than coloured.
 */
const meta = {
    title: "Components/Navigation/Paginations",
    component: PaginationPageDefault,
    parameters: { layout: "padded" },
    argTypes: {
        page: { control: { type: "number", min: 1 } },
        total: { control: { type: "number", min: 1 } },
        rounded: { control: "boolean" },
    },
    args: {
        page: 1,
        total: 10,
        rounded: false,
    },
} satisfies Meta<typeof PaginationPageDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Rounded page markers paging through this weekend’s available tee times. */
export const TeeTimeResults: Story = {
    args: {
        page: 3,
        total: 8,
        rounded: true,
    },
};

/**
 * Controlled example: clicking Previous/Next moves through the Saturday tee
 * sheet and the current page updates via React state.
 */
export const ControlledTeeSheet: Story = {
    render: () => {
        const [page, setPage] = useState(1);
        return (
            <div className="flex w-full max-w-2xl flex-col gap-4">
                <p className="text-sm text-secondary">
                    Showing Championship tee times — page {page} of 12.
                </p>
                <PaginationPageDefault page={page} total={12} onPageChange={setPage} />
            </div>
        );
    },
};

/**
 * Edge case: a single page of results. With only one page there is nothing to
 * collapse, so the ellipsis never appears.
 */
export const SinglePage: Story = {
    args: {
        page: 1,
        total: 1,
    },
};
