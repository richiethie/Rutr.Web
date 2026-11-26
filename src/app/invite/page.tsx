"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { acceptInvite } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { persistSession } from "@/lib/auth";
import {
  STAFF_PASSWORD_MAX,
  STAFF_PASSWORD_MESSAGES,
  STAFF_PASSWORD_MIN,
  passwordsMatch,
  staffPasswordError,
} from "@/lib/password";

function AcceptInviteForm() {
  const search = useSearchParams();
  const tokenFromUrl = search.get("token") ?? "";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validatePasswords(nextPassword = password, nextConfirm = confirmPassword) {
    const strength = staffPasswordError(nextPassword);
    setPasswordError(strength);
    if (!nextConfirm) {
      setConfirmError(null);
    } else if (!passwordsMatch(nextPassword, nextConfirm)) {
      setConfirmError(STAFF_PASSWORD_MESSAGES.mismatch);
    } else {
      setConfirmError(null);
    }
    return !strength && !!nextConfirm && passwordsMatch(nextPassword, nextConfirm);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const inviteToken = String(form.get("inviteToken") ?? "").trim();
    const displayName = String(form.get("displayName") ?? "").trim();

    if (!validatePasswords()) {
      setError(null);
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
        <div>
          <label className="block text-[12px] font-medium text-foreground">
            Password
            <input
              className="console-input mt-1.5"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={STAFF_PASSWORD_MIN}
              maxLength={STAFF_PASSWORD_MAX}
              required
              value={password}
              onChange={(e) => {
                const next = e.target.value;
                setPassword(next);
                validatePasswords(next, confirmPassword);
              }}
              onBlur={() => validatePasswords()}
              aria-invalid={Boolean(passwordError)}
              aria-describedby="invite-password-hint invite-password-error"
            />
          </label>
          <p id="invite-password-hint" className="mt-1.5 text-[11px] text-muted-foreground">
            At least {STAFF_PASSWORD_MIN} characters, with a letter and a number.
          </p>
          {passwordError ? (
            <p id="invite-password-error" className="mt-1 text-[12px] text-destructive">
              {passwordError}
            </p>
          ) : null}
        </div>
        <div>
          <label className="block text-[12px] font-medium text-foreground">
            Confirm password
            <input
              className="console-input mt-1.5"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={STAFF_PASSWORD_MIN}
              maxLength={STAFF_PASSWORD_MAX}
              required
              value={confirmPassword}
              onChange={(e) => {
                const next = e.target.value;
                setConfirmPassword(next);
                validatePasswords(password, next);
              }}
              onBlur={() => validatePasswords()}
              aria-invalid={Boolean(confirmError)}
              aria-describedby="invite-confirm-error"
            />
          </label>
          {confirmError ? (
            <p id="invite-confirm-error" className="mt-1 text-[12px] text-destructive">
              {confirmError}
            </p>
          ) : null}
        </div>
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
