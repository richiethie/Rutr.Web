"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { approveDraft, rejectDraft, sendDraft } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

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

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["approvals"] });
    router.refresh();
  }

  function errMsg(err: unknown) {
    return err instanceof ApiError
      ? err.message
      : err instanceof Error
        ? err.message
        : "Request failed.";
  }

  if (mode === "rejected") {
    return <span className="console-badge">Rejected</span>;
  }

  if (mode === "sent") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="console-badge console-badge-success">Sent · {channel}</span>
        {portalHref ? (
          <Link
            href={portalHref}
            className="text-[12px] font-medium text-[var(--console-accent)] hover:underline"
          >
            Open portal
          </Link>
        ) : null}
      </div>
    );
  }

  if (mode === "approved") {
    return (
      <div className="flex flex-col items-end gap-2">
        <p className="text-[11px] text-muted-foreground">Approved · photos visible</p>
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
                } catch (err) {
                  setError(errMsg(err));
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
                await approveDraft(draftId);
                // Stay on Approved/Send UI; refresh keeps the row (queue includes Approved).
                setMode("approved");
                await refresh();
              } catch (err) {
                setError(errMsg(err));
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
              } catch (err) {
                setError(errMsg(err));
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
