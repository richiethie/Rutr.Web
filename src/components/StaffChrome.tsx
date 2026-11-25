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

const crm = [
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
      <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
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
  /** True when this page successfully talked to the API. */
  live?: boolean;
  title?: string;
}) {
  return (
    <div className="flex min-h-screen text-[var(--text)]">
      <aside className="relative sticky top-0 z-30 flex h-screen w-[248px] shrink-0 flex-col bg-[var(--ink)] text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-[var(--signal)] via-[rgba(224,90,26,0.35)] to-transparent" />
        <div className="relative overflow-hidden px-5 pb-5 pt-6">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[var(--signal)] opacity-25 blur-3xl" />
          <Link href="/jobs" className="brand-mark relative text-[22px] text-white">
            RUTR
          </Link>
          <p className="relative mt-2 text-[11px] font-medium tracking-[0.14em] text-white/45">
            CONNECT
          </p>
          <div className="signal-rule mt-4" />
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-3">
          <NavGroup label="Field ops" links={fieldOps} active={active} />
          <NavGroup label="CRM" links={crm} active={active} />
          <NavGroup label="System" links={system} active={active} />
        </nav>

        <div className="mx-3 mb-3 rounded-[12px] border border-white/10 bg-white/[0.04] px-3.5 py-3 text-[11px] text-white/55">
          <p className="font-semibold tracking-wide text-white/75">Rutters</p>
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
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(255,255,255,0.78)] backdrop-blur-xl">
          <div className="signal-sweep h-[3px] bg-gradient-to-r from-[var(--signal)] via-[#ff8a4c] to-transparent" />
          <div className="flex h-[58px] items-center justify-between gap-4 px-7">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                {title ?? titles[active]}
              </p>
              <p className="truncate text-[14px] font-semibold tracking-tight text-[var(--text)]">
                Rutters Roofing &amp; Exteriors
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="hidden h-10 w-60 items-center rounded-full border border-[var(--line)] bg-white/90 px-4 text-[12px] text-[var(--muted)] md:flex"
                title="Search coming later"
              >
                <span className="mr-2 text-[var(--signal)]">⌘K</span>
                Search jobs, digests…
              </div>
              <StaffSession />
            </div>
          </div>
        </header>

        <main className="page-enter flex-1 px-7 py-7">{children}</main>
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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="signal-rule mb-3" />
        <h1 className="display-title text-[34px] text-[var(--text)] sm:text-[40px]">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-3.5 flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
