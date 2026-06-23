"use client";

import { useEffect, useState } from "react";
import { saveOC } from "@/lib/supabase-queries";
import type { OC, OCField } from "@/lib/types";

function makeField(id: string, label: string, type: "text" | "textarea" | "select", value: string): OCField {
  return { id, label, type, value, visible: true, skipped: false };
}

const CHARACTERS: Array<{
  name: string;
  fields: Record<string, string>;
  tags: string[];
  truthsAndLie: [string, string, string];
  openFeed: string[];
}> = []; // Add characters here for batch import

export default function SeedPage() {
  const [status, setStatus] = useState<{ name: string; ok: boolean; error?: string }[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    setDone(true);

    (async () => {
      const results: { name: string; ok: boolean; error?: string }[] = [];

      for (const c of CHARACTERS) {
        try {
          const fieldDefs = Object.entries(c.fields).map(([id, value], i) => {
            const labelMap: Record<string, string> = {
              name: "Character Name",
              age: "Age",
              species: "Species / Race",
              gender: "Gender",
              orientation: "Sexual Orientation",
              romantic: "Romantic Orientation",
              height: "Height",
              hair: "Hair",
              eyes: "Eyes",
              bodyType: "Body Type",
              features: "Distinguishing Features",
              personality: "Personality Traits",
              strengths: "Strengths",
              weaknesses: "Weaknesses",
              backstory: "Backstory",
              occupation: "Occupation",
              homeworld: "Homeworld / Origin",
            };
            const typeMap: Record<string, "text" | "textarea" | "select"> = {
              name: "text",
              age: "text",
              species: "text",
              gender: "select",
              orientation: "select",
              romantic: "select",
              height: "text",
              hair: "text",
              eyes: "text",
              bodyType: "text",
              features: "textarea",
              personality: "textarea",
              strengths: "textarea",
              weaknesses: "textarea",
              backstory: "textarea",
              occupation: "text",
              homeworld: "text",
            };
            return makeField(id, labelMap[id] || id, typeMap[id] || "text", value);
          });

          const oc: OC = {
            id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: c.name,
            fields: fieldDefs,
            tags: c.tags,
            truthsAndLie: c.truthsAndLie,
            openFeed: c.openFeed.map((content) => ({
              id: `feed_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              content,
              visible: true,
              createdAt: new Date(),
            })),
            brand: 0,
            badges: [],
            visibleBadgeIds: [],
            isPreMade: false,
            imageUrl: undefined,
            images: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await saveOC(oc);
          results.push({ name: c.name, ok: true });
        } catch (e: any) {
          results.push({ name: c.name, ok: false, error: e?.message || String(e) });
        }
      }

      setStatus(results);
    })();
  }, [done]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Seeding OC Characters</h1>
        <div className="space-y-3">
          {status.length === 0 && (
            <p className="text-center text-muted-foreground">Creating characters...</p>
          )}
          {status.map((s) => (
            <div
              key={s.name}
              className={`p-4 rounded-lg border ${
                s.ok ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={s.ok ? "text-green-400" : "text-red-400"}>
                  {s.ok ? "✓" : "✗"}
                </span>
                <span className="font-medium">{s.name}</span>
              </div>
              {s.error && <p className="text-sm text-red-400 mt-1">{s.error}</p>}
            </div>
          ))}
          {status.length > 0 && (
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground mb-4">
                {status.every((s) => s.ok) ? "All characters created!" : "Some characters failed."}
              </p>
              <a
                href="/"
                className="text-accent hover:underline text-sm"
              >
                ← Back to Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
