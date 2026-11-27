"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  connectIntegration,
  disconnectIntegration,
  type IntegrationConnection,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

export function IntegrationConnect({ connection }: { connection: IntegrationConnection }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        className={
          connection.isConnected
            ? "console-btn console-btn-secondary"
            : "console-btn console-btn-primary"
        }
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              if (connection.isConnected) {
                await disconnectIntegration(connection.provider);
              } else {
                await connectIntegration(connection.provider);
              }
              router.refresh();
            } catch (err) {
              setError(
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Action failed",
              );
            }
          });
        }}
      >
        {pending
          ? "Working…"
          : connection.isConnected
            ? "Disconnect"
            : "Connect"}
      </button>
      {error ? <p className="text-[11px] text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
