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
    <div className="relative flex min-h-screen overflow-hidden">
      <aside className="sidebar-grid relative hidden w-[44%] flex-col justify-between bg-[var(--ink)] px-10 py-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_320px_at_0%_0%,rgba(255,92,26,0.28),transparent_60%)]" />
        <div className="brand-flare pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-[var(--signal)] blur-3xl" />
        <div className="relative">
          <p className="brand-mark text-[32px]">RUTR</p>
          <p className="mt-3 text-[12px] font-semibold tracking-[0.22em] text-[var(--flare)]">
            FIELD SIGNAL
          </p>
          <div className="signal-rule mt-6" />
        </div>
        <div className="relative max-w-sm">
          <h1 className="display-title text-[42px] leading-[0.95] text-white">
            Staff console for the job in the yard.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/55">
            Approvals, evidence, and homeowner updates — one copper signal from field to portal.
          </p>
        </div>
        <p className="relative text-[11px] tracking-[0.12em] text-white/35">
          RUTTERS · ROOFING &amp; EXTERIORS
        </p>
      </aside>

      <div className="relative flex flex-1 items-center justify-center px-5 py-12">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[var(--signal)] opacity-[0.12] blur-3xl" />
        <div className="page-enter relative w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="brand-mark text-[26px] text-[var(--text)]">RUTR</p>
            <p className="mt-2 text-[11px] font-semibold tracking-[0.18em] text-[var(--signal)]">
              FIELD SIGNAL
            </p>
          </div>
          <div className="console-panel p-8 shadow-[var(--shadow-lg)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Staff sign-in
            </p>
            <h2 className="display-title mt-2 text-[28px] text-[var(--text)]">Open the console</h2>
            <p className="mt-2 text-[13px] text-[var(--muted)]">
              Demo: pm@rutters.demo / rutters-demo
            </p>
            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <label className="block text-[12px] font-bold text-[var(--muted)]">
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
              <label className="block text-[12px] font-bold text-[var(--muted)]">
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
              {error ? <p className="text-[12px] text-[var(--danger)]">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="console-btn console-btn-primary mt-1 w-full"
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-[12px] text-[var(--muted)]">
            <Link href="/jobs" className="font-bold text-[var(--signal)] hover:underline">
              Continue with demo header
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
