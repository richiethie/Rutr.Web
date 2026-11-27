"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { Dialog } from "@/components/ui/dialog";
import { importOnboarding, seedOnboarding } from "@/lib/api";
import type { OnboardingImportError, OnboardingImportResult } from "@/lib/api/types";
import { ApiError } from "@/lib/api/errors";
import { readToken } from "@/lib/auth";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  CSV_HEADERS,
  SAMPLE_CSV,
  jobsHrefForOutcome,
  previewCsv,
  writeOnboardingOutcome,
  type OnboardingOutcomeKind,
} from "@/lib/onboarding-outcome";

type Choice = "empty" | "sample" | "jobnimbus" | "csv";

type Summary = {
  kind: OnboardingOutcomeKind;
  message: string;
  contactsCreated: number;
  propertiesCreated: number;
  jobsCreated: number;
  skipped: number;
  warnings: string[];
  errors: OnboardingImportError[];
  idempotencyRule: string | null;
  dryRun: boolean;
};

export default function OnboardingImportPage() {
  const [choice, setChoice] = useState<Choice>("empty");
  const [csvContent, setCsvContent] = useState(SAMPLE_CSV);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pending, startTransition] = useTransition();

  const csvPreview = useMemo(
    () => (choice === "csv" ? previewCsv(csvContent) : null),
    [choice, csvContent],
  );

  useEffect(() => {
    if (!readToken()) {
      window.location.href = "/login";
    }
  }, []);

  function applyResult(
    kind: OnboardingOutcomeKind,
    res: Pick<
      OnboardingImportResult,
      | "message"
      | "contactsCreated"
      | "propertiesCreated"
      | "jobsCreated"
      | "skipped"
      | "warnings"
      | "errors"
      | "idempotencyRule"
      | "dryRun"
    >,
    requestedDryRun: boolean,
  ) {
    const wasDryRun = Boolean(res.dryRun ?? requestedDryRun);
    const next: Summary = {
      kind,
      message: res.message,
      contactsCreated: res.contactsCreated,
      propertiesCreated: res.propertiesCreated,
      jobsCreated: res.jobsCreated,
      skipped: res.skipped ?? 0,
      warnings: res.warnings ?? [],
      errors: res.errors ?? [],
      idempotencyRule: res.idempotencyRule ?? null,
      dryRun: wasDryRun,
    };
    setSummary(next);
    if (!wasDryRun) {
      writeOnboardingOutcome({
        kind,
        contactsCreated: next.contactsCreated,
        propertiesCreated: next.propertiesCreated,
        jobsCreated: next.jobsCreated,
        skipped: next.skipped,
        warnings: next.warnings,
        message: next.message,
      });
    }
  }

  function runImport() {
    setError(null);
    setSummary(null);
    startTransition(async () => {
      try {
        if (choice === "empty" || choice === "sample") {
          const res = await seedOnboarding({ mode: choice });
          applyResult(
            choice,
            { ...res, skipped: 0, warnings: [], errors: [], idempotencyRule: null, dryRun: false },
            false,
          );
          toastSuccess(
            choice === "empty" ? "Organization left empty" : "Sample data seeded",
          );
        } else if (choice === "jobnimbus") {
          const res = await importOnboarding({
            source: "jobnimbus",
            csvContent: null,
            dryRun,
          });
          applyResult("jobnimbus", res, dryRun);
          toastSuccess(
            dryRun || res.dryRun
              ? "JobNimbus dry-run complete"
              : `Imported ${res.jobsCreated} jobs from JobNimbus`,
          );
        } else {
          if (csvPreview && !csvPreview.ok) {
            setError(csvPreview.error ?? "CSV failed client checks.");
            return;
          }
          const res = await importOnboarding({
            source: "csv",
            csvContent,
            dryRun,
          });
          applyResult("csv", res, dryRun);
          toastSuccess(
            dryRun || res.dryRun
              ? "CSV dry-run complete"
              : `Imported ${res.jobsCreated} jobs from CSV`,
          );
        }
      } catch (err) {
        toastError("Import failed", err);
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Import failed.",
        );
      }
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (choice === "csv" || choice === "jobnimbus") {
      setConfirmOpen(true);
      return;
    }
    runImport();
  }

  const jobsHref = summary
    ? jobsHrefForOutcome(summary.kind, summary.jobsCreated)
    : "/jobs?onboarding=empty";

  return (
    <AuthShell step="data" wide>
      <AuthCard
        title="Start with data"
        description="One-shot migration into your org — empty, sample, JobNimbus mock, or CSV. Not ongoing JN sync."
      >
        {summary ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p className="text-[13px] font-medium text-foreground">
                {summary.dryRun ? "Dry-run preview" : "Import summary"}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">{summary.message}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px] sm:grid-cols-4">
                <div className="rounded-md border border-border bg-background px-2.5 py-2">
                  <dt className="text-muted-foreground">Contacts</dt>
                  <dd className="font-mono-data text-[15px] font-semibold">
                    {summary.contactsCreated}
                  </dd>
                </div>
                <div className="rounded-md border border-border bg-background px-2.5 py-2">
                  <dt className="text-muted-foreground">Properties</dt>
                  <dd className="font-mono-data text-[15px] font-semibold">
                    {summary.propertiesCreated}
                  </dd>
                </div>
                <div className="rounded-md border border-border bg-background px-2.5 py-2">
                  <dt className="text-muted-foreground">Jobs</dt>
                  <dd className="font-mono-data text-[15px] font-semibold">
                    {summary.jobsCreated}
                  </dd>
                </div>
                <div className="rounded-md border border-border bg-background px-2.5 py-2">
                  <dt className="text-muted-foreground">Skipped</dt>
                  <dd className="font-mono-data text-[15px] font-semibold">
                    {summary.skipped}
                  </dd>
                </div>
              </dl>
              {summary.idempotencyRule ? (
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Idempotency: {summary.idempotencyRule}
                </p>
              ) : null}
              {summary.errors.length > 0 ? (
                <div className="mt-3">
                  <p className="text-[12px] font-medium text-destructive">
                    Errors ({summary.errors.length})
                  </p>
                  <ul className="mt-1 max-h-40 space-y-1 overflow-y-auto text-[12px] text-muted-foreground">
                    {summary.errors.map((err, i) => (
                      <li
                        key={`${err.rowNumber ?? "r"}-${err.externalId ?? ""}-${err.code ?? i}`}
                        className="rounded border border-destructive/30 bg-background/80 px-2 py-1.5"
                      >
                        <span className="font-medium text-foreground">
                          {err.rowNumber != null ? `Row ${err.rowNumber}` : "Row ?"}
                          {err.externalId ? ` · ${err.externalId}` : ""}
                          {err.code ? ` · ${err.code}` : ""}
                        </span>
                        {err.message ? (
                          <span className="mt-0.5 block">{err.message}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {summary.warnings.length > 0 ? (
                <div className="mt-3">
                  <p className="text-[12px] font-medium text-foreground">
                    Warnings ({summary.warnings.length})
                  </p>
                  <ul className="mt-1 max-h-36 space-y-1 overflow-y-auto text-[12px] text-muted-foreground">
                    {summary.warnings.map((w) => (
                      <li key={w} className="rounded bg-background/80 px-2 py-1">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : summary.errors.length === 0 ? (
                <p className="mt-3 text-[12px] text-muted-foreground">No warnings or row errors.</p>
              ) : null}
              {summary.dryRun ? (
                <p className="mt-3 text-[12px] text-muted-foreground">
                  Dry-run — nothing was written. Turn off dry-run and apply again to import for real.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {!summary.dryRun ? (
                <Link href={jobsHref} className="console-btn console-btn-primary">
                  Open jobs
                </Link>
              ) : (
                <button
                  type="button"
                  className="console-btn console-btn-primary"
                  onClick={() => {
                    setDryRun(false);
                    setSummary(null);
                  }}
                >
                  Back to form
                </button>
              )}
              <button
                type="button"
                className="console-btn console-btn-ghost"
                onClick={() => setSummary(null)}
              >
                Import more
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <fieldset className="space-y-2">
              {(
                [
                  ["empty", "Start empty", "No CRM rows — intentional empty states from the API."],
                  ["sample", "Seed sample", "A few contacts, properties, and jobs in your org."],
                  [
                    "jobnimbus",
                    "Import JobNimbus (mock)",
                    "One-shot mock JN snapshot — migration only, not forever sync.",
                  ],
                  ["csv", "Upload CSV", "JN report-style rows; duplicates by externalId are skipped."],
                ] as const
              ).map(([id, label, hint]) => (
                <label
                  key={id}
                  className={
                    choice === id
                      ? "flex cursor-pointer gap-3 rounded-lg border bg-[var(--brand-soft)] px-3 py-3 shadow-[0_0_0_1px_var(--brand)]"
                      : "flex cursor-pointer gap-3 rounded-lg border border-border bg-card px-3 py-3 hover:bg-muted/60"
                  }
                  style={choice === id ? { borderColor: "var(--brand)" } : undefined}
                >
                  <input
                    type="radio"
                    name="choice"
                    className="mt-1"
                    checked={choice === id}
                    onChange={() => setChoice(id)}
                  />
                  <span>
                    <span className="block text-[13px] font-medium text-foreground">{label}</span>
                    <span className="mt-0.5 block text-[12px] text-muted-foreground">{hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            {choice === "csv" ? (
              <div className="space-y-3">
                <label className="block text-[12px] font-medium text-foreground">
                  Upload CSV file
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="mt-1.5 block w-full text-[12px] text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-foreground"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFileName(file.name);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setCsvContent(String(reader.result ?? ""));
                      };
                      reader.readAsText(file);
                    }}
                  />
                  {fileName ? (
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      Loaded {fileName}
                    </span>
                  ) : null}
                </label>
                <label className="block text-[12px] font-medium text-foreground">
                  CSV content
                  <textarea
                    className="console-input mt-1.5 min-h-[140px] font-mono-data"
                    value={csvContent}
                    onChange={(e) => {
                      setCsvContent(e.target.value);
                      setFileName(null);
                    }}
                    required
                  />
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Headers: <span className="font-mono-data">{CSV_HEADERS}</span>
                </p>
                {csvPreview ? (
                  <p
                    className={
                      csvPreview.ok
                        ? "text-[12px] text-muted-foreground"
                        : "text-[12px] text-destructive"
                    }
                  >
                    {csvPreview.ok
                      ? `${csvPreview.dataRows} data row${csvPreview.dataRows === 1 ? "" : "s"} ready.`
                      : csvPreview.error}
                  </p>
                ) : null}
              </div>
            ) : null}

            {choice === "jobnimbus" || choice === "csv" ? (
              <label className="flex items-center gap-2 text-[13px] text-foreground">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-brand"
                />
                Dry-run (preview counts — no writes)
              </label>
            ) : null}

            {error ? <p className="text-[12px] text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={pending || (choice === "csv" && !!csvPreview && !csvPreview.ok)}
              className="console-btn console-btn-primary w-full"
            >
              {pending
                ? "Working…"
                : choice === "empty"
                  ? "Start empty"
                  : choice === "sample"
                    ? "Seed sample"
                    : dryRun
                      ? "Preview import"
                      : "Import into org"}
            </button>
          </form>
        )}
      </AuthCard>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={dryRun ? "Preview import?" : "Import into this org?"}
        description={
          choice === "csv"
            ? dryRun
              ? `API will validate about ${csvPreview?.dataRows ?? 0} CSV rows without writing.`
              : `Creates contacts, properties, and jobs from ${csvPreview?.dataRows ?? 0} CSV rows. Existing externalId values are skipped.`
            : dryRun
              ? "Mock JobNimbus snapshot preview — no writes."
              : "Loads the mock JobNimbus snapshot once. Re-import skips matching external IDs."
        }
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="console-btn console-btn-ghost"
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="console-btn console-btn-primary"
            disabled={pending}
            onClick={() => {
              setConfirmOpen(false);
              runImport();
            }}
          >
            {pending ? "Working…" : dryRun ? "Run preview" : "Import"}
          </button>
        </div>
      </Dialog>

      <div className="flex items-center justify-between gap-3 text-[12px]">
        <Link
          href="/onboarding/team"
          className="font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          Back
        </Link>
        <Link href={summary ? jobsHref : "/jobs?onboarding=empty"} className="console-btn console-btn-secondary h-9">
          {summary && !summary.dryRun ? "Open jobs" : "Skip to dashboard"}
        </Link>
      </div>
    </AuthShell>
  );
}
