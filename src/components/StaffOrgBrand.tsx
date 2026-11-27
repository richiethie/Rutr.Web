"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { fetchOrganization, fetchStaffMe } from "@/lib/api";
import { brandTokenSet, normalizeBrandColor } from "@/lib/brand";
import { persistSession, readStaffUser, readToken, type StaffUser } from "@/lib/auth";

type OrgBrand = {
  name: string;
  brandPrimaryColor: string | null;
};

const OrgBrandContext = createContext<OrgBrand>({
  name: "Your organization",
  brandPrimaryColor: null,
});

function fromSession(user: StaffUser | null): OrgBrand | null {
  if (!user?.organizationName) return null;
  return {
    name: user.organizationName,
    brandPrimaryColor: user.brandPrimaryColor ?? null,
  };
}

/** Wraps staff chrome: org name + brandPrimaryColor CSS tokens for accents. */
export function StaffBrandScope({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<OrgBrand>(() => {
    if (typeof window === "undefined") {
      return { name: "Your organization", brandPrimaryColor: null };
    }
    return (
      fromSession(readStaffUser()) ?? {
        name: "Your organization",
        brandPrimaryColor: null,
      }
    );
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [org, me] = await Promise.all([
          fetchOrganization().catch(() => null),
          fetchStaffMe().catch(() => null),
        ]);
        if (cancelled) return;
        const name = org?.name || me?.organizationName || brand.name;
        const color = org?.brandPrimaryColor ?? brand.brandPrimaryColor ?? null;
        setBrand({ name, brandPrimaryColor: color });

        const session = readStaffUser();
        const token = readToken();
        if (session && token) {
          persistSession(token, {
            ...session,
            organizationId: me?.organizationId ?? session.organizationId,
            organizationName: name,
            brandPrimaryColor: color,
          });
        }
      } catch {
        /* keep session / placeholder */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = brandTokenSet(brand.brandPrimaryColor) as CSSProperties;

  return (
    <OrgBrandContext.Provider value={brand}>
      <div
        className="staff-brand-scope flex min-h-svh w-full bg-canvas text-foreground"
        style={style}
        data-org={brand.name}
      >
        {children}
      </div>
    </OrgBrandContext.Provider>
  );
}

export function useOrgBrand() {
  return useContext(OrgBrandContext);
}

export function StaffOrgMark() {
  const brand = useOrgBrand();
  const tokens = brandTokenSet(brand.brandPrimaryColor);
  return (
    <Link
      href="/jobs"
      className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-sidebar-accent"
    >
      <div
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold"
        style={{
          background: normalizeBrandColor(brand.brandPrimaryColor),
          color: tokens["--sidebar-primary-foreground"],
        }}
      >
        {(brand.name.trim()[0] || "R").toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold tracking-tight">RUTR Connect</p>
        <p className="truncate text-[11px] text-sidebar-muted">{brand.name}</p>
      </div>
    </Link>
  );
}
