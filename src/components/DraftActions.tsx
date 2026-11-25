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
    status === "Sent"
      ? "sent"
      : status === "Approved"
        ? "approved"
        : status === "Rejected"
          ? "rejected"
          : "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "sample" | null>(null);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["approvals"] });
    router.refresh();
  }

  if (mode === "rejected") {
    return <span className="console-badge">Rejected</span>;
  }

  if (mode === "sent") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="console-badge console-badge-success">Sent · {channel}</span>
        {portalHref ? (
          <Link href={portalHref} className="text-[12px] font-medium text-[var(--console-accent)] hover:underline">
            Open portal
          </Link>
        ) : null}
      </div>
    );
  }

  if (mode === "approved") {
    return (
      <div className="flex flex-col items-end gap-2">
        <p className="text-[11px] text-[var(--console-muted)]">
          Approved{source === "sample" ? " (sample)" : ""} · photos visible
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pending}
            className="console-btn console-btn-primary"
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  await sendDraft(draftId);
                  setMode("sent");
                  await refresh();
                } catch {
                  setError("Send failed.");
                }
              });
            }}
          >
            {pending ? "Sending…" : `Send ${channel}`}
          </button>
          {portalHref ? (
            <Link href={portalHref} className="console-btn console-btn-secondary">
              Portal
            </Link>
          ) : null}
        </div>
        {error ? <p className="text-[11px] text-[var(--console-danger)]">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          className="console-btn console-btn-primary"
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
          {pending ? "Working…" : "Approve"}
        </button>
        <button
          type="button"
          disabled={pending}
          className="console-btn console-btn-secondary"
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
      </div>
      {error ? <p className="text-[11px] text-[var(--console-danger)]">{error}</p> : null}
    </div>
  );
}
