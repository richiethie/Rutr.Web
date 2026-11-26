import { JOB_STAGES } from "@/lib/api";

export function PortalStageRail({ stage }: { stage: string }) {
  const current = JOB_STAGES.findIndex((s) => s.toLowerCase() === stage.toLowerCase());
  const activeIndex = current >= 0 ? current : 1;

  return (
    <ol className="grid grid-cols-4 gap-3">
      {JOB_STAGES.map((label, index) => {
        const reached = index <= activeIndex;
        const isCurrent = index === activeIndex;
        return (
          <li key={label} className="min-w-0">
            <div
              className={
                reached ? "h-0.5 rounded-full bg-foreground" : "h-0.5 rounded-full bg-border"
              }
            />
            <p
              className={
                isCurrent
                  ? "mt-2 truncate text-[12px] font-medium text-foreground"
                  : reached
                    ? "mt-2 truncate text-[12px] text-foreground"
                    : "mt-2 truncate text-[12px] text-muted-foreground"
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
