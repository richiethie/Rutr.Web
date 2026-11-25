import Link from "next/link";
import { StaffSession } from "@/components/StaffSession";

const fieldOps = [
  { href: "/jobs", label: "Jobs", keys: ["jobs", "detail"] as const },
  { href: "/approvals", label: "Approvals", keys: ["approvals"] as const },
  { href: "/evidence", label: "Evidence", keys: ["evidence"] as const },
  { href: "/tasks", label: "Tasks", keys: ["tasks"] as const },
  { href: "/notes", label: "Notes", keys: ["notes"] as const },
  { href: "/milestones", label: "Milestones", keys: ["milestones"] as const },
];

const roster = [
  { href: "/contacts", label: "Contacts", keys: ["contacts"] as const },
  { href: "/properties", label: "Properties", keys: ["properties"] as const },
  { href: "/consents", label: "Consents", keys: ["consents"] as const },
];

const system = [
  { href: "/integrations", label: "Integrations", keys: ["integrations"] as const },
  { href: "/settings", label: "Settings", keys: ["settings"] as const },
];

export type StaffNav =
  | "jobs"
  | "approvals"
  | "detail"
  | "evidence"
  | "contacts"
  | "properties"
  | "notes"
  | "tasks"
  | "milestones"
  | "consents"
  | "integrations"
  | "settings";

const titles: Record<StaffNav, string> = {
  jobs: "Jobs",
  detail: "Job detail",
  approvals: "Approvals",
  evidence: "Evidence",
  contacts: "Contacts",
  properties: "Properties",
  notes: "Notes",
  tasks: "Tasks",
  milestones: "Milestones",
  consents: "Consents",
  integrations: "Integrations",
  settings: "Settings",
};

function NavGroup({
  label,
  links,
  active,
}: {
  label: string;
  links: { href: string; label: string; keys: readonly string[] }[];
  active: StaffNav;
}) {
  return (
    <>
      <p className="px-3 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/28">
        {label}
      </p>
      {links.map((link) => {
        const isActive = link.keys.includes(active);
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
    </>
  );
}

export function StaffChrome({
  children,
  active,
  live,
  title,
}: {
  children: React.ReactNode;
  active: StaffNav;
  live?: boolean;
  title?: string;
}) {
  return (
    <div className="flex min-h-screen text-[var(--text)]">
      <aside className="sidebar-grid relative sticky top-0 z-30 flex h-screen w-[262px] shrink-0 flex-col bg-[var(--ink)] text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-[var(--signal)] via-[rgba(255,92,26,0.45)] to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_240px_at_0%_0%,rgba(255,92,26,0.22),transparent_65%)]" />

        <div className="relative overflow-hidden px-5 pb-5 pt-7">
          <div className="brand-flare pointer-events-none absolute -left-12 -top-8 h-48 w-48 rounded-full bg-[var(--signal)] blur-3xl" />
          <Link href="/jobs" className="brand-mark relative text-[26px] text-white">
            RUTR
          </Link>
          <p className="relative mt-2.5 text-[11px] font-semibold tracking-[0.22em] text-[var(--flare)]">
            FIELD SIGNAL
          </p>
          <p className="relative mt-1 text-[11px] tracking-[0.08em] text-white/40">CONNECT</p>
          <div className="signal-rule mt-5" />
        </div>

        <nav className="relative flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-3">
          <NavGroup label="Field ops" links={fieldOps} active={active} />
          <NavGroup label="Roster" links={roster} active={active} />
          <NavGroup label="System" links={system} active={active} />
        </nav>

        <div className="relative mx-3 mb-4 overflow-hidden rounded-[14px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-3.5 py-3.5 text-[11px] text-white/55">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--signal)] opacity-20 blur-2xl" />
          <p className="font-bold tracking-wide text-white/85">Rutters</p>
          <p className="mt-1 text-white/45">Roofing &amp; Exteriors</p>
          <div className="mt-3">
            {live ? (
              <span className="inline-flex items-center gap-2 text-[#7ddeb0]">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#7ddeb0]" />
                Live signal · :5188
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-white/45">
                <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                Staff console
              </span>
            )}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(251,252,254,0.78)] backdrop-blur-xl">
          <div className="signal-sweep h-[4px] bg-gradient-to-r from-[var(--signal)] via-[var(--flare)] to-transparent" />
          <div className="flex h-[64px] items-center justify-between gap-4 px-7">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--signal-deep)]">
                {title ?? titles[active]}
              </p>
              <p className="display-title truncate text-[17px] font-semibold text-[var(--text)]">
                Rutters Roofing &amp; Exteriors
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="hidden h-11 w-64 items-center rounded-[12px] border border-[var(--line)] bg-white/90 px-4 text-[12px] text-[var(--muted)] md:flex"
                title="Search coming later"
              >
                <span className="mr-2 font-bold text-[var(--signal)]">⌘K</span>
                Search jobs, digests…
              </div>
              <StaffSession />
            </div>
          </div>
        </header>

        <main className="page-enter flex-1 px-7 py-8">{children}</main>
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
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-3">
          <div className="signal-rule" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Field console
          </span>
        </div>
        <h1 className="display-title text-[40px] text-[var(--text)] sm:text-[48px]">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-4 flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
