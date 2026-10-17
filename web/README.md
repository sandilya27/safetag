# SAFETAG website

Homepage built from the Claude Design handoff in `../project` (`Homepage.dc.html`, caliper concept).
Stack follows the scroll spec: Next.js (App Router) + Tailwind v4 + Anime.js v4, icons from `lucide-react`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Layout

| Path | What it is |
| --- | --- |
| `src/lib/content.ts` | All homepage copy, shaped after the Strapi `homepage` single type |
| `src/lib/scroll-timeline.ts` | Scroll story steps S0–S7 and the scrub engine (port of `project/scroll-timeline.js`) |
| `src/components/home/story-stage.tsx` | Sticky stage: inlined caliper SVG, service ring, lab callouts |
| `src/components/home/sections.tsx` | Sections 01–08 (server components) |
| `src/components/home/islands.tsx` | Interactive bits: active service card, calibration readout, testimonials, quick quote |
| `public/assets/hero-dial-caliper.svg` | Layered caliper illustration (`g[data-role]`, `data-dx/dy`, `#cl-needle`) |

## Pinned vs static

The pinned story runs when the viewport is at least 1100px wide and motion is allowed. Otherwise the
page renders the static fallback. This is decided in CSS through the `pinned:` variant in
`globals.css`, so the server-rendered HTML is already correct on first paint. `html[data-motion="static"]`
forces the fallback. A pre-paint script in `layout.tsx` sets it on save-data or low-power
devices, and the stage sets it if Anime.js or the SVG fails to load.

Pinned section heights (services 360vh, industries 130vh, labs 150vh, calibration 200vh) are what the
scroll triggers rely on.

Dev query params: `?motion=static` forces the fallback; `?steps=1` shows the current step / progress HUD.

## Placeholders

Everything with an amber **TBC** marker (certifications, figures, address, quote turnaround) needs
confirming by SAFETAG before launch. Testimonials and project metrics are placeholders.
