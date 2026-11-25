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
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        disabled={pending}
        className="console-btn console-btn-primary"
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
        <p className="max-w-md text-right text-[12px] text-[var(--console-muted)]">
          {result.message || "Sync complete."} · jobs {result.jobsUpserted} · photos{" "}
          {result.photosAdded} · drafts {result.draftsCreated}
        </p>
      ) : null}
      {error ? <p className="text-[11px] text-[var(--console-danger)]">{error}</p> : null}
    </div>
  );
}
