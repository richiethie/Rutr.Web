import { ApiError } from "@/lib/api/errors";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-card px-6 py-16 text-[13px] text-muted-foreground">
      <span className="pulse-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
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
    <div className="rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="text-[15px] font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
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
    <div className="rounded-lg border border-border bg-card px-6 py-8">
      <p className="text-[12px] font-medium text-destructive">API error</p>
      <p className="mt-1 text-[14px] font-medium text-foreground">{message}</p>
      {hint ? <p className="mt-2 text-[13px] text-muted-foreground">{hint}</p> : null}
      {onRetry ? <div className="mt-4">{onRetry}</div> : null}
    </div>
  );
}
