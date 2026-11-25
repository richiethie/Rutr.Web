"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { loginStaff } from "@/lib/api";
import { persistSession } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("pm@rutters.demo");
  const [password, setPassword] = useState("rutters-demo");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await loginStaff(email, password);
      persistSession(data.token, { displayName: data.displayName, role: data.role });
      window.location.href = "/jobs";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed — is the API on :5188?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(197,106,45,0.18),_transparent_55%)]" />
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="brand-mark text-4xl text-[var(--rutr-chalk)]">
          RUTR
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-[var(--rutr-chalk)]">Staff sign-in</h1>
        <p className="mt-2 text-sm text-[var(--rutr-mist)]">
          Demo: pm@rutters.demo / rutters-demo. JWT is stored for approve actions; SSR still falls
          back to demo auth when the API is reachable.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 border-y border-[var(--rutr-line)] py-8">
          <label className="block text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
            Email
            <input
              className="mt-2 w-full border border-[var(--rutr-line)] bg-[var(--rutr-asphalt)] px-3 py-3 text-base text-[var(--rutr-chalk)] outline-none focus:border-[var(--rutr-copper)]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
            Password
            <input
              className="mt-2 w-full border border-[var(--rutr-line)] bg-[var(--rutr-asphalt)] px-3 py-3 text-base text-[var(--rutr-chalk)] outline-none focus:border-[var(--rutr-copper)]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm text-[var(--rutr-copper-hot)]">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="approve-btn w-full bg-[var(--rutr-copper)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--rutr-ink)] hover:bg-[var(--rutr-copper-hot)] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--rutr-mist)]">
          <Link href="/jobs" className="underline-offset-4 hover:text-[var(--rutr-chalk)] hover:underline">
            Continue with demo header
          </Link>
        </p>
      </div>
    </div>
  );
}
