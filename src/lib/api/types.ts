/** Types aligned to Rutr.Api Models/Dtos (CrmDtos + JobDtos). */

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  role: string;
  preferredChannel: string;
  updatedAt: string;
};

export type ContactWrite = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string | null;
  preferredChannel?: string | null;
};

export type Property = {
  id: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  propertyType: string;
  yearBuilt: number | null;
  notes: string | null;
  jobCount: number;
  updatedAt: string;
};

export type PropertyWrite = {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  propertyType?: string | null;
  yearBuilt?: number | null;
  notes?: string | null;
};

export type JobListItem = {
  id: string;
  title?: string | null;
  jobType?: string | null;
  addressLine1: string;
  city: string;
  state: string;
  homeownerName: string;
  status: string;
  stage: string;
  propertyId?: string | null;
  primaryContactId?: string | null;
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
  title?: string | null;
  jobType?: string | null;
  propertyId?: string | null;
  primaryContactId?: string | null;
};

export type JobWrite = {
  title?: string | null;
  jobType?: string | null;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  homeownerName: string;
  homeownerEmail: string;
  homeownerPhone: string;
  status?: string | null;
  stage?: string | null;
  externalJobNimbusId?: string | null;
  propertyId?: string | null;
  primaryContactId?: string | null;
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
  /** PendingApproval | Approved (queue); Sent/Rejected leave the queue. */
  status: string;
  createdAt: string;
};

export type PortalMilestone = {
  name: string;
  status: string;
  completedAt: string | null;
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
  milestones?: PortalMilestone[] | null;
};

export type Note = {
  id: string;
  jobId: string | null;
  contactId: string | null;
  body: string;
  createdByStaffId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NoteWrite = {
  jobId?: string | null;
  contactId?: string | null;
  body: string;
};

export type TaskItem = {
  id: string;
  jobId: string | null;
  contactId?: string | null;
  title: string;
  description: string;
  status: string;
  dueAt: string | null;
  assignedStaffId: string | null;
  updatedAt: string;
};

export type TaskWrite = {
  jobId?: string | null;
  contactId?: string | null;
  title: string;
  description?: string | null;
  status?: string | null;
  dueAt?: string | null;
  assignedStaffId?: string | null;
};

export type Milestone = {
  id: string;
  jobId: string;
  name: string;
  status: string;
  sortOrder: number;
  dueAt: string | null;
  completedAt: string | null;
  updatedAt: string;
};

export type MilestoneWrite = {
  jobId: string;
  name: string;
  status?: string | null;
  sortOrder?: number | null;
  dueAt?: string | null;
  completedAt?: string | null;
};

export type Evidence = {
  id: string;
  jobId: string;
  externalCompanyCamId: string;
  caption: string;
  imageUrl: string;
  customerVisible: boolean;
  capturedAt: string;
  softDeleted?: boolean;
};

export type EvidenceWrite = {
  jobId: string;
  caption: string;
  imageUrl: string;
  externalCompanyCamId?: string | null;
  customerVisible?: boolean | null;
  capturedAt?: string | null;
};

export type DraftWrite = {
  jobId: string;
  channel: string;
  subject: string;
  body: string;
  evidenceSummary?: string | null;
  status?: string | null;
};

export type Consent = {
  id: string;
  jobId: string | null;
  contactId?: string | null;
  smsOptIn: boolean;
  emailOptIn: boolean;
  smsStopped: boolean;
  source?: string | null;
  disclosureText?: string | null;
  updatedAt: string;
};

export type ConsentWrite = {
  jobId?: string | null;
  contactId?: string | null;
  smsOptIn: boolean;
  emailOptIn: boolean;
  smsStopped: boolean;
  source?: string | null;
  disclosureText?: string | null;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  brandPrimaryColor: string | null;
  quietHoursStartLocal: number;
  quietHoursEndLocal: number;
  timeZoneId: string;
};

export type OrganizationWrite = {
  name?: string | null;
  brandPrimaryColor?: string | null;
  quietHoursStartLocal?: number | null;
  quietHoursEndLocal?: number | null;
  timeZoneId?: string | null;
};

export type StaffMember = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  organizationId: string;
};

export type IntegrationConnection = {
  id: string;
  provider: string;
  displayName: string;
  isConnected: boolean;
  connectedAt: string | null;
  updatedAt: string;
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

export type StaffMe = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  organizationId: string;
  organizationName: string;
};

export type StaffRole = "Admin" | "Pm" | "Sales";

export type SignupRequest = {
  email: string;
  password: string;
  displayName: string;
  organizationName: string;
  brandPrimaryColor?: string | null;
  quietHoursStartLocal?: number | null;
  quietHoursEndLocal?: number | null;
  timeZoneId?: string | null;
};

export type SignupResponse = {
  token: string;
  staffUserId: string;
  displayName: string;
  role: string;
  organizationId: string;
  organization: Organization;
};

export type AddStaffMemberRequest = {
  email: string;
  displayName: string;
  role: StaffRole | string;
  temporaryPassword: string;
};

export type InviteStaffRequest = {
  email: string;
  displayName?: string | null;
  role: StaffRole | string;
};

export type Invite = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  inviteToken: string;
  expiresAt: string;
  createdAt: string;
};

export type AcceptInviteRequest = {
  inviteToken: string;
  password: string;
  displayName?: string | null;
};

export type OnboardingSeedRequest = {
  mode: "empty" | "sample" | string;
};

export type OnboardingSeedResult = {
  mode: string;
  contactsCreated: number;
  propertiesCreated: number;
  jobsCreated: number;
  message: string;
};

export type OnboardingImportRequest = {
  source: "jobnimbus" | "csv" | string;
  csvContent?: string | null;
  /** When API supports it (default false). Preview counts without writes. */
  dryRun?: boolean;
};

export type OnboardingImportResult = {
  source: string;
  contactsCreated: number;
  propertiesCreated: number;
  jobsCreated: number;
  skipped: number;
  warnings: string[];
  message: string;
  /** Present once Api ships dry-run; may be omitted on older builds. */
  dryRun?: boolean;
};

export const JOB_STAGES = ["Lead", "Prepare", "Build", "Complete"] as const;
export const STAFF_ROLES = ["Admin", "Pm", "Sales"] as const;
