"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { approveDraft } from "@/lib/api";

export function ApproveButton({ draftId }: { draftId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        disabled={pending || done}
        className="approve-btn rounded-sm bg-[var(--rutr-copper)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rutr-ink)] transition hover:bg-[var(--rutr-copper-hot)] disabled:opacity-60"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await approveDraft(draftId);
              setDone(true);
              router.refresh();
            } catch {
              setError("Could not approve. Try again.");
            }
          });
        }}
      >
        {done ? "Approved" : pending ? "Approving…" : "Approve digest"}
      </button>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
