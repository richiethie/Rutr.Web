import { clientAuthHeaders } from "@/lib/auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5188";

export type JobListItem = {
  id: string;
  addressLine1: string;
  city: string;
  state: string;
  homeownerName: string;
  status: string;
  stage: string;
  pendingApprovals: number;
  photoCount: number;
  updatedAt: string;
};

export type Photo = {
  id: string;
  caption: string;
  imageUrl: string;
  customerVisible: boolean;
  capturedAt: string;
};

export type MessageDraft = {
  id: string;
  channel: string;
  subject: string;
  body: string;
  status: string;
  evidenceSummary: string;
  createdAt: string;
  approvedAt: string | null;
};

export type JobDetail = {
  id: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  homeownerName: string;
  homeownerEmail: string;
  homeownerPhone: string;
  status: string;
  stage: string;
  externalJobNimbusId: string;
  updatedAt: string;
  photos: Photo[];
  drafts: MessageDraft[];
  portalToken: string | null;
};

export type ApprovalItem = {
  draftId: string;
  jobId: string;
  addressLine1: string;
  homeownerName: string;
  channel: string;
  subject: string;
  body: string;
  evidenceSummary: string;
  createdAt: string;
};

export type PortalJob = {
  organizationName: string;
  addressLine1: string;
  city: string;
  state: string;
  homeownerName: string;
  status: string;
  stage: string;
  latestUpdate: string;
  photos: Photo[];
};

export type IntegrationStatus = {
  useMocks: boolean;
  jobNimbus: string;
  companyCam: string;
  messaging: string;
};

export type SyncResult = {
  useMocks: boolean;
  jobsUpserted: number;
  photosAdded: number;
  draftsCreated: number;
  portalTokensEnsured: number;
  message: string;
};

export type AuditEvent = {
  id: string;
  jobId: string | null;
  draftId: string | null;
  action: string;
  detail: string;
  createdAt: string;
};

export type FetchResult<T> = {
  data: T;
  source: "api" | "sample";
};

const SAMPLE_JOBS: JobListItem[] = [
  {
    id: "33333333-3333-3333-3333-333333333331",
    addressLine1: "1428 Maple Ridge Dr",
    city: "Cedar Falls",
    state: "IA",
    homeownerName: "Dana & Chris Keller",
    status: "InProgress",
    stage: "Build",
    pendingApprovals: 1,
    photoCount: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "33333333-3333-3333-3333-333333333332",
    addressLine1: "88 Prairie View Ct",
    city: "Waterloo",
    state: "IA",
    homeownerName: "Morgan Ellis",
    status: "InProgress",
    stage: "Prepare",
    pendingApprovals: 1,
    photoCount: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    addressLine1: "409 Oak Street",
    city: "Waverly",
    state: "IA",
    homeownerName: "Pat Nguyen",
    status: "Complete",
    stage: "Complete",
    pendingApprovals: 0,
    photoCount: 1,
    updatedAt: new Date().toISOString(),
  },
];

const SAMPLE_APPROVALS: ApprovalItem[] = [
  {
    draftId: "55555555-5555-5555-5555-555555555551",
    jobId: SAMPLE_JOBS[0].id,
    addressLine1: SAMPLE_JOBS[0].addressLine1,
    homeownerName: SAMPLE_JOBS[0].homeownerName,
    channel: "Sms",
    subject: "Progress update",
    body: "Hi Dana & Chris — tear-off on the north slope is finished and underlayment is going down.",
    evidenceSummary: "CompanyCam cc-9001, cc-9002",
    createdAt: new Date().toISOString(),
  },
  {
    draftId: "55555555-5555-5555-5555-555555555552",
    jobId: SAMPLE_JOBS[1].id,
    addressLine1: SAMPLE_JOBS[1].addressLine1,
    homeownerName: SAMPLE_JOBS[1].homeownerName,
    channel: "Email",
    subject: "Materials on site — install starts tomorrow",
    body: "Morgan, your shingles and ridge vent are staged. Crew arrives tomorrow morning weather permitting.",
    evidenceSummary: "CompanyCam cc-9101",
    createdAt: new Date().toISOString(),
  },
];

function sampleJobDetail(id: string): JobDetail {
  const base = SAMPLE_JOBS.find((j) => j.id === id) ?? SAMPLE_JOBS[0];
  return {
    ...base,
    postalCode: "50613",
    homeownerEmail: "homeowner@example.com",
    homeownerPhone: "+13195550100",
    externalJobNimbusId: "jn-demo",
    photos: [
      {
        id: "photo-1",
        caption: "Field progress (sample)",
        imageUrl:
          "https://images.unsplash.com/photo-1632759145351-1d592919f540?w=1200&q=80",
        customerVisible: false,
        capturedAt: new Date().toISOString(),
      },
    ],
    drafts: SAMPLE_APPROVALS.filter((a) => a.jobId === base.id).map((a) => ({
      id: a.draftId,
      channel: a.channel,
      subject: a.subject,
      body: a.body,
      status: "PendingApproval",
      evidenceSummary: a.evidenceSummary,
      createdAt: a.createdAt,
      approvedAt: null,
    })),
    portalToken: "keller-maple-demo",
  };
}

const SAMPLE_PORTAL: PortalJob = {
  organizationName: "Rutters Roofing & Exteriors",
  addressLine1: "1428 Maple Ridge Dr",
  city: "Cedar Falls",
  state: "IA",
  homeownerName: "Dana & Chris Keller",
  status: "InProgress",
  stage: "Build",
  latestUpdate:
    "Tear-off on the north slope is finished and underlayment is going down. New verified photos appear here after your PM approves them.",
  photos: [
    {
      id: "portal-photo-1",
      caption: "Tear-off complete — north slope clear",
      imageUrl:
        "https://images.unsplash.com/photo-1632759145351-1d592919f540?w=1200&q=80",
      customerVisible: true,
      capturedAt: new Date().toISOString(),
    },
  ],
};

const SAMPLE_INTEGRATIONS: IntegrationStatus = {
  useMocks: true,
  jobNimbus: "mock",
  companyCam: "mock",
  messaging: "mock",
};

/** Stages shown in staff + portal Connect MVP. */
export const JOB_STAGES = ["Lead", "Prepare", "Build", "Complete"] as const;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const auth =
    typeof window === "undefined"
      ? { "X-Demo-Auth": "pm" }
      : clientAuthHeaders();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...auth,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function fetchJobs(): Promise<FetchResult<JobListItem[]>> {
  try {
    const data = await apiFetch<JobListItem[]>("/api/v1/jobs");
    return { data, source: "api" };
  } catch {
    return { data: SAMPLE_JOBS, source: "sample" };
  }
}

export async function fetchJob(id: string): Promise<FetchResult<JobDetail | null>> {
  try {
    const data = await apiFetch<JobDetail>(`/api/v1/jobs/${id}`);
    return { data, source: "api" };
  } catch {
    if (SAMPLE_JOBS.some((j) => j.id === id) || id.startsWith("3333")) {
      return { data: sampleJobDetail(id), source: "sample" };
    }
    return { data: null, source: "sample" };
  }
}

export async function fetchApprovals(): Promise<FetchResult<ApprovalItem[]>> {
  try {
    const data = await apiFetch<ApprovalItem[]>("/api/v1/approvals");
    return { data, source: "api" };
  } catch {
    return { data: SAMPLE_APPROVALS, source: "sample" };
  }
}

export async function approveDraft(
  draftId: string,
): Promise<FetchResult<MessageDraft | { ok: true }>> {
  try {
    const data = await apiFetch<MessageDraft>(`/api/v1/approvals/${draftId}/approve`, {
      method: "POST",
      body: "{}",
    });
    return { data, source: "api" };
  } catch {
    return { data: { ok: true }, source: "sample" };
  }
}

export async function rejectDraft(
  draftId: string,
  reason?: string,
): Promise<FetchResult<MessageDraft | { ok: true }>> {
  try {
    const data = await apiFetch<MessageDraft>(`/api/v1/approvals/${draftId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason: reason ?? null }),
    });
    return { data, source: "api" };
  } catch {
    return { data: { ok: true }, source: "sample" };
  }
}

export async function sendDraft(
  draftId: string,
): Promise<FetchResult<MessageDraft | { ok: true }>> {
  try {
    const data = await apiFetch<MessageDraft>(`/api/v1/approvals/${draftId}/send`, {
      method: "POST",
      body: "{}",
    });
    return { data, source: "api" };
  } catch (err) {
    throw err instanceof Error ? err : new Error("Send failed");
  }
}

export async function fetchPortal(token: string): Promise<FetchResult<PortalJob>> {
  try {
    const data = await apiFetch<PortalJob>(`/api/v1/portal/${token}`);
    return { data, source: "api" };
  } catch {
    return { data: { ...SAMPLE_PORTAL }, source: "sample" };
  }
}

export async function fetchIntegrationStatus(): Promise<FetchResult<IntegrationStatus>> {
  try {
    const data = await apiFetch<IntegrationStatus>("/api/v1/integrations/status");
    return { data, source: "api" };
  } catch {
    return { data: SAMPLE_INTEGRATIONS, source: "sample" };
  }
}

export async function runIntegrationSync(): Promise<FetchResult<SyncResult>> {
  try {
    const data = await apiFetch<SyncResult>("/api/v1/integrations/sync", {
      method: "POST",
      body: "{}",
    });
    return { data, source: "api" };
  } catch {
    return {
      data: {
        useMocks: true,
        jobsUpserted: 0,
        photosAdded: 0,
        draftsCreated: 0,
        portalTokensEnsured: 0,
        message: "Sync unavailable — API offline or endpoint missing.",
      },
      source: "sample",
    };
  }
}

export async function fetchJobAudit(jobId: string): Promise<FetchResult<AuditEvent[]>> {
  try {
    const data = await apiFetch<AuditEvent[]>(`/api/v1/jobs/${jobId}/audit`);
    return { data, source: "api" };
  } catch {
    return { data: [], source: "sample" };
  }
}

export async function setPhotoVisibility(
  jobId: string,
  photoId: string,
  customerVisible: boolean,
): Promise<FetchResult<Photo | { ok: true }>> {
  try {
    const data = await apiFetch<Photo>(
      `/api/v1/jobs/${jobId}/photos/${photoId}/visibility`,
      {
        method: "PATCH",
        body: JSON.stringify({ customerVisible }),
      },
    );
    return { data, source: "api" };
  } catch {
    return { data: { ok: true }, source: "sample" };
  }
}

export type StaffMe = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  organizationId: string;
  organizationName: string;
};

export async function loginStaff(
  email: string,
  password: string,
): Promise<{ token: string; displayName: string; role: string; organizationId?: string }> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid email or password.");
  }
  return res.json() as Promise<{
    token: string;
    displayName: string;
    role: string;
    organizationId?: string;
  }>;
}

export async function fetchStaffMe(): Promise<FetchResult<StaffMe | null>> {
  try {
    const data = await apiFetch<StaffMe>("/api/v1/auth/me");
    return { data, source: "api" };
  } catch {
    return {
      data: {
        id: "22222222-2222-2222-2222-222222222222",
        email: "pm@rutters.demo",
        displayName: "Alex Rivera",
        role: "Pm",
        organizationId: "11111111-1111-1111-1111-111111111111",
        organizationName: "Rutters Roofing & Exteriors",
      },
      source: "sample",
    };
  }
}
