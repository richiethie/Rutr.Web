"use client";

import Link from "next/link";
import { JOB_STAGES } from "@/lib/api";

export function JobsStageFilter({ active }: { active?: string }) {
  const stages = ["All", ...JOB_STAGES];

  return (
    <div className="console-filter-bar">
      {stages.map((stage) => {
        const href = stage === "All" ? "/jobs" : `/jobs?stage=${stage}`;
        const isActive =
          stage === "All" ? !active : active?.toLowerCase() === stage.toLowerCase();
        return (
          <Link
            key={stage}
            href={href}
            className={isActive ? "console-filter console-filter-active" : "console-filter"}
          >
            {stage}
          </Link>
        );
      })}
    </div>
  );
}
