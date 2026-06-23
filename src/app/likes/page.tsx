"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLikesForMyOCs, recordSwipe, checkMutualLike, createChatSession, fetchMyOCs } from "@/lib/supabase-queries";
import type { SwipeLike } from "@/lib/supabase-queries";
import { ArrowLeft, Heart, Loader2, HeartOff, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function LikesPage() {
  const [likes, setLikes] = useState<SwipeLike[]>([]);
  const [myOcs, setMyOcs] = useState<Awaited<ReturnType<typeof fetchMyOCs>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLikesForMyOCs(), fetchMyOCs()]).then(([l, m]) => {
      setLikes(l);
      setMyOcs(m);
      setLoading(false);
    });
  }, []);

  function findMyOcForLike(like: SwipeLike) {
    return myOcs.find((o) => o.id === like.toOcId) || myOcs[0];
  }

  function removeLike(like: SwipeLike) {
    setLikes((prev) => prev.filter((l) => !(l.ocId === like.ocId && l.toOcId === like.toOcId)));
  }

  async function handleLikeBack(like: SwipeLike) {
    const myOc = findMyOcForLike(like);
    if (!myOc) { toast.error("You need at least one OC to like back"); return; }

    try {
      await recordSwipe(myOc.id, like.ocId, "like");
      const mutual = await checkMutualLike(myOc.id, like.ocId);
      if (mutual) {
        try {
          await createChatSession(myOc.id, like.ocId, like.ocName);
        } catch (e) {
          console.error("createChatSession failed", e);
        }
        toast(`It's a match with ${like.ocName}!`);
      } else {
        toast(`Liked ${like.ocName} back!`);
      }
      removeLike(like);
    } catch (e: any) {
      console.error("handleLikeBack error", e);
      toast.error(`Like back failed: ${e?.message || e}`);
    }
  }

  async function handlePass(like: SwipeLike) {
    const myOc = findMyOcForLike(like);
    if (!myOc) return;
    try {
      await recordSwipe(myOc.id, like.ocId, "pass");
      removeLike(like);
    } catch (e: any) {
      console.error("handlePass error", e);
      toast.error(`Failed to save: ${e?.message || e}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Likes You</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {likes.length} OC{likes.length !== 1 ? "s" : ""} have liked your characters
          </p>
        </div>

        {likes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-medium mb-2">No likes yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              When someone likes your OC, they'll appear here. Swipe more to get matches!
            </p>
            <Button render={<Link href="/swipe" />}>
              <Heart className="h-4 w-4 mr-1.5" /> Start Swiping
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {likes.map((like) => (
              <Card key={`${like.ocId}_${like.toOcId}`} className="flex items-center gap-4 p-4">
                {like.ocImageUrl ? (
                  <Link href={`/oc/${like.ocId}`} className="shrink-0">
                    <img src={like.ocImageUrl} alt={like.ocName} className="w-16 h-16 rounded-xl object-cover border border-border" />
                  </Link>
                ) : (
                  <Link href={`/oc/${like.ocId}`} className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                    <span className="text-2xl">🎭</span>
                  </Link>
                )}

                <div className="flex-1 min-w-0">
                  <Link href={`/oc/${like.ocId}`} className="font-medium text-foreground hover:text-primary transition-colors">
                    {like.ocName}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    liked{" "}
                    <span className="text-foreground font-medium">
                      {myOcs.find((o) => o.id === like.toOcId)?.name || "your OC"}
                    </span>
                  </p>
                  {like.ocTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {like.ocTags.slice(0, 4).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handlePass(like)} className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10">
                    <HeartOff className="h-4 w-4 text-red-400" />
                  </Button>
                  <Button size="sm" onClick={() => handleLikeBack(like)}>
                    <Heart className="h-4 w-4 mr-1" /> Like Back
                  </Button>
                </div>
              </Card>
            ))}
            <div className="pt-4 text-center">
              <Button render={<Link href="/swipe" />}>
                <Heart className="h-4 w-4 mr-1.5" /> Start Swiping
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
