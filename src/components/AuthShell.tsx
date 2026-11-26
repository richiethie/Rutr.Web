import Link from "next/link";
import type { ReactNode } from "react";

const steps = [
  { id: "account", label: "Account" },
  { id: "team", label: "Team" },
  { id: "data", label: "Data" },
  { id: "done", label: "Dashboard" },
] as const;

export type OnboardingStepId = (typeof steps)[number]["id"];

export function AuthBrand() {
  return (
    <Link href="/login" className="flex items-center gap-2 self-center font-medium">
      <div className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
        R
      </div>
      <span className="brand-mark text-[15px]">RUTR Connect</span>
    </Link>
  );
}

export function OnboardingSteps({ active }: { active: OnboardingStepId }) {
  const activeIdx = steps.findIndex((s) => s.id === active);
  return (
    <ol className="flex w-full items-center justify-between gap-1 px-1">
      {steps.map((step, i) => {
        const done = i < activeIdx;
        const current = i === activeIdx;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div
              className={
                current
                  ? "flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
                  : done
                    ? "flex size-6 items-center justify-center rounded-full bg-ok text-[11px] font-semibold text-ok-foreground"
                    : "flex size-6 items-center justify-center rounded-full border border-border bg-card text-[11px] font-medium text-muted-foreground"
              }
            >
              {done ? "✓" : i + 1}
            </div>
            <span
              className={
                current
                  ? "truncate text-[11px] font-medium text-foreground"
                  : "truncate text-[11px] text-muted-foreground"
              }
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function AuthShell({
  children,
  step,
  wide,
}: {
  children: ReactNode;
  step?: OnboardingStepId;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-canvas p-6 md:p-10">
      <div
        className={`page-enter flex w-full flex-col gap-6 ${wide ? "max-w-xl" : "max-w-sm"}`}
      >
        <AuthBrand />
        {step ? <OnboardingSteps active={step} /> : null}
        {children}
      </div>
    </div>
  );
}

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="display-title text-[20px] text-foreground">{title}</h1>
      {description ? (
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}
