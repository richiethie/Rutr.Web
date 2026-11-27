"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import {
  PasswordConfirmFields,
  passwordChecksOk,
} from "@/components/PasswordFields";
import { signupStaff } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { persistSession } from "@/lib/auth";
import {
  STAFF_PASSWORD_MESSAGES,
  getPasswordChecks,
  staffPasswordError,
} from "@/lib/password";

export default function SignupPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function passwordsValid() {
    const checks = getPasswordChecks(password, confirmPassword);
    return passwordChecksOk(checks, true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const displayName = String(form.get("displayName") ?? "").trim();
    const organizationName = String(form.get("organizationName") ?? "").trim();
    const brandPrimaryColor = String(form.get("brandPrimaryColor") ?? "").trim();

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
        organizationId: data.organizationId,
        organizationName: data.organization.name,
        brandPrimaryColor: data.organization.brandPrimaryColor,
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
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <label className="block text-[13px] font-medium text-foreground">
            Your name
            <input
              className="console-input mt-2 h-10 text-[14px]"
              name="displayName"
              autoComplete="name"
              required
              placeholder="Jamie Acme"
            />
          </label>
          <label className="block text-[13px] font-medium text-foreground">
            Work email
            <input
              className="console-input mt-2 h-10 text-[14px]"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="jamie@acme-roofing.example"
            />
          </label>

          <PasswordConfirmFields
            idPrefix="signup"
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={setPassword}
            onConfirmChange={setConfirmPassword}
          />

          <div className="border-t border-border pt-5">
            <p className="mb-3.5 text-[13px] font-medium text-muted-foreground">
              Organization
            </p>
            <label className="block text-[13px] font-medium text-foreground">
              Company name
              <input
                className="console-input mt-2 h-10 text-[14px]"
                name="organizationName"
                required
                placeholder="Acme Roofing"
              />
            </label>
            <label className="mt-5 block text-[13px] font-medium text-foreground">
              Brand color <span className="font-normal text-muted-foreground">(optional)</span>
              <input
                className="console-input mt-2 h-10 text-[14px]"
                name="brandPrimaryColor"
                placeholder="#B87333"
              />
            </label>
          </div>
          {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="console-btn console-btn-primary mt-1 h-10 w-full text-[14px]"
          >
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
      </AuthCard>

      <p className="text-center text-[13px] text-muted-foreground">
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
