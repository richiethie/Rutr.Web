import Link from "next/link";
import { StaffChrome } from "@/components/StaffChrome";
import { fetchJobs } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const { data: jobs, source } = await fetchJobs();

  return (
    <StaffChrome active="jobs" source={source}>
      <div className="fade-up mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--rutr-chalk)]">Active jobs</h1>
          <p className="mt-2 max-w-xl text-[var(--rutr-mist)]">
            Live Rutters work pulled from JobNimbus with pending digest counts from CompanyCam
            evidence.
          </p>
        </div>
        <p className="hidden text-xs uppercase tracking-[0.16em] text-[var(--rutr-sage)] sm:block">
          {jobs.length} jobs
        </p>
      </div>

      <ul className="fade-up-delay divide-y divide-[var(--rutr-line)] border-y border-[var(--rutr-line)]">
        {jobs.map((job) => (
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
      </ul>
    </StaffChrome>
  );
}
