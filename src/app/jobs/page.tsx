import Link from "next/link";
import { JobsStageFilter } from "@/components/JobsStageFilter";
import { StaffChrome } from "@/components/StaffChrome";
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
      <div className="fade-up mb-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--rutr-chalk)]">Active jobs</h1>
          <p className="mt-2 max-w-xl text-[var(--rutr-mist)]">
            JobNimbus work for Rutters with pending digest counts from CompanyCam evidence.
          </p>
        </div>
        <div className="text-xs uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
          <p>
            {filtered.length} shown · {jobs.length} total
          </p>
          {waiting > 0 ? (
            <p className="mt-1 text-[var(--rutr-copper-hot)]">{waiting} digests waiting</p>
          ) : null}
        </div>
      </div>

      <div className="fade-up-delay mb-8">
        <JobsStageFilter active={stage} />
      </div>

      <ul className="fade-up-delay-2 divide-y divide-[var(--rutr-line)] border-y border-[var(--rutr-line)]">
        {filtered.map((job) => (
          <li key={job.id}>
            <Link
              href={`/jobs/${job.id}`}
              className="group flex flex-col gap-3 py-5 transition hover:bg-[rgba(243,235,224,0.03)] sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div>
                <p className="text-lg text-[var(--rutr-chalk)] group-hover:text-[var(--rutr-copper-hot)]">
                  {job.addressLine1}
                </p>
                <p className="text-sm text-[var(--rutr-mist)]">
                  {job.city}, {job.state} · {job.homeownerName}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
                <span className="rounded-sm border border-[var(--rutr-line)] px-2 py-1">
                  {job.stage}
                </span>
                <span>{job.status}</span>
                <span className="text-[var(--rutr-sage)]">{job.photoCount} photos</span>
                {job.pendingApprovals > 0 ? (
                  <span className="inline-flex items-center gap-2 text-[var(--rutr-copper-hot)]">
                    <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-[var(--rutr-copper)]" />
                    {job.pendingApprovals} waiting
                  </span>
                ) : (
                  <span className="text-[var(--rutr-sage)]">Clear</span>
                )}
              </div>
            </Link>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="py-10 text-[var(--rutr-mist)]">No jobs in this stage.</li>
        ) : null}
      </ul>
    </StaffChrome>
  );
}
