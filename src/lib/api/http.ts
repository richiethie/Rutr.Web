import { clientAuthHeaders } from "@/lib/auth";
import { ApiError } from "@/lib/api/errors";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5188";

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

  if (!res.ok) {
    let detail = `API ${res.status}`;
    try {
      const body = (await res.json()) as { title?: string; detail?: string; error?: string };
      detail = body.detail || body.title || body.error || detail;
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
