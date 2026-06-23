"use client"

import { useEffect, useState, useMemo } from "react"
import { fetchPlaylist } from "@/lib/iptv/parse-m3u"
import type { Channel } from "@/lib/iptv/types"
import Link from "next/link"
import { Search, Tv, ChevronRight, Loader2, Star, Flag } from "lucide-react"
import { isIranChannel } from "@/lib/iptv/iran"

const PAGE_SIZE = 48
const FAV_KEY = "dadtv-favorites"

interface FavEntry {
  id: string
  name: string
}

function loadFavorites(): Map<string, FavEntry> {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    if (!raw) return new Map()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return new Map(parsed.map((id: string) => [id, { id, name: "" }]))
    }
    if (typeof parsed === "object" && parsed !== null) {
      return new Map(Object.entries(parsed))
    }
    return new Map()
  } catch {
    return new Map()
  }
}

function saveFavorites(fav: Map<string, FavEntry>) {
  const obj = Object.fromEntries(fav)
  localStorage.setItem(FAV_KEY, JSON.stringify(obj))
}

const ALL_KEY = "★ Favorites"
const IRAN_KEY = "🇮🇷 Iran"

export default function IptvPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("iptv-search") || ""
    return ""
  })
  const [activeGroup, setActiveGroup] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("iptv-group") || ""
    return ""
  })
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [favorites, setFavorites] = useState<Map<string, FavEntry>>(loadFavorites)

  useEffect(() => {
    fetchPlaylist()
      .then((list) => {
        setChannels(list)
        sessionStorage.setItem("iptv-channels", JSON.stringify(list))
      })
      .catch(() => setError("Failed to load channels"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { sessionStorage.setItem("iptv-group", activeGroup) }, [activeGroup])
  useEffect(() => { sessionStorage.setItem("iptv-search", search) }, [search])

  const toggleFav = (id: string, name: string) => {
    setFavorites((prev) => {
      const next = new Map(prev)
      if (next.has(id)) next.delete(id)
      else next.set(id, { id, name })
      saveFavorites(next)
      return next
    })
  }

  const groups = useMemo(() => {
    const map = new Map<string, number>()
    const iranCount = channels.filter(isIranChannel).length
    if (favorites.size > 0) map.set(ALL_KEY, favorites.size)
    if (iranCount > 0) map.set(IRAN_KEY, iranCount)
    for (const ch of channels) {
      map.set(ch.group, (map.get(ch.group) || 0) + 1)
    }
    return Array.from(map.entries())
      .sort((a, b) => {
        if (a[0] === ALL_KEY) return -1
        if (b[0] === ALL_KEY) return 1
        if (a[0] === IRAN_KEY) return -1
        if (b[0] === IRAN_KEY) return 1
        return b[1] - a[1]
      })
      .slice(0, 50)
  }, [channels, favorites])

  const q = search.toLowerCase().trim()

  const filtered = useMemo(() => {
    let list = channels
    if (activeGroup === ALL_KEY) list = list.filter((c) => favorites.has(c.id))
    else if (activeGroup === IRAN_KEY) list = list.filter(isIranChannel)
    else if (activeGroup) list = list.filter((c) => c.group === activeGroup)
    if (q) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
      )
    }
    return list
  }, [channels, activeGroup, q, favorites])

  const page = filtered.slice(0, visible)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4 text-zinc-400">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-lg">Loading channels...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="max-w-md text-center text-zinc-400">
          <p className="text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-lg text-white transition-all duration-200 hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dad&apos;s TV</h1>
          <p className="mt-1 text-base text-zinc-500">
            {channels.length.toLocaleString()} channels
            {favorites.size > 0 && (
              <span className="ml-2 text-amber-400">{favorites.size} favorites</span>
            )}
          </p>
        </header>

        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE) }}
            placeholder="Search for a channel, sport, news, movie..."
            className="w-full rounded-2xl border border-zinc-800 bg-[#12121a] py-5 pl-14 pr-6 text-xl text-white placeholder-zinc-600 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="mb-6 flex max-h-48 flex-wrap gap-2 overflow-y-auto pb-1">
          <button
            onClick={() => { setActiveGroup(""); setVisible(PAGE_SIZE) }}
            className={`cursor-pointer rounded-full px-6 py-3 text-base font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400 ${
              !activeGroup
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
            }`}
          >
            All
          </button>
          {groups.map(([group, count]) => (
            <button
              key={group}
              onClick={() => { setActiveGroup(group); setVisible(PAGE_SIZE) }}
              className={`cursor-pointer rounded-full px-6 py-3 text-base font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400 ${
                activeGroup === group
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              {group === ALL_KEY ? (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  Favorites
                </span>
              ) : group === IRAN_KEY ? (
                <span className="flex items-center gap-1">
                  <Flag className="h-4 w-4 text-green-400" />
                  Iran
                </span>
              ) : (
                group
              )}
              <span className="ml-1.5 text-sm opacity-60">({count})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-zinc-500">
            <Tv className="h-12 w-12" />
            <p className="text-lg">
              {activeGroup === ALL_KEY
                ? "No favorites yet — click the star on any channel"
                : activeGroup === IRAN_KEY
                  ? "No Iranian channels found"
                  : "No channels found"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {page.map((ch) => {
                const isFav = favorites.has(ch.id)
                return (
                  <div key={ch.id} className="group relative">
                    <Link
                      href={`/iptv/watch/${ch.id}`}
                      className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-[#12121a] p-5 text-center transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/5 focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-zinc-800/50">
                        {ch.logo ? (
                          <img
                            src={ch.logo}
                            alt=""
                            className="max-h-full max-w-full object-contain p-1"
                            loading="lazy"
                          />
                        ) : (
                          <Tv className="h-9 w-9 text-zinc-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-zinc-200 group-hover:text-white">
                          {ch.name}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-zinc-600">{ch.group}</p>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFav(ch.id, ch.name)
                      }}
                      className="absolute right-2 top-2 cursor-pointer rounded-lg p-1.5 transition-all duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-400"
                      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star
                        className={`h-5 w-5 transition-all duration-200 ${
                          isFav
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                            : "text-zinc-600 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>

            {visible < filtered.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="flex cursor-pointer items-center gap-2 rounded-2xl border border-zinc-800 bg-[#12121a] px-8 py-4 text-lg font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Show More ({filtered.length - visible} remaining)
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            <p className="mt-4 text-center text-sm text-zinc-600">
              Showing {page.length} of {filtered.length.toLocaleString()} channels
            </p>
          </>
        )}
      </div>
    </div>
  )
}
