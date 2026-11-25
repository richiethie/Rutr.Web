"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import {
  createEvidence,
  deleteEvidence,
  setPhotoVisibility,
  updateEvidenceVisibility,
  type Photo,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

export function EvidenceCreate({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="Add evidence" open={open} onOpenChange={setOpen} triggerLabel="Add photo">
      <EntityForm
        fields={[
          { name: "caption", label: "Caption", required: true },
          {
            name: "imageUrl",
            label: "Image URL",
            required: true,
            placeholder: "https://…",
          },
          {
            name: "externalCompanyCamId",
            label: "CompanyCam id",
            placeholder: "cc-…",
          },
          {
            name: "customerVisible",
            label: "Customer visible",
            type: "checkbox",
            defaultValue: false,
            placeholder: "Show on portal",
          },
        ]}
        submitLabel="Create evidence"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          await createEvidence({
            jobId,
            caption: String(values.caption ?? ""),
            imageUrl: String(values.imageUrl ?? ""),
            externalCompanyCamId: values.externalCompanyCamId
              ? String(values.externalCompanyCamId)
              : null,
            customerVisible: Boolean(values.customerVisible),
            capturedAt: new Date().toISOString(),
          });
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function EvidenceActions({
  jobId,
  photo,
}: {
  jobId: string;
  photo: Photo;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        className="console-btn console-btn-ghost text-[11px]"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              try {
                await setPhotoVisibility(jobId, photo.id, !photo.customerVisible);
              } catch {
                await updateEvidenceVisibility(photo.id, !photo.customerVisible);
              }
              router.refresh();
            } catch (err) {
              setError(
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Update failed",
              );
            }
          });
        }}
      >
        {photo.customerVisible ? "Hide from portal" : "Show on portal"}
      </button>
      <DeleteButton
        label="Soft-delete"
        confirm="Soft-delete this photo?"
        onDelete={async () => {
          await deleteEvidence(photo.id);
          router.refresh();
        }}
      />
      {error ? <p className="w-full text-[11px] text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
