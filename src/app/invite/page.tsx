"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import {
  PasswordConfirmFields,
  passwordChecksOk,
} from "@/components/PasswordFields";
import { acceptInvite } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { persistSession } from "@/lib/auth";
import {
  STAFF_PASSWORD_MESSAGES,
  getPasswordChecks,
  staffPasswordError,
} from "@/lib/password";

function AcceptInviteForm() {
  const search = useSearchParams();
  const tokenFromUrl = search.get("token") ?? "";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function passwordsValid() {
    return passwordChecksOk(getPasswordChecks(password, confirmPassword), true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const inviteToken = String(form.get("inviteToken") ?? "").trim();
    const displayName = String(form.get("displayName") ?? "").trim();

    if (!passwordsValid()) {
      const strength = staffPasswordError(password);
      setError(
        strength ??
          (!confirmPassword || password !== confirmPassword
            ? STAFF_PASSWORD_MESSAGES.mismatch
            : "Check password requirements."),
      );
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const data = await acceptInvite({
        inviteToken,
        password,
        displayName: displayName || null,
      });
      persistSession(data.token, {
        displayName: data.displayName,
        role: data.role,
        organizationId: data.organizationId,
        organizationName: data.organization.name,
        brandPrimaryColor: data.organization.brandPrimaryColor,
      });
      window.location.href = "/jobs";
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Invite accept failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Accept invite"
      description="Set your password to join the organization."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <label className="block text-[12px] font-medium text-foreground">
          Invite token
          <input
            className="console-input mt-1.5 font-mono-data"
            name="inviteToken"
            required
            defaultValue={tokenFromUrl}
            placeholder="inv_…"
          />
        </label>
        <label className="block text-[12px] font-medium text-foreground">
          Display name <span className="font-normal text-muted-foreground">(optional)</span>
          <input className="console-input mt-1.5" name="displayName" autoComplete="name" />
        </label>

        <PasswordConfirmFields
          idPrefix="invite"
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={setPassword}
          onConfirmChange={setConfirmPassword}
        />

        {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="console-btn console-btn-primary w-full"
        >
          {busy ? "Joining…" : "Join organization"}
        </button>
      </form>
    </AuthCard>
  );
}

export default function InvitePage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <AuthCard title="Accept invite" description="Loading…">
            <p className="text-[13px] text-muted-foreground">Loading invite…</p>
          </AuthCard>
        }
      >
        <AcceptInviteForm />
      </Suspense>
      <p className="text-center text-[12px] text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
