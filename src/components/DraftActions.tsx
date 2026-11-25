"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { approveDraft, rejectDraft, sendDraft } from "@/lib/api";

type Mode = "idle" | "approved" | "sent" | "rejected";

export function DraftActions({
  draftId,
  status,
  channel,
  portalHref,
}: {
  draftId: string;
  status: string;
  channel: string;
  portalHref?: string | null;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<Mode>(
    status === "Sent" ? "sent" : status === "Approved" ? "approved" : status === "Rejected" ? "rejected" : "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "sample" | null>(null);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["approvals"] });
    router.refresh();
  }

  if (mode === "rejected") {
    return <p className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">Rejected</p>;
  }

  if (mode === "sent") {
    return (
      <div className="flex min-w-[11rem] flex-col gap-2 text-xs text-[var(--rutr-sage)]">
        <p className="uppercase tracking-[0.12em]">Sent via {channel}</p>
        {portalHref ? (
          <Link href={portalHref} className="text-[var(--rutr-copper-hot)] hover:underline">
            Open portal
          </Link>
        ) : null}
      </div>
    );
  }

  if (mode === "approved") {
    return (
      <div className="flex min-w-[12rem] flex-col items-start gap-2">
        <p className="text-xs text-[var(--rutr-sage)]">
          Approved — photos customer-visible
          {source === "sample" ? " (sample)" : ""}.
        </p>
        <button
          type="button"
          disabled={pending}
          className="approve-btn rounded-sm bg-[var(--rutr-copper)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rutr-ink)] hover:bg-[var(--rutr-copper-hot)] disabled:opacity-60"
          onClick={() => {
            setError(null);
            startTransition(async () => {
              try {
                await sendDraft(draftId);
                setMode("sent");
                await refresh();
              } catch {
                setError("Send failed — is messaging mock up on the API?");
              }
            });
          }}
        >
          {pending ? "Sending…" : `Send ${channel}`}
        </button>
        {portalHref ? (
          <Link href={portalHref} className="text-xs text-[var(--rutr-copper-hot)] hover:underline">
            Preview portal
          </Link>
        ) : null}
        {error ? <p className="text-xs text-red-300">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex min-w-[12rem] flex-col items-start gap-2">
      <button
        type="button"
        disabled={pending}
        className="approve-btn rounded-sm bg-[var(--rutr-copper)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rutr-ink)] hover:bg-[var(--rutr-copper-hot)] disabled:opacity-60"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              const result = await approveDraft(draftId);
              setSource(result.source);
              setMode("approved");
              await refresh();
            } catch {
              setError("Could not approve.");
            }
          });
        }}
      >
        {pending ? "Working…" : "Approve digest"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="rounded-sm border border-[var(--rutr-line)] px-4 py-2 text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)] hover:border-[var(--rutr-copper)] hover:text-[var(--rutr-chalk)] disabled:opacity-60"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await rejectDraft(draftId, "Evidence incomplete");
              setMode("rejected");
              await refresh();
            } catch {
              setError("Could not reject.");
            }
          });
        }}
      >
        Reject
      </button>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
