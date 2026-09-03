import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * # Foundations · Color
 *
 * The Tenfore Golf color system. Two brand primaries — **green** and **navy** — a
 * **gray** neutral, and **red / amber / green** semantics, each authored as a full
 * 50–950 ramp (see the **Palette** story). Semantic **tokens** map those ramps to
 * roles — text, foreground, background, border — and adapt across light/dark (see
 * **Tokens**). Every swatch reads its real `--color-*` variable, so what you see is
 * exactly what ships. Sourced from the brand palette (references/080626).
 */
const meta = {
    title: "Foundations/Colors",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

const Page = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col gap-10 bg-primary p-6 text-primary lg:p-8">{children}</div>;

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-primary">{title}</h3>
            {subtitle && <p className="text-xs text-tertiary">{subtitle}</p>}
        </div>
        {children}
    </section>
);

/* -------------------------------------------------------------------------- */
/* Ramps (Palette)                                                            */
/* -------------------------------------------------------------------------- */

const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** Convert a computed "rgb(r, g, b)" (or rgba) string to #rrggbb; passes other formats through. */
const toHex = (rgb: string): string => {
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return rgb;
    return "#" + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
};

/** One ramp swatch — reads its own resolved color at runtime so the hex is always accurate. */
const RampCell = ({ family, step }: { family: string; step: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hex, setHex] = useState("");

    useEffect(() => {
        if (ref.current) setHex(toHex(getComputedStyle(ref.current).backgroundColor));
    }, []);

    return (
        <div className="flex min-w-0 flex-col gap-1">
            <div ref={ref} className="h-14 rounded-md ring-1 ring-inset ring-black/10" style={{ background: `var(--color-${family}-${step})` }} />
            <span className="text-[11px] font-semibold text-secondary">{step}</span>
            <span className="font-mono text-[10px] text-tertiary uppercase">{hex}</span>
        </div>
    );
};

/** A labeled 50–950 ramp for one color family. */
const Ramp = ({ family, label, note }: { family: string; label: string; note?: string }) => (
    <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-primary">{label}</p>
            {note && <p className="text-xs text-tertiary">{note}</p>}
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
            {RAMP_STEPS.map((s) => (
                <RampCell key={s} family={family} step={s} />
            ))}
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/* Token swatches (Tokens)                                                    */
/* -------------------------------------------------------------------------- */

const TokenLabel = ({ token }: { token: string }) => <span className="font-mono text-xs break-all text-tertiary">{token}</span>;

/** A fill swatch: a color block reading the CSS variable, its token name, and an optional usage note. */
const Swatch = ({ token, note }: { token: string; note?: string }) => (
    <div className="flex flex-col gap-1.5">
        <div className="h-16 w-full rounded-lg border border-secondary" style={{ background: `var(${token})` }} />
        <TokenLabel token={token} />
        {note && <span className="text-xs text-tertiary">{note}</span>}
    </div>
);

/** A text-token swatch: an "Aa" rendered in the token color on a white card. */
const TextSwatch = ({ token, note }: { token: string; note?: string }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex h-16 w-full items-center justify-center rounded-lg border border-secondary bg-primary">
            <span className="text-2xl font-semibold" style={{ color: `var(${token})` }}>
                Aa
            </span>
        </div>
        <TokenLabel token={token} />
        {note && <span className="text-xs text-tertiary">{note}</span>}
    </div>
);

/** A border-token swatch: a card outlined with the token color. */
const BorderSwatch = ({ token, note }: { token: string; note?: string }) => (
    <div className="flex flex-col gap-1.5">
        <div className="h-16 w-full rounded-lg bg-primary" style={{ border: `2px solid var(${token})` }} />
        <TokenLabel token={token} />
        {note && <span className="text-xs text-tertiary">{note}</span>}
    </div>
);

const SwatchGrid = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">{children}</div>;

type Item = { token: string; note?: string };

const BASE: Item[] = [
    { token: "--color-white", note: "Always white" },
    { token: "--color-black", note: "Always black" },
];

const TEXT: Item[] = [
    { token: "--color-text-primary", note: "Headings" },
    { token: "--color-text-secondary", note: "Labels" },
    { token: "--color-text-tertiary", note: "Supporting text" },
    { token: "--color-text-quaternary", note: "Subtle text" },
    { token: "--color-text-placeholder", note: "Input placeholders" },
    { token: "--color-text-white", note: "On dark fills" },
    { token: "--color-text-brand-primary" },
    { token: "--color-text-brand-secondary" },
    { token: "--color-text-brand-tertiary" },
    { token: "--color-text-error-primary", note: "Error state" },
    { token: "--color-text-warning-primary", note: "Warning state" },
    { token: "--color-text-success-primary", note: "Success state" },
];

const FOREGROUND: Item[] = [
    { token: "--color-fg-primary", note: "Highest-contrast icons" },
    { token: "--color-fg-secondary" },
    { token: "--color-fg-tertiary" },
    { token: "--color-fg-quaternary", note: "Input/help icons" },
    { token: "--color-fg-white" },
    { token: "--color-fg-brand-primary", note: "Featured icons" },
    { token: "--color-fg-brand-secondary" },
    { token: "--color-fg-error-primary" },
    { token: "--color-fg-error-secondary" },
    { token: "--color-fg-warning-primary" },
    { token: "--color-fg-warning-secondary" },
    { token: "--color-fg-success-primary" },
    { token: "--color-fg-success-secondary" },
];

const BACKGROUND: Item[] = [
    { token: "--color-bg-primary", note: "Default page bg" },
    { token: "--color-bg-primary_hover" },
    { token: "--color-bg-primary-solid", note: "Tooltips" },
    { token: "--color-bg-secondary", note: "Section bg" },
    { token: "--color-bg-secondary_hover" },
    { token: "--color-bg-tertiary", note: "Toggles" },
    { token: "--color-bg-quaternary", note: "Sliders, progress" },
    { token: "--color-bg-active", note: "Active menu items" },
    { token: "--color-bg-overlay", note: "Modal overlay" },
    { token: "--color-bg-brand-primary" },
    { token: "--color-bg-brand-secondary" },
    { token: "--color-bg-brand-solid", note: "Toggles, messages" },
    { token: "--color-bg-brand-solid_hover" },
    { token: "--color-bg-brand-section", note: "CTA sections" },
    { token: "--color-bg-error-primary" },
    { token: "--color-bg-error-secondary" },
    { token: "--color-bg-error-solid" },
    { token: "--color-bg-warning-primary" },
    { token: "--color-bg-warning-secondary" },
    { token: "--color-bg-warning-solid" },
    { token: "--color-bg-success-primary" },
    { token: "--color-bg-success-secondary" },
    { token: "--color-bg-success-solid" },
];

const BORDER: Item[] = [
    { token: "--color-border-primary", note: "Inputs, checkboxes" },
    { token: "--color-border-secondary", note: "Default border" },
    { token: "--color-border-secondary_alt", note: "Floating menus" },
    { token: "--color-border-tertiary", note: "Subtle dividers" },
    { token: "--color-border-brand", note: "Active states" },
    { token: "--color-border-brand_alt" },
    { token: "--color-border-error", note: "Error inputs" },
    { token: "--color-border-error_subtle" },
];

/* -------------------------------------------------------------------------- */
/* Stories                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * **Palette** — the raw color ramps. Two brand primaries (green + navy), the gray
 * neutral, and the red / amber / green semantics, each 50–950 with live hex.
 */
export const Brand: Story = {
    name: "Palette",
    render: () => (
        <Page>
            <Section title="Brand primaries" subtitle="Green and navy — the two Tenfore Golf brand colors.">
                <div className="flex flex-col gap-6">
                    <Ramp family="brand" label="Green (brand)" note="Primary brand · #3EA563 @ 500. brand-600 is the interactive shade (WCAG AA on white)." />
                    <Ramp family="navy" label="Navy" note="Co-primary · #182132 @ 900. Deep navies for headers, heroes, and dark surfaces." />
                </div>
            </Section>

            <Section title="Neutral" subtitle="The UI workhorse — text, surfaces, borders, dividers.">
                <Ramp family="gray" label="Gray" />
            </Section>

            <Section title="Semantic" subtitle="Reserved for status — error, warning, success.">
                <div className="flex flex-col gap-6">
                    <Ramp family="red" label="Error (red)" />
                    <Ramp family="amber" label="Warning (amber)" />
                    <Ramp family="green" label="Success (green)" />
                </div>
            </Section>
        </Page>
    ),
};

/**
 * **Tokens** — the semantic tokens that map the palette to roles. These are what
 * you style with (`text-primary`, `bg-brand-solid`, `border-secondary`, …); they
 * adapt automatically across light and dark mode.
 */
export const Tokens: Story = {
    name: "Tokens",
    render: () => (
        <Page>
            <Section title="Base" subtitle="Absolute values that never change with theme.">
                <SwatchGrid>
                    {BASE.map((item) => (
                        <Swatch key={item.token} {...item} />
                    ))}
                </SwatchGrid>
            </Section>

            <Section title="Text" subtitle="Text fill tokens — shown as “Aa” in the token color.">
                <SwatchGrid>
                    {TEXT.map((item) => (
                        <TextSwatch key={item.token} {...item} />
                    ))}
                </SwatchGrid>
            </Section>

            <Section title="Foreground (fg)" subtitle="Non-text foreground such as icon fills.">
                <SwatchGrid>
                    {FOREGROUND.map((item) => (
                        <Swatch key={item.token} {...item} />
                    ))}
                </SwatchGrid>
            </Section>

            <Section title="Background (bg)" subtitle="Fill tokens across neutral, brand, and semantic states.">
                <SwatchGrid>
                    {BACKGROUND.map((item) => (
                        <Swatch key={item.token} {...item} />
                    ))}
                </SwatchGrid>
            </Section>

            <Section title="Border" subtitle="Stroke tokens, drawn as outlined cards.">
                <SwatchGrid>
                    {BORDER.map((item) => (
                        <BorderSwatch key={item.token} {...item} />
                    ))}
                </SwatchGrid>
            </Section>
        </Page>
    ),
};
