export const TOKEN_KEY = "rutr_token";
export const USER_KEY = "rutr_user";
export const TOKEN_COOKIE = "rutr_token";

export type StaffUser = {
  displayName: string;
  role: string;
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

export function clientAuthHeaders(): Record<string, string> {
  const token = readToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return { "X-Demo-Auth": "pm" };
}
