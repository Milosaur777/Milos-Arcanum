"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { OCCard } from "@/components/oc/OCCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase-store";
import { fetchMyOCs, deleteOC, reorderOCs } from "@/lib/supabase-queries";
import type { OC } from "@/lib/types";
import { Plus, Users, Sparkles, Loader2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ocs, setOcs] = useState<OC[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"custom" | "newest" | "brand" | "name">("custom");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchMyOCs()
      .then(setOcs)
      .catch(() => toast.error("Failed to load characters"))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function handleDelete(id: string) {
    try {
      await deleteOC(id);
      setOcs((prev) => prev.filter((o) => o.id !== id));
      toast.success("OC deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  }, []);

  const handleDrop = useCallback((idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }

    setOcs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      reorderOCs(next.map((o) => o.id)).catch(() => toast.error("Failed to save order"));
      return next;
    });

    setDragIdx(null);
    setOverIdx(null);
  }, [dragIdx]);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
    setOverIdx(null);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const sorted = [...ocs].sort((a, b) => {
    if (sortBy === "brand") return b.brand - a.brand;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const isDragging = dragIdx !== null;

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-5xl px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">My Characters</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              {ocs.length} OC{ocs.length !== 1 ? "s" : ""}
              {sortBy === "custom" && ocs.length > 1 && (
                <span className="ml-2 text-[10px] sm:text-xs text-primary/70">(drag to reorder)</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-9 rounded-md border border-border bg-card px-3 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-accent flex-1 sm:flex-initial appearance-none cursor-pointer"
            >
              <option value="custom">Custom Order</option>
              <option value="newest">Newest</option>
              <option value="brand">Brand Level</option>
              <option value="name">Name</option>
            </select>

            <Button render={<Link href="/create" />} className="flex-1 sm:flex-initial text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-1 sm:mr-1.5" />
              <span className="sm:inline">New OC</span>
            </Button>
          </div>
        </div>

        {ocs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">No characters yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Create your first Original Character and start finding matches!
            </p>
            <Button size="lg" render={<Link href="/create" />}>
              <Sparkles className="h-5 w-5 mr-2" />
              Create Your First OC
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
            {sorted.map((oc, idx) => (
              <motion.div
                key={oc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: dragIdx === idx ? 0.5 : 1,
                  y: 0,
                  scale: overIdx === idx && dragIdx !== null ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                draggable={sortBy === "custom"}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                className={sortBy === "custom" ? "cursor-grab active:cursor-grabbing" : ""}
              >
                <div className="relative">
                  {sortBy === "custom" && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  )}
                  <OCCard oc={oc} onDelete={handleDelete} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
