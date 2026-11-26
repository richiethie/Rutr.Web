"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { importOnboarding, seedOnboarding } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { readToken } from "@/lib/auth";

type Choice = "empty" | "sample" | "jobnimbus" | "csv";

const SAMPLE_CSV = `externalId,firstName,lastName,email,phone,addressLine1,city,state,postalCode,jobTitle,jobType,status,stage
jn-20001,Dana,Keller,keller@example.com,+13195550142,1428 Maple Ridge Dr,Cedar Falls,IA,50613,Keller reroof,Retail,InProgress,Build
jn-20002,Morgan,Ellis,morgan.ellis@example.com,+13195550188,88 Prairie View Ct,Waterloo,IA,50701,Ellis install,Retail,InProgress,Prepare`;

export default function OnboardingImportPage() {
  const [choice, setChoice] = useState<Choice>("empty");
  const [csvContent, setCsvContent] = useState(SAMPLE_CSV);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!readToken()) {
      window.location.href = "/login";
    }
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        if (choice === "empty" || choice === "sample") {
          const res = await seedOnboarding({ mode: choice });
          setResult(
            `${res.message} · contacts ${res.contactsCreated} · properties ${res.propertiesCreated} · jobs ${res.jobsCreated}`,
          );
        } else if (choice === "jobnimbus") {
          const res = await importOnboarding({ source: "jobnimbus", csvContent: null });
          setResult(
            `${res.message} · contacts ${res.contactsCreated} · properties ${res.propertiesCreated} · jobs ${res.jobsCreated}`,
          );
        } else {
          const res = await importOnboarding({
            source: "csv",
            csvContent,
          });
          setResult(
            `${res.message} · contacts ${res.contactsCreated} · properties ${res.propertiesCreated} · jobs ${res.jobsCreated}` +
              (res.warnings?.length ? ` · warnings: ${res.warnings.join("; ")}` : ""),
          );
        }
        window.setTimeout(() => {
          window.location.href = "/jobs";
        }, 700);
      } catch (err) {
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

  return (
    <AuthShell step="data" wide>
      <AuthCard
        title="Start with data"
        description="Empty org, sample rows, JobNimbus mock import, or CSV — one-shot migration into RUTR."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset className="space-y-2">
            {(
              [
                ["empty", "Start empty", "No CRM rows — empty states from the API."],
                ["sample", "Seed sample", "A few contacts, properties, and jobs in your org."],
                [
                  "jobnimbus",
                  "Import JobNimbus (mock)",
                  "One-shot mock JN snapshot — not ongoing sync.",
                ],
                ["csv", "Import CSV", "Paste job-centric rows with a header."],
              ] as const
            ).map(([id, label, hint]) => (
              <label
                key={id}
                className={
                  choice === id
                    ? "flex cursor-pointer gap-3 rounded-lg border border-primary bg-muted px-3 py-3"
                    : "flex cursor-pointer gap-3 rounded-lg border border-border bg-card px-3 py-3 hover:bg-muted/60"
                }
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
            <label className="block text-[12px] font-medium text-foreground">
              CSV content
              <textarea
                className="console-input mt-1.5 min-h-[140px] font-mono-data"
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                required
              />
            </label>
          ) : null}

          {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
          {result ? (
            <p className="rounded-md bg-ok-soft px-3 py-2 text-[12px] text-foreground">{result}</p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="console-btn console-btn-primary w-full"
          >
            {pending ? "Working…" : "Apply and continue"}
          </button>
        </form>
      </AuthCard>

      <div className="flex items-center justify-between gap-3 text-[12px]">
        <Link
          href="/onboarding/team"
          className="font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          Back
        </Link>
        <Link
          href="/jobs"
          className="console-btn console-btn-primary h-9"
          onClick={(e) => {
            if (!result && !pending) {
              // Allow skip to dashboard without seed/import
              return;
            }
            if (pending) e.preventDefault();
          }}
        >
          {result ? "Open dashboard" : "Skip to dashboard"}
        </Link>
      </div>
    </AuthShell>
  );
}
