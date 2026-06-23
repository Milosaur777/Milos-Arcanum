"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth, useSupabase } from "@/lib/supabase-store";
import { fetchCreatorProfile, updateCreatorProfile, type CreatorProfile } from "@/lib/supabase-queries";
import { ArrowLeft, Save, Loader2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function CreatorProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);

  const [creatorName, setCreatorName] = useState("");
  const [creatorBio, setCreatorBio] = useState("");
  const [creatorWebsite, setCreatorWebsite] = useState("");
  const [creatorDiscord, setCreatorDiscord] = useState("");
  const [creatorVisible, setCreatorVisible] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchCreatorProfile(user.id).then((p) => {
      if (p) {
        setProfile(p);
        setCreatorName(p.creatorName);
        setCreatorBio(p.creatorBio);
        setCreatorWebsite(p.creatorWebsite);
        setCreatorDiscord(p.creatorDiscord);
        setCreatorVisible(p.creatorVisible);
      }
      setLoading(false);
    });
  }, [user, authLoading, router]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateCreatorProfile({
        creatorName,
        creatorBio,
        creatorWebsite,
        creatorDiscord,
        creatorVisible,
      });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
    setSaving(false);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Creator Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage how others see you as a creator. This info can appear on your OCs.
          </p>
        </div>

        <div className="space-y-6">
          {/* Visibility Toggle */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Public Profile</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {creatorVisible
                    ? "Your creator profile is visible to other players"
                    : "Your creator profile is hidden from other players"}
                </p>
              </div>
              <button
                onClick={() => setCreatorVisible(!creatorVisible)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  creatorVisible ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    creatorVisible ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </Card>

          {/* Basic Info */}
          <Card className="p-5 space-y-4">
            <div>
              <Label className="text-sm font-medium">Creator Name</Label>
              <p className="text-xs text-muted-foreground mb-2">
                The name displayed as the creator of your OCs
              </p>
              <Input
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Your creator name"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Bio</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Tell other players about yourself as a creator
              </p>
              <Textarea
                value={creatorBio}
                onChange={(e) => setCreatorBio(e.target.value)}
                placeholder="Write about yourself, your创作 style, what kind of characters you enjoy making..."
                rows={4}
              />
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-medium">Contact & Links</h2>

            <div>
              <Label className="text-xs text-muted-foreground">Website / Portfolio</Label>
              <Input
                value={creatorWebsite}
                onChange={(e) => setCreatorWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Discord</Label>
              <Input
                value={creatorDiscord}
                onChange={(e) => setCreatorDiscord(e.target.value)}
                placeholder="username#0000"
                className="mt-1"
              />
            </div>
          </Card>

          {/* Preview */}
          {(creatorName || creatorBio) && (
            <Card className="p-5">
              <h2 className="text-sm font-medium mb-3">Preview</h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">
                    {creatorName.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{creatorName || "Creator Name"}</h3>
                  {creatorBio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{creatorBio}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {creatorWebsite && (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {creatorWebsite.replace(/^https?:\/\//, "")}
                      </span>
                    )}
                    {creatorDiscord && (
                      <span className="text-xs text-muted-foreground">
                        Discord: {creatorDiscord}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Save */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving} className="glow-pink-sm">
              {saving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              Save Profile
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
