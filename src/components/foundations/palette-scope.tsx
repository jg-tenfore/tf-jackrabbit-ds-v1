import type { CSSProperties, ReactNode } from "react";

/** The color treatments explored for Tenfore screens. */
export type Palette = "green" | "navy" | "green-navy";

// Remap the brand ramp to the navy ramp for a subtree. Because every semantic
// brand token (bg-brand-solid, fg-brand-primary, text-brand-*, border-brand, …)
// resolves to var(--color-brand-N), overriding these variables re-themes an
// entire screen from green to navy with no per-component changes.
const NAVY_BRAND_VARS = {
    "--color-brand-25": "var(--color-navy-25)",
    "--color-brand-50": "var(--color-navy-50)",
    "--color-brand-100": "var(--color-navy-100)",
    "--color-brand-200": "var(--color-navy-200)",
    "--color-brand-300": "var(--color-navy-300)",
    "--color-brand-400": "var(--color-navy-400)",
    "--color-brand-500": "var(--color-navy-500)",
    "--color-brand-600": "var(--color-navy-600)",
    "--color-brand-700": "var(--color-navy-700)",
    "--color-brand-800": "var(--color-navy-800)",
    "--color-brand-900": "var(--color-navy-900)",
    "--color-brand-950": "var(--color-navy-950)",
} as CSSProperties;

/**
 * Scopes a color treatment to its children.
 *
 * - `green` — the default brand ramp (green).
 * - `navy` — the brand ramp is swapped to navy, so buttons, accents, badges,
 *   charts, and every brand-derived token render in navy.
 * - `green-navy` — brand stays green (green actions/accents); screens pair it
 *   with explicit navy structure (`bg-navy-*`) for a two-tone look.
 */
export const PaletteScope = ({ palette, className, children }: { palette: Palette; className?: string; children: ReactNode }) => (
    <div className={className} style={palette === "navy" ? NAVY_BRAND_VARS : undefined}>
        {children}
    </div>
);
