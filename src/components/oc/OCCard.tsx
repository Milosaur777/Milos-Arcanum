"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandBadge } from "./BrandBadge";
import { Trash2, Edit3, Eye, ImageIcon, AlertTriangle, X } from "lucide-react";
import type { OC } from "@/lib/types";

interface OCCardProps {
  oc: OC;
  onDelete?: (id: string) => void;
}

export function OCCard({ oc, onDelete }: OCCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const visibleFields = oc.fields.filter((f) => f.visible && !f.skipped && f.value);

  const firstName = oc.name.split(" ")[0] || oc.name;
  const deleteEnabled = deleteInput.trim().toLowerCase() === firstName.toLowerCase();

  function handleDeleteKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && deleteEnabled) {
      onDelete?.(oc.id);
      setShowDeleteConfirm(false);
      setDeleteInput("");
    }
  }

  return (
    <Card className="group relative p-2 sm:p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,45,123,0.15)] hover:border-primary/40">
      <div className="flex items-start gap-2 sm:gap-4">
        {oc.imageUrl ? (
          <div className="shrink-0 w-10 h-10 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-primary/30 shadow-[0_0_12px_rgba(255,45,123,0.2)]">
            <img src={oc.imageUrl} alt={oc.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="shrink-0 w-10 h-10 sm:w-16 sm:h-16 rounded-lg border-2 border-border bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            <h3 className="text-sm sm:text-lg font-bold text-foreground truncate">
              {oc.name || "Unnamed OC"}
            </h3>
          </div>
          <BrandBadge level={oc.brand} className="mt-0.5 sm:mt-1" />
          <div className="flex items-center gap-0.5 mt-1 sm:mt-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:text-primary hover:bg-primary/10 active:scale-90 active:bg-primary/20" render={<Link href={`/oc/${oc.id}`} />}>
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">View profile</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:text-primary hover:bg-primary/10 active:scale-90 active:bg-primary/20" render={<Link href={`/create?id=${oc.id}`} />}>
              <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Edit OC</span>
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-90 active:bg-destructive/20 active:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="sr-only">Delete OC</span>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-1.5 sm:gap-1.5 sm:mt-2">
            {oc.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[9px] sm:text-xs bg-primary/15 text-primary border border-primary/25 font-medium leading-[14px] sm:leading-normal">
                {tag}
              </Badge>
            ))}
            {oc.tags.length > 4 && (
              <Badge variant="outline" className="text-[9px] sm:text-xs text-muted-foreground border-border/60 leading-[14px] sm:leading-normal">
                +{oc.tags.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {visibleFields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-border/40">
          {visibleFields.slice(0, 4).map((field) => (
            <div key={field.id} className="text-[11px] sm:text-sm truncate">
              <span className="text-muted-foreground">{field.label}: </span>
              <span className="text-foreground/90">
                {Array.isArray(field.value) ? field.value.join(", ") : String(field.value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 bg-card/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 border border-destructive/30">
          <div className="flex items-center gap-2 text-destructive mb-3">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-medium">Delete {oc.name}?</span>
          </div>
          <p className="text-xs text-muted-foreground text-center mb-3">
            Type <span className="font-mono font-bold text-foreground">{firstName}</span> to confirm
          </p>
          <Input
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            onKeyDown={handleDeleteKey}
            placeholder={firstName}
            className="h-9 text-center max-w-[200px]"
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
            >
              <X className="h-3 w-3 mr-1" /> Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={!deleteEnabled}
              onClick={() => { onDelete?.(oc.id); setShowDeleteConfirm(false); setDeleteInput(""); }}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
