import { clientAuthHeaders } from "@/lib/auth";
import { ApiError } from "@/lib/api/errors";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5188";

function readErrorDetail(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const b = body as {
    title?: string;
    detail?: string;
    error?: string;
    errors?: Record<string, string[]>;
  };
  if (b.error) return b.error;
  if (b.detail) return b.detail;
  if (b.title) return b.title;
  if (b.errors) {
    const first = Object.values(b.errors).flat()[0];
    if (first) return first;
  }
  return fallback;
}

async function parseApiResponse<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    let detail = `API ${res.status}`;
    try {
      detail = readErrorDetail(await res.json(), detail);
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, path, detail);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

/** Authenticated staff fetch (JWT or demo header). */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const auth =
    typeof window === "undefined"
      ? { "X-Demo-Auth": "pm" }
      : clientAuthHeaders();

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...auth,
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, path, "Cannot reach API. Is Rutr.Api running on :5188?");
  }

  return parseApiResponse<T>(res, path);
}

/** Anonymous fetch for signup / accept-invite (no demo auth). */
export async function publicApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, path, "Cannot reach API. Is Rutr.Api running on :5188?");
  }

  return parseApiResponse<T>(res, path);
}
