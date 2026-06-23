import { cn } from "@/lib/utils";

interface BrandBadgeProps {
  level: number;
  className?: string;
}

const BRAND_LEVELS = [
  { label: "Newcomer", color: "text-muted-foreground", bar: "w-1/4" },
  { label: "Regular", color: "text-primary", bar: "w-2/4" },
  { label: "Popular", color: "text-pink-400", bar: "w-3/4" },
  { label: "Star", color: "text-yellow-400", bar: "w-full" },
  { label: "Legend", color: "text-purple-400", bar: "w-full" },
];

export function BrandBadge({ level, className }: BrandBadgeProps) {
  const tier = BRAND_LEVELS[Math.min(level, BRAND_LEVELS.length - 1)];
  const label = BRAND_LEVELS[Math.min(Math.floor(level / 10), BRAND_LEVELS.length - 1)].label;
  const bar = BRAND_LEVELS[Math.min(Math.floor(level / 10), BRAND_LEVELS.length - 1)].bar;
  const color = BRAND_LEVELS[Math.min(Math.floor(level / 10), BRAND_LEVELS.length - 1)].color;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-xs font-mono font-medium", color)}>
        ★ Lv.{level}
      </span>
      <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full bg-current transition-all", bar)} />
      </div>
      <span className="text-[10px] text-muted-foreground font-mono">{label}</span>
    </div>
  );
}
