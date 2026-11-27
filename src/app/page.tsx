import { redirect } from "next/navigation";

/**
 * Entry is handled by middleware (session → /jobs, else → /login).
 * Keep a server redirect as a fallback if middleware is bypassed.
 */
export default function HomePage() {
  redirect("/login");
}
