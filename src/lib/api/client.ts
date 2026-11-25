import createClient from "openapi-fetch";
import type { paths } from "@/lib/api/schema";
import { clientAuthHeaders } from "@/lib/auth";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5188";

/** Generated OpenAPI client. Prefer helpers in `@/lib/api` for staff SSR/CRUD. */
export function createRutrClient() {
  return createClient<paths>({
    baseUrl,
    headers: {
      "Content-Type": "application/json",
      ...(typeof window === "undefined"
        ? { "X-Demo-Auth": "pm" }
        : clientAuthHeaders()),
    },
  });
}
