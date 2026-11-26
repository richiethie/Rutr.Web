import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatCardItem = {
  label: string;
  value: string | number;
  hint?: string;
  trend?: string;
  tone?: "default" | "ok" | "warn" | "brand";
};

/** Compact metric cards — density/structure aligned with shadcn blocks SectionCards. */
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
  return (
    <div className="console-panel flex flex-col gap-3 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        {trend ? (
          <span
            className={cn(
              "console-badge shrink-0",
              tone === "ok" && "console-badge-success",
              tone === "warn" && "console-badge-warn",
              tone === "brand" && "console-badge-accent",
            )}
          >
            {trend}
          </span>
        ) : null}
      </div>
      <p className="display-title text-[24px] tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {hint ? <p className="text-[12px] text-muted-foreground">{hint}</p> : null}
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">{children}</div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
