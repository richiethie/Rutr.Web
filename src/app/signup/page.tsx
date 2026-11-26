"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { signupStaff } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { persistSession } from "@/lib/auth";
import {
  STAFF_PASSWORD_MAX,
  STAFF_PASSWORD_MESSAGES,
  STAFF_PASSWORD_MIN,
  passwordsMatch,
  staffPasswordError,
} from "@/lib/password";

export default function SignupPage() {
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
    const email = String(form.get("email") ?? "").trim();
    const displayName = String(form.get("displayName") ?? "").trim();
    const organizationName = String(form.get("organizationName") ?? "").trim();
    const brandPrimaryColor = String(form.get("brandPrimaryColor") ?? "").trim();

    if (!validatePasswords()) {
      setError(null);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const data = await signupStaff({
        email,
        password,
        displayName,
        organizationName,
        brandPrimaryColor: brandPrimaryColor || null,
      });
      persistSession(data.token, {
        displayName: data.displayName,
        role: data.role,
      });
      window.location.href = "/onboarding/team";
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Signup failed — is the API on :5188?",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell step="account" wide>
      <AuthCard
        title="Create your account"
        description="Sign up creates your staff user and organization in one step."
      >
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <label className="block text-[12px] font-medium text-foreground">
            Your name
            <input
              className="console-input mt-1.5"
              name="displayName"
              autoComplete="name"
              required
              placeholder="Jamie Acme"
            />
          </label>
          <label className="block text-[12px] font-medium text-foreground">
            Work email
            <input
              className="console-input mt-1.5"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="jamie@acme-roofing.example"
            />
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
                aria-describedby="signup-password-hint signup-password-error"
              />
            </label>
            <p id="signup-password-hint" className="mt-1.5 text-[11px] text-muted-foreground">
              At least {STAFF_PASSWORD_MIN} characters, with a letter and a number.
            </p>
            {passwordError ? (
              <p id="signup-password-error" className="mt-1 text-[12px] text-destructive">
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
                aria-describedby="signup-confirm-error"
              />
            </label>
            {confirmError ? (
              <p id="signup-confirm-error" className="mt-1 text-[12px] text-destructive">
                {confirmError}
              </p>
            ) : null}
          </div>
          <div className="border-t border-border pt-4">
            <p className="mb-3 text-[12px] font-medium text-muted-foreground">
              Organization
            </p>
            <label className="block text-[12px] font-medium text-foreground">
              Company name
              <input
                className="console-input mt-1.5"
                name="organizationName"
                required
                placeholder="Acme Roofing"
              />
            </label>
            <label className="mt-4 block text-[12px] font-medium text-foreground">
              Brand color <span className="font-normal text-muted-foreground">(optional)</span>
              <input
                className="console-input mt-1.5"
                name="brandPrimaryColor"
                placeholder="#B87333"
              />
            </label>
          </div>
          {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="console-btn console-btn-primary mt-1 w-full"
          >
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
      </AuthCard>

      <p className="text-center text-[12px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
