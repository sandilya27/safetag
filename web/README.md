# SAFETAG Web Application

Production Next.js frontend for **SAFETAG**, featuring an interactive scroll-driven dial caliper story, modular service showcases, and client quote pipelines.

---

## ⚡ Tech Stack

- **Framework**: Next.js 16 (App Router with Server Components & Turbopack)
- **Styling**: Tailwind CSS v4 + Custom `@theme inline` design tokens
- **Animations**: Anime.js v4 + SVG layered transformations
- **Icons**: Lucide React
- **Typography**: Archivo, IBM Plex Sans, IBM Plex Mono, Lato

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

Default local address: [http://localhost:3000](http://localhost:3000)

---

## 📂 Source Code Architecture

| Path | Purpose |
| :--- | :--- |
| `src/lib/content.ts` | Source of truth for homepage copy, services, industries, lab zones, and metrics |
| `src/lib/scroll-timeline.ts` | Mathematical scroll scrubber, triggers, and tween orchestration |
| `src/components/home/story-stage.tsx` | Pinned SVG dial caliper canvas, orbital service ring, and metrology callouts |
| `src/components/home/sections.tsx` | Homepage sections 01–08 (Hero, Services, Industries, Labs, Calibration, etc.) |
| `src/components/home/islands.tsx` | Client interactivity (active service card, dynamic calibration readout, quotes) |
| `src/components/chat-widget.tsx` | AI engineering assistant floating modal |
| `public/assets/hero-dial-caliper.svg` | Layered vector illustration with `data-role` and coordinate attributes |

---

## 🎯 Pinned Story vs. Static Fallback

- **Pinned Mode (Desktop ≥ 1100px & motion allowed)**: Sticky stage runs synchronized with vertical scroll across sections 01–05. Heights (`services 360vh`, `industries 130vh`, `labs 150vh`, `calibration 200vh`) anchor the scrub triggers.
- **Static Fallback**: Activated automatically on viewports < 1100px, devices requesting `prefers-reduced-motion`, or low-memory/save-data connections. Controlled by the custom Tailwind `pinned:` variant in `src/app/globals.css`.

### URL Diagnostics
- `?motion=static` — Enforce static fallback layout.
- `?steps=1` — Display live scroll diagnostics HUD (step ID, scrollY, percentage).

---

## 🧪 Quality Assurance

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build test
npm run build
```
