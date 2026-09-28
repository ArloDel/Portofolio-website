# Project: Metaphor: ReFantazio Themed Personal Portfolio for Hakeeem

## Architecture
- **Framework**: Next.js 14+ App Router (`app/` directory), React 18, TypeScript (strict mode)
- **Styling**: Tailwind CSS extended with *Metaphor: ReFantazio* theme tokens, custom CSS utility classes for parchment textures, ornate borders, and polygon clip paths.
- **Typography**: Google Fonts loaded via `next/font/google` (`Cinzel`, `EB Garamond`, `JetBrains Mono`).
- **Motion & Physics**: Zero runtime animation libraries. Pure CSS `@keyframes` with bespoke easing `cubic-bezier(0.87, 0, 0.13, 1)`, native `IntersectionObserver` for scroll reveals, and full `@media (prefers-reduced-motion: reduce)` accessibility support.
- **Graphics & Vectors**: Inline and standalone SVGs (Royal Wax Seal, Heraldic Diamond dividers, Archetype constellation tree, quill cursor) and an HTML5 2D Canvas particle engine for floating embers.
- **Data Layer**: Strongly typed static TypeScript data modules in `app/data/` for profile, projects, archetype skills, and journey history.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Metaphor Color Palette | Near-black (`#0D0B0A`), crimson (`#8B1A1A`/`#C0392B`), aged parchment (`#EDE0C4`/`#D4C5A0`), muted cobalt (`#1B3A5C`/`#2E6B9E`), gold (`#B8975A`), off-white (`#F5F0E8`) | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Bespoke Typography | Cinzel (headings), EB Garamond (body/lore), JetBrains Mono (stats/labels/code) via `next/font` | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Parchment & Ornate Texture | CSS parchment grain overlay with `mix-blend-mode: multiply` and ornate double gold borders | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Custom Desktop Cursor | Quill-pen shaped SVG cursor via `cursor: url()` scoped to pointer-fine devices | M1 | ORIGINAL_REQUEST §R4 |
| 5 | Reduced Motion Support | Full `@media (prefers-reduced-motion: reduce)` disabling all keyframes and pausing canvas | M1 | ORIGINAL_REQUEST §R4 |
| 6 | Desktop Fixed Side Nav | Vertical navigation HUD with active ink-draw underline transition on scroll | M2 | ORIGINAL_REQUEST §R3 |
| 7 | Mobile Bottom HUD Nav | Fixed bottom tab bar styled as a game HUD with active indicator | M2 | ORIGINAL_REQUEST §R3 |
| 8 | Shared UI Motifs | Heraldic diamond dividers, wax seal badges, parchment panels, ornate frames | M2 | ORIGINAL_REQUEST §R1 |
| 9 | Hero / Title Screen | Full-screen canvas, glowing Metaphor title, floating ember particle canvas, blinking PRESS ANY KEY prompt | M3 | ORIGINAL_REQUEST §R2.1 |
| 10 | About / Character Profile | RPG character sheet: hexagonal clipped avatar, 4 skill gauges (FRONTEND, PROBLEM SOLVING, SYSTEM DESIGN, CREATIVITY), lore bio | M3 | ORIGINAL_REQUEST §R2.2 |
| 11 | Projects / Quest Log | Grid of 5 real Quest Cards (@ArloDel), status badges, archetype tags, stamp-scale scroll reveals | M4 | ORIGINAL_REQUEST §R2.3 |
| 12 | Skills / Archetype Tree | Interactive SVG node graph with 9 skills, animated `stroke-dashoffset` line draws, unlock card tooltips | M4 | ORIGINAL_REQUEST §R2.4 |
| 13 | Experience / Journey Log | Vertical chronicle timeline of UPN Jatim & freelance milestones, roman numeral markers, slide-in animation | M5 | ORIGINAL_REQUEST §R2.5 |
| 14 | Contact / Royal Decree | Parchment form, hand-ruled inputs, red wax seal SVG button, letter seal animation, GitHub banner | M5 | ORIGINAL_REQUEST §R2.6 |
| 15 | E2E Test Suite (Tiers 1-4) | Comprehensive opaque-box test suite covering all features, boundaries, interactions, and scenarios | M-TEST | ORIGINAL_REQUEST AC |
| 16 | Final Integration & Tier 5 Hardening | 100% E2E test pass + Tier 5 white-box adversarial coverage hardening | M-FINAL | Project Pattern Spec |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Base Setup & Design Tokens | Next.js 14+ scaffolding, TypeScript, Tailwind config, fonts, textures, cursor, base CSS | none | DONE |
| M2 | Navigation & UI Motifs | Desktop Side Nav, Mobile Bottom HUD, Heraldic Dividers, Wax Seal SVGs, Panel frames | M1 | DONE |
| M3 | Hero & Character Profile | Hero Title Screen (canvas particles + CTA) + Character Sheet (hex avatar + stat bars + bio) | M1, M2 | DONE |
| M4 | Quest Log & Archetype Tree | Quest Log (5 projects + stamp animations) + Archetype Tree SVG (9 nodes + animated lines + tooltips) | M1, M2 | DONE |
| M5 | Journey Log & Royal Decree | Journey Log (timeline chronicle) + Royal Decree Contact (parchment form + wax seal submit) | M1, M2 | DONE |
| M-TEST | E2E Testing Suite Track | Opaque-box E2E test suite (Tiers 1-4), test runner, and `TEST_READY.md` generation | M1 | DONE |
| M-FINAL | E2E Test Pass & Hardening | Phase 1: Pass 100% of Tiers 1-4 tests; Phase 2: Tier 5 white-box adversarial hardening | M3, M4, M5, M-TEST | DONE |

## Interface Contracts
### Data Models (`app/data/`)
- `ProfileData`: `{ name: string, bio: string, role: string, avatarUrl: string, githubUrl: string, stats: Array<{ name: string, level: number, maxLevel: number, category: string }> }`
- `ProjectData`: `{ id: string, name: string, description: string, stack: string[], link: string, status: 'COMPLETED' | 'IN PROGRESS', rank: string }`
- `ArchetypeNode`: `{ id: string, name: string, category: 'Mage' | 'Knight' | 'Commander' | 'Seeker', tier: number, x: number, y: number, description: string, mastered: boolean }`
- `ArchetypeLink`: `{ source: string, target: string }`
- `JourneyEntry`: `{ id: string, title: string, period: string, organization: string, role: string, summary: string, chapter: string }`

### Component Contracts (`app/components/`)
- `HeroSection`: `() => JSX.Element` — renders hero canvas, title, particle embers, and press-any-key CTA.
- `ProfileSection`: `({ profile: ProfileData }) => JSX.Element` — renders hexagonal avatar, RPG stat bars, bio text.
- `QuestLogSection`: `({ projects: ProjectData[] }) => JSX.Element` — renders 5 project quest cards with stamp animations.
- `ArchetypeTreeSection`: `({ nodes: ArchetypeNode[], links: ArchetypeLink[] }) => JSX.Element` — renders SVG node graph with animated stroke-dashoffset lines and hover cards.
- `JourneyLogSection`: `({ entries: JourneyEntry[] }) => JSX.Element` — renders vertical timeline chapters.
- `ContactSection`: `({ githubUrl: string }) => JSX.Element` — renders parchment form, wax seal button, letter animation.
- `Navigation`: `({ activeSection: string, onNavigate: (id: string) => void }) => JSX.Element` — renders desktop sidebar & mobile HUD.

## Code Layout
```
d:/kerji/personal website/
├── app/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── HeraldicDiamond.tsx
│   │   │   ├── ParchmentPanel.tsx
│   │   │   ├── WaxSealButton.tsx
│   │   │   └── ParticleCanvas.tsx
│   │   ├── navigation/
│   │   │   ├── DesktopSidebar.tsx
│   │   │   └── MobileHud.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── QuestLogSection.tsx
│   │   │   ├── ArchetypeTreeSection.tsx
│   │   │   ├── JourneyLogSection.tsx
│   │   │   └── ContactSection.tsx
│   ├── data/
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── archetypes.ts
│   │   └── journey.ts
│   ├── types/
│   │   └── index.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── cursor-quill.svg
│   └── wax-seal.svg
├── tests/
│   ├── e2e/
│   │   ├── tier1_features.test.ts
│   │   ├── tier2_boundaries.test.ts
│   │   ├── tier3_interactions.test.ts
│   │   └── tier4_scenarios.test.ts
│   ├── helpers/
│   │   ├── test_framework.ts
│   │   └── fixtures.ts
│   ├── test_runner.ts
│   └── test_runner.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.mjs
├── TEST_INFRA.md
└── TEST_READY.md
```
