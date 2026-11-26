"use client";

import { useEffect, useState } from "react";
import { readOnboardingOutcome } from "@/lib/onboarding-outcome";

/** Empty-state copy: start empty vs just-imported (query + session outcome). */
export function JobsEmptyCopy({
  stage,
  onboarding,
  importedJobs,
  via,
}: {
  stage?: string;
  onboarding?: string;
  importedJobs?: string;
  via?: string;
}) {
  const [fromSession, setFromSession] = useState<string | null>(null);

  useEffect(() => {
    const o = readOnboardingOutcome();
    if (!o) return;
    if (o.kind === "empty") {
      setFromSession(
        "You chose start empty — create a job here, or import CSV / mock JobNimbus when ready.",
      );
      return;
    }
    if (o.jobsCreated > 0) {
      setFromSession(
        `Imported ${o.jobsCreated} job${o.jobsCreated === 1 ? "" : "s"} (${o.kind}). If the list is empty, refresh or check org auth.`,
      );
      return;
    }
    setFromSession(
      `Import finished with 0 jobs created (${o.skipped} skipped). Adjust CSV or try mock JobNimbus.`,
    );
  }, []);

  if (stage) {
    return <>No jobs in the {stage} stage from the API.</>;
  }

  if (onboarding === "empty") {
    return (
      <>
        You started empty — no CRM rows yet. Create a job, or{" "}
        <span className="font-medium text-foreground">import CSV / mock JobNimbus</span> from
        onboarding.
      </>
    );
  }

  if (onboarding === "imported") {
    const n = Number(importedJobs ?? "0");
    const source = via ? ` via ${via}` : "";
    if (n > 0) {
      return (
        <>
          Import reported {n} job{n === 1 ? "" : "s"}
          {source}, but none are listed yet. Refresh, or open a job from search once the API
          returns them.
        </>
      );
    }
    return (
      <>
        Import finished{source} with 0 new jobs (duplicates by externalId are skipped). Upload a
        different CSV or create a job manually.
      </>
    );
  }

  if (fromSession) return <>{fromSession}</>;

  return <>Empty from the API — create a job, or finish onboarding import/seed.</>;
}
