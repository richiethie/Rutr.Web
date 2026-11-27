export const TOKEN_KEY = "rutr_token";
export const USER_KEY = "rutr_user";
export const TOKEN_COOKIE = "rutr_token";
/** Explicit opt-in for Rutters demo header — never set automatically. */
export const DEMO_COOKIE = "rutr_demo";
export const DEMO_KEY = "rutr_demo";

export type StaffUser = {
  displayName: string;
  role: string;
  organizationId?: string;
  organizationName?: string;
  brandPrimaryColor?: string | null;
};

export function readStaffUser(): StaffUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffUser;
  } catch {
    return null;
  }
}

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isDemoSession(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(DEMO_KEY) === "1") return true;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${DEMO_COOKIE}=`));
}

export function persistSession(token: string, user: StaffUser) {
  clearDemoSession();
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  const maxAge = 60 * 60 * 12;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Explicit “Continue with demo” from login — sets flag so API may send X-Demo-Auth. */
export function persistDemoSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.setItem(DEMO_KEY, "1");
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      displayName: "Demo PM",
      role: "Pm",
      organizationName: "Rutters",
    } satisfies StaffUser),
  );
  const maxAge = 60 * 60 * 12;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${DEMO_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearDemoSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_KEY);
  }
  if (typeof document !== "undefined") {
    document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(DEMO_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Browser auth headers. JWT when present; X-Demo-Auth only after explicit
 * persistDemoSession() — never silent fallback (RUT-29).
 */
export function clientAuthHeaders(): Record<string, string> {
  const token = readToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  if (isDemoSession()) {
    return { "X-Demo-Auth": "pm" };
  }
  return {};
}

/**
 * Server (RSC): JWT cookie, else explicit demo cookie. No silent demo.
 */
export async function serverAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const token = jar.get(TOKEN_COOKIE)?.value;
    if (token) {
      return { Authorization: `Bearer ${decodeURIComponent(token)}` };
    }
    if (jar.get(DEMO_COOKIE)?.value === "1") {
      return { "X-Demo-Auth": "pm" };
    }
  } catch {
    /* not in a Next request context */
  }
  return {};
}

/** Auth headers for the current runtime (browser or RSC). */
export async function authHeaders(): Promise<Record<string, string>> {
  if (typeof window === "undefined") {
    return serverAuthHeaders();
  }
  return clientAuthHeaders();
}
