import { JOB_STAGES } from "@/lib/api";

export function PortalStageRail({ stage }: { stage: string }) {
  const current = JOB_STAGES.findIndex(
    (s) => s.toLowerCase() === stage.toLowerCase(),
  );
  const activeIndex = current >= 0 ? current : 1;

  return (
    <ol className="grid grid-cols-4 gap-2">
      {JOB_STAGES.map((label, index) => {
        const reached = index <= activeIndex;
        const isCurrent = index === activeIndex;
        return (
          <li key={label} className="min-w-0">
            <div
              className={
                reached
                  ? "h-1 rounded-full bg-[var(--rutr-copper)]"
                  : "h-1 rounded-full bg-[var(--rutr-line)]"
              }
            />
            <p
              className={
                isCurrent
                  ? "mt-2 truncate text-[10px] uppercase tracking-[0.14em] text-[var(--rutr-copper-hot)] sm:text-xs"
                  : reached
                    ? "mt-2 truncate text-[10px] uppercase tracking-[0.14em] text-[var(--rutr-mist)] sm:text-xs"
                    : "mt-2 truncate text-[10px] uppercase tracking-[0.14em] text-[var(--rutr-sage)] opacity-60 sm:text-xs"
              }
            >
              {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
