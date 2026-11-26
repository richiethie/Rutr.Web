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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-canvas p-6 md:p-10">
      <div className="page-enter flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
            R
          </div>
          RUTR Connect
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="display-title text-[20px] text-foreground">Sign in</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Demo: pm@rutters.demo / rutters-demo
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-[12px] font-medium text-foreground">
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
            <label className="block text-[12px] font-medium text-foreground">
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
            {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="console-btn console-btn-primary mt-1 w-full"
            >
              {busy ? "Signing in…" : "Continue"}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-muted-foreground">
          <Link href="/jobs" className="font-medium text-foreground underline-offset-4 hover:underline">
            Continue with demo header
          </Link>
        </p>
      </div>
    </div>
  );
}
