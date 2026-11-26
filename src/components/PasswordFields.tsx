"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import {
  STAFF_PASSWORD_MAX,
  STAFF_PASSWORD_MIN,
  getPasswordChecks,
  type PasswordChecks,
} from "@/lib/password";
import { cn } from "@/lib/utils";

function CheckRow({ ok, label, active }: { ok: boolean; label: string; active: boolean }) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 text-[12px]",
        !active
          ? "text-muted-foreground"
          : ok
            ? "text-ok"
            : "text-destructive",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
          !active
            ? "border-border text-muted-foreground"
            : ok
              ? "border-ok/40 bg-ok-soft text-ok"
              : "border-destructive/40 bg-[var(--danger-soft)] text-destructive",
        )}
        aria-hidden
      >
        {active && ok ? "✓" : active ? "!" : "·"}
      </span>
      {label}
    </li>
  );
}

function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  autoComplete = "new-password",
  describedBy,
  invalid,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete?: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block text-[12px] font-medium text-foreground" htmlFor={id}>
      {label}
      <div className="relative mt-1.5">
        <input
          id={id}
          className="console-input pr-10"
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={STAFF_PASSWORD_MIN}
          maxLength={STAFF_PASSWORD_MAX}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={0}
        >
          {visible ? (
            <EyeOff className="size-4" strokeWidth={1.75} />
          ) : (
            <Eye className="size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </label>
  );
}

export function PasswordChecklist({
  checks,
  active,
  showMatch,
}: {
  checks: PasswordChecks;
  active: boolean;
  showMatch: boolean;
}) {
  return (
    <ul className="mt-2 space-y-1 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
      <CheckRow
        active={active}
        ok={checks.minLength}
        label={`At least ${STAFF_PASSWORD_MIN} characters`}
      />
      <CheckRow active={active} ok={checks.letter} label="At least one letter" />
      <CheckRow active={active} ok={checks.number} label="At least one number" />
      <CheckRow
        active={active}
        ok={checks.special}
        label="At least one special character"
      />
      {showMatch ? (
        <CheckRow active={active} ok={checks.match} label="Passwords match" />
      ) : null}
    </ul>
  );
}

/** Password + confirm with eye toggles and live checklist. */
export function PasswordConfirmFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  idPrefix = "pw",
}: {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  idPrefix?: string;
}) {
  const uid = useId();
  const checks = getPasswordChecks(password, confirmPassword);
  const active = password.length > 0 || confirmPassword.length > 0;
  const checklistId = `${idPrefix}-checklist-${uid}`;

  return (
    <div className="space-y-3">
      <PasswordInput
        id={`${idPrefix}-password-${uid}`}
        name="password"
        label="Password"
        value={password}
        onChange={onPasswordChange}
        describedBy={checklistId}
        invalid={active && !passwordChecksOk(checks, false)}
      />
      <PasswordInput
        id={`${idPrefix}-confirm-${uid}`}
        name="confirmPassword"
        label="Confirm password"
        value={confirmPassword}
        onChange={onConfirmChange}
        describedBy={checklistId}
        invalid={active && confirmPassword.length > 0 && !checks.match}
      />
      <div id={checklistId}>
        <PasswordChecklist checks={checks} active={active} showMatch />
      </div>
    </div>
  );
}

function passwordChecksOk(checks: PasswordChecks, requireMatch: boolean) {
  return (
    checks.minLength &&
    checks.letter &&
    checks.number &&
    checks.special &&
    (!requireMatch || checks.match)
  );
}

/** Single password field + checklist (admin-add temporary password). */
export function TemporaryPasswordField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const uid = useId();
  const checks = getPasswordChecks(value);
  const active = value.length > 0;
  const checklistId = `temp-pw-checklist-${uid}`;

  return (
    <div className="space-y-2">
      <PasswordInput
        id={`temp-password-${uid}`}
        name="temporaryPassword"
        label="Temporary password"
        value={value}
        onChange={onChange}
        describedBy={checklistId}
        invalid={active && !passwordChecksOk(checks, false)}
      />
      <div id={checklistId}>
        <PasswordChecklist checks={checks} active={active} showMatch={false} />
      </div>
    </div>
  );
}

export { passwordChecksOk };
