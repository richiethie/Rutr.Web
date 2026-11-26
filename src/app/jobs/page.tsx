import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { JobCreate } from "@/components/JobCrud";
import { JobsStageFilter } from "@/components/JobsStageFilter";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { PageToolbar, StatCards } from "@/components/StatCards";
import { fetchJobs } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const { stage } = await searchParams;
  const result = await loadApi(fetchJobs);

  if (!result.ok) {
    return (
      <StaffChrome active="jobs">
        <PageHeader title="Jobs" description="Job-centric Connect records from the API." />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const jobs = result.data;
  const filtered = stage
    ? jobs.filter((j) => j.stage.toLowerCase() === stage.toLowerCase())
    : jobs;
  const waiting = jobs.reduce((sum, j) => sum + j.pendingApprovals, 0);
  const photos = jobs.reduce((sum, j) => sum + j.photoCount, 0);
  const activeStages = new Set(jobs.map((j) => j.stage)).size;

  return (
    <StaffChrome active="jobs" live>
      <PageHeader
        title="Jobs"
        description="Live Rutters work from JobNimbus — digests wait when CompanyCam evidence needs a PM eye."
        actions={<JobCreate />}
      />

      <StatCards
        items={[
          {
            label: "Jobs shown",
            value: filtered.length,
            hint: `${jobs.length} total in Connect`,
            tone: "brand",
          },
          {
            label: "Digests waiting",
            value: waiting,
            hint: waiting ? "Needs PM review" : "Queue clear",
            trend: waiting ? "Action" : "Clear",
            tone: waiting ? "warn" : "ok",
          },
          {
            label: "Evidence photos",
            value: photos,
            hint: "Across all jobs",
          },
          {
            label: "Active stages",
            value: activeStages,
            hint: "Distinct pipeline stages",
          },
        ]}
      />

      <PageToolbar>
        <JobsStageFilter active={stage} />
      </PageToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description={
            stage
              ? `No jobs in the ${stage} stage from the API.`
              : "Empty from the API — create a job, or finish onboarding import/seed."
          }
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <JobCreate />
              {!stage ? (
                <Link href="/onboarding/import" className="console-btn console-btn-secondary">
                  Import or seed
                </Link>
              ) : null}
            </div>
          }
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="console-table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Homeowner</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Photos</th>
                  <th>Approvals</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-medium tracking-tight text-foreground transition-colors hover:text-brand"
                      >
                        {job.addressLine1}
                      </Link>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        {job.city}, {job.state}
                        {job.title ? ` · ${job.title}` : ""}
                      </p>
                    </td>
                    <td>{job.homeownerName}</td>
                    <td>
                      <span className="console-badge">{job.stage}</span>
                    </td>
                    <td className="text-muted-foreground">{job.status}</td>
                    <td className="font-mono-data text-muted-foreground">{job.photoCount}</td>
                    <td>
                      {job.pendingApprovals > 0 ? (
                        <span className="console-badge console-badge-warn">
                          <span className="size-1.5 rounded-full bg-warn" />
                          {job.pendingApprovals} waiting
                        </span>
                      ) : (
                        <span className="console-badge console-badge-success">
                          <span className="size-1.5 rounded-full bg-ok" />
                          Clear
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </StaffChrome>
  );
}
