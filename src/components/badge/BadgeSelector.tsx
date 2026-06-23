"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BADGE_TEMPLATES } from "@/lib/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeSelectorProps {
  onSelect: (icon: string, name: string) => void;
}

export function BadgeSelector({ onSelect }: BadgeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const badge = selected
    ? BADGE_TEMPLATES.find((b) => b.name === selected)
    : null;

  return (
    <div>
      <p className="text-sm font-medium mb-3">Award a Badge</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {BADGE_TEMPLATES.map((b) => (
          <button
            key={b.name}
            type="button"
            onClick={() => setSelected(b.name)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200 border",
              selected === b.name
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-muted text-muted-foreground hover:border-accent/50"
            )}
          >
            <span>{b.icon}</span>
            <span>{b.name}</span>
            {selected === b.name && <Check className="h-3.5 w-3.5 ml-0.5" />}
          </button>
        ))}
      </div>
      {badge && (
        <Button
          size="sm"
          onClick={() => onSelect(badge.icon, badge.name)}
          className="w-full"
        >
          Award {badge.icon} {badge.name}
        </Button>
      )}
    </div>
  );
}
