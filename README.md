# tf-jackrabbit-ds-v1

Design system for the **TenFore Golf JackRabbit kiosk** — an Untitled UI + React
Aria component library authored against the kiosk's 750 × 1298 design canvas.

Shares its brand palette and token set with
[tf-buck-ds-v1](https://jg-tenfore.github.io/tf-buck-ds-v1/), so components move
between the two repos unchanged.

## Commands

```bash
npm install
npm run storybook        # component library at http://localhost:6020
npm run build-storybook  # static build -> storybook-static/
npm run dev              # Next dev server (prototype shell)
```

## Layout

```
src/
├── kiosk/                    # canvas primitives: KioskFrame, KioskScreen, constants
├── components/
│   ├── base/                 # Untitled UI primitives (ported from Buck)
│   ├── foundations/          # tokens, logos, featured icons
│   └── kiosk/                # kiosk-specific components
│       ├── keyboard/         # on-screen keyboard + code input
│       ├── nav/              # persistent header + footer action rail
│       └── auth/             # scan prompt, how-to-log-in
├── providers/kiosk-session.tsx   # simulated wallet scan + session state
├── data/members.ts           # member fixtures backing the scan
└── styles/                   # theme.css carries the TenFore green ramp
references/flows/             # 157 design exports, all 750 x 1298
```

Read `Introduction` in Storybook first — it covers the canvas model, the kiosk
constraints that shape every component, and how the simulated scan works.

## Outstanding assets

Imagery is not exported yet. Every stand-in is tagged, so the list is one grep:

```bash
grep -rn 'data-placeholder-asset' src/
```
