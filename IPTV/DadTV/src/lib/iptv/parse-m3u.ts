import type { Channel } from "./types"

const M3U_URL = "https://iptv-org.github.io/iptv/index.m3u"

const ATTR_RE = /(\w[\w-]*)="([^"]*)"/g

function parseAttrs(line: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  let m: RegExpExecArray | null
  ATTR_RE.lastIndex = 0
  while ((m = ATTR_RE.exec(line)) !== null) {
    attrs[m[1]] = m[2]
  }
  return attrs
}

export async function fetchPlaylist(): Promise<Channel[]> {
  const res = await fetch(M3U_URL)
  const text = await res.text()
  return parseM3U(text)
}

export function parseM3U(content: string): Channel[] {
  const lines = content.split(/\r?\n/)
  const channels: Channel[] = []
  let index = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith("#EXTINF:")) continue

    const attrs = parseAttrs(line)
    const lastComma = line.lastIndexOf(",")
    const name = lastComma >= 0 ? line.slice(lastComma + 1).trim() : "Unknown"

    const group = attrs["group-title"] || "Uncategorized"
    const logo = attrs["tvg-logo"] || ""
    const tvgId = attrs["tvg-id"] || ""

    let userAgent = attrs["http-user-agent"]
    let referer = attrs["http-referrer"]

    let url = ""
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j].trim()
      if (next.startsWith("#EXTVLCOPT:")) {
        const val = next.slice("#EXTVLCOPT:".length)
        if (val.startsWith("http-user-agent=")) userAgent = val.slice("http-user-agent=".length)
        if (val.startsWith("http-referrer=")) referer = val.slice("http-referrer=".length)
        continue
      }
      if (next.startsWith("#")) continue
      if (next) {
        url = next
        break
      }
    }

    if (!url) continue

    channels.push({
      id: String(index++),
      name,
      logo,
      group,
      url,
      tvgId,
      userAgent,
      referer,
    })
  }

  return channels
}
