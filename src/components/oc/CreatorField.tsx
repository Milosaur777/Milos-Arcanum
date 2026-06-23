"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldVisibilityToggle } from "./FieldVisibilityToggle";
import { SkipForward, Undo2, Dices } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorFieldProps {
  id: string;
  label: string;
  type?: "text" | "textarea" | "select";
  value: string;
  visible: boolean;
  skipped: boolean;
  options?: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  onVisibilityChange: (visible: boolean) => void;
  onSkip: (skipped: boolean) => void;
  onRandom?: () => void;
}

export function CreatorField({
  id,
  label,
  type = "text",
  value,
  visible,
  skipped,
  options,
  placeholder,
  onChange,
  onVisibilityChange,
  onSkip,
  onRandom,
}: CreatorFieldProps) {
  return (
    <div className={cn("space-y-2 transition-opacity", skipped && "opacity-30 pointer-events-none")}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-1">
          {onRandom && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary"
              onClick={onRandom}
              title={`Random ${label}`}
            >
              <Dices className="h-3 w-3" />
            </Button>
          )}
          <FieldVisibilityToggle visible={visible} onChange={onVisibilityChange} skipped={skipped} />
          {skipped ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 gap-1 text-xs text-muted-foreground"
              onClick={() => onSkip(false)}
            >
              <Undo2 className="h-3 w-3" />
              Undo
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onSkip(true)}
            >
              <SkipForward className="h-3 w-3" />
              Skip
            </Button>
          )}
        </div>
      </div>

      {!skipped && (
        <>
          {type === "textarea" ? (
            <Textarea
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
              className="min-h-[80px]"
            />
          ) : type === "select" && options ? (
            <>
              <select
                id={id}
                value={options.includes(value) ? value : "Other"}
                onChange={(e) => onChange(e.target.value === "Other" ? "" : e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
              >
                <option value="" className="bg-card text-foreground">Select...</option>
                {options.map((opt) => (
                  <option key={opt} value={opt} className="bg-card text-foreground">{opt}</option>
                ))}
              </select>
              {(!value || value === "Other" || !options.includes(value)) && (
                <Input
                  value={value === "Other" ? "" : value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Describe..."
                  className="mt-2"
                />
              )}
            </>
          ) : (
            <Input
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            />
          )}
        </>
      )}
    </div>
  );
}
