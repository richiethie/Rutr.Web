/**
 * Staff password strength — mirrors Rutr.Api StaffPasswordRules
 * (signup / accept-invite / admin-add temporary password).
 * confirmPassword is client-only; API validates a single password field.
 */
export const STAFF_PASSWORD_MIN = 8;
export const STAFF_PASSWORD_MAX = 128;

export const STAFF_PASSWORD_MESSAGES = {
  required: "Password is required.",
  minLength: "Password must be at least 8 characters.",
  letter: "Password must include at least one letter.",
  number: "Password must include at least one number.",
  special: "Password must include at least one special character.",
  mismatch: "Passwords do not match.",
} as const;

const hasLetter = /[A-Za-z]/;
const hasNumber = /[0-9]/;
/** Same as API: any non-alphanumeric. */
const hasSpecial = /[^A-Za-z0-9]/;

export type PasswordChecks = {
  minLength: boolean;
  letter: boolean;
  number: boolean;
  special: boolean;
  match: boolean;
};

export function getPasswordChecks(
  password: string,
  confirm: string = "",
): PasswordChecks {
  return {
    minLength: password.length >= STAFF_PASSWORD_MIN,
    letter: hasLetter.test(password),
    number: hasNumber.test(password),
    special: hasSpecial.test(password),
    match: confirm.length > 0 && password === confirm,
  };
}

export function passwordChecksPass(checks: PasswordChecks, requireMatch: boolean) {
  return (
    checks.minLength &&
    checks.letter &&
    checks.number &&
    checks.special &&
    (!requireMatch || checks.match)
  );
}

/** First failing strength rule, or null if OK (does not check confirm). */
export function staffPasswordError(password: string): string | null {
  if (!password) return STAFF_PASSWORD_MESSAGES.required;
  if (password.length < STAFF_PASSWORD_MIN) return STAFF_PASSWORD_MESSAGES.minLength;
  if (password.length > STAFF_PASSWORD_MAX) {
    return `Password must be at most ${STAFF_PASSWORD_MAX} characters.`;
  }
  if (!hasLetter.test(password)) return STAFF_PASSWORD_MESSAGES.letter;
  if (!hasNumber.test(password)) return STAFF_PASSWORD_MESSAGES.number;
  if (!hasSpecial.test(password)) return STAFF_PASSWORD_MESSAGES.special;
  return null;
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password === confirm;
}
