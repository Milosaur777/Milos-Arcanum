# DESIGN.md — OC Dating Platform

## 1. Vision

En rollspelsapp där användare skapar dejtingprofiler för sina Original Characters (OCs) — oavsett genre — och matchar med andras OCs via tagg-baserad kompatibilitet. Din OC kan vara vad som helst: en drake, en rymdvarelse, ett monster, en detektiv från 20-talet, en alv, en cigarrökande antihjälte, eller en helt vanlig människa. Fantasy, sci-fi, horror, historiskt, noir — alla genrer är välkomna. Inspirerad av Hinge's enkelhet men med rollspel och karaktärsskapande i centrum.

**Motto:** *Let your characters find each other.*

---

## 2. Visual Theme

- **Mood:** Lekfull, dark-first, community-driven, premium utan att vara stel
- **Vibe:** Hinge möter en custom character creator — personligt, uttrycksfullt, modernt
- **Dark Palette:** Samma som launchpad-agentens mörka palett (se sektion 5)
- **Light Mode:** Kommer senare som en skin

---

## 3. User Flow (Phase 1 — MVP)

```
Landing → Dashboard → Create OC → Fill Fields → Set Visibility → Save
                         ↓
                    Dashboard (med OC-lista)
                         ↓
                    Browse / Search OCs
                         ↓
                    Matchmaking (tag-based)
                         ↓
                    Chat / Dating Session
```

### 3.1 Dashboard (Huvudvy)
- **Plustecken (+)** för att skapa första/ny OC
- Lista över alla användarens OCs (sorterbar)
- Each OC card visar: namn, bild, taggar, kort status
- **Brand/Rank badge** per OC syns här

### 3.2 OC Creator
- Formulär med fältsektioner:
  - **Basics:** Namn, ålder, species/race, kön, sexuell läggning
  - **Utseende:** Längd, hår, ögon, kroppstyp, distinguishing features
  - **Personlighet:** Traits, MBTI, styrkor/svagheter
  - **Bakgrund:** Backstory, occupation, homeworld
  - **Taggar:** Användardefinierade taggar för matchning (t.ex. "drake", "elf", "mage")
  - **Två sanningar och en lögn:** Per OC, för profilförbättring
  - **Open Feed:** Fritextfält där man kan skriva vad som helst
- **Checkbox per fält:** "Show on Profile" / "Hidden from Profile"
- **Skip Question-knapp:** Varje fråga kan hoppas över
- **Pre-made Characters:** Ett urval av bare-bones mallar för snabb start (t.ex. "Mystisk riddare", "Rymdvarelse", "Skogsvätte"). Går att redigera efteråt.
- **Multi-OC:** När en OC är skapad, tryck + igen för nästa

### 3.3 Matchmaking
- **Sökfunktion:** Sök efter andra OCs via taggar
- **Algoritm:**
  - Du väljer vad du söker hos en annan OC (taggar/kategorier)
  - Andra användare har sagt vad de söker
  - När dina önskade taggar matchar en annans OC-taggar → poäng
  - Ju fler taggar som matchar, desto högre compatibility score
  - Högst score = bäst match
- **Search by ID:** Skriv in en specifik användares ID för att hitta dem direkt (för vänner)

### 3.4 Chat / Dating Session
- Chatt för matchade par
- **Innan chatten startar:** Välj om bilder tillåts i chatten (toggle)
- Chatten är starten på en "date" eller session
- **Scene Roleplay Mode** (senare):
  - Välj en scen: strand, grotta, taverna, skog, slott, etc.
  - Alternativ: "True Setting" (förutbestämd) eller "Random"
  - Scenen blir miljön för rollspelsessionen

### 3.5 Badges
- Efter en date/rollspelssession kan man ge den andra spelaren en badge
- Badge-typer: "Rolig", "In Character", "Bra rollspel", "Creativ", etc.
- Badges samlas på användarens profil
- Välj max 5 badges att visa på sin profil (synligt för andra)
- Kan ses när någon klickar in på din profil och dina synliga OCs

---

## 4. Profile & Visibility System

- Varje OC har en **publik profil** (vad andra ser) och en **privat vy** (skaparen ser allt)
- Per-fält checkbox avgör synlighet: `☐ Show on Profile` / `☑ Hidden`
- Default: Alla fält är synliga förutom "känsliga" fält (markeras i creator)
- Open Feed-poster har också individuell show/hide toggle

---

## 5. Brand / Rank System

- **Brand** ökar ju mer du använder profilen:
  - Logga in dagligen
  - Uppdatera OC-info
  - Genomför matchmaking
  - Slutför chats/dates
  - Få badges från andra
- Högre brand = högre synlighet i matchmaking-resultat
- Brand visas som en badge/nivåindikator på dashboard och profil

---

## 6. Monetization & Skins

- **Donationer:** Ko-Fi, Patreon, Subscribestar-länkar
- **Skins:** Köpbar omskinning av hela appens UX
  - T.ex. "Fantasy Theme", "Cyberpunk Theme", "Mörk Romantik"
  - Ändrar färger, typsnitt, animationer, ikoner
- **QoL Features:** Små betalfunktioner för att stödja appen
  - T.ex. fler badge-platser, avancerad statistik, custom tag-färger
- **Emoji-paket:** Stort urval av emojis att använda i profiler och chatt

---

## 7. Color Palette (Dark Mode)

| Token | Hex | Role |
|---|---|---|
| `background` | `#0a0a0a` | Near-black canvas |
| `surface` | `#171717` | Kort, sektioner, inputs |
| `surface-elevated` | `#262626` | Hover states |
| `primary-text` | `#fafafa` | Headings, brödtext |
| `secondary-text` | `#a3a3a3` | Metadata, captions |
| `muted-text` | `#737373` | Placeholders |
| `accent` | `#3b82f6` | CTAs, match-knappar, interaktion |
| `accent-hover` | `#2563eb` | Accent hover |
| `success` | `#22c55e` | Match confirmed |
| `warning` | `#eab308` | Pending match |
| `error` | `#ef4444` | Reject / unmatch |
| `border` | `#262626` | Subtle borders |
| `border-hover` | `#404040` | Border hover |

### Usage Rules
- Aldrig pure `#000000` — alltid tintad svart
- Text på accent-bakgrunder ska vara vit eller nära vit
- Borders är subtila — definiera struktur, inte dekoration

---

## 8. Typography

- **Heading Font:** Geist Sans (Next.js default)
- **Body Font:** Geist Sans
- **Mono Font:** Geist Mono (stats, IDs, tekniska labels)

### Scale

| Token | Size | Weight | Letter-Spacing | Line-Height |
|---|---|---|---|---|
| `display` | `64px` | `700` | `-0.03em` | `1.1` |
| `h1` | `48px` | `600` | `-0.02em` | `1.15` |
| `h2` | `36px` | `600` | `-0.015em` | `1.2` |
| `h3` | `24px` | `600` | `-0.01em` | `1.3` |
| `h4` | `20px` | `500` | `-0.005em` | `1.35` |
| `body` | `16px` | `400` | `0` | `1.6` |
| `body-sm` | `14px` | `400` | `0` | `1.5` |
| `caption` | `12px` | `500` | `0.02em` | `1.4` |
| `mono` | `14px` | `400` | `0` | `1.5` |

---

## 9. Component Library

Alla komponenter finns i `src/components/ui/` (shadcn/ui). Custom-komponenter i `src/components/`.

### Core Components (MVP)

| Component | Description |
|---|---|
| `OCCard` | Visar en OC i dashboard-listan. Bild, namn, taggar, brand-nivå |
| `OCCreator` | Multi-step form med fältsektioner, skip, visibility toggle |
| `OCProfile` | Publik OC-profilvy för andra användare |
| `FieldVisibilityToggle` | Checkbox per fält: show/hide |
| `TagInput` | Skapa/ta bort taggar för OC |
| `TruthOrLieField` | Två sanningar + en lögn per OC |
| `OpenFeedEntry` | Fritextpost med show/hide |
| `MatchCard` | Visar en matchkandidat med compatibility score |
| `ChatWindow` | Chatt med image-permission toggle |
| `BadgeSelector` | Ge badge efter date |
| `BadgeDisplay` | Visa upp till 5 badges på profil |
| `BrandBadge` | Indikator för brand/rank nivå |
| `PreMadeCharacterCard` | Mall för snabbstart |

### Phase 2 Components
| Component | Description |
|---|---|
| `SceneSelector` | Välj scen för roleplay (beach, cave, tavern, etc.) |
| `SceneCard` | Spelkort för en rollspelsscen |
| `SkinShop` | Butik för UI-skins och QoL |
| `CreatorPage` | Personlig användarsida (om dig själv, inte OC) |

---

## 10. Data Structure (Conceptual)

```typescript
interface OC {
  id: string;
  userId: string;
  name: string;
  fields: OCField[];
  tags: string[];
  truthsAndLie: [string, string, string]; // 2 truths, 1 lie
  openFeed: OpenFeedEntry[];
  brand: number;
  badges: Badge[];
  visibleBadges: string[]; // max 5 IDs
  isPreMade: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface OCField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'tags';
  value: string | string[];
  visible: boolean; // show on profile?
  skipped: boolean;
}

interface OpenFeedEntry {
  id: string;
  content: string;
  visible: boolean;
  createdAt: Date;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  fromUserId: string;
  fromOCId: string;
  message?: string;
  createdAt: Date;
}

interface MatchPreference {
  userId: string;
  ocId: string;
  seekingTags: string[];
}
```

---

## 11. Layout & Navigation

### Dashboard Layout
```
┌──────────────────────────────────┐
│  Topbar: Logo | Search | Profile │  sticky, 64px, bg-background/80 backdrop-blur
├──────────────────────────────────┤
│                                  │
│  [+ Create New OC]               │  plustecken-knapp, fixed/absolute
│                                  │
│  ┌─────────────────────────┐    │
│  │ OC Card 1    ★ Brand Lv3│    │  OCCard — sorterbar lista
│  ├─────────────────────────┤    │
│  │ OC Card 2    ★ Brand Lv1│    │
│  ├─────────────────────────┤    │
│  │ OC Card 3    ★ Brand Lv0│    │
│  └─────────────────────────┘    │
│                                  │
└──────────────────────────────────┘
```

### OC Creator Layout (Multi-step)
```
Step 1: Basics ──→ Step 2: Appearance ──→ Step 3: Personality
       ──→ Step 4: Background ──→ Step 5: Tags ──→ Step 6: Truths & Lie
       ──→ Step 7: Open Feed ──→ Done!
```

### Chat Layout (Hinge-inspired)
```
┌──────────────────────────────────┐
│  ← Back    OC Name    ⚙️        │
├──────────────────────────────────┤
│  ┌────────────────────────┐     │
│  │ Their message           │     │
│  ├────────────────────────┤     │
│  │            Your message │     │
│  ├────────────────────────┤     │
│  │ Their message           │     │
│  └────────────────────────┘     │
│                                  │
│  ┌───────────────────────┐      │
│  │ Type a message... 📎📷│      │  Input med image-toggle
│  └───────────────────────┘      │
└──────────────────────────────────┘
```

---

## 12. Accessibility & Responsive

- **Touch targets:** Min 44x44px för alla interaktiva element
- **Mobile-first:** Singelkolumn på <640px
- **Tablet+:** 2-column grids, mer information synlig
- **Keyboard navigering:** Fullt stöd för Tab/Enter/Escape
- **Focus states:** `ring-2 ring-accent ring-offset-2 ring-offset-background`
- **prefers-reduced-motion:** Respekteras för alla animationer

---

## 13. Do's and Don'ts

### Do
- Håll det enkelt i början — Hinge-level enkelhet
- Tydliga visibility-toggles per fält
- Skip-knapp på varje fråga i OC Creator
- Lutande mot community och kreativitet
- Badges som belöning och samlarobjekt

### Don't
- Överkomplicera matchmaking-algoritmen från start
- Tvinga användare att fylla i alla fält
- Visa privata fält för andra användare
- Glömma att pre-made characters ska vara redigerbara

---

## 14. Implementation Phases

### Phase 1 (MVP)
- [ ] Dashboard med OC-lista
- [ ] OC Creator med alla fält, visibility toggles, skip
- [ ] Pre-made characters (3-5 st)
- [ ] Tag-baserad matchmaking
- [ ] Search by ID
- [ ] Chat med image-permission toggle
- [ ] Brand/rank-system (grundläggande)
- [ ] Badges (grundläggande: ge och visa)

### Phase 2
- [ ] Scene Roleplay Mode
- [ ] Creator Page (användarprofil för sig själv)
- [ ] Open Feed förbättringar
- [ ] Avancerad sortering/filtrering på dashboard

### Phase 3
- [ ] Skins & themes (betalt)
- [ ] Emoji-paket
- [ ] Ko-Fi / Patreon / Subscribestar integration
- [ ] Avancerad badge-statistik
- [ ] Notifikationer

---

## 15. Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | App Router, SSR/SSG |
| TypeScript | Strict mode |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | UI-komponentbibliotek (src/components/ui/) |
| Framer Motion | Animationer |
| Lucide React | Ikoner |
| Sonner | Toasts / notiser |
| Next Themes | Dark/light mode (för skins) |

---

## 16. Agent Prompt Guide

När du genererar UI för OC Dating Platform:

1. **Läs denna DESIGN.md först.** Alla komponenter ska följa tokens och struktur här.
2. **Använd mörka paletten** om inte ett skin säger annat.
3. **Geist Sans** för all text, Geist Mono för tekniskt (brand level, IDs).
4. **Håll det Hinge-inspirerat** — rent, kortbaserat, fokus på profilen.
5. **Checkboxar för visibility** är core feature — glöm inte dem.
6. **Skip-knapp** på varje fält i OC Creator.
7. **Pre-made characters** ska vara redigerbara — inte låsta.
8. **Taggar är matchmaking-nyckeln** — gör dem framträdande.
