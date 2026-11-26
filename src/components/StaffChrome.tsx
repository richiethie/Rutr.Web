import Link from "next/link";
import {
  Briefcase,
  Camera,
  CheckSquare,
  ClipboardCheck,
  Contact,
  FileText,
  Flag,
  Home,
  Plug,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { StaffSearch } from "@/components/StaffSearch";
import { StaffSession } from "@/components/StaffSession";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  keys: readonly string[];
  icon: LucideIcon;
};

const fieldOps: NavItem[] = [
  { href: "/jobs", label: "Jobs", keys: ["jobs", "detail"], icon: Briefcase },
  { href: "/approvals", label: "Approvals", keys: ["approvals"], icon: ClipboardCheck },
  { href: "/evidence", label: "Evidence", keys: ["evidence"], icon: Camera },
  { href: "/tasks", label: "Tasks", keys: ["tasks"], icon: CheckSquare },
  { href: "/notes", label: "Notes", keys: ["notes"], icon: FileText },
  { href: "/milestones", label: "Milestones", keys: ["milestones"], icon: Flag },
];

const roster: NavItem[] = [
  { href: "/contacts", label: "Contacts", keys: ["contacts"], icon: Contact },
  { href: "/properties", label: "Properties", keys: ["properties"], icon: Home },
  { href: "/consents", label: "Consents", keys: ["consents"], icon: ShieldCheck },
];

const system: NavItem[] = [
  { href: "/integrations", label: "Integrations", keys: ["integrations"], icon: Plug },
  { href: "/settings", label: "Settings", keys: ["settings"], icon: Settings },
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
  links: NavItem[];
  active: StaffNav;
}) {
  return (
    <div className="mb-5">
      <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide text-sidebar-muted">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">
        {links.map((link) => {
          const isActive = link.keys.includes(active);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "nav-link nav-link-active" : "nav-link"}
            >
              <Icon className="nav-icon" strokeWidth={1.75} />
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
      <aside className="sticky top-0 z-30 flex h-screen w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-[11px] font-semibold text-sidebar-primary-foreground">
            R
          </div>
          <div className="min-w-0">
            <Link href="/jobs" className="brand-mark block truncate text-[14px] tracking-tight">
              RUTR Connect
            </Link>
            <p className="truncate text-[11px] text-sidebar-muted">Rutters Roofing</p>
          </div>
        </div>

        <div className="border-b border-sidebar-border px-3 py-3">
          <Link
            href="/jobs"
            className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-sidebar-primary text-[13px] font-medium text-sidebar-primary-foreground transition-opacity hover:opacity-90"
          >
            <span className="text-[15px] leading-none">+</span>
            New job
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavGroup label="Operations" links={fieldOps} active={active} />
          <NavGroup label="CRM" links={roster} active={active} />
          <NavGroup label="System" links={system} active={active} />
        </nav>

        <div className="space-y-3 border-t border-sidebar-border px-3 py-3">
          <p className="px-2 text-[11px] text-sidebar-muted">
            {live ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                <span className="text-ok">API connected</span>
                <span className="text-sidebar-muted">· 5188</span>
              </span>
            ) : (
              <span>Staff console</span>
            )}
          </p>
          <StaffSession variant="sidebar" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <p className="truncate text-[14px] font-medium text-foreground">
              {title ?? titles[active]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StaffSearch />
          </div>
        </header>

        <main className="page-enter flex-1 px-6 py-6 md:px-8 md:py-8">{children}</main>
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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <h1 className="display-title text-[26px] tracking-tight text-foreground sm:text-[30px]">
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
