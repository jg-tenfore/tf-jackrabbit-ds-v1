# tf-jackrabbit-ds-v1

Design system for the **TenFore Golf JackRabbit kiosk** — an Untitled UI + React
Aria component library authored against the kiosk's 750 × 1298 design canvas.

Two surfaces are published from this one repo, and they are built from the same
components:

|               | Live                                                        | What it is                                             |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| **Storybook** | https://jg-tenfore.github.io/tf-jackrabbit-ds-v1/           | The component library and every screen, story by story |
| **Prototype** | https://jg-tenfore.github.io/tf-jackrabbit-ds-v1/prototype/ | A clickable kiosk you can actually order and book on   |

The prototype imports `src/components/kiosk/*` directly rather than copying it.
That is the point of it living in this repo: an edit to a component reaches both
surfaces on the next build, with no package to publish and no version to keep in
sync. If a screen looks wrong in the prototype it looks wrong in Storybook too.

Shares its brand palette and token set with
[tf-buck-ds-v1](https://jg-tenfore.github.io/tf-buck-ds-v1/), so components move
between the two repos unchanged.

## Commands

```bash
npm install

npm run storybook        # component library at http://localhost:6020
npm run dev              # prototype at http://localhost:3000 (-- -p 6030 to move it)

npm run build-storybook  # static build -> storybook-static/
npm run build            # prototype static export -> out/

npm run lint             # eslint, --max-warnings 0
npm test                 # vitest (touch-target and button-scale assertions)
npm run smoke            # drives Chromium over every User Flows story
```

`npm run smoke` is the one worth knowing about. Type-checking cannot see a
canvas that overflows, an image that 404s or a console error that only fires on
render, so the smoke suite opens all 89 flow stories at 750 × 1298 and fails on
any of them. Run it before pushing UI changes.

## Storybook order

Categories are ordered top-down, general to specific, by `storySort` in
`.storybook/preview.tsx`:

1. **Introduction** — read this first: the canvas model, the kiosk constraints
   that shape every component, and how the simulated wallet scan works
2. **Foundations** — colour, type, spacing, touch targets
3. **Components** — the kiosk component library
4. **App Chrome** — the persistent nav and rails
5. **User Flows** — every built screen, grouped by flow, in the order a user
   meets them: Welcome Screen · Interstitials · Auth w New User · Auth w
   Existing User · Order Sandwich · Order Sandwich Guest · Book Tee Time · Book
   Activity · Waitlist Reg · Standby
6. **Library (unused)** — the ported Untitled UI set, kept for reference. No
   flow reaches it; nothing here is part of the kiosk.

Within a flow, stories appear in screen order rather than alphabetically —
declaration order in the file is preserved.

## Layout

```
src/
├── kiosk/                    # canvas primitives: KioskFrame, KioskScreen, constants
├── components/
│   ├── base/                 # Untitled UI primitives (ported from Buck)
│   ├── foundations/          # tokens, logos, featured icons
│   └── kiosk/                # kiosk-specific components
│       ├── app-chrome/       # persistent nav, order rail, wallet drawer
│       ├── auth/             # scan prompt, how-to-log-in
│       ├── booking/          # tee sheet, activity steps, review sections
│       ├── keyboard/         # on-screen keyboard + code input
│       ├── modals/           # dialogs and full-screen overlays
│       ├── nav/              # header and footer action rail
│       ├── order/            # menu, item detail, customize, order review
│       ├── screens/          # whole-screen compositions
│       └── store/            # pro shop grid and product cards
├── prototype/                # the clickable prototype — routing and session
│   ├── prototype-app.tsx     # ScreenId -> component, exhaustive by type
│   ├── navigation.tsx        # explicit screen stack (a kiosk has no URL bar)
│   ├── prototype-state.tsx   # one cart across food, pro shop and bookings
│   ├── session-lifecycle.ts  # what Start Over has to clear, in one place
│   └── screens/              # routes composing the Storybook components
├── providers/kiosk-session.tsx   # simulated wallet scan + session state
├── data/                     # menu, pro shop, members, courses, modifiers
└── styles/                   # theme.css carries the TenFore green ramp
references/flows/             # design exports, all 750 x 1298
```

## The prototype

Five flows, all sharing one cart and one checkout: **book a tee time**, **pro
shop**, **food** (including custom sandwiches and drinks), **book a simulator
bay**, **book a pickleball court**.

State is real rather than scripted. A scripted prototype survives only the path
it was recorded on, and totals that never reflect what was chosen make the
checkout screens worthless as a review artefact. So the cart accumulates across
all five flows, the tax maths is real, and modifiers chosen on the customize
screen travel onto the order line.

A session ends for exactly two reasons — **Start Over**, or a completed order —
and both clear the cart, the booking draft, each flow's transient state and the
signed-in member. There is no idle timer: a demo that resets itself mid-sentence
is worse than one left on a checkout.

Navigation is a state machine, not routes. A kiosk has no address bar, no back
button and no shareable link, so the screen a user is on is a fact about the
session rather than a location.

### Signing in

The wallet scan is simulated. Tap the wallet target anywhere it appears, or type
code **482913** on the Enter Code screen to sign in as a member. Fixtures live in
`src/data/members.ts`.

Guests are asked for a name at checkout and members are not, because a member
was already identified by the scan.

## Deploying

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds both
artefacts and combines them into one Pages upload — Storybook at the root, the
prototype at `/prototype/`. Pages serves one artifact per repo, which is why
they are combined rather than deployed separately.

CI (`.github/workflows/ci.yml`) runs on every PR in two jobs: `static`
(typecheck, lint, unit tests) and `build` (both builds plus the story smoke
suite).

## Outstanding assets

Imagery is not fully exported yet. Every stand-in is tagged, so the list is one
grep:

```bash
grep -rn 'data-placeholder-asset' src/
```
