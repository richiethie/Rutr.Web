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

export function StaffChrome({
  children,
  active,
  source,
}: {
  children: React.ReactNode;
  active: StaffNav;
  source?: "api" | "sample";
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--rutr-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Link href="/jobs" className="brand-mark text-3xl text-[var(--rutr-chalk)] sm:text-4xl">
                RUTR
              </Link>
              <p className="mt-1 max-w-md text-sm text-[var(--rutr-mist)]">
                Contractor OS · Connect for Rutters
              </p>
            </div>
            <StaffSession />
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
            {links.map((link) => {
              const isActive = (link.keys as readonly string[]).includes(active);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? "text-[var(--rutr-copper-hot)]"
                      : "hover:text-[var(--rutr-chalk)]"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {source === "sample" ? (
          <div className="border-t border-[var(--rutr-line)] bg-[rgba(197,106,45,0.12)] px-5 py-2 text-center text-xs tracking-wide text-[var(--rutr-copper-hot)] sm:px-8">
            Showing labeled sample data — API at localhost:5188 not reachable from this session.
          </div>
        ) : source === "api" ? (
          <div className="border-t border-[var(--rutr-line)] bg-[rgba(127,143,107,0.12)] px-5 py-1.5 text-center text-[11px] tracking-wide text-[var(--rutr-sage)] sm:px-8">
            Live API · localhost:5188
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
