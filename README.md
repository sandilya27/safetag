<div align="center">

# 🛡️ SAFETAG
### Next-Generation Industrial Testing, Inspection & Calibration Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Anime.js](https://img.shields.io/badge/Anime.js-v4-FC395A?style=for-the-badge)](https://animejs.com/)
[![Region](https://img.shields.io/badge/Region-Kingdom_of_Saudi_Arabia-006C35?style=for-the-badge)](https://en.wikipedia.org/wiki/Saudi_Arabia)

<p align="center">
  <strong>Comprehensive digital redesign and web platform for SAFETAG — Delivering accredited, traceable calibration, non-destructive testing (NDT), and third-party inspection services across the Kingdom of Saudi Arabia.</strong>
</p>

[Explore Services](#-core-services) • [Key Features](#-platform-highlights) • [Tech Stack](#-technology-stack) • [Quick Start](#-quick-start) • [Repository Structure](#-repository-structure)

---

</div>

## 📌 Executive Summary

**SAFETAG** is an accredited third-party technical authority in Saudi Arabia specializing in precision calibration, non-destructive testing (NDT), mechanical/metallurgical laboratory evaluations, and industrial inspection.

This repository hosts the complete web redevelopment initiative designed to modernize SAFETAG's digital identity into an interactive, high-performance, and conversion-optimized digital platform.

---

## ✨ Platform Highlights

### 1. ⚙️ Scroll-Driven Dial Caliper Experience
- **Interactive Storytelling Stage**: A custom-engineered SVG dial caliper orchestrates across 8 narrative stages (`S0`–`S7`), seamlessly demonstrating precision metrology through scroll progress.
- **Dynamic Orbital Service Ring**: Revolves through 8 primary industrial services with synchronized counter-rotation to maintain upright indicators.
- **Exploded Metrology View**: Deconstructs precision components into distinct analytical callouts during laboratory section walkthroughs.
- **Real-Time Calibration Sweep**: Animates needle deflection and live digital tolerance readouts (`WITHIN TOLERANCE` / `MEASURING` states) synchronized to scroll velocity.
- **Adaptive Story Modes**: Pinned full-screen stage on desktop (≥ 1100px); on phones and tablets the same caliper docks in a sticky band under the header while the text scrolls beneath it; a lightweight static fallback for low-power devices, short landscape screens, or `prefers-reduced-motion`.

### 2. 💬 AI-Powered Engineering Inquiry Assistant
- Embedded smart conversational assistant designed to address client technical queries, explain inspection certifications, and accelerate request-for-quote (RFQ) submissions.

### 3. 🔍 Traceable Certificate Verification & Instant Quotation
- Built-in verification workflows for calibration certificates, reducing administrative friction for audits and compliance officers.
- Streamlined quote builder allowing clients to request site visits or lab bookings across Saudi Arabia.

---

## 🛠 Technology Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Server Components, Partial Prerendering, optimized asset streaming |
| **Language** | **TypeScript 5** | Strict end-to-end static typing and interface validation |
| **Styling** | **Tailwind CSS v4** | Modern inline theme design tokens, CSS variables, custom variants |
| **Motion & Graphics** | **Anime.js v4 + Scalable Vector Graphics (SVG)** | Deterministic scroll scrub timeline and layer transformations |
| **Typography** | **Archivo, IBM Plex Sans, IBM Plex Mono** | Precision industrial editorial typography |
| **Icons** | **Lucide React** | Clean, accessible iconography |
| **CMS & Data** | **Strapi Headless CMS / Drizzle ORM** | Schema-driven content pipeline for services, labs, and case studies |
| **Database** | **PostgreSQL** | Enterprise relational storage for quotes and certificate tracking |

---

## 📁 Repository Structure

```text
safetag/
├── 37a24d55-..._Proposal-1.pdf  # Formal website redesign & technical development proposal
├── safetag_logo.pdf             # Official brand vector logo and identity specifications
├── README.md                    # Project documentation
│
└── web/                         # Production Next.js web application
    ├── public/
    │   ├── assets/
    │   │   └── hero-dial-caliper.svg # Multi-layer caliper illustration with data anchors
    │   └── favicon.ico
    ├── src/
    │   ├── app/
    │   │   ├── globals.css      # Design tokens, grid-paper background, pinned variants
    │   │   ├── layout.tsx       # Root layout with pre-paint motion detection
    │   │   └── page.tsx         # Assembled sections (Hero to Footer)
    │   ├── components/
    │   │   ├── chat-context.tsx # Assistant modal state provider
    │   │   ├── chat-widget.tsx  # Floating technical assistant interface
    │   │   ├── logo.tsx         # Responsive SAFETAG brand component
    │   │   ├── site-header.tsx  # Navigation with desktop & mobile slide-out menus
    │   │   ├── site-footer.tsx  # Industrial footer & mobile quick quote bar
    │   │   └── home/
    │   │       ├── islands.tsx  # Active service card, calibration readout, quote forms
    │   │       ├── sections.tsx # Sections 01–08 (Hero, Services, Labs, Calibration...)
    │   │       ├── story-context.tsx # Scroll stage state (active service, gauge progress)
    │   │       └── story-stage.tsx   # Sticky scrub canvas & Anime.js integration
    │   └── lib/
    │       ├── content.ts       # Structured copy for all services, industries, and labs
    │       └── scroll-timeline.ts # Mathematical timeline and trigger engine
    ├── next.config.ts           # Turbopack rules, prefetching & cache configuration
    ├── package.json             # Application dependencies and build scripts
    └── tsconfig.json            # TypeScript path aliases and compiler options
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+)

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sandilya27/safetag.git
   cd safetag/web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Developer URL Parameters
- `?motion=static` — Forces the lightweight static fallback layout (bypasses pinned animation).
- `?steps=1` — Displays real-time scroll diagnostics HUD (step ID, scrub percentage, `scrollY`).

### Production Build & Verification

```bash
# Verify static typing
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Generate production bundle
npm run build

# Launch production server
npm run start
```

---

## 🧪 Industrial Standards & Compliance

SAFETAG procedures and technical operations align with international and regional quality standards:
- **ISO/IEC 17025**: General requirements for the competence of testing and calibration laboratories.
- **SASO**: Saudi Standards, Metrology and Quality Organization regulations.
- **ASME / ASTM / API / AWS**: Industrial pressure vessel, piping, welding, and NDT compliance.

---

## 👨‍💻 Project Maintainer

- **Developer / Lead**: [sandilya27](https://github.com/sandilya27)
- **Organization**: SAFETAG Technical Services, Saudi Arabia
- **License**: Private / Proprietary — All Rights Reserved.
