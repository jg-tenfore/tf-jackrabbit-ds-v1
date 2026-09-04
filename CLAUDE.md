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
- **No physical keyboard.** All text entry goes through `OnScreenKeyboard`,
  `NumericKeypad` or `KeyboardField`. Layouts live in `keyboard/layouts.ts` as
  data; adding one is a data change, never a new component.
- **Target size is argued in millimetres, not pixels** (`src/kiosk/touch.ts`).
  Pixels cannot express hittability — the same 64px is generous on a 21" panel
  and cramped on a 55" one. Every size is validated against the *smallest*
  panel (21.5"), since that is the binding constraint. Floors: 11mm any target,
  14mm primary actions.
- **Every touchable cell is a `KioskKey`.** Never hand-size a key — the scale in
  `touch.ts` is derived from row arithmetic against the 750px canvas, so `md`
  (64px) is exactly the widest key that fits a 10-column row.
- **Fewer columns is a usability decision.** Target *area* scales with the
  square, so a 3-column numeric pad (234px keys) has ~12x the area of a QWERTY
  key in the same space. Drop keys a layout does not need.

## Validation

`npm run lint` · `npm test` · `npx tsc --noEmit` · `npm run build-storybook` ·
`npm run build`. All five run in CI on every push and PR (`.github/workflows/ci.yml`).

Lint deliberately ignores `components/base`, `foundations`, `shared-assets`,
`application`, `marketing` and `booking` — that is the Untitled UI library
ported verbatim from Buck, upstream code we do not author. Linting it would bury
the findings that matter.

Tests cover arithmetic and parsing, not markup: touch-target maths, phone
formatting, email domain completion, keyboard layout geometry. Layout is
verified by `npm run shoot` instead — a snapshot on class strings would pass
through every defect that harness has actually caught, while making refactors
expensive.

## Story layout

Kiosk stories must use `layout: "fullscreen"`, never `"centered"`. Centered wraps
the story in a padded box, and at the 750x1298 kiosk viewport that padding
becomes exactly 32px of horizontal overflow — the preview scrolls sideways on a
panel that physically cannot. The only story allowed to exceed the canvas is
`Kiosk Frame / Full HD Panel`, which exists to show the canvas scaled onto a
1080px panel.

## Visual QA is not optional

`tsc` passing and Storybook building prove a component compiles, not that it
looks right. Run `npm run shoot` (dev server on 6020) to drive a real browser
over the kiosk stories and write PNGs, then **look at them**. Shots are taken of
`[data-kiosk-frame]`, so they come out at exactly 750x1298 and diff directly
against `references/flows`.

This is load-bearing: the first run caught a price colliding with its meta line,
a step label wrapping and breaking the rail's fixed row height, and a day strip
clipped behind its own expand control — none of which type-check as errors. Do
this before building anything on top of a new layout, or the error compounds.

## Booking

Simulator and pickleball are **one flow**, driven by an `ActivityConfig`
(`booking/activity-config.ts`). They ask the same four questions in the same
order and differ only in wording and offered durations. Never fork them — a new
activity is a config object, not a component.

Tee time is genuinely a different shape (filter rail + paired slot grid + rate
modal) and stays its own component.

The left rail is pinned at `-left-16` and clipped by the canvas on purpose:
only the inner edge of each card shows, which reads as tabs hanging off the
edge without spending the horizontal room a full sidebar would cost. That room
is what the slot grid needs.

## Storybook categories

`Foundations` -> `App Chrome` -> `Kiosk Core` -> `Screens` -> `Components`.

`App Chrome` is the persistent frame around every screen (the global nav rail).
`Screens` is assembled surfaces built from the primitives. `Kiosk Core` is the
kiosk-native building blocks. `Components` is the ported Buck library — source
material, not finished kiosk UI.

## Exported design assets

Assets exported from Figma land in `references/build/<screen>/` and are copied
into `public/screen-assets/<screen>/`, which Storybook serves in dev and copies
into the static build. Reference them base-relative through `assetUrl()` —
never with a leading slash, or they 404 on GitHub Pages.

`npm run build-screen-assets` copies from `references/build/` into
`public/screen-assets/` — it never mutates in place, so it is idempotent and
safe to re-run whenever an export is replaced. Add new assets to the `ASSETS`
list in that script rather than copying by hand.

Some exports carry a baked-in background. The wallet illustrations ship with a
solid `#079455` ground that does not match `--color-bg-brand-solid`, which shows
as a visible rectangle. The script strips it rather than recolouring the drawer
to match: the drawer turns **red** on a failed scan, and a green-boxed
illustration on a red card looks broken rather than themed. The token stays
authoritative; the asset adapts.

Prefer SVG for line art and UI marks — it stays crisp when `KioskFrame` scales
the canvas onto a 1080px panel, where a 1x raster would soften.

## KioskKey span

`span={0}` means "not in a key row" — width comes from a class. Any other value
is a flex ratio within a row. Do not pass `span={0}` and expect flex sizing:
that combination previously applied `flex-basis: 0`, which let the default
shrink collapse a button to min-content and wrap its label one character per
line. It is now explicitly opted out.

## Raster assets need 2x

A raster needs at least **2x its CSS render width**. Kiosk panels are HiDPI, and
`KioskFrame` then transform-scales the 750px canvas up to 1080px on hardware —
so a 1x export is soft twice over. `npm run build-screen-assets` audits every
raster with a `renderWidth` and prints the exact dimensions to re-export at.
Upscaling does not help; the pixels are not there.

**Prefer SVG for line art and UI marks** — it has no density to get wrong, and
it survives the canvas scale cleanly.

## Global nav geometry

The rail is fixed chrome, not a component that flows with content:

**The mocks are @1x (375x649); this canvas is @2x (750x1298).** Every dimension
taken off a mock doubles. That mismatch caused a run of "the sizing is off"
corrections — check the scale before applying a number.

- rail is **min 244px collapsed**, compressing to **min 114px** when the sign-in
  panel is open, so the whole nav stays ~423 rather than stacking to 553
- drawer is **174x214 collapsed** and **174x114 expanded** — it drops its
  illustration when the panel above is already carrying one
- signed-in identity card is **174x100**, fully rounded, sitting *inside* the
  rail rather than overhanging: once signed in there is no action left to
  advertise, so it stops pulling the eye
- **64px left and right inset** for everything, the drawer included
- content is **bottom-anchored**, so Start Over holds the same line in every
  state rather than drifting as the cart row appears
- **z-50** with an upward shadow — it always sits above screen content, and a
  shadow is what makes that legible on a white page where a border would read
  as a divider rather than a layer
- **full-bleed**: 100% width, no horizontal scrolling anywhere in the canvas
- wallet drawer / identity card is **174 x 214**, inset 64 from the right
- expanded sign-in band is **450px** (`promptHeight` prop; the annotated export
  measures nearer 304 — compare the two stories before settling it)

Do not put `overflow-x-hidden` on the nav itself. CSS promotes the other axis to
`auto` when one is `hidden`, which clips the drawer's upward overhang.
`KioskScreen` and the frame canvas already prevent horizontal scrolling.

App Chrome stories deliberately black out the screen body. The rail's surfaces
are white and brand green, so on a white screen its top edge, the drawer
overhang and the identity card ring all disappear. Black makes the silhouette
readable. It is a test surface, not the product.

## Overlays: two kinds, and the difference matters

There are exactly two overlay components, and choosing between them is a
question about **what the overlay is doing, not how big its content is**.

`KioskDialog` — a card that sits *on* the current screen. The page stays visible
around and beneath it, footer rail included. Use it when the overlay is a step
*inside* the current task (picking a rate for the time you just tapped, setting
a quantity for the item you just picked). Backing out should cost nothing.

**No scrim by default.** Every card overlay in `references/flows` sits on an
undimmed page — the standby card overlays the hero photograph at full
brightness. `scrim` exists but is not the house style; enabling it makes a
dialog read as a takeover when it is not one.

`KioskFullScreenModal` — replaces the entire screen. No card, no page behind, the
footer rail covered. Use it for a **hard stop**: the flow cannot continue until
it is answered, and the context is deliberately removed so nothing competes with
the question. Destroying an order, choosing where to pay, interstitials. It
takes no scrim and no card — a dimmed page behind would reintroduce exactly what
it is stripping away.

Their footers differ too: a dialog uses the edge-to-edge split bar (it has a card
edge to span); a full-screen modal uses two centred pills (it does not).

Name destructive actions for what they do ("Remove"), not "Confirm".

## Entry screens

Enter your code, email and name are one `EntryScreen` template with a **field
slot**, not a `type` prop — the three fields have genuinely different shapes and
a union would push the differences into the template rather than remove them.
`showSignInPanel` is on for code and email, off for name: by name entry the user
has chosen guest checkout, and re-offering the scan reopens a settled decision.

## Ordering

`CategoryRail` is the third mode of `step-rail.tsx`, beside `StepRail` and
`FilterRail`, so the clip offset, width and radius stay one set of numbers.

Menu sub-filters are keyed **per category** (`MENU_SUBFILTERS`). The reference
shows beverage filters under a Sandwiches heading, which is a mock artefact.

`src/data/menu-catalog.ts` is hand-written but uses the same `ProShopProduct`
shape as the generated pro-shop catalogue, so both feed the same cards and a
future `build-menu-images` can replace it wholesale. Its `image` paths point at
`menu-images/`, which does not exist yet — `ProductImage` renders a deliberate
empty state, so the screens are reviewable before the food exports land.

## Pro shop and menu imagery

The raw capture in `references/pos-item-imagery` is ~134MB and is **gitignored**.
`npm run build-pos-images` curates it to one hero per product at 800px WebP —
1.2MB, 23x smaller — into `public/pos-images/`, which **is** committed. Re-run it
after changing the raw capture.

Catalog image paths are stored **base-relative** (`pos-images/...`, no leading
slash) and must be resolved with `assetUrl()` from `@/utils/asset-url`. GitHub
Pages serves this project from `/tf-jackrabbit-ds-v1/`, so a rooted path works
locally and 404s after deploy. Render catalog images through `ProductImage`,
which applies `assetUrl` and owns the missing-image fallback.

## Modals

There is **one modal**: `KioskModal`, plus thin named variants in
`modal-variants.tsx` (RatePicker, ProductDetail, DestructiveConfirm, Choice,
CheckoutMethod, InfoSheet). Overlay, dismissal and focus containment live in the
base — never hand-roll a new overlay. Focus containment is React Aria's, because
a kiosk runs unattended and a leaking modal leaves the previous customer's
session reachable behind it.

The overlay is scoped to the kiosk canvas, not the browser viewport.

## No data visualization

Charts, gauges, sparklines and the metric cards were removed, along with
`recharts`. A kiosk presents a single linear task to a standing user; it has no
dashboards. Do not reintroduce a charting dependency without a concrete screen
that needs one.

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
