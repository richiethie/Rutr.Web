import Link from "next/link";
import { ApproveButton } from "@/components/ApproveButton";
import { StaffChrome } from "@/components/StaffChrome";
import { fetchApprovals, fetchJob } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const { data: items, source } = await fetchApprovals();

  const withPortal = await Promise.all(
    items.map(async (item) => {
      const job = await fetchJob(item.jobId);
      return {
        ...item,
        portalToken: job.data?.portalToken ?? null,
      };
    }),
  );

  return (
    <StaffChrome active="approvals" source={source}>
      <div className="fade-up mb-8">
        <h1 className="text-3xl font-semibold text-[var(--rutr-chalk)]">Approval queue</h1>
        <p className="mt-2 max-w-2xl text-[var(--rutr-mist)]">
          Digests wait here until a PM verifies the evidence. Approving marks related photos
          customer-visible and unlocks the homeowner portal update.
        </p>
      </div>

      {withPortal.length === 0 ? (
        <p className="fade-up-delay border-y border-[var(--rutr-line)] py-10 text-[var(--rutr-sage)]">
          Queue is clear. New CompanyCam activity will draft the next digest.
        </p>
      ) : (
        <ul className="fade-up-delay space-y-8">
          {withPortal.map((item) => (
            <li
              key={item.draftId}
              className="border-t border-[var(--rutr-line)] pt-6 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <Link
                    href={`/jobs/${item.jobId}`}
                    className="text-xl text-[var(--rutr-chalk)] hover:text-[var(--rutr-copper-hot)]"
                  >
                    {item.addressLine1}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--rutr-mist)]">
                    {item.homeownerName} · {item.channel}
                  </p>
                  <p className="mt-4 text-lg text-[var(--rutr-chalk)]">{item.subject}</p>
                  <p className="mt-2 text-[var(--rutr-mist)]">{item.body}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[var(--rutr-sage)]">
                    Evidence · {item.evidenceSummary}
                  </p>
                </div>
                <ApproveButton
                  draftId={item.draftId}
                  portalHref={item.portalToken ? `/p/${item.portalToken}` : null}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </StaffChrome>
  );
}
