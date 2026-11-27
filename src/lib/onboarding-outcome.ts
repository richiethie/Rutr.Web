/** Persist last onboarding seed/import outcome for jobs empty-state copy. */

export type OnboardingOutcomeKind = "empty" | "sample" | "jobnimbus" | "csv" | "skipped";

export type OnboardingOutcome = {
  kind: OnboardingOutcomeKind;
  contactsCreated: number;
  propertiesCreated: number;
  jobsCreated: number;
  skipped: number;
  warnings: string[];
  message: string;
  at: number;
};

const KEY = "rutr_onboarding_outcome";

export function writeOnboardingOutcome(outcome: Omit<OnboardingOutcome, "at">): OnboardingOutcome {
  const full: OnboardingOutcome = { ...outcome, at: Date.now() };
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(full));
    } catch {
      /* ignore quota */
    }
  }
  return full;
}

export function readOnboardingOutcome(): OnboardingOutcome | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingOutcome;
  } catch {
    return null;
  }
}

export const CSV_HEADERS =
  "externalId,firstName,lastName,email,phone,addressLine1,city,state,postalCode,jobTitle,jobType,status,stage";

export const SAMPLE_CSV = `${CSV_HEADERS}
jn-20001,Dana,Keller,keller@example.com,+13195550142,1428 Maple Ridge Dr,Cedar Falls,IA,50613,Keller reroof,Retail,InProgress,Build
jn-20002,Morgan,Ellis,morgan.ellis@example.com,+13195550188,88 Prairie View Ct,Waterloo,IA,50701,Ellis install,Retail,InProgress,Prepare`;

/** Client-side CSV sanity check before calling the API (not a substitute for API dry-run). */
export function previewCsv(csvContent: string): {
  ok: boolean;
  dataRows: number;
  missingHeaders: string[];
  error?: string;
} {
  const required = [
    "externalid",
    "firstname",
    "lastname",
    "email",
    "phone",
    "addressline1",
    "city",
    "state",
    "postalcode",
  ];
  const text = csvContent.replace(/\r\n/g, "\n").trim();
  if (!text) {
    return { ok: false, dataRows: 0, missingHeaders: required, error: "CSV is empty." };
  }
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return {
      ok: false,
      dataRows: 0,
      missingHeaders: [],
      error: "CSV needs a header row and at least one data row.",
    };
  }
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const missingHeaders = required.filter((h) => !headers.includes(h));
  return {
    ok: missingHeaders.length === 0,
    dataRows: lines.length - 1,
    missingHeaders,
    error:
      missingHeaders.length > 0
        ? `Missing columns: ${missingHeaders.join(", ")}`
        : undefined,
  };
}

export function jobsHrefForOutcome(kind: OnboardingOutcomeKind, jobsCreated: number): string {
  if (kind === "empty" || kind === "skipped") {
    return "/jobs?onboarding=empty";
  }
  return `/jobs?onboarding=imported&jobs=${jobsCreated}&via=${kind}`;
}
