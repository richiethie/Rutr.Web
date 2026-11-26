export const TOKEN_KEY = "rutr_token";
export const USER_KEY = "rutr_user";
export const TOKEN_COOKIE = "rutr_token";

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

export function persistSession(token: string, user: StaffUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  const maxAge = 60 * 60 * 12;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/** Browser: JWT from localStorage, else demo header for Rutters seed fallback. */
export function clientAuthHeaders(): Record<string, string> {
  const token = readToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return { "X-Demo-Auth": "pm" };
}

/**
 * Server (RSC): prefer JWT cookie from signup/login so new orgs do not
 * silently fall back to the Rutters demo seed via X-Demo-Auth.
 */
export async function serverAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const token = jar.get(TOKEN_COOKIE)?.value;
    if (token) {
      return { Authorization: `Bearer ${decodeURIComponent(token)}` };
    }
  } catch {
    /* not in a Next request context */
  }
  return { "X-Demo-Auth": "pm" };
}

/** Auth headers for the current runtime (browser or RSC). */
export async function authHeaders(): Promise<Record<string, string>> {
  if (typeof window === "undefined") {
    return serverAuthHeaders();
  }
  return clientAuthHeaders();
}
