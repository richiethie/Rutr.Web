"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { approveDraft } from "@/lib/api";

export function ApproveButton({
  draftId,
  portalHref,
}: {
  draftId: string;
  portalHref?: string | null;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "sample" | null>(null);

  return (
    <div className="flex min-w-[11rem] flex-col items-start gap-2">
      <button
        type="button"
        disabled={pending || done}
        className="approve-btn rounded-sm bg-[var(--rutr-copper)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rutr-ink)] transition hover:bg-[var(--rutr-copper-hot)] disabled:opacity-60"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              const result = await approveDraft(draftId);
              setSource(result.source);
              setDone(true);
              await queryClient.invalidateQueries({ queryKey: ["approvals"] });
              router.refresh();
            } catch {
              setError("Could not approve. Try again.");
            }
          });
        }}
      >
        {done ? "Approved" : pending ? "Approving…" : "Approve digest"}
      </button>
      {done ? (
        <p className="max-w-[16rem] text-xs leading-relaxed text-[var(--rutr-sage)]">
          Photos marked customer-visible
          {source === "sample" ? " (sample mode)" : ""}.
          {portalHref ? (
            <>
              {" "}
              <Link href={portalHref} className="text-[var(--rutr-copper-hot)] hover:underline">
                Open portal
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
