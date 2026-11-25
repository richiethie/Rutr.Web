import Link from "next/link";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/approvals", label: "Approvals" },
  { href: "/login", label: "Login" },
];

export function StaffChrome({
  children,
  active,
  source,
}: {
  children: React.ReactNode;
  active: "jobs" | "approvals" | "detail";
  source?: "api" | "sample";
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--rutr-line)]">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 py-6 sm:px-8">
          <div>
            <Link href="/jobs" className="brand-mark text-3xl text-[var(--rutr-chalk)] sm:text-4xl">
              RUTR
            </Link>
            <p className="mt-1 max-w-md text-sm text-[var(--rutr-mist)]">
              Contractor OS · Connect for Rutters
            </p>
          </div>
          <nav className="flex items-center gap-5 text-sm uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
            {links.map((link) => {
              const isActive =
                (active === "jobs" || active === "detail") && link.href === "/jobs"
                  ? active === "jobs"
                  : active === "approvals" && link.href === "/approvals";
              const detailJobs = active === "detail" && link.href === "/jobs";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive || detailJobs
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
        ) : null}
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
