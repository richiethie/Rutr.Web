"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { runIntegrationSync, type SyncResult } from "@/lib/api";

export function SyncButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        disabled={pending}
        className="approve-btn rounded-sm bg-[var(--rutr-copper)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rutr-ink)] hover:bg-[var(--rutr-copper-hot)] disabled:opacity-60"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              const res = await runIntegrationSync();
              setResult(res.data);
              router.refresh();
            } catch {
              setError("Sync failed.");
            }
          });
        }}
      >
        {pending ? "Syncing…" : "Run mock sync"}
      </button>
      {result ? (
        <p className="max-w-xl text-sm text-[var(--rutr-mist)]">
          {result.message || "Sync complete."} · jobs {result.jobsUpserted} · photos{" "}
          {result.photosAdded} · drafts {result.draftsCreated} · portals{" "}
          {result.portalTokensEnsured}
        </p>
      ) : null}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
