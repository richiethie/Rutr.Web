"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { fetchOrganization, loginStaff } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { persistDemoSession, persistSession } from "@/lib/auth";

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
      // Persist token first so org fetch uses JWT (not demo header).
      persistSession(data.token, {
        displayName: data.displayName,
        role: data.role,
        organizationId: data.organizationId,
      });
      let organizationName: string | undefined;
      let brandPrimaryColor: string | null | undefined;
      try {
        const org = await fetchOrganization();
        organizationName = org.name;
        brandPrimaryColor = org.brandPrimaryColor;
        persistSession(data.token, {
          displayName: data.displayName,
          role: data.role,
          organizationId: data.organizationId ?? org.id,
          organizationName,
          brandPrimaryColor,
        });
      } catch {
        /* shell will refresh org from API */
      }
      window.location.href = "/jobs";
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Login failed — is the API on :5188?",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title="Sign in"
        description="Use your account, or the Rutters demo as a fallback."
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block text-[13px] font-medium text-foreground">
            Email
            <input
              className="console-input mt-2 h-10 text-[14px]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="block text-[13px] font-medium text-foreground">
            Password
            <input
              className="console-input mt-2 h-10 text-[14px]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <p className="rounded-md bg-muted px-3.5 py-2.5 text-[12px] text-muted-foreground">
            Demo fallback: pm@rutters.demo / rutters-demo
          </p>
          {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="console-btn console-btn-primary mt-1 h-10 w-full text-[14px]"
          >
            {busy ? "Signing in…" : "Continue"}
          </button>
        </form>
      </AuthCard>

      <div className="space-y-2.5 text-center text-[13px] text-muted-foreground">
        <p>
          New org?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </p>
        <p>
          <button
            type="button"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            onClick={() => {
              persistDemoSession();
              window.location.href = "/jobs";
            }}
          >
            Continue with demo (Rutters seed)
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
