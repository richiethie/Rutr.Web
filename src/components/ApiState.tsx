import { ApiError } from "@/lib/api/errors";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="console-panel flex items-center justify-center px-6 py-16 text-[13px] text-[var(--muted)]">
      <span className="pulse-dot mr-2 inline-block h-2 w-2 rounded-full bg-[var(--signal)]" />
      {label}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="console-panel px-6 py-16 text-center">
      <div className="mx-auto mb-4 signal-rule" />
      <p className="display-title text-[24px] text-[var(--text)]">{title}</p>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-[14px] text-[var(--muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: React.ReactNode }) {
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Something went wrong talking to the API.";
  const hint =
    error instanceof ApiError && error.status === 404
      ? "This endpoint is not on the API yet — waiting on the OpenAPI contract."
      : error instanceof ApiError && error.status === 0
        ? "Start Rutr.Api on http://127.0.0.1:5188 and refresh."
        : null;

  return (
    <div className="console-panel border-[rgba(209,43,43,0.28)] px-6 py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--danger)]">
        Signal fault
      </p>
      <p className="display-title mt-2 text-[22px] text-[var(--text)]">{message}</p>
      {hint ? <p className="mt-3 text-[13px] text-[var(--muted)]">{hint}</p> : null}
      {onRetry ? <div className="mt-5">{onRetry}</div> : null}
    </div>
  );
}
