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
}: {
  children: React.ReactNode;
  active: StaffNav;
  source?: "api" | "sample";
  title?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen text-[var(--console-text)]">
      <aside className="sticky top-0 z-30 flex h-screen w-[232px] shrink-0 flex-col bg-[var(--console-sidebar)] text-white shadow-[4px_0_24px_rgba(15,20,28,0.12)]">
        <div className="relative overflow-hidden border-b border-white/8 px-4 py-5">
          <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-[var(--console-accent)] opacity-20 blur-2xl" />
          <Link href="/jobs" className="brand-mark relative text-[18px] text-white">
            RUTR
          </Link>
          <p className="relative mt-1.5 text-[11px] font-medium tracking-[0.04em] text-[var(--console-sidebar-muted)]">
            Connect · Rutters
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2.5">
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
            Workspace
          </p>
          {links.map((link) => {
            const isActive = (link.keys as readonly string[]).includes(active);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "nav-link nav-link-active" : "nav-link"}
              >
                <span className="nav-dot" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/8 px-4 py-3.5 text-[11px] text-[var(--console-sidebar-muted)]">
          {source === "sample" ? (
            <span className="inline-flex items-center gap-2 text-[#f0b27a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f0b27a]" />
              Sample data · API offline
            </span>
          ) : source === "api" ? (
            <span className="inline-flex items-center gap-2 text-[#8fd0ad]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#8fd0ad]" />
              Live API · :5188
            </span>
          ) : (
            <span>Staff console</span>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[var(--console-border)] bg-[rgba(255,255,255,0.86)] px-6 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <div>
              <p className="truncate text-[13px] font-semibold tracking-tight text-[var(--console-text)]">
                Rutters Roofing &amp; Exteriors
              </p>
              <p className="truncate text-[11px] text-[var(--console-muted)]">
                {title ?? titles[active]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hidden h-9 w-56 items-center rounded-[var(--console-radius-sm)] border border-[var(--console-border)] bg-white/80 px-3 text-[12px] text-[var(--console-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] md:flex"
              title="Search coming later"
            >
              <span className="mr-2 opacity-50">⌕</span>
              Search jobs, drafts…
            </div>
            <StaffSession />
          </div>
        </header>

        <main className="page-enter flex-1 px-6 py-6">{children}</main>
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
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="display-title text-[26px] font-semibold text-[var(--console-text)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--console-muted)]">
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-3 flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
