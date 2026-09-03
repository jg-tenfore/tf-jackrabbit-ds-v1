## Project Overview

**JackRabbit Kiosk design system** — the component library for the TenFore Golf
self-service kiosk.

- **React 19** + TypeScript, **Next 16**, **Storybook 10** (`@storybook/nextjs-vite`)
- **Tailwind CSS v4.2**, **React Aria Components** as the accessibility foundation
- Untitled UI base components and `styles/theme.css` are ported unchanged from
  `tf-buck-ds-v1`. Keep them in sync — do not fork the token set.

All the conventions from the Buck/Fox design system apply here: `Aria*` import
prefixes, kebab-case filenames, `cx`/`sortCx`, semantic color classes only
(`text-primary`, not `text-gray-900`), and `opacity-50` for disabled states.

## The 750 x 1298 canvas

Every export in `references/flows` is exactly 750 x 1298. **Author against that
coordinate space** — an element at x=64 in the design must sit at x=64 in the
build, so QA is a real pixel diff.

Never hard-code a physical panel size in a component. `KioskFrame` scales the
canvas to the target panel (`design` | `fhd` | `tall`); components stay unaware.
`KioskScreen` owns the header / body / footer geometry.

## Kiosk constraints

These are not stylistic preferences — they are why components here differ from
the Buck equivalents:

- **No hover.** There is no cursor. Define `active:` states; do not add `hover:`.
- **64px minimum touch target** (`KIOSK_MIN_TOUCH_TARGET`), not the 44px web norm —
  kiosks are used standing, in gloves, in sunlight.
- **No physical keyboard.** All text entry goes through `OnScreenKeyboard`.
  Layouts live in `keyboard/layouts.ts` as data; adding one is a data change,
  never a new component.

## Session and the simulated scan

`KioskSessionProvider` (`src/providers/kiosk-session.tsx`) owns auth. The wallet
read is **simulated in software** — no camera, no hardware — so every visual
state is reachable from a story.

Scan state is a machine (`idle → scanning → success | not-found | expired`), not
a boolean. Components render the machine; they never own scan state themselves.
Outcomes are selected by wallet code against the fixtures in `src/data/members.ts`.

## Global navigation

The nav is a persistent **action rail**, not a set of destinations — a kiosk
session is one linear task. The three always-reachable actions are Start Over,
the cart, and the wallet drawer. Do not add destination-style nav items.

## Placeholder assets

Imagery is not exported yet. Tag every stand-in with `data-placeholder-asset="<name>"`
so the outstanding list stays greppable:

```bash
grep -rn 'data-placeholder-asset' src/
```

## Storybook

Hierarchy: `Introduction` → `Foundations` → `Kiosk Core` → `Components` → `Screens`.
QA a component in `Kiosk Core` in isolation before composing it into a screen.

`Foundations` and `Components` are ported wholesale from `tf-buck-ds-v1` and are
**reference material, not finished kiosk UI** — they were authored for a desktop
app with a cursor. Before promoting one into a kiosk screen: swap `hover:` for
`active:`, raise touch targets to 64px, and re-scale type/spacing for 750px
arm's-length reading. Buck's admin-product stories (`App Chrome`, `App Screens`,
`Sign in ∕ Sign up`) are deliberately **not** ported.

Reference exports are served at `/reference-flows/…`. Pair one with `KioskFrame`'s
`overlaySrc` to diff a build against its design — matching pixels render black
under `mix-blend-difference`.

## Git

This repo is authored solely by **jg-tenfore <justin.girard@tenfore.golf>**
(set repo-locally). Do not commit under any other identity.
