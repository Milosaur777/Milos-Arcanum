"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldVisibilityToggleProps {
  visible: boolean;
  onChange: (visible: boolean) => void;
  skipped?: boolean;
  className?: string;
}

export function FieldVisibilityToggle({ visible, onChange, skipped, className }: FieldVisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!visible)}
      disabled={skipped}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs transition-all duration-200",
        skipped
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer hover:text-foreground",
        visible ? "text-accent" : "text-muted-foreground",
        className
      )}
      aria-label={visible ? "Visible on profile" : "Hidden from profile"}
    >
      {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      <span>{visible ? "Visible" : "Hidden"}</span>
    </button>
  );
}
