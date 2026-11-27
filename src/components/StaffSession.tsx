"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { clearSession, readStaffUser, type StaffUser } from "@/lib/auth";

export function StaffSession({
  variant = "header",
}: {
  variant?: "header" | "sidebar";
}) {
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    setUser(readStaffUser());
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className={
          variant === "sidebar"
            ? "flex h-9 w-full items-center justify-center rounded-md border border-sidebar-border text-[12px] font-medium text-sidebar-foreground hover:bg-sidebar-accent"
            : "console-btn console-btn-secondary h-8 text-[12px]"
        }
      >
        Sign in
      </Link>
    );
  }

  const initials = user.displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (variant === "sidebar") {
    return (
      <div className="flex items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-sidebar-accent">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-[11px] font-semibold text-brand">
          {initials}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[13px] font-medium text-sidebar-foreground">
            {user.displayName}
          </p>
          <p className="truncate text-[11px] text-sidebar-muted">{user.role}</p>
        </div>
        <button
          type="button"
          title="Sign out"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={() => {
            clearSession();
            setUser(null);
            window.location.href = "/login";
          }}
        >
          <LogOut className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden text-right sm:block">
        <p className="text-[12px] font-medium text-foreground">{user.displayName}</p>
        <p className="text-[11px] text-muted-foreground">{user.role}</p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-brand-soft text-[11px] font-medium text-brand">
        {initials}
      </div>
      <button
        type="button"
        className="console-btn console-btn-ghost h-8 text-[12px]"
        onClick={() => {
          clearSession();
          setUser(null);
          window.location.href = "/login";
        }}
      >
        Sign out
      </button>
    </div>
  );
}
