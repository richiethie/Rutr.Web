import Link from "next/link";

/** Homeowner chrome — same zinc language, no staff sidebar. */
export function PortalShell({
  children,
  organizationName,
}: {
  children: React.ReactNode;
  organizationName: string;
}) {
  return (
    <div className="portal-shell min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="min-w-0">
            <p className="brand-mark text-[14px] text-foreground">RUTR</p>
            <p className="truncate text-[12px] text-muted-foreground">{organizationName}</p>
          </div>
          <span className="console-badge shrink-0">Project portal</span>
        </div>
      </header>

      <main className="page-enter mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">{children}</main>

      <footer className="border-t border-border py-6 text-center text-[12px] text-muted-foreground">
        Updates appear only after your project manager approves them.
        <span className="mx-2 text-zinc-500">·</span>
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Staff
        </Link>
      </footer>
    </div>
  );
}
