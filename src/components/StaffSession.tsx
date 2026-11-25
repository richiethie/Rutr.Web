"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, readStaffUser, type StaffUser } from "@/lib/auth";

export function StaffSession() {
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    setUser(readStaffUser());
  }, []);

  if (!user) {
    return (
      <Link href="/login" className="console-btn console-btn-secondary text-[12px]">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden text-right sm:block">
        <p className="text-[12px] font-semibold tracking-tight text-[var(--console-text)]">
          {user.displayName}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--console-muted)]">
          {user.role}
        </p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-[var(--signal)] to-[var(--signal-deep)] text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(212,65,8,0.35)]">
        {user.displayName
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
      <button
        type="button"
        className="console-btn console-btn-ghost text-[12px]"
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
