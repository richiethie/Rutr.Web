import Link from "next/link";
import { StaffSession } from "@/components/StaffSession";

const links = [
  { href: "/jobs", label: "Jobs", keys: ["jobs", "detail"] as const },
  { href: "/approvals", label: "Approvals", keys: ["approvals"] as const },
  { href: "/integrations", label: "Integrations", keys: ["integrations"] as const },
  { href: "/settings", label: "Settings", keys: ["settings"] as const },
];

export type StaffNav =
  | "jobs"
  | "approvals"
  | "detail"
  | "integrations"
  | "settings";

const titles: Record<StaffNav, string> = {
  jobs: "Jobs",
  detail: "Job detail",
  approvals: "Approvals",
  integrations: "Integrations",
  settings: "Settings",
};

export function StaffChrome({
  children,
  active,
  source,
  title,
  actions,
}: {
  children: React.ReactNode;
  active: StaffNav;
  source?: "api" | "sample";
  title?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--console-bg)] text-[var(--console-text)]">
      <aside className="sticky top-0 flex h-screen w-[220px] shrink-0 flex-col bg-[var(--console-sidebar)] text-white">
        <div className="border-b border-white/10 px-4 py-4">
          <Link href="/jobs" className="brand-mark text-lg text-white">
            RUTR
          </Link>
          <p className="mt-1 text-[11px] font-medium tracking-wide text-[var(--console-sidebar-muted)]">
            Connect · Rutters
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {links.map((link) => {
            const isActive = (link.keys as readonly string[]).includes(active);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "rounded-md bg-white/10 px-3 py-2 text-[13px] font-semibold text-white"
                    : "rounded-md px-3 py-2 text-[13px] font-medium text-[var(--console-sidebar-muted)] hover:bg-[var(--console-sidebar-hover)] hover:text-white"
                }
              >
                <span
                  className={
                    isActive
                      ? "mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--console-accent)]"
                      : "mr-2 inline-block h-1.5 w-1.5 rounded-full bg-transparent"
                  }
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-4 py-3 text-[11px] text-[var(--console-sidebar-muted)]">
          {source === "sample" ? (
            <span className="text-[#f0b27a]">Sample data · API offline</span>
          ) : source === "api" ? (
            <span className="text-[#8fd0ad]">Live API · :5188</span>
          ) : (
            <span>Staff console</span>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-12 items-center justify-between gap-4 border-b border-[var(--console-border)] bg-[var(--console-surface)] px-5">
          <div className="flex min-w-0 items-center gap-3">
            <p className="truncate text-[13px] font-semibold text-[var(--console-text)]">
              Rutters Roofing &amp; Exteriors
            </p>
            <span className="hidden h-4 w-px bg-[var(--console-border)] sm:block" />
            <p className="hidden truncate text-[12px] text-[var(--console-muted)] sm:block">
              {title ?? titles[active]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hidden h-8 w-52 items-center rounded-md border border-[var(--console-border)] bg-[var(--console-bg)] px-3 text-[12px] text-[var(--console-muted)] md:flex"
              title="Search coming later"
            >
              Search jobs, drafts…
            </div>
            <StaffSession />
          </div>
        </header>

        <main className="flex-1 px-5 py-5">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[20px] font-semibold tracking-tight text-[var(--console-text)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-[13px] text-[var(--console-muted)]">{description}</p>
        ) : null}
        {meta ? <div className="mt-2 flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
