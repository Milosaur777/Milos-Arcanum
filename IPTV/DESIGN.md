# Dad's TV — IPTV Player Design

## Purpose
A dead-simple IPTV channel browser for a non-technical user (dad). Minimal friction, zero configuration, click-and-watch.

## Design Principles
- **Big everything** — large touch targets, readable text at arm's length
- **One job per page** — browse channels OR watch, never both
- **No settings** — no login, no config, no preferences
- **Forgiving** — if something fails, clear message + big back button

## UI / Visual
- **Theme:** Dark (avoids eye strain), warm zinc/blue palette
- **Background:** `#0a0a0f` (very dark, not pure black)
- **Surface:** `#12121a` for cards, inputs
- **Accent:** Blue-600 (`#2563eb`) — calm, trustworthy, high contrast
- **Text:** White (`#fafafa`) primary, Zinc-400 (`#a1a1aa`) secondary
- **Typography:** Geist Sans (system), 16px base, 20px inputs, 14px secondary
- **Cards:** 80×80px logo area, rounded-2xl, subtle border, hover glow

## Pages

### `/iptv` — Channel Browser
1. **Header:** "Dad's TV" title + channel count
2. **Search:** Huge input (20px font, 20px padding), blue focus ring, placeholder example
3. **Categories:** Horizontal scrollable pills, top 30 groups by count, count badge
4. **Channel grid:** 2–6 columns responsive. Card = logo + name + group label
5. **Load more:** Button at bottom, shows remaining count

### `/iptv/watch/[id]` — Player
1. **Top bar:** Big "← Back" button (48px+), channel logo + name
2. **Video:** Full remaining height, native controls, auto-plays
3. **States:** Buffering spinner, error message with back link
4. **Cleanup:** HLS instance destroyed on unmount

## Interactions
- Click channel card → navigates to player
- Click "Back" → returns to channel list, preserves scroll state via sessionStorage
- Search filters as you type (debounced by React state, instant)
- Category pill toggles filter (single active, "All" to clear)

## Technical
- **Parser:** Regex-based M3U parser (handles EXTINF, EXTVLCOPT, custom headers)
- **Playback:** hls.js for HLS streams, falls back to native `<video>` for direct URLs
- **Caching:** Channels cached in `sessionStorage` so watch page loads instantly
- **No backend** — everything is client-side, M3U fetched directly from iptv-org.github.io
- **Frameworks:** Next.js 16 App Router, Tailwind CSS v4, TypeScript
