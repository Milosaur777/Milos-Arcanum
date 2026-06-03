# MCP Setup & Troubleshooting Walkthrough

> **Purpose:** This document serves as a complete runbook for setting up MCP (Model Context Protocol) servers in future projects from a fresh context window. It contains every step, configuration detail, and hard-won insight from getting the Anime Artist Portfolio project working.

---

## Table of Contents

1. [What Are MCPs?](#1-what-are-mcps)
2. [Prerequisites](#2-prerequisites)
3. [Step-by-Step Setup](#3-step-by-step-setup)
4. [MCP Server Configurations](#4-mcp-server-configurations)
5. [Common Issues & Fixes](#5-common-issues--fixes)
6. [Verification Checklist](#6-verification-checklist)
7. [Key Insights & Lessons Learned](#7-key-insights--lessons-learned)

---

## 1. What Are MCPs?

MCP (Model Context Protocol) servers are **external tools that extend the AI's capabilities**. They allow the AI to:

- **Search and install UI components** (21st.dev, shadcn/ui)
- **Deploy to no-code platforms** (Webflow)
- **Generate specialized frontend code** (impeccable, frontend-design skills)
- **Access design systems and component libraries**

Without MCPs, the AI is limited to generic code generation. With MCPs, it becomes a specialized frontend engineering assistant.

### MCP Servers Used in This Project

| Server | Purpose | Key Capabilities |
|--------|---------|------------------|
| `21stdev` | UI component search & generation | Search components, get code snippets, refine existing components |
| `webflow_*` | Webflow integration | Build pages, manage CMS, upload assets, deploy sites |
| `shadcn` | shadcn/ui registry | Search components, view examples, get add commands |
| `frontend-designer` | Design system generation | Generate DESIGN.md, audit UI, build production-ready components |

---

## 2. Prerequisites

### Required Files

Before starting, ensure these files exist in your project root:

```
project-root/
├── .opencode/
│   └── mcp_servers.json       # MCP server definitions (CRITICAL)
├── components.json              # shadcn/ui configuration
├── package.json                 # Node.js dependencies
└── next.config.js / next.config.ts  # Next.js configuration
```

### Required Software

- **Node.js** 18+ (check: `node -v`)
- **npm** or **yarn**
- **Vercel CLI** (`npm i -g vercel`) for deployment
- **Git** for version control

---

## 3. Step-by-Step Setup

### Phase 1: Project Initialization

```bash
# 1. Create Next.js project (if starting fresh)
npx create-next-app@latest my-project --typescript --tailwind --eslint --app --src-dir

# 2. Initialize shadcn/ui
npx shadcn@latest init
# Select: Next.js, TypeScript, Slate (or custom colors)
# This creates components.json and installs base dependencies

# 3. Verify project builds
cd my-project
npm run build
```

### Phase 2: MCP Server Configuration

#### ⚠️ CRITICAL: The `.opencode/mcp_servers.json` File

This file is **the most important file** for MCP functionality. It tells the AI which tools are available.

**Location:** `project-root/.opencode/mcp_servers.json`

**Template:**

```json
{
  "mcpServers": {
    "21stdev": {
      "command": "npx",
      "args": ["-y", "@21st-dev/mcp-server"],
      "description": "21st.dev UI component builder and inspiration"
    },
    "webflow_data_cms": {
      "command": "npx",
      "args": ["-y", "@webflow/mcp-server-data"],
      "description": "Webflow Data API for CMS"
    },
    "webflow_designer": {
      "command": "npx",
      "args": ["-y", "@webflow/mcp-server-designer"],
      "description": "Webflow Designer API"
    },
    "shadcn_registry": {
      "command": "npx",
      "args": ["-y", "@shadcn/mcp-server"],
      "description": "shadcn/ui component registry"
    }
  }
}
```

**Key Points:**
- Use `npx -y` to auto-install and run without global installation
- Each server runs as a separate Node.js process
- The AI auto-discovers these on startup IF the file exists

### Phase 3: Installing MCP Dependencies

Some MCP servers require additional packages:

```bash
# For 21st.dev components
npm install framer-motion lucide-react

# For shadcn/ui components (auto-installed by shadcn init)
# Radix UI primitives, tailwind-merge, clsx, etc.

# For Webflow (if using DevLink)
# Follow Webflow's specific setup guide
```

### Phase 4: Testing MCP Connectivity

In a **fresh chat context**, run these tests in order:

```
Test 1: "Search 21st.dev for a button component"
→ Should return: Component name, code snippet, install instructions

Test 2: "What shadcn components are available?"
→ Should return: List of components from registry

Test 3: "List my Webflow sites"
→ Should return: Site names and IDs (requires auth)
```

---

## 4. MCP Server Configurations

### 4.1 21st.dev MCP

**Purpose:** Search and generate React/Tailwind components

**When to use:**
- Need a specific UI component (hero, pricing cards, navbar)
- Want to see examples before building
- Need to refine an existing component's UI

**Key Commands:**
- `/21st fetch [component-name]` — Get component data and preview
- `/ui [description]` — Generate a new component
- `/21st refine [component-name]` — Improve existing component

**Gotchas:**
- Returns code snippets only — you must manually integrate into files
- Sometimes returns incomplete code — always verify before pasting
- Use `/21st fetch` before `/21st refine` to get existing code

### 4.2 shadcn/ui MCP

**Purpose:** Access the shadcn/ui component registry

**When to use:**
- Need standard UI primitives (Button, Card, Dialog, Form)
- Want to see usage examples
- Need to check if a component exists before building custom

**Key Commands:**
- `npx shadcn add [component]` — Add to project (run in terminal)
- Search registry for examples: `shadcn_get_item_examples_from_registries`
- View component details: `shadcn_view_items_in_registries`

**Gotchas:**
- Requires `components.json` to exist (created by `shadcn init`)
- Some components need manual dependency installation
- Examples may use older Next.js patterns — adapt for your version

### 4.3 Webflow MCP

**Purpose:** Two-way sync between code and Webflow

**Servers:**
- **Designer API:** Build pages, add elements, manage styles
- **Data API:** CMS collections, assets, scripts, redirects

**When to use:**
- Exporting a Next.js design to Webflow for no-code editing
- Managing CMS content programmatically
- Uploading assets in bulk

**Authentication:**
- Requires Webflow site ID (never hardcode — always ask user)
- Use `webflow_data_sites_tool` to list accessible sites first
- Designer API requires the Webflow Designer to be open

**Gotchas:**
- Designer API only works when connected to a live Webflow Designer session
- Data API works headlessly but needs proper scopes
- Always provide `context` parameter (15-25 words, third person)

### 4.4 Frontend Designer Skill

**Purpose:** Heavy-lifting design agent for complete UI generation

**When to use:**
- Building entire pages from scratch
- Generating DESIGN.md files
- Auditing existing UI for anti-patterns

**Trigger keywords:**
- `design`, `UI`, `UX`, `component`, `portfolio`, `dashboard`, `landing page`
- `audit`, `polish`, `critique`, `animate`, `colorize`, `typography`

**Anti-Pattern Checklist (ALWAYS verify):**
- [ ] No pure black (`#000000`) backgrounds
- [ ] No gray text on colored backgrounds
- [ ] All clickable elements have `cursor-pointer`
- [ ] All interactive elements have hover/focus states
- [ ] No emojis as icons (use Lucide React)
- [ ] Images have `alt` text
- [ ] Semantic HTML (`<button>`, not `<div onclick>`)

---

## 5. Common Issues & Fixes

### Issue 1: MCP Servers Not Detected

**Symptom:** AI says "I don't have access to [tool]" or "I can only use [X, Y] tools"

**Causes & Fixes:**

1. **Missing `mcp_servers.json`**
   - Fix: Create `.opencode/mcp_servers.json` with proper schema
   - Verify: File must be in project root, not in `.opencode/` subfolder

2. **JSON Syntax Error**
   - Fix: Validate JSON with `node -e "JSON.parse(require('fs').readFileSync('.opencode/mcp_servers.json'))"`
   - Common error: Trailing commas in JSON (not allowed!)

3. **Wrong File Location**
   - Fix: Must be `.opencode/mcp_servers.json` (note the dot in `.opencode`)
   - NOT `opencode/mcp_servers.json`
   - NOT `.opencode.json`

4. **Git Ignored / Lost on Move**
   - **🔑 IMPORTANT:** The `.opencode/` directory is now **tracked in git** — it survives moves and clones
   - If you find it missing after a move/clone: `git checkout HEAD -- .opencode/mcp_servers.json`
   - If you deliberately want it untracked, add `.opencode` to `.gitignore` (but you'll need to recreate it manually next time)

5. **Process Not Restarted**
   - Fix: The AI detects MCPs on startup. In a fresh chat, it should auto-detect.
   - If not detected, mention: "Please read the MCP configuration from .opencode/mcp_servers.json"

### Issue 2: 21st.dev Returns Empty or Error

**Symptom:** "I couldn't find any components matching your query"

**Fixes:**
- Use shorter search queries (2-4 words max)
- Try different keywords: "hero section" instead of "a beautiful hero section for my anime portfolio"
- Check if the MCP server process is running: look for Node.js processes

### Issue 3: shadcn Components Not Installing

**Symptom:** `npx shadcn add button` fails with "components.json not found"

**Fixes:**
- Run `npx shadcn@latest init` first
- Ensure you're in the project root (where `package.json` lives)
- Check `components.json` exists: `cat components.json`

### Issue 4: Webflow Designer API Fails

**Symptom:** "Not connected to Webflow Designer" or timeout errors

**Fixes:**
- Designer API requires an active Webflow Designer browser tab
- Data API works without Designer but needs correct site ID
- Always list sites first: `webflow_data_sites_tool` → ask user to pick

### Issue 5: Font/Style Issues After Component Integration

**Symptom:** Component looks broken or has wrong styling

**Fixes:**
- 21st.dev components assume Tailwind CSS v4
- Check `globals.css` for conflicting styles
- Verify design tokens from DESIGN.md are applied
- Look for hardcoded colors — replace with CSS variables

---

## 6. Verification Checklist

After setup, verify each MCP works:

### 21st.dev
```
✅ Can search components
✅ Returns code snippets
✅ Can refine existing components
✅ Code integrates without errors
```

### shadcn/ui
```
✅ components.json exists and is valid
✅ Can list registry items
✅ Can view component examples
✅ `npx shadcn add [component]` works
```

### Webflow
```
✅ Can list sites
✅ Can get site details
✅ Designer API connects (if Designer is open)
✅ Data API can read CMS collections
```

### General
```
✅ Project builds without errors: npm run build
✅ No TypeScript errors
✅ All new files are committed to git
✅ Deploy to Vercel works
```

---

## 7. Key Insights & Lessons Learned

### 🔑 Insight 1: The `.opencode` Directory is Sacred

The `.opencode/mcp_servers.json` file is the **single source of truth** for MCP configuration. If it's missing or malformed, NONE of the MCP tools work. Always verify this file first when starting a new project.

### 🔑 Insight 2: Context Matters

Webflow tools require a `context` parameter (15-25 words, third person). This is NOT optional — it's used for analytics and debugging. Always include it.

### 🔑 Insight 3: Order of Operations

When building a page:
1. **Design first** — Generate or read DESIGN.md
2. **Check existing components** — Search shadcn and 21st.dev
3. **Build custom** — Only when no suitable component exists
4. **Verify** — Run the Anti-Pattern checklist
5. **Deploy** — Test on mobile and desktop

### 🔑 Insight 4: Mobile is Different

- `@media (hover: hover) and (pointer: fine)` targets desktop only
- `@supports (-webkit-background-clip: text)` is **NOT reliable** — browsers claim support but render incorrectly
- `inline-flex` vs `flex` makes a huge difference in container width
- `max-w-[90vw]` prevents overflow on mobile

### 🔑 Insight 5: Font Loading is Fragile

- `next/font/google` with `display: 'swap'` + fallbacks
- Add `@import` for Google Fonts in `globals.css` as backup
- Always test fonts on multiple devices

### 🔑 Insight 6: Git Commit Discipline

- Commit after EVERY significant change
- Use semantic commit messages: `feat:`, `fix:`, `refactor:`, `style:`
- Push before deploying — Vercel deploys from git

### 🔑 Insight 7: The AI Has Limits

- MCPs return **snippets**, not complete solutions
- The AI cannot see the result of its changes in real-time
- Always verify by reading files after edits
- Build frequently — catch TypeScript errors early

---

## Quick Start Template

For a brand new project, run this sequence:

```bash
# 1. Create project
cd /path/to/projects
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app

# 2. Init shadcn
npx shadcn@latest init

# 3. Create MCP config
mkdir -p .opencode
cat > .opencode/mcp_servers.json << 'EOF'
{
  "mcpServers": {
    "21stdev": {
      "command": "npx",
      "args": ["-y", "@21st-dev/mcp-server"]
    },
    "shadcn_registry": {
      "command": "npx",
      "args": ["-y", "@shadcn/mcp-server"]
    }
  }
}
EOF

# 4. Install extras
npm install framer-motion lucide-react

# 5. Build and verify
npm run build

# 6. Git init
git init
git add .
git commit -m "feat: initial setup with MCP configuration"
```

---

## Backup & Recovery

**This file should be:**
- ✅ Committed to git in the project repository
- ✅ Copied to a template repository for future use
- ✅ Referenced at the start of every new project

**If MCPs stop working:**
1. Check `.opencode/mcp_servers.json` exists and is valid JSON
2. Verify Node.js processes are running (`ps aux | grep mcp` on Unix)
3. Start a fresh chat context
4. Reference this document for the exact configuration

---

*Last updated: May 27, 2026*
*Project: Anime Artist Portfolio — Neos Art Corner*
*Author: OpenCode AI Assistant*
