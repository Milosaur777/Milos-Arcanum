"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BrandBadge } from "@/components/oc/BrandBadge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchOCById, fetchCreatorProfile, type CreatorProfile } from "@/lib/supabase-queries";
import { useAuth } from "@/lib/supabase-store";
import type { OC } from "@/lib/types";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, X, ExternalLink, Copy, Check } from "lucide-react";

export default function OCProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const fromSwipe = searchParams.get("from") === "swipe";
  const focusCard = fromSwipe ? searchParams.get("card") || "" : "";
  const swipingAs = fromSwipe ? searchParams.get("swipingAs") || "" : "";
  const [oc, setOc] = useState<OC | null>(null);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    fetchOCById(id).then((found) => {
      setOc(found);
      if (found) {
        fetchCreatorProfile(found.userId || "").then(setCreator);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!oc) {
    return (
      <div className="min-h-screen">
        <DashboardHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-2">OC not found</h1>
          <p className="text-muted-foreground mb-6">This character doesn't exist or has been deleted.</p>
          <Button render={<Link href="/" />}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  const visibleBadges = oc.visibleBadgeIds
    .map((bid) => oc.badges.find((b) => b.id === bid))
    .filter(Boolean);

  const allImages = [oc.imageUrl, ...(oc.images || [])].filter(Boolean) as string[];
  const visibleFields = oc.fields.filter((f) => f.visible && !f.skipped && f.value);

  const FIELD_GROUPS = [
    { label: "Basics", ids: ["name", "age", "species", "gender", "orientation", "romantic"] },
    { label: "Appearance", ids: ["height", "hair", "eyes", "bodyType", "features"] },
    { label: "Personality", ids: ["personality", "strengths", "weaknesses"] },
    { label: "Background", ids: ["backstory", "occupation", "homeworld"] },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-3xl px-3 sm:px-4 py-6 sm:py-8">
        <Link
          href={fromSwipe ? `/swipe?card=${focusCard}&oc=${swipingAs}` : "/"}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {fromSwipe ? "Back to Swipe" : "Back to Dashboard"}
        </Link>

        <div>
          {/* Profile Image + Header */}
          <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
            {oc.imageUrl ? (
              <div
                className="shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(255,45,123,0.2)] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => { setSelectedImage(oc.imageUrl!); setGalleryIndex(0); }}
              >
                <img src={oc.imageUrl} alt={oc.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl border-2 border-border bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">🎭</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{oc.name}</h1>
              <BrandBadge level={oc.brand} className="mt-2" />
              {user && !("is_guest" in user) && oc.userId === user.id && (
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" render={<Link href={`/create?id=${oc.id}`} />}>
                    Edit
                  </Button>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(oc.id);
                  setCopiedId(true);
                  setTimeout(() => setCopiedId(false), 2000);
                }}
                className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
              >
                {copiedId ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                {copiedId ? "Copied!" : `ID: ${oc.id}`}
              </button>
            </div>
          </div>

          {/* Tags */}
          {oc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6 sm:mb-8">
              {oc.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/15 text-primary border border-primary/25 font-medium text-xs sm:text-sm">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Gallery */}
          {allImages.length > 1 && (
            <Card className="p-3 sm:p-4 mb-6 sm:mb-8">
              <h2 className="text-sm font-medium mb-3">Gallery</h2>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {allImages.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => { setSelectedImage(url); setGalleryIndex(i); }}
                    className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Fields */}
          {visibleFields.length > 0 && (
            <div className="space-y-6 mb-8">
              {FIELD_GROUPS.map((group) => {
                const groupFields = visibleFields.filter((f) => group.ids.includes(f.id));
                if (groupFields.length === 0) return null;
                return (
                  <div key={group.label}>
                    <h2 className="text-sm font-medium text-muted-foreground mb-3">{group.label}</h2>
                    <Card className="p-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {groupFields.map((field) => (
                          <div key={field.id}>
                            <dt className="text-xs text-muted-foreground">{field.label}</dt>
                            <dd className="text-sm text-foreground mt-0.5">
                              {Array.isArray(field.value) ? field.value.join(", ") : field.value}
                            </dd>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          {/* Two Truths & a Lie */}
          {oc.truthsAndLie.some((t) => t.trim()) && (
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-sm font-medium mb-3 sm:mb-4">Two Truths & a Lie</h2>
              <div className="space-y-2">
                {oc.truthsAndLie.map((text, i) => (
                  text.trim() && (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="text-foreground">{text}</span>
                    </div>
                  )
                ))}
              </div>
            </Card>
          )}

          {/* Open Feed */}
          {oc.openFeed.length > 0 && (
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-sm font-medium mb-3 sm:mb-4">Open Feed</h2>
              <div className="space-y-3">
                {oc.openFeed.filter((e) => e.visible).map((entry) => (
                  <p key={entry.id} className="text-sm text-foreground">{entry.content}</p>
                ))}
              </div>
            </Card>
          )}

          {/* Badges */}
          {visibleBadges.length > 0 && (
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-sm font-medium mb-3">Badges</h2>
              <div className="flex flex-wrap gap-2">
                {visibleBadges.map((b: any) => (
                  <div key={b.id} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm">
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Creator */}
          {creator && creator.creatorVisible && (
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-sm font-medium mb-3 sm:mb-4">Creator</h2>
              <div className="flex items-start gap-4">
                {creator.creatorAvatarUrl ? (
                  <img
                    src={creator.creatorAvatarUrl}
                    alt={creator.creatorName}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">
                      {creator.creatorName.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{creator.creatorName}</h3>
                  {creator.creatorBio && (
                    <p className="text-sm text-muted-foreground mt-1">{creator.creatorBio}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {creator.creatorWebsite && (
                      <a
                        href={creator.creatorWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {creator.creatorWebsite.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                    {creator.creatorDiscord && (
                      <span className="text-xs text-muted-foreground">
                        Discord: {creator.creatorDiscord}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Image lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                  setSelectedImage(allImages[(galleryIndex - 1 + allImages.length) % allImages.length]);
                }}
                className="absolute left-4 p-2 text-white/70 hover:text-white"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryIndex((prev) => (prev + 1) % allImages.length);
                  setSelectedImage(allImages[(galleryIndex + 1) % allImages.length]);
                }}
                className="absolute right-4 p-2 text-white/70 hover:text-white"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
