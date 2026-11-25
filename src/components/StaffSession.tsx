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
      <Link
        href="/login"
        className="text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)] hover:text-[var(--rutr-chalk)]"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">
      <span className="hidden sm:inline">
        <span className="text-[var(--rutr-chalk)]">{user.displayName}</span>
        <span className="mx-2 text-[var(--rutr-line)]">·</span>
        {user.role}
      </span>
      <button
        type="button"
        className="hover:text-[var(--rutr-copper-hot)]"
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
