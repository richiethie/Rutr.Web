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
      <Link href="/login" className="console-btn console-btn-secondary h-8 text-[12px]">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden text-right sm:block">
        <p className="text-[12px] font-medium text-foreground">{user.displayName}</p>
        <p className="text-[11px] text-muted-foreground">{user.role}</p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-[11px] font-medium text-foreground">
        {user.displayName
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
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
