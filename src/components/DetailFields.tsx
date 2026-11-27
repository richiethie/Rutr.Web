import type { ReactNode } from "react";

export type DetailField = {
  label: string;
  value: ReactNode;
};

/** Read-only field list for staff detail “view” mode. */
export function DetailFields({
  fields,
  title,
  actions,
  bare,
}: {
  fields: DetailField[];
  title?: string;
  actions?: ReactNode;
  /** Skip outer panel when already inside a console-panel. */
  bare?: boolean;
}) {
  const body = (
    <>
      {(title || actions) && (
        <div
          className={
            bare
              ? "mb-3 flex flex-wrap items-center justify-between gap-2"
              : "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-5 py-3"
          }
        >
          {title ? (
            <h2 className="text-[14px] font-semibold text-foreground">{title}</h2>
          ) : (
            <span />
          )}
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <dl className={bare ? "divide-y divide-border rounded-md border border-border" : "divide-y divide-border"}>
        {fields.map((f) => (
          <div
            key={f.label}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="text-left text-[12px] font-medium text-muted-foreground">{f.label}</dt>
            <dd className="text-left text-[13px] text-foreground">
              {f.value === null || f.value === undefined || f.value === "" ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                f.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );

  if (bare) return <div className="space-y-3">{body}</div>;
  return <section className="console-panel overflow-hidden">{body}</section>;
}
