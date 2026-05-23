# Frontend Designer Agent - Roadmap & Project Plan

## Overview

The `frontend-designer` agent is a reusable, global OpenCode agent configured to build any number of frontend projects. Each project lives in its own folder and has its own GitHub repo + Vercel deployment. The agent itself never changes — it only orchestrates building new projects.

---

## Agent Architecture (Do Not Modify)

**Location:** `~/.config/opencode/`
- `opencode.json` — Global config with 7 MCP servers
- `skills/frontend-design/SKILL.md` — Master design skill
- `agents/frontend-designer.md` — Subagent definition (kimi-k2.6)
- `skills/impeccable/SKILL.md` — Design audit skill
- `skills/ui-ux-pro-max/SKILL.md` — Design reasoning engine

**Current Projects Folder:** `F:\1. CORE\Projekt\18.OpenCode\Frontend Agent\`

### Active MCP Servers
| MCP | Status | Purpose |
|-----|--------|---------|
| 21stdev | Active | UI component search |
| n8n | Active | Workflow automation |
| obsidian | Active | Knowledge management |
| shadcn | Active | Component registry |
| supabase | Active | Database & backend |
| vps | Active | SSH server management |
| webflow | Active | No-code publishing |

---

## Active Projects

### 1. frontend-designer-portfolio (CORE)
- **Repo:** https://github.com/Milosaur777/frontend-designer-portfolio
- **Live:** https://frontend-designer-portfolio-umber.vercel.app
- **Folder:** `F:\1. CORE\Projekt\18.OpenCode\Frontend Agent\`
- **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Aesthetic:** Dark-first, minimalist, developer-focused, premium
- **Status:** Live v1.0 — Hero, Stats, Tech Stack, Selected Work, CTA, Footer

### 2. anime-artist-portfolio (IN PROGRESS)
- **Repo:** *(to be created)*
- **Live:** *(to be deployed)*
- **Folder:** `F:\1. CORE\Projekt\18.OpenCode\Anime Artist\`
- **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Aesthetic:** Sparkly, joyful, shiny, stylized, queer, anime convention artist
- **Features:**
  - Hero with sparkly/animated background
  - Portfolio gallery (art showcase)
  - About the artist section
  - Convention schedule
  - Contact/commission info
  - *(Future)* Online shop section
- **Status:** Not started

---

## Planned Future Projects

### 3. SaaS Dashboard
- **Purpose:** Data-dense admin dashboard
- **Aesthetic:** Light mode, high contrast, tabular
- **Features:** Sidebar, KPI cards, data tables, charts
- **Stack:** Next.js + shadcn/ui + Recharts

### 4. E-commerce Webshop
- **Purpose:** Full online store
- **Aesthetic:** Conversion-optimized, clean whites, strong CTAs
- **Features:** Product grid, cart, checkout, auth
- **Stack:** Next.js + Stripe + Supabase

### 5. Personal Blog
- **Purpose:** Content publishing
- **Aesthetic:** Editorial, readable, warm
- **Features:** MDX posts, categories, RSS
- **Stack:** Next.js + Contentlayer

---

## Workflow for New Projects

1. **Create folder:** `F:\1. CORE\Projekt\18.OpenCode\[Project Name]\`
2. **Scaffold:** `npx shadcn@latest init --yes --template next --base-color [color]`
3. **Design:** Generate DESIGN.md with tokens (colors, typography, spacing)
4. **Build:** Use agent with 21stdev + shadcn + custom components
5. **Test:** `npm run build` then `npm run dev`
6. **Git:** `git init` → create GitHub repo → push
7. **Deploy:** `vercel deploy --prod`
8. **Document:** Update this ROADMAP.md

---

## Design System Archetypes

### Portfolio (Developer)
- Dark-first, `#0a0a0a` background
- Geist Sans + Mono
- Tight letter-spacing, negative tracking
- Blue accent (`#3b82f6`)

### Portfolio (Anime Artist)
- *(to be defined — sparkly, joyful, queer aesthetic)*
- Pastel/rainbow gradient palette
- Rounded, bubbly typography
- Glitter/sparkle animations
- Playful, expressive UI

### SaaS Dashboard
- Light mode default
- Data-dense, high contrast
- Blue/gray palette
- Tabular layouts

### E-commerce
- Clean whites, generous imagery
- Strong CTAs
- Trust signals
- Product-focused

---

## Session Continuity Notes

- The agent config lives in `~/.config/opencode/` (global)
- Each project is self-contained in its own folder
- Never modify agent source when building a project
- Always create separate Git repos for separate deployments
- Vercel projects are linked per-repo
- Supabase MCP is project-scoped via `project_ref`

## Tech Stack Standard

All projects use:
- Next.js 15+ (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui components
- Framer Motion (animations)
- Lucide React (icons)
- Geist font family
