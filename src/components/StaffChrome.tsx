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
  Plus,
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
    <div className="px-2 py-1">
      <p className="mb-1 px-2 text-[12px] font-medium text-sidebar-muted">{label}</p>
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
              <span className="truncate">{link.label}</span>
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
  const pageTitle = title ?? titles[active];

  return (
    <div className="flex min-h-svh w-full bg-canvas text-foreground">
      {/* Inset sidebar — softer surface than canvas + inset */}
      <aside className="sticky top-0 z-30 m-2 mr-0 hidden h-[calc(100svh-1rem)] w-[16rem] shrink-0 flex-col rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-14 items-center gap-2 px-3 pt-1">
          <Link
            href="/jobs"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-sidebar-accent"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-[11px] font-semibold text-sidebar-primary-foreground">
              R
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold tracking-tight">RUTR Connect</p>
              <p className="truncate text-[11px] text-sidebar-muted">Rutters Roofing</p>
            </div>
          </Link>
        </div>

        <div className="px-3 pb-2">
          <div className="flex gap-2">
            <Link
              href="/jobs"
              className="flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-md bg-sidebar-primary text-[13px] font-medium text-sidebar-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" strokeWidth={2} />
              New job
            </Link>
            <Link
              href="/approvals"
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-background/60 text-sidebar-foreground hover:bg-sidebar-accent dark:bg-muted"
              title="Approvals"
              aria-label="Approvals"
            >
              <ClipboardCheck className="size-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-1 py-2">
          <NavGroup label="Operations" links={fieldOps} active={active} />
          <NavGroup label="CRM" links={roster} active={active} />
          <NavGroup label="System" links={system} active={active} />
        </nav>

        <div className="mt-auto space-y-2 border-t border-sidebar-border bg-muted/30 p-3 dark:bg-muted/20">
          <p className="px-1 text-[11px] text-sidebar-muted">
            {live ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-ok" />
                <span className="text-ok">API connected</span>
                <span>· 5188</span>
              </span>
            ) : (
              "Staff console"
            )}
          </p>
          <StaffSession variant="sidebar" />
        </div>
      </aside>

      {/* Inset main — raised white/dark panel over canvas */}
      <div className="relative m-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm dark:border-border-strong">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-4 dark:bg-muted/30">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h1 className="truncate text-[14px] font-medium text-foreground">{pageTitle}</h1>
            {live ? (
              <>
                <span className="hidden h-4 w-px bg-border sm:block" />
                <span className="hidden items-center gap-1.5 rounded-full border border-ok/20 bg-ok-soft px-2 py-0.5 text-[11px] font-medium text-ok sm:inline-flex">
                  <span className="size-1.5 rounded-full bg-ok" />
                  Live
                </span>
              </>
            ) : null}
          </div>
          <StaffSearch />
        </header>

        <main className="page-enter flex-1 overflow-auto bg-background">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
        </main>
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <h2 className="display-title text-[22px] tracking-tight text-foreground md:text-[24px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        {meta ? <div className="mt-2.5 flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
