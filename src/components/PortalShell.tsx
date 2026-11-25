import Link from "next/link";

/** Homeowner chrome — same Field Signal craft, no staff nav. */
export function PortalShell({
  children,
  organizationName,
}: {
  children: React.ReactNode;
  organizationName: string;
}) {
  return (
    <div className="min-h-screen text-[var(--text)]">
      <header className="portal-hero-band relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 sidebar-grid opacity-40" />
        <div className="brand-flare pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[var(--signal)] blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl items-end justify-between gap-4 px-5 pb-6 pt-7 sm:px-8">
          <div className="min-w-0">
            <p className="brand-mark text-[20px] text-white">RUTR</p>
            <p className="mt-2 truncate text-[14px] font-semibold text-white/85">
              {organizationName}
            </p>
            <p className="mt-1 text-[11px] font-semibold tracking-[0.16em] text-[var(--flare)]">
              PROJECT PORTAL
            </p>
          </div>
          <div className="signal-rule shrink-0 self-center" />
        </div>
        <div className="signal-sweep h-[3px] bg-gradient-to-r from-[var(--signal)] via-[var(--flare)] to-transparent" />
      </header>

      <main className="page-enter mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">{children}</main>

      <footer className="border-t border-[var(--line)] py-6 text-center text-[12px] text-[var(--muted)]">
        Updates appear only after your project manager approves them.
        <span className="mx-2 text-[var(--line-strong)]">·</span>
        <Link href="/login" className="font-bold text-[var(--signal)] hover:underline">
          Staff
        </Link>
      </footer>
    </div>
  );
}
