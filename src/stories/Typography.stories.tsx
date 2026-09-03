import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * The Sagamore type scale. Every size below maps to a real Tailwind v4 utility
 * generated from the theme tokens, from the smallest caption (`text-xs`) up to
 * the largest hero display (`text-display-2xl`). Body and display both render in
 * Inter via `font-body`; specs and code render in the mono stack via `font-mono`.
 */
const SAMPLE = "Sagamore Golf Club — tee times";

type TypeSpec = {
    /** Tailwind utility class, e.g. "text-display-md" */
    className: string;
    /** Font size in px */
    size: number;
    /** Line height in px */
    lineHeight: number;
    /** Optional letter-spacing in px */
    letterSpacing?: number;
};

const SCALE: TypeSpec[] = [
    { className: "text-display-2xl", size: 72, lineHeight: 90, letterSpacing: -1.44 },
    { className: "text-display-xl", size: 60, lineHeight: 72, letterSpacing: -1.2 },
    { className: "text-display-lg", size: 48, lineHeight: 60, letterSpacing: -0.96 },
    { className: "text-display-md", size: 36, lineHeight: 44, letterSpacing: -0.72 },
    { className: "text-display-sm", size: 30, lineHeight: 38 },
    { className: "text-display-xs", size: 24, lineHeight: 32 },
    { className: "text-xl", size: 20, lineHeight: 30 },
    { className: "text-lg", size: 18, lineHeight: 28 },
    { className: "text-md", size: 16, lineHeight: 24 },
    { className: "text-sm", size: 14, lineHeight: 20 },
    { className: "text-xs", size: 12, lineHeight: 18 },
];

const formatSpec = ({ className, size, lineHeight, letterSpacing }: TypeSpec): string => {
    const base = `${className} · ${size}/${lineHeight}px`;
    return letterSpacing !== undefined ? `${base} · ${letterSpacing}px tracking` : base;
};

type TypeRowProps = {
    spec: TypeSpec;
    text?: string;
    /** Optional weight utility, e.g. "font-medium" */
    weightClassName?: string;
    /** Optional family utility, e.g. "font-mono" */
    familyClassName?: string;
};

const TypeRow = ({ spec, text = SAMPLE, weightClassName, familyClassName }: TypeRowProps) => {
    const sampleClass = [spec.className, familyClassName, weightClassName, "text-primary"]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="flex flex-col gap-1 border-b border-secondary pb-4">
            <p className={sampleClass}>{text}</p>
            <span className="text-xs text-tertiary font-mono">{formatSpec(spec)}</span>
        </div>
    );
};

const meta = {
    title: "Foundations/Typography",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
    render: () => (
        <div className="bg-primary text-primary p-8 space-y-8 font-body">
            <div className="space-y-1">
                <h2 className="text-display-xs font-semibold text-primary">Type scale</h2>
                <p className="text-sm text-secondary">From display-2xl down to xs.</p>
            </div>
            <div className="space-y-6">
                {SCALE.map((spec) => (
                    <TypeRow key={spec.className} spec={spec} />
                ))}
            </div>
        </div>
    ),
};

const WEIGHTS: { label: string; className: string }[] = [
    { label: "Normal · 400", className: "font-normal" },
    { label: "Medium · 500", className: "font-medium" },
    { label: "Semibold · 600", className: "font-semibold" },
    { label: "Bold · 700", className: "font-bold" },
];

export const Weights: Story = {
    render: () => {
        const spec: TypeSpec = { className: "text-display-xs", size: 24, lineHeight: 32 };
        return (
            <div className="bg-primary text-primary p-8 space-y-8 font-body">
                <div className="space-y-1">
                    <h2 className="text-display-xs font-semibold text-primary">Weights</h2>
                    <p className="text-sm text-secondary">Inter at {spec.size}px, four weights.</p>
                </div>
                <div className="space-y-6">
                    {WEIGHTS.map((weight) => (
                        <div key={weight.className} className="flex flex-col gap-1 border-b border-secondary pb-4">
                            <p className={`${spec.className} ${weight.className} text-primary`}>{SAMPLE}</p>
                            <span className="text-xs text-tertiary font-mono">{weight.label} · {weight.className}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
};

export const FontFamilies: Story = {
    render: () => {
        const spec: TypeSpec = { className: "text-xl", size: 20, lineHeight: 30 };
        return (
            <div className="bg-primary text-primary p-8 space-y-8 font-body">
                <div className="space-y-1">
                    <h2 className="text-display-xs font-semibold text-primary">Font families</h2>
                    <p className="text-sm text-secondary">Body (Inter) vs mono stack.</p>
                </div>
                <div className="space-y-6">
                    <div className="flex flex-col gap-1 border-b border-secondary pb-4">
                        <p className={`${spec.className} font-body text-primary`}>{SAMPLE}</p>
                        <span className="text-xs text-tertiary font-mono">font-body · Inter · --font-body / --font-display</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-secondary pb-4">
                        <p className={`${spec.className} font-mono text-primary`}>{SAMPLE}</p>
                        <span className="text-xs text-tertiary font-mono">font-mono · mono stack · --font-mono</span>
                    </div>
                </div>
            </div>
        );
    },
};

export const AllTypography: Story = {
    render: () => (
        <div className="bg-primary text-primary p-8 space-y-8 font-body">
            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-display-xs font-semibold text-primary">Type scale</h2>
                    <p className="text-sm text-secondary">From display-2xl down to xs.</p>
                </div>
                {SCALE.map((spec) => (
                    <TypeRow key={spec.className} spec={spec} />
                ))}
            </section>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-display-xs font-semibold text-primary">Weights</h2>
                    <p className="text-sm text-secondary">Inter at 24px, four weights.</p>
                </div>
                {WEIGHTS.map((weight) => (
                    <div key={weight.className} className="flex flex-col gap-1 border-b border-secondary pb-4">
                        <p className={`text-display-xs ${weight.className} text-primary`}>{SAMPLE}</p>
                        <span className="text-xs text-tertiary font-mono">{weight.label} · {weight.className}</span>
                    </div>
                ))}
            </section>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-display-xs font-semibold text-primary">Font families</h2>
                    <p className="text-sm text-secondary">Body (Inter) vs mono stack.</p>
                </div>
                <div className="flex flex-col gap-1 border-b border-secondary pb-4">
                    <p className="text-xl font-body text-primary">{SAMPLE}</p>
                    <span className="text-xs text-tertiary font-mono">font-body · Inter · --font-body / --font-display</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-secondary pb-4">
                    <p className="text-xl font-mono text-primary">{SAMPLE}</p>
                    <span className="text-xs text-tertiary font-mono">font-mono · mono stack · --font-mono</span>
                </div>
            </section>
        </div>
    ),
};
