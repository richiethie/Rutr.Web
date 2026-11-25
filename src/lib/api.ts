import { clientAuthHeaders } from "@/lib/auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5188";

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
    body: "Hi Dana & Chris — tear-off on the north slope is finished and underlayment is going down. We'll text again when shingles start.",
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
        customerVisible: true,
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

export async function fetchPortal(token: string): Promise<FetchResult<PortalJob>> {
  try {
    const data = await apiFetch<PortalJob>(`/api/v1/portal/${token}`);
    return { data, source: "api" };
  } catch {
    return { data: { ...SAMPLE_PORTAL }, source: "sample" };
  }
}

export async function loginStaff(
  email: string,
  password: string,
): Promise<{ token: string; displayName: string; role: string }> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid email or password.");
  }
  return res.json() as Promise<{ token: string; displayName: string; role: string }>;
}
