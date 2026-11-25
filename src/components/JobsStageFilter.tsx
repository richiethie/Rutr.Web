"use client";

import Link from "next/link";
import { JOB_STAGES } from "@/lib/api";

export function JobsStageFilter({ active }: { active?: string }) {
  const stages = ["All", ...JOB_STAGES];

  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((stage) => {
        const href = stage === "All" ? "/jobs" : `/jobs?stage=${stage}`;
        const isActive =
          stage === "All" ? !active : active?.toLowerCase() === stage.toLowerCase();
        return (
          <Link
            key={stage}
            href={href}
            className={
              isActive
                ? "rounded-sm bg-[var(--rutr-copper)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rutr-ink)]"
                : "rounded-sm border border-[var(--rutr-line)] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)] hover:border-[var(--rutr-copper)] hover:text-[var(--rutr-chalk)]"
            }
          >
            {stage}
          </Link>
        );
      })}
    </div>
  );
}
