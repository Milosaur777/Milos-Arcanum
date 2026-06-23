"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BrandBadge } from "@/components/oc/BrandBadge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchMyOCs, fetchPublicOCs } from "@/lib/supabase-queries";
import type { OC } from "@/lib/types";
import { ArrowLeft, Search, MessageCircle, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function computeMatchScore(oc1: OC, oc2: OC): { score: number; matchedTags: string[] } {
  const oc1Tags = oc1.tags.map((t) => t.toLowerCase());
  const oc2Tags = oc2.tags.map((t) => t.toLowerCase());
  const matchedTags = oc1Tags.filter((t) => oc2Tags.includes(t));
  const score = oc1Tags.length > 0 ? Math.round((matchedTags.length / Math.max(oc1Tags.length, 1)) * 100) : 0;
  return { score, matchedTags };
}

export default function MatchesPage() {
  const [myOCs, setMyOCs] = useState<OC[]>([]);
  const [allOCs, setAllOCs] = useState<OC[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOC, setSelectedOC] = useState<string | null>(null);
  const [idSearch, setIdSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
    Promise.all([fetchMyOCs(), fetchPublicOCs()]).then(([mine, all]) => {
      setMyOCs(mine);
      setAllOCs(all);
      setLoading(false);
    });
  }, []);

  const selected = selectedOC ? myOCs.find((o) => o.id === selectedOC) : null;

  const matches = useMemo(() => {
    if (!selected) return [];
    const myIds = new Set(myOCs.map((o) => o.id));
    return allOCs
      .filter((o) => o.id !== selected.id && !myIds.has(o.id))
      .map((o) => ({ oc: o, ...computeMatchScore(selected, o) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [selected, allOCs, myOCs]);

  const idMatch = idSearch.trim()
    ? allOCs.find((o) => o.id === idSearch.trim())
    : null;

  const nameResults = nameSearch.trim()
    ? allOCs.filter((o) => o.name.toLowerCase().includes(nameSearch.trim().toLowerCase()))
    : [];

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

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-4">Find Matches</h1>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium">Match as</label>
                <select
                  value={selectedOC || ""}
                  onChange={(e) => setSelectedOC(e.target.value || null)}
                  className="w-full h-10 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select an OC...</option>
                  {myOCs.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              {selected && (
                <Card className="p-4 mb-6">
                  <p className="text-sm font-medium">{selected.name}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selected.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </Card>
              )}

              <div className="border-t border-border pt-6">
                <label className="text-sm font-medium mb-2 block">Search by name</label>
                <Input
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  placeholder="Type a character name..."
                />
                {nameResults.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {nameResults.slice(0, 10).map((oc) => (
                      <Link key={oc.id} href={`/oc/${oc.id}`}>
                        <Card className="p-3 transition-all hover:border-accent/50 cursor-pointer">
                          <p className="text-sm font-medium">{oc.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{oc.tags.slice(0, 3).join(", ")}</p>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
                {nameSearch.trim() && nameResults.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2">No OCs found with that name</p>
                )}
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <label className="text-sm font-medium mb-2 block">Search by ID</label>
                <Input
                  value={idSearch}
                  onChange={(e) => setIdSearch(e.target.value)}
                  placeholder="Enter OC ID..."
                />
                {idMatch && (
                  <Card className="p-3 mt-2">
                    <p className="text-sm font-medium">{idMatch.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{idMatch.id}</p>
                  </Card>
                )}
                {idSearch.trim() && !idMatch && (
                  <p className="text-xs text-muted-foreground mt-2">No OC found with that ID</p>
                )}
              </div>
            </div>
          </div>

          <div>
            {!selected ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Heart className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h2 className="text-lg font-medium mb-2">Select an OC to start matching</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Choose one of your characters above to find compatible matches based on shared tags.
                </p>
              </div>
            ) : matches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h2 className="text-lg font-medium mb-2">No matches found</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No other characters match your tags yet. Add more tags to find matches.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Found {matches.length} potential match{matches.length > 1 ? "es" : ""}
                </p>
                {matches.map((match) => (
                  <motion.div key={match.oc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-4 transition-all duration-200 hover:border-accent/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{match.oc.name}</h3>
                            <span className="text-xs font-mono text-accent">{match.score}%</span>
                          </div>
                          <BrandBadge level={match.oc.brand} className="mt-0.5" />
                        </div>
                        <Button size="sm" className="shrink-0 ml-3 gap-1.5">
                          <MessageCircle className="h-4 w-4" /> Chat
                        </Button>
                      </div>
                      {match.matchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {match.matchedTags.map((t) => (
                            <Badge key={t} className="text-xs bg-accent/10 text-accent border-accent/20">
                              {t} ✓
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
