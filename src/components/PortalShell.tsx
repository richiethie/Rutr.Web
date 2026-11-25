import Link from "next/link";

/** Lightweight homeowner chrome — shares console craft, no staff left nav. */
export function PortalShell({
  children,
  organizationName,
}: {
  children: React.ReactNode;
  organizationName: string;
}) {
  return (
    <div className="min-h-screen text-[var(--console-text)]">
      <header className="sticky top-0 z-20 border-b border-[var(--console-border)] bg-[rgba(255,255,255,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="min-w-0">
            <p className="brand-mark text-[15px] text-[var(--console-text)]">RUTR</p>
            <p className="truncate text-[12px] text-[var(--console-muted)]">{organizationName}</p>
          </div>
          <span className="console-badge console-badge-accent shrink-0">Project portal</span>
        </div>
      </header>
      <main className="page-enter mx-auto max-w-3xl px-5 py-7 sm:px-8 sm:py-9">{children}</main>
      <footer className="border-t border-[var(--console-border)] py-5 text-center text-[11px] text-[var(--console-muted)]">
        Updates appear only after your project manager approves them.
        <span className="mx-2 text-[var(--console-border-strong)]">·</span>
        <Link href="/login" className="font-semibold text-[var(--console-accent)] hover:underline">
          Staff
        </Link>
      </footer>
    </div>
  );
}
