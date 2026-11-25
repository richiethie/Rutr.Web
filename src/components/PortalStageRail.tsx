import { JOB_STAGES } from "@/lib/api";

export function PortalStageRail({ stage }: { stage: string }) {
  const current = JOB_STAGES.findIndex((s) => s.toLowerCase() === stage.toLowerCase());
  const activeIndex = current >= 0 ? current : 1;

  return (
    <ol className="grid grid-cols-4 gap-2.5 sm:gap-3">
      {JOB_STAGES.map((label, index) => {
        const reached = index <= activeIndex;
        const isCurrent = index === activeIndex;
        return (
          <li key={label} className="min-w-0">
            <div
              className={
                reached
                  ? "h-2 rounded-full bg-gradient-to-r from-[var(--signal)] to-[var(--flare)] shadow-[0_0_12px_var(--signal-glow)]"
                  : "h-2 rounded-full bg-[var(--line)]"
              }
            />
            <p
              className={
                isCurrent
                  ? "mt-2.5 truncate text-[11px] font-bold text-[var(--signal-deep)] sm:text-[12px]"
                  : reached
                    ? "mt-2.5 truncate text-[11px] font-semibold text-[var(--text)] sm:text-[12px]"
                    : "mt-2.5 truncate text-[11px] text-[var(--muted)] sm:text-[12px]"
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
