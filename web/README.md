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

## 🎯 Story Modes: Pinned, Docked, Static

One timeline (`src/lib/scroll-timeline.ts`) drives the caliper in two layouts. Steps share their scroll triggers; a step may add `docked` poses or trigger overrides.

- **Pinned (desktop ≥ 1100px, motion allowed)**: full-viewport sticky stage that sections scroll over. Heights (`services 360vh`, `industries 130vh`, `labs 150vh`, `calibration 200vh`) anchor the scrub triggers.
- **Docked (phones and tablets < 1100px, at least 560px tall, motion allowed)**: the caliper sits in a sticky band under the header (`--band: 38svh`) and the text scrolls beneath it. Triggers are measured against the readable area below the band. The ring orbits with the active-service card stuck under it, the caliper explodes with short callouts beside the lab list, the calibration readout docks under the band while the needle sweeps, and the dark Certifications section wipes over the band.
- **Static fallback**: reduced motion, short landscape phones, save-data or low-power devices, or if Anime.js / the SVG fails to load.

Tailwind variants in `src/app/globals.css`: `pinned:`, `docked:`, and `story:` (either). Their media queries must match `PINNED_QUERY` / `DOCKED_QUERY` in `story-stage.tsx`.

### URL Diagnostics
- `?motion=static`: force the static fallback.
- `?motion=on`: skip the low-power device check (test the story on any hardware).
- `?steps=1`: live scroll diagnostics HUD (mode, step ID, progress, scrollY).

---

## 🗺️ Routes

| Route | Page |
| :--- | :--- |
| `/` | Home: caliper scroll story |
| `/services`, `/services/[slug]` | Service index (grouped) and 13 service pages |
| `/industries` | Six sectors, anchored (`/industries#oil-gas`) |
| `/laboratories`, `/certifications` | Lab zones; accreditations and certificate check |
| `/projects`, `/projects/[slug]` | Filterable case studies and write-ups |
| `/about`, `/careers`, `/news`, `/news/[slug]`, `/faq`, `/contact` | Company pages |
| `/request-a-quote` | Six-step quote form (`?service=` / `?location=` prefill) |
| `/privacy-policy`, `/terms-and-conditions` | Legal (draft templates) |
| `/api/inquiries` | Quote, contact and careers submissions |
| `/sitemap.xml`, `/robots.txt` | Generated from content |

Content lives in `src/lib/*.ts`, shaped after the planned Strapi types. Facts SAFETAG has not confirmed render an amber **TBC** marker.

### Environment
- `NEXT_PUBLIC_SITE_URL`: canonical origin for metadata, sitemap and JSON-LD (default `https://www.safetag.sa`).
- `INQUIRY_WEBHOOK_URL`: where `/api/inquiries` forwards validated submissions until the Express backend is connected. Unset, submissions are only logged.

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
