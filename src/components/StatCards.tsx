import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardItem = {
  label: string;
  value: string | number;
  hint?: string;
  trend?: string;
  tone?: "default" | "ok" | "warn" | "brand" | "danger";
};

/** Metric cards with footer wells — layered like shadcn blocks SectionCards. */
export function StatCards({ items }: { items: StatCardItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  trend,
  tone = "default",
}: StatCardItem) {
  const TrendIcon =
    tone === "danger" || tone === "warn" ? TrendingDown : TrendingUp;

  return (
    <div className="console-panel flex flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-3 p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] text-muted-foreground">{label}</p>
          {trend ? (
            <span
              className={cn(
                "console-badge shrink-0",
                tone === "ok" && "console-badge-success",
                tone === "warn" && "console-badge-warn",
                tone === "brand" && "console-badge-accent",
                tone === "danger" && "console-badge-danger",
              )}
            >
              {tone !== "default" ? (
                <TrendIcon className="size-3" strokeWidth={2.25} />
              ) : null}
              {trend}
            </span>
          ) : null}
        </div>
        <p className="display-title text-[26px] tracking-tight text-foreground tabular-nums">
          {value}
        </p>
      </div>
      {hint ? (
        <div className="border-t border-border bg-muted/70 px-4 py-2.5 dark:bg-muted/50">
          <p
            className={cn(
              "text-[12px] font-medium",
              tone === "ok" && "text-ok",
              tone === "warn" && "text-warn",
              tone === "brand" && "text-brand",
              tone === "danger" && "text-destructive",
              tone === "default" && "text-muted-foreground",
            )}
          >
            {hint}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function PageToolbar({
  children,
  actions,
}: {
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/60 p-2 sm:flex-row sm:items-center sm:justify-between dark:bg-muted/40">
      <div className="min-w-0 px-1">{children}</div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 px-1">{actions}</div>
      ) : null}
    </div>
  );
}
