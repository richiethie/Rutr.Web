import { JOB_STAGES } from "@/lib/api";

export function PortalStageRail({ stage }: { stage: string }) {
  const current = JOB_STAGES.findIndex((s) => s.toLowerCase() === stage.toLowerCase());
  const activeIndex = current >= 0 ? current : 1;

  return (
    <ol className="grid grid-cols-4 gap-2 sm:gap-3">
      {JOB_STAGES.map((label, index) => {
        const reached = index <= activeIndex;
        const isCurrent = index === activeIndex;
        return (
          <li key={label} className="min-w-0">
            <div
              className={
                reached
                  ? "h-1 rounded-full bg-[var(--console-accent)]"
                  : "h-1 rounded-full bg-[var(--console-border)]"
              }
            />
            <p
              className={
                isCurrent
                  ? "mt-2 truncate text-[11px] font-semibold text-[var(--console-accent)] sm:text-[12px]"
                  : reached
                    ? "mt-2 truncate text-[11px] font-medium text-[var(--console-text)] sm:text-[12px]"
                    : "mt-2 truncate text-[11px] text-[var(--console-muted)] sm:text-[12px]"
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
