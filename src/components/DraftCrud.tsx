"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import {
  createDraft,
  deleteDraft,
  updateDraft,
  type MessageDraft,
} from "@/lib/api";

function fields(jobId: string, d?: MessageDraft) {
  return [
    {
      name: "channel",
      label: "Channel",
      type: "select" as const,
      defaultValue: d?.channel ?? "Sms",
      options: [
        { value: "Sms", label: "SMS" },
        { value: "Email", label: "Email" },
      ],
    },
    { name: "subject", label: "Subject", required: true, defaultValue: d?.subject },
    {
      name: "body",
      label: "Body",
      type: "textarea" as const,
      required: true,
      defaultValue: d?.body,
    },
    {
      name: "evidenceSummary",
      label: "Evidence summary",
      defaultValue: d?.evidenceSummary,
    },
  ];
}

function toWrite(
  jobId: string,
  values: Record<string, string | boolean | number | null>,
) {
  return {
    jobId,
    channel: String(values.channel ?? "Sms"),
    subject: String(values.subject ?? ""),
    body: String(values.body ?? ""),
    evidenceSummary: values.evidenceSummary ? String(values.evidenceSummary) : null,
    status: "PendingApproval" as string | null,
  };
}

export function DraftCreate({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="New draft" open={open} onOpenChange={setOpen} triggerLabel="New draft">
      <EntityForm
        fields={fields(jobId)}
        submitLabel="Create draft"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          await createDraft(toWrite(jobId, values));
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function DraftEdit({ jobId, draft }: { jobId: string; draft: MessageDraft }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  if (!editing) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          className="console-btn console-btn-ghost text-[12px]"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <DeleteButton
          label="Delete"
          confirm="Delete this draft?"
          onDelete={async () => {
            await deleteDraft(draft.id);
            router.refresh();
          }}
        />
      </div>
    );
  }
  return (
    <EntityForm
      fields={fields(jobId, draft)}
      submitLabel="Save draft"
      onCancel={() => setEditing(false)}
      onSubmit={async (values) => {
        await updateDraft(draft.id, toWrite(jobId, values));
        setEditing(false);
        router.refresh();
      }}
    />
  );
}
