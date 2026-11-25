import Link from "next/link";
import { JobsStageFilter } from "@/components/JobsStageFilter";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchJobs } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const { stage } = await searchParams;
  const { data: jobs, source } = await fetchJobs();
  const filtered = stage
    ? jobs.filter((j) => j.stage.toLowerCase() === stage.toLowerCase())
    : jobs;
  const waiting = jobs.reduce((sum, j) => sum + j.pendingApprovals, 0);

  return (
    <StaffChrome active="jobs" source={source}>
      <PageHeader
        title="Jobs"
        description="JobNimbus work for Rutters with pending digest counts from CompanyCam evidence."
        meta={
          <>
            <span className="console-badge">
              {filtered.length} shown · {jobs.length} total
            </span>
            {waiting > 0 ? (
              <span className="console-badge console-badge-accent">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--console-accent)]" />
                {waiting} digests waiting
              </span>
            ) : (
              <span className="console-badge console-badge-success">Queue clear</span>
            )}
          </>
        }
      />

      <div className="mb-3">
        <JobsStageFilter active={stage} />
      </div>

      <div className="console-panel overflow-hidden">
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
                    className="font-semibold text-[var(--console-text)] hover:text-[var(--console-accent)]"
                  >
                    {job.addressLine1}
                  </Link>
                  <p className="text-[12px] text-[var(--console-muted)]">
                    {job.city}, {job.state}
                  </p>
                </td>
                <td className="text-[13px]">{job.homeownerName}</td>
                <td>
                  <span className="console-badge">{job.stage}</span>
                </td>
                <td className="text-[13px] text-[var(--console-muted)]">{job.status}</td>
                <td className="font-mono-data text-[12px] text-[var(--console-muted)]">
                  {job.photoCount}
                </td>
                <td>
                  {job.pendingApprovals > 0 ? (
                    <span className="console-badge console-badge-accent">
                      {job.pendingApprovals} waiting
                    </span>
                  ) : (
                    <span className="console-badge console-badge-success">Clear</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-[var(--console-muted)]">
                  No jobs in this stage.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </StaffChrome>
  );
}
