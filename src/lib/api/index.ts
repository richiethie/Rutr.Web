/**
 * Staff/portal API client — API only, no sample/mock fallbacks.
 * Paths match Rutr.Api controllers + CrmDtos REST conventions.
 */
import { apiFetch, API_URL } from "@/lib/api/http";
import type {
  ApprovalItem,
  AuditEvent,
  Consent,
  ConsentWrite,
  Contact,
  ContactWrite,
  DraftWrite,
  Evidence,
  EvidenceWrite,
  IntegrationConnection,
  IntegrationStatus,
  JobDetail,
  JobListItem,
  JobWrite,
  MessageDraft,
  Milestone,
  MilestoneWrite,
  Note,
  NoteWrite,
  Organization,
  OrganizationWrite,
  Photo,
  PortalJob,
  Property,
  PropertyWrite,
  StaffMe,
  StaffMember,
  SyncResult,
  TaskItem,
  TaskWrite,
} from "@/lib/api/types";

export { API_URL } from "@/lib/api/http";
export { ApiError, isNotFound } from "@/lib/api/errors";
export type * from "@/lib/api/types";
export { JOB_STAGES } from "@/lib/api/types";

// ── Auth ──────────────────────────────────────────────────────────────────

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

export async function fetchStaffMe(): Promise<StaffMe> {
  return apiFetch<StaffMe>("/api/v1/auth/me");
}

// ── Jobs ──────────────────────────────────────────────────────────────────

export async function fetchJobs(): Promise<JobListItem[]> {
  return apiFetch<JobListItem[]>("/api/v1/jobs");
}

export async function fetchJob(id: string): Promise<JobDetail> {
  return apiFetch<JobDetail>(`/api/v1/jobs/${id}`);
}

export async function createJob(body: JobWrite): Promise<JobDetail> {
  return apiFetch<JobDetail>("/api/v1/jobs", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateJob(id: string, body: JobWrite): Promise<JobDetail> {
  return apiFetch<JobDetail>(`/api/v1/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function updateJobStatus(
  id: string,
  status: string,
  stage?: string | null,
): Promise<JobDetail> {
  return apiFetch<JobDetail>(`/api/v1/jobs/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, stage: stage ?? null }),
  });
}

export async function deleteJob(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/jobs/${id}`, { method: "DELETE" });
}

export async function fetchJobAudit(jobId: string): Promise<AuditEvent[]> {
  return apiFetch<AuditEvent[]>(`/api/v1/jobs/${jobId}/audit`);
}

// ── Contacts ──────────────────────────────────────────────────────────────

export async function fetchContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>("/api/v1/contacts");
}

export async function fetchContact(id: string): Promise<Contact> {
  return apiFetch<Contact>(`/api/v1/contacts/${id}`);
}

export async function createContact(body: ContactWrite): Promise<Contact> {
  return apiFetch<Contact>("/api/v1/contacts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateContact(id: string, body: ContactWrite): Promise<Contact> {
  return apiFetch<Contact>(`/api/v1/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteContact(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/contacts/${id}`, { method: "DELETE" });
}

// ── Properties ────────────────────────────────────────────────────────────

export async function fetchProperties(): Promise<Property[]> {
  return apiFetch<Property[]>("/api/v1/properties");
}

export async function fetchProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/v1/properties/${id}`);
}

export async function createProperty(body: PropertyWrite): Promise<Property> {
  return apiFetch<Property>("/api/v1/properties", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateProperty(id: string, body: PropertyWrite): Promise<Property> {
  return apiFetch<Property>(`/api/v1/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteProperty(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/properties/${id}`, { method: "DELETE" });
}

// ── Notes ─────────────────────────────────────────────────────────────────

export async function fetchNotes(params?: {
  jobId?: string;
  contactId?: string;
}): Promise<Note[]> {
  const q = new URLSearchParams();
  if (params?.jobId) q.set("jobId", params.jobId);
  if (params?.contactId) q.set("contactId", params.contactId);
  const qs = q.toString();
  return apiFetch<Note[]>(`/api/v1/notes${qs ? `?${qs}` : ""}`);
}

export async function createNote(body: NoteWrite): Promise<Note> {
  return apiFetch<Note>("/api/v1/notes", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateNote(id: string, body: NoteWrite): Promise<Note> {
  return apiFetch<Note>(`/api/v1/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteNote(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/notes/${id}`, { method: "DELETE" });
}

// ── Tasks ─────────────────────────────────────────────────────────────────

export async function fetchTasks(params?: { jobId?: string }): Promise<TaskItem[]> {
  const q = new URLSearchParams();
  if (params?.jobId) q.set("jobId", params.jobId);
  const qs = q.toString();
  return apiFetch<TaskItem[]>(`/api/v1/tasks${qs ? `?${qs}` : ""}`);
}

export async function createTask(body: TaskWrite): Promise<TaskItem> {
  return apiFetch<TaskItem>("/api/v1/tasks", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateTask(id: string, body: TaskWrite): Promise<TaskItem> {
  return apiFetch<TaskItem>(`/api/v1/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/tasks/${id}`, { method: "DELETE" });
}

// ── Milestones ────────────────────────────────────────────────────────────

export async function fetchMilestones(params?: { jobId?: string }): Promise<Milestone[]> {
  const q = new URLSearchParams();
  if (params?.jobId) q.set("jobId", params.jobId);
  const qs = q.toString();
  return apiFetch<Milestone[]>(`/api/v1/milestones${qs ? `?${qs}` : ""}`);
}

export async function createMilestone(body: MilestoneWrite): Promise<Milestone> {
  return apiFetch<Milestone>("/api/v1/milestones", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateMilestone(id: string, body: MilestoneWrite): Promise<Milestone> {
  return apiFetch<Milestone>(`/api/v1/milestones/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteMilestone(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/milestones/${id}`, { method: "DELETE" });
}

// ── Evidence ──────────────────────────────────────────────────────────────

export async function fetchEvidence(params?: { jobId?: string }): Promise<Evidence[]> {
  const q = new URLSearchParams();
  if (params?.jobId) q.set("jobId", params.jobId);
  const qs = q.toString();
  return apiFetch<Evidence[]>(`/api/v1/evidence${qs ? `?${qs}` : ""}`);
}

export async function createEvidence(body: EvidenceWrite): Promise<Evidence> {
  return apiFetch<Evidence>("/api/v1/evidence", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateEvidenceVisibility(
  id: string,
  customerVisible: boolean,
): Promise<Evidence> {
  return apiFetch<Evidence>(`/api/v1/evidence/${id}/visibility`, {
    method: "PATCH",
    body: JSON.stringify({ customerVisible }),
  });
}

/** Soft-delete evidence photo. */
export async function deleteEvidence(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/evidence/${id}`, { method: "DELETE" });
}

export async function setPhotoVisibility(
  jobId: string,
  photoId: string,
  customerVisible: boolean,
): Promise<Photo> {
  return apiFetch<Photo>(`/api/v1/jobs/${jobId}/photos/${photoId}/visibility`, {
    method: "PATCH",
    body: JSON.stringify({ customerVisible }),
  });
}

// ── Drafts / Approvals ────────────────────────────────────────────────────

export async function fetchApprovals(): Promise<ApprovalItem[]> {
  return apiFetch<ApprovalItem[]>("/api/v1/approvals");
}

export async function createDraft(body: DraftWrite): Promise<MessageDraft> {
  return apiFetch<MessageDraft>("/api/v1/drafts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateDraft(id: string, body: DraftWrite): Promise<MessageDraft> {
  return apiFetch<MessageDraft>(`/api/v1/drafts/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteDraft(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/drafts/${id}`, { method: "DELETE" });
}

export async function approveDraft(draftId: string): Promise<MessageDraft> {
  return apiFetch<MessageDraft>(`/api/v1/approvals/${draftId}/approve`, {
    method: "POST",
    body: "{}",
  });
}

export async function rejectDraft(draftId: string, reason?: string): Promise<MessageDraft> {
  return apiFetch<MessageDraft>(`/api/v1/approvals/${draftId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason: reason ?? null }),
  });
}

export async function sendDraft(draftId: string): Promise<MessageDraft> {
  return apiFetch<MessageDraft>(`/api/v1/approvals/${draftId}/send`, {
    method: "POST",
    body: "{}",
  });
}

// ── Consents ──────────────────────────────────────────────────────────────

export async function fetchConsents(params?: { jobId?: string }): Promise<Consent[]> {
  const q = new URLSearchParams();
  if (params?.jobId) q.set("jobId", params.jobId);
  const qs = q.toString();
  return apiFetch<Consent[]>(`/api/v1/consents${qs ? `?${qs}` : ""}`);
}

export async function createConsent(body: ConsentWrite): Promise<Consent> {
  return apiFetch<Consent>("/api/v1/consents", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateConsent(id: string, body: ConsentWrite): Promise<Consent> {
  return apiFetch<Consent>(`/api/v1/consents/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteConsent(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/consents/${id}`, { method: "DELETE" });
}

// ── Integrations ──────────────────────────────────────────────────────────

export async function fetchIntegrationStatus(): Promise<IntegrationStatus> {
  return apiFetch<IntegrationStatus>("/api/v1/integrations/status");
}

export async function runIntegrationSync(): Promise<SyncResult> {
  return apiFetch<SyncResult>("/api/v1/integrations/sync", {
    method: "POST",
    body: "{}",
  });
}

export async function fetchIntegrationConnections(): Promise<IntegrationConnection[]> {
  return apiFetch<IntegrationConnection[]>("/api/v1/integrations/connections");
}

export async function connectIntegration(provider: string): Promise<IntegrationConnection> {
  return apiFetch<IntegrationConnection>(
    `/api/v1/integrations/connections/${provider}/connect`,
    { method: "POST", body: "{}" },
  );
}

export async function disconnectIntegration(provider: string): Promise<IntegrationConnection> {
  return apiFetch<IntegrationConnection>(
    `/api/v1/integrations/connections/${provider}/disconnect`,
    { method: "POST", body: "{}" },
  );
}

// ── Organizations / members ───────────────────────────────────────────────

export async function fetchOrganization(): Promise<Organization> {
  return apiFetch<Organization>("/api/v1/organizations/current");
}

export async function updateOrganization(body: OrganizationWrite): Promise<Organization> {
  return apiFetch<Organization>("/api/v1/organizations/current", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchOrgMembers(): Promise<StaffMember[]> {
  return apiFetch<StaffMember[]>("/api/v1/organizations/current/members");
}

export async function updateMemberRole(staffId: string, role: string): Promise<StaffMember> {
  return apiFetch<StaffMember>(`/api/v1/organizations/current/members/${staffId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

// ── Portal (read-only) ────────────────────────────────────────────────────

export async function fetchPortal(token: string): Promise<PortalJob> {
  return apiFetch<PortalJob>(`/api/v1/portal/${token}`);
}
