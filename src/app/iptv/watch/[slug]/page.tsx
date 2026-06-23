"use client"

import { useEffect, useRef, useState, use } from "react"
import { fetchPlaylist } from "@/lib/iptv/parse-m3u"
import type { Channel } from "@/lib/iptv/types"
import Link from "next/link"
import { ArrowLeft, Loader2, WifiOff } from "lucide-react"

function getChannelFromStorage(slug: string): Channel | undefined {
  try {
    const raw = sessionStorage.getItem("iptv-channels")
    if (raw) {
      const found = (JSON.parse(raw) as Channel[]).find((c) => c.id === slug)
      if (found) return found
    }
    const customRaw = localStorage.getItem("dadtv-custom")
    if (customRaw) {
      return (JSON.parse(customRaw) as Channel[]).find((c) => c.id === slug)
    }
  } catch {
  }
}

function getFavName(slug: string): string | undefined {
  try {
    const raw = localStorage.getItem("dadtv-favorites")
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      const entry = parsed[slug]
      if (entry?.name) return entry.name
    }
  } catch {}
}

export default function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<{ destroy: () => void } | null>(null)
  const [channel, setChannel] = useState<Channel | null>(() => getChannelFromStorage(slug) ?? null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (channel) return
    fetchPlaylist()
      .then((list) => {
        const found = list.find((c) => c.id === slug)
        if (found) {
          setChannel(found)
          return
        }
        const favName = getFavName(slug)
        if (favName) {
          const byName = list.find((c) => c.name.toLowerCase() === favName.toLowerCase())
          if (byName) {
            setChannel(byName)
            return
          }
          const partial = list.find((c) => c.name.toLowerCase().includes(favName.toLowerCase()))
          if (partial) {
            setChannel(partial)
            return
          }
        }
        setError("Channel not found — it may have been removed from the playlist")
      })
      .catch(() => setError("Failed to load channel data"))
  }, [slug, channel])

  useEffect(() => {
    if (!channel || !videoRef.current) return

    const video = videoRef.current
    let destroyed = false

    if (channel.url.endsWith(".m3u8")) {
      import("hls.js").then(({ default: Hls }) => {
        if (destroyed) return
        if (Hls.isSupported()) {
          const hls = new Hls()
          hlsRef.current = hls
          hls.loadSource(channel.url)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!destroyed) setReady(true)
          })
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (destroyed) return
            if (!data.fatal) return
            if (data.response?.code === 451) {
              setError("This channel is blocked in your country")
            } else if (data.response?.code === 403 || data.response?.code === 404) {
              setError("This channel is currently unavailable")
            } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              setError("Could not reach this channel. It may be offline.")
            } else {
              setError("This channel is currently unavailable")
            }
          })
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = channel.url
          video.addEventListener("loadedmetadata", () => {
            if (!destroyed) setReady(true)
          })
        } else {
          setError("HLS playback not supported in this browser")
        }
      })
    } else {
      video.src = channel.url
      video.addEventListener("loadedmetadata", () => {
        if (!destroyed) setReady(true)
      })
    }

    return () => {
      destroyed = true
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [channel])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0a0a0f] px-4 text-zinc-400">
        {channel && (
          <div className="flex flex-col items-center gap-3">
            {channel.logo && (
              <img src={channel.logo} alt="" className="h-16 w-16 rounded-2xl object-contain" />
            )}
            <p className="text-xl font-semibold text-white">{channel.name}</p>
            <span className="rounded-full bg-zinc-800 px-4 py-1.5 text-sm text-zinc-400">{channel.group}</span>
          </div>
        )}
        <WifiOff className="h-10 w-10 text-amber-500" />
        <p className="max-w-md text-center text-lg">{error}</p>
        <Link
          href="/iptv"
          className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-lg text-white transition-all duration-200 hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Back to Channels
        </Link>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4 text-zinc-400">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-lg">Loading channel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex items-center justify-between gap-3 bg-[#0a0a0f] px-4 py-3">
        <Link
          href="/iptv"
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-800 px-5 py-3 text-base font-medium text-zinc-200 transition-all duration-200 hover:bg-zinc-700 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          {channel.logo && (
            <img src={channel.logo} alt="" className="h-10 w-10 shrink-0 rounded-xl object-contain" />
          )}
          <div className="truncate text-right">
            <p className="truncate text-lg font-semibold text-white">{channel.name}</p>
            <p className="truncate text-sm text-zinc-500">{channel.group}</p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-black">
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          className="h-full max-h-screen w-full"
        />
        {!ready && !error && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 text-zinc-500">
            {channel.logo && (
              <img src={channel.logo} alt="" className="h-20 w-20 rounded-2xl object-contain opacity-60" />
            )}
            <p className="text-2xl font-semibold text-zinc-400">{channel.name}</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              <span className="text-base">Connecting...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
