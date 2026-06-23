"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BrandBadge } from "@/components/oc/BrandBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchMyOCs, fetchPublicOCs, recordSwipe, checkMutualLike, undoLastSwipe, getBlockedOcIds, getSwipedOcIds, createChatSession } from "@/lib/supabase-queries";
import { useAuth } from "@/lib/supabase-store";
import type { OC } from "@/lib/types";
import { ArrowLeft, Heart, X as XIcon, Loader2, SkipForward, RotateCcw, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { toast } from "sonner";

function computeMatchScore(oc1: OC, oc2: OC): { score: number; matchedTags: string[] } {
  const oc1Tags = oc1.tags.map((t) => t.toLowerCase());
  const oc2Tags = oc2.tags.map((t) => t.toLowerCase());
  const matchedTags = oc1Tags.filter((t) => oc2Tags.includes(t));
  const score = oc1Tags.length > 0 ? Math.round((matchedTags.length / Math.max(oc1Tags.length, 1)) * 100) : 0;
  return { score, matchedTags };
}

function SwipeCard({
  oc,
  matchScore,
  matchedTags,
  onSwipe,
  swipingAs,
}: {
  oc: OC;
  matchScore: number;
  matchedTags: string[];
  onSwipe: (dir: "left" | "right") => void;
  swipingAs: string | null;
}) {
  const router = useRouter();
  const suppressTap = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  function handleDragEnd(_: any, info: any) {
    suppressTap.current = true;
    const threshold = 100;
    if (info.offset.x > threshold || info.velocity.x > 500) {
      animate(x, 500, { duration: 0.25, ease: "easeIn" });
      setTimeout(() => { suppressTap.current = false; onSwipe("right"); }, 200);
    } else if (info.offset.x < -threshold || info.velocity.x < -500) {
      animate(x, -500, { duration: 0.25, ease: "easeIn" });
      setTimeout(() => { suppressTap.current = false; onSwipe("left"); }, 200);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      setTimeout(() => { suppressTap.current = false; }, 400);
    }
  }

  function handleTap() {
    if (!suppressTap.current) {
      const params = new URLSearchParams();
      params.set("from", "swipe");
      params.set("card", oc.id);
      if (swipingAs) params.set("swipingAs", swipingAs as string);
      router.push(`/oc/${oc.id}?${params.toString()}`);
    }
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragElastic={0.9}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      onDragStart={() => { suppressTap.current = true; }}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      className="cursor-grab touch-none select-none relative"
    >
      <Card className="overflow-hidden p-0 transition-shadow hover:shadow-[0_0_40px_rgba(255,45,123,0.15)]">
        <div className="relative">
          {oc.imageUrl ? (
            <div className="w-full h-64 sm:h-80 bg-muted">
              <img src={oc.imageUrl} alt={oc.name} className="w-full h-full object-cover pointer-events-none" />
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <span className="text-6xl opacity-30 select-none">🎭</span>
            </div>
          )}

          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 rotate-[15deg] z-20"
          >
            <span className="text-3xl sm:text-4xl font-black text-green-400 bg-black/40 px-4 py-2 rounded-lg border-2 border-green-400 shadow-lg backdrop-blur-sm">
              LIKE
            </span>
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 -rotate-[15deg] z-20"
          >
            <span className="text-3xl sm:text-4xl font-black text-red-400 bg-black/40 px-4 py-2 rounded-lg border-2 border-red-400 shadow-lg backdrop-blur-sm">
              NOPE
            </span>
          </motion.div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{oc.name}</h2>
            <span className="text-sm font-mono font-bold text-accent">{matchScore}%</span>
          </div>

          <BrandBadge level={oc.brand} />

          {matchedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {matchedTags.slice(0, 8).map((t) => (
                <Badge key={t} className="text-xs bg-accent/15 text-accent border-accent/25">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          {oc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {oc.tags.slice(0, 6).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default function SwipePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <SwipePageContent />
    </Suspense>
  );
}

function SwipePageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [myOCs, setMyOCs] = useState<OC[]>([]);
  const [allOCs, setAllOCs] = useState<OC[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOC, setSelectedOC] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string> | null>(null);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [showMatch, setShowMatch] = useState<OC | null>(null);
  const swipingRef = useRef(false);

  const focusCard = searchParams.get("card");

  useEffect(() => {
    (async () => {
      const [mine, all] = await Promise.all([fetchMyOCs(), fetchPublicOCs()]);
      setMyOCs(mine);
      setAllOCs(all);

      if (user && !("is_guest" in user && user.is_guest)) {
        const blocked = await getBlockedOcIds();
        setBlockedIds(blocked);
      }

      // Pre-select OC from URL if present
      const oc = searchParams.get("oc");
      if (oc && mine.some((o) => o.id === oc)) {
        setSelectedOC(oc);
        sessionStorage.setItem("swipe_oc", oc);
      }

      setLoading(false);
    })();
  }, [user]);

  // Load/refresh swiped IDs whenever selectedOC changes or base data arrives
  useEffect(() => {
    if (loading) return;
    if (!user || ("is_guest" in user && user.is_guest)) {
      setSeenIds(new Set());
      return;
    }

    if (selectedOC && myOCs.some((o) => o.id === selectedOC)) {
      sessionStorage.setItem("swipe_oc", selectedOC);
      getSwipedOcIds(selectedOC).then((ids) => {
        setSeenIds(ids);
      });
    } else {
      sessionStorage.removeItem("swipe_oc");
      setSelectedOC(null);
      setSeenIds(new Set());
    }
  }, [loading, selectedOC]);

  const selected = selectedOC ? myOCs.find((o) => o.id === selectedOC) : null;

  const myIds = new Set(myOCs.map((o) => o.id));

  const seenSet = seenIds ?? new Set<string>();
  let cards = allOCs
    .filter((o) => !myIds.has(o.id) && !seenSet.has(o.id) && !blockedIds.has(o.id))
    .sort(() => Math.random() - 0.5);

  // Put the focused card (from profile back-link) at position 0
  if (focusCard) {
    const idx = cards.findIndex((c) => c.id === focusCard);
    if (idx > 0) {
      const [focused] = cards.splice(idx, 1);
      cards = [focused, ...cards];
    }
  }

  const current = cards[0] || null;
  const matchData = current && selected ? computeMatchScore(selected, current) : null;

  function handleSwipe(dir: "left" | "right") {
    if (!current || !selected || swipingRef.current) return;
    swipingRef.current = true;

    setSeenIds((prev) => new Set([...(prev || []), current.id]));

    if (dir === "right" && matchData) {
      toast(`Liked ${current.name}! ${matchData.score}% match`);
    }

    // Reset ref after animation
    setTimeout(() => { swipingRef.current = false; }, 400);

    // Async DB
    if (!user || ("is_guest" in user && user.is_guest)) {
      if (dir === "right") toast("Liked! (guest mode - sign in for full matching)");
      return;
    }

    (async () => {
      try {
        await recordSwipe(selected.id, current.id, dir === "right" ? "like" : "pass");

        if (dir === "right") {
          const mutual = await checkMutualLike(selected.id, current.id);
          if (mutual) {
            try {
              await createChatSession(selected.id, current.id, current.name);
            } catch {}
            setShowMatch(current);
            toast(`It's a match with ${current.name}!`, {
              description: "Chat session created.",
            });
          }
        }
      } catch {}
    })();
  }

  async function handleUndo() {
    if (!selected) return;
    if (user && !("is_guest" in user && user.is_guest)) {
      await undoLastSwipe(selected.id);
    }
    setSeenIds((prev) => {
      const prevSet = prev || new Set();
      const arr = Array.from(prevSet);
      const next = new Set(prevSet);
      if (arr.length > 0) next.delete(arr[arr.length - 1]);
      return next;
    });
    toast("Undid last swipe");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <DashboardHeader />
      <main className="mx-auto max-w-md px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {!selected ? (
          <div className="space-y-4 py-16">
            <h1 className="text-2xl font-semibold tracking-tight text-center">Swipe Mode</h1>
            <p className="text-muted-foreground text-center text-sm">Pick an OC to start swiping</p>
            <select
              value={selectedOC || ""}
              onChange={(e) => setSelectedOC(e.target.value || null)}
              className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
            >
              <option value="" className="bg-card text-foreground">Choose your OC...</option>
              {myOCs.map((o) => (
                <option key={o.id} value={o.id} className="bg-card text-foreground">{o.name}</option>
              ))}
            </select>
          </div>
        ) : current ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Swiping as <span className="text-foreground font-medium">{selected.name}</span>
              </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {seenIds ? cards.length + seenIds.size : "..."} profiles • {cards.length} remaining
                </p>
              </div>

            <AnimatePresence mode="wait">
              {showMatch ? (
                <motion.div
                  key="match"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <Sparkles className="h-16 w-16 mx-auto text-accent mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold mb-2">It's a Match!</h2>
                  <p className="text-muted-foreground mb-4">
                    You and <span className="text-foreground font-medium">{showMatch.name}</span> liked each other!
                  </p>
                  {showMatch.imageUrl && (
                    <img src={showMatch.imageUrl} alt={showMatch.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-accent object-cover" />
                  )}
                  <div className="flex gap-3 justify-center">
                    <Button render={<Link href="/chat" />}>
                      <MessageCircle className="h-4 w-4 mr-1.5" /> Go to Chats
                    </Button>
                    <Button variant="outline" onClick={() => setShowMatch(null)}>
                      Keep Swiping
                    </Button>
                  </div>
                </motion.div>
              ) : (
                current && seenIds && (
                  <SwipeCard
                    key={current.id}
                    oc={current}
                    matchScore={matchData?.score ?? 0}
                    matchedTags={matchData?.matchedTags ?? []}
                    onSwipe={handleSwipe}
                    swipingAs={selectedOC}
                  />
                )
              )}
            </AnimatePresence>

            {!showMatch && (
              <div className="flex items-center justify-center gap-6 pt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-red-500/30 hover:border-red-500 hover:bg-red-500/10 active:scale-90 active:bg-red-500/20 transition-all duration-150"
                  onClick={() => handleSwipe("left")}
                >
                  <XIcon className="h-6 w-6 text-red-400" />
                </Button>
                {seenSet.size > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleUndo} className="text-xs text-muted-foreground active:scale-90">
                    <RotateCcw className="h-3 w-3 mr-1" /> Undo
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-green-500/30 hover:border-green-500 hover:bg-green-500/10 active:scale-90 active:bg-green-500/20 transition-all duration-150"
                  onClick={() => handleSwipe("right")}
                >
                  <Heart className="h-6 w-6 text-green-400" />
                </Button>
              </div>
            )}

            {!showMatch && (
              <p className="text-center text-xs text-muted-foreground">
                Drag right to like • Drag left to skip • Tap to view profile
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SkipForward className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-medium mb-2">No more profiles</h2>
            <p className="text-sm text-muted-foreground mb-4">
              You've seen all available OCs. Check back later!
            </p>
            {seenSet.size > 0 && (
              <Button variant="outline" onClick={() => { setSeenIds(new Set()); toast("Reset! Swipe again."); }}>
                <RotateCcw className="h-4 w-4 mr-1.5" /> Start Over
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
