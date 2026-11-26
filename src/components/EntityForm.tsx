"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { ApiError } from "@/lib/api/errors";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "checkbox" | "select" | "datetime-local";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean | null;
};

const fieldClass =
  "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

export function EntityForm({
  fields,
  submitLabel = "Save",
  onSubmit,
  onCancel,
  danger,
}: {
  fields: FieldDef[];
  submitLabel?: string;
  onSubmit: (values: Record<string, string | boolean | number | null>) => Promise<void>;
  onCancel?: () => void;
  danger?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values: Record<string, string | boolean | number | null> = {};
    for (const field of fields) {
      if (field.type === "checkbox") {
        values[field.name] = form.get(field.name) === "on";
      } else if (field.type === "number") {
        const raw = String(form.get(field.name) ?? "").trim();
        values[field.name] = raw === "" ? null : Number(raw);
      } else {
        const raw = String(form.get(field.name) ?? "").trim();
        values[field.name] = raw === "" ? null : raw;
      }
    }
    setError(null);
    startTransition(async () => {
      try {
        await onSubmit(values);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Save failed.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="text-[12px] font-medium text-foreground">
            {field.label}
            {field.required ? " *" : ""}
          </span>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              defaultValue={
                field.defaultValue === null || field.defaultValue === undefined
                  ? ""
                  : String(field.defaultValue)
              }
              rows={4}
              className={fieldClass}
            />
          ) : field.type === "checkbox" ? (
            <span className="mt-2 flex items-center gap-2 text-[13px] text-foreground">
              <input
                type="checkbox"
                name={field.name}
                defaultChecked={Boolean(field.defaultValue)}
                className="h-4 w-4 rounded border-input accent-foreground"
              />
              {field.placeholder ?? field.label}
            </span>
          ) : field.type === "select" ? (
            <select
              name={field.name}
              required={field.required}
              defaultValue={
                field.defaultValue === null || field.defaultValue === undefined
                  ? ""
                  : String(field.defaultValue)
              }
              className={fieldClass}
            >
              {(field.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type ?? "text"}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              defaultValue={
                field.defaultValue === null || field.defaultValue === undefined
                  ? ""
                  : String(field.defaultValue)
              }
              className={fieldClass}
            />
          )}
        </label>
      ))}
      {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
        {onCancel ? (
          <button type="button" className="console-btn console-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className={
            danger
              ? "console-btn console-btn-secondary text-destructive"
              : "console-btn console-btn-primary"
          }
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function DeleteButton({
  label = "Delete",
  confirm = "Delete this record?",
  onDelete,
}: {
  label?: string;
  confirm?: string;
  onDelete: () => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        className="console-btn console-btn-secondary text-destructive"
        onClick={() => {
          if (!window.confirm(confirm)) return;
          setError(null);
          startTransition(async () => {
            try {
              await onDelete();
              router.refresh();
            } catch (err) {
              setError(
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Delete failed.",
              );
            }
          });
        }}
      >
        {pending ? "Deleting…" : label}
      </button>
      {error ? <p className="mt-1 text-[12px] text-destructive">{error}</p> : null}
    </div>
  );
}

/** Create/edit trigger → modal dialog (replaces inline CrudPanel expand). */
export function CrudPanel({
  title,
  open,
  onOpenChange,
  children,
  triggerLabel = "New",
  description,
  wide,
  triggerClassName,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  triggerLabel?: string;
  description?: string;
  wide?: boolean;
  triggerClassName?: string;
}) {
  return (
    <>
      <button
        type="button"
        className={triggerClassName ?? "console-btn console-btn-primary"}
        onClick={() => onOpenChange(true)}
      >
        {triggerLabel}
      </button>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        wide={wide}
      >
        {children}
      </Dialog>
    </>
  );
}
