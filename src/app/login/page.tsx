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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--console-accent)] opacity-[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-[var(--console-success)] opacity-[0.08] blur-3xl" />
      <div className="page-enter relative w-full max-w-md">
        <div className="mb-7 text-center">
          <p className="brand-mark text-[28px] text-[var(--console-text)]">RUTR</p>
          <p className="mt-2 text-[13px] text-[var(--console-muted)]">Connect staff console</p>
        </div>
        <div className="console-panel p-7 shadow-[var(--console-shadow-lg)]">
          <h1 className="display-title text-[22px] font-semibold text-[var(--console-text)]">
            Sign in
          </h1>
          <p className="mt-1.5 text-[13px] text-[var(--console-muted)]">
            Demo: pm@rutters.demo / rutters-demo
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
            <label className="block text-[12px] font-semibold text-[var(--console-muted)]">
              Email
              <input
                className="console-input mt-1.5"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label className="block text-[12px] font-semibold text-[var(--console-muted)]">
              Password
              <input
                className="console-input mt-1.5"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="text-[12px] text-[var(--console-danger)]">{error}</p> : null}
            <button type="submit" disabled={busy} className="console-btn console-btn-primary mt-1 w-full">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <p className="mt-5 text-center text-[12px] text-[var(--console-muted)]">
          <Link href="/jobs" className="font-semibold text-[var(--console-accent)] hover:underline">
            Continue with demo header
          </Link>
        </p>
      </div>
    </div>
  );
}
