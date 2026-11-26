import Link from "next/link";
import { StaffSearch } from "@/components/StaffSearch";
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
    <div className="mb-4">
      <p className="mb-1 px-2 text-[11px] font-medium text-zinc-500">{label}</p>
      <div className="flex flex-col gap-0.5">
        {links.map((link) => {
          const isActive = link.keys.includes(active);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "nav-link nav-link-active" : "nav-link"}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
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
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 z-30 flex h-screen w-[240px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-50">
        <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-4">
          <Link href="/jobs" className="brand-mark text-[15px] tracking-tight text-white">
            RUTR
          </Link>
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
            Connect
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavGroup label="Operations" links={fieldOps} active={active} />
          <NavGroup label="CRM" links={roster} active={active} />
          <NavGroup label="System" links={system} active={active} />
        </nav>

        <div className="border-t border-zinc-800 px-4 py-3">
          <p className="text-[12px] font-medium text-zinc-200">Rutters</p>
          <p className="text-[11px] text-zinc-500">Roofing &amp; Exteriors</p>
          <p className="mt-2 text-[11px] text-zinc-500">
            {live ? (
              <span className="inline-flex items-center gap-1.5 text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                API · 5188
              </span>
            ) : (
              <span>Staff console</span>
            )}
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-foreground">
              {title ?? titles[active]}
            </p>
            <p className="truncate text-[12px] text-muted-foreground">
              Rutters Roofing &amp; Exteriors
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StaffSearch />
            <StaffSession />
          </div>
        </header>

        <main className="page-enter flex-1 px-6 py-8">{children}</main>
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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <h1 className="display-title text-[28px] tracking-tight text-foreground sm:text-[32px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        {meta ? <div className="mt-3 flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
