# Red Bull Gravity Egypt 2026 — Design Showroom

A single-page app for reviewing, scoring and comparing the competing design drafts for the **Red Bull Gravity Egypt 2026** event landing page.

Each draft is a complete, separately built landing page. The showroom embeds each one live, lets a reviewer score it and record a verdict, then ranks the drafts and exports a text summary for sharing.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, **GSAP**, and **Three.js** (via `@react-three/fiber` / `@react-three/drei`).

## Current lineup

| # | Draft | Direction |
|---|-------|-----------|
| 01 | **Category Standard** | Dark action-sports layout: spotlit can over the pyramids, stacked Anton wordmark, stat-led arena rows. |
| 02 | **Aluminium** | Brutalist identity program: silver and can-blue checkerboard quarter-panels, Anybody typography. |
| 03 | **Midnight Swiss** | Editorial Swiss design on a Red Bull navy field: 12-column hairline grid, Archivo + Geist, a single red accent. |

The lineup is defined in [`tools/drafts.config.json`](tools/drafts.config.json). The built output and metadata live in [`public/drafts/`](public/drafts/).

## How the showroom works

The app uses hash routing, so every view has a URL you can share:

| Route | View | What it does |
|-------|------|--------------|
| `#/` | **Intro** | Title screen with a draggable 3D turntable can. "Start judging" (or "Resume judging") jumps to the first draft you haven't scored yet. |
| `#/lineup` | **Lineup** | Poster grid of every draft with its thesis. |
| `#/heat/<slug>` | **Heat** | The draft running live in an iframe, with desktop/mobile preview modes and a scorecard drawer. |
| `#/results` | **Results** | Drafts ranked by score, with verdicts, notes and a "copy summary" button. |
| `#/compare/<a>/<b>` | **Compare** | Two drafts side by side (50/50 split) with their scorecards. |

### Scoring

On each heat you can record:

- a **score** from 1 to 10
- a **verdict**: *keep*, *maybe* or *cut*
- **what works**: tags for Typography, Colour, Layout, Motion, 3D can, Imagery and Copy
- a free-text **note**

Scores are saved in the browser's `localStorage` under the key `gravity-showroom.v1`, so they are **per browser and per device**. They stay in sync across tabs, and "Clear all" on the Results view resets them. To share results with others, use **Copy summary** on the Results view, which puts a plain-text ranking on the clipboard.

### Keyboard shortcuts (Heat view)

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / next draft (`→` on the last draft opens Results) |
| `S` | Open or close the scorecard |
| `1`–`9`, `0` | Set the score (`0` = 10) while the scorecard is open |
| `Esc` | Close the scorecard |

Shortcuts are ignored while you're typing in a text field.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

The drafts in `public/drafts/` are committed pre-built, so the showroom runs without rebuilding them.

## Rebuilding the drafts

Each draft's source lives on its own git branch (`redesign/<slug>`). Two scripts in [`tools/`](tools/) turn those branches into the static pages and posters the showroom serves:

```bash
npm run drafts:build     # build every draft into public/drafts/<slug>/ and rewrite manifest.json
npm run drafts:posters   # screenshot every draft into public/drafts/posters/ (desktop + mobile)

# Or target specific drafts by slug
node tools/build-drafts.mjs aluminium midnight-swiss
node tools/capture-posters.mjs midnight-swiss
```

- **`build-drafts.mjs`** checks out each branch into a temporary git worktree, builds it with Vite using `base: '/drafts/<slug>/'`, and records the short commit SHA and build time in `public/drafts/manifest.json`. The app reads that manifest as its only source of truth for the lineup.
- **`capture-posters.mjs`** serves `public/` locally and uses headless Chromium (Playwright) to capture a 1440×900 desktop poster and a 390×844 mobile poster for each draft.

The `redesign/*` branches must exist in your local clone before you run `drafts:build`. Run `drafts:build` after a redesign branch gets new commits, then run `drafts:posters` to refresh the previews.

**To add or remove a draft:** edit `tools/drafts.config.json` (`slug`, `ref`, `name`, `thesis`), then run both scripts. See [`tools/README.md`](tools/README.md) for more detail.

## Project structure

```
├── index.html
├── public/
│   ├── drafts/              # built drafts, posters and manifest.json (generated)
│   ├── models/              # Red Bull can .glb models
│   ├── textures/            # can water-droplet normal map
│   └── *.jpg / *.mp3        # shared imagery and audio used by the drafts
├── src/
│   ├── App.tsx              # route → view switch
│   ├── router/useHashRoute.ts
│   ├── views/               # Intro, Lineup, Heat, Results, Compare
│   ├── components/          # TurntableCan (3D can), ScoreCard
│   ├── store/showroomStore.ts  # localStorage-backed verdict store
│   ├── data/manifest.ts     # typed wrapper over public/drafts/manifest.json
│   └── utils/motion.ts      # reduced-motion helper
└── tools/
    ├── drafts.config.json   # the draft lineup
    ├── build-drafts.mjs
    └── capture-posters.mjs
```

## Accessibility

Every GSAP animation and the auto-rotating can check `prefers-reduced-motion`. With reduced motion on, content appears in its final state and the can stays still unless you drag it.
