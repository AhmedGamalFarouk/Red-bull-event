# Showroom Build Pipeline Tools

This directory contains the pipeline tooling to compile and capture previews for the design showroom drafts.

## Tools

### 1. `tools/drafts.config.json`
Configuration file containing the list of drafts to compile:
- `slug`: Unique identifier and directory name in `public/drafts/<slug>`
- `ref`: Git branch or commit hash pointing to the draft's source
- `name`: Human-readable display name for the draft
- `thesis`: Concise sentence defining the draft's design direction

### 2. `tools/build-drafts.mjs`
Compiles each draft using Vite's programmatic build API:
- Spawns a temporary detached git worktree in `os.tmpdir()` for the specified ref.
- Creates an NTFS directory junction linking `<tmp>/node_modules` to root `node_modules`.
- Runs Vite build with `base: '/drafts/<slug>/'`, `publicDir: false`, and `outDir: public/drafts/<slug>`.
- Safely unlinks the junction and prunes the temporary git worktree.
- Generates `public/drafts/manifest.json` containing metadata, short commit SHAs, URLs, and build timestamps.

**Usage:**
```bash
# Build all drafts
npm run drafts:build

# Or build specific drafts by slug
node tools/build-drafts.mjs aluminium midnight-swiss
```

### 3. `tools/capture-posters.mjs`
Spins up a lightweight local static server for `public/` and drives headless Playwright Chromium to capture preview posters:
- Navigates to `/drafts/<slug>/` at desktop resolution (1440x900) and waits for animations/preloader to settle (~7s).
- Captures `public/drafts/posters/<slug>.jpg` (quality 78).
- Resizes viewport to mobile (390x844) and captures `public/drafts/posters/<slug>-mobile.jpg`.
- Gracefully handles errors per draft without halting the suite.

**Usage:**
```bash
# Capture posters for all drafts
npm run drafts:posters

# Or capture posters for specific drafts
node tools/capture-posters.mjs midnight-swiss
```

## When to Rerun

- **Rerun `npm run drafts:build`**: Whenever a redesign branch receives new commits or design tweaks that should be reflected in the showroom.
- **Rerun `npm run drafts:posters`**: Whenever drafts are rebuilt and fresh preview screenshots are required for the showroom gallery UI.
