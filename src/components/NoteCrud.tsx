"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import { createNote, deleteNote, updateNote, type Note } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";

function fields(n?: Note) {
  return [
    { name: "jobId", label: "Job id", defaultValue: n?.jobId },
    { name: "contactId", label: "Contact id", defaultValue: n?.contactId },
    {
      name: "body",
      label: "Note",
      type: "textarea" as const,
      required: true,
      defaultValue: n?.body,
    },
  ];
}

function toWrite(values: Record<string, string | boolean | number | null>) {
  return {
    jobId: values.jobId ? String(values.jobId) : null,
    contactId: values.contactId ? String(values.contactId) : null,
    body: String(values.body ?? ""),
  };
}

export function NoteCreate({ defaultJobId }: { defaultJobId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="New note" open={open} onOpenChange={setOpen} triggerLabel="New note">
      <EntityForm
        fields={fields(defaultJobId ? ({ jobId: defaultJobId } as Note) : undefined)}
        submitLabel="Create note"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          try {
            await createNote(toWrite(values));
            toastSuccess("Note created");
            setOpen(false);
            router.refresh();
          } catch (err) {
            toastError("Failed to create note", err);
            throw err;
          }
        }}
      />
    </CrudPanel>
  );
}

export function NoteRowActions({ note }: { note: Note }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2">
      <CrudPanel
        title="Edit note"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Edit"
        triggerClassName="console-btn console-btn-ghost text-[12px]"
      >
        <EntityForm
          fields={fields(note)}
          submitLabel="Save"
          onCancel={() => setOpen(false)}
          onSubmit={async (values) => {
            try {
              await updateNote(note.id, toWrite(values));
              toastSuccess("Note updated");
              setOpen(false);
              router.refresh();
            } catch (err) {
              toastError("Failed to save note", err);
              throw err;
            }
          }}
        />
      </CrudPanel>
      <DeleteButton
        label="Delete"
        confirm="Delete this note?"
        successToast="Note deleted"
        failToast="Failed to delete note"
        onDelete={async () => {
          await deleteNote(note.id);
          router.refresh();
        }}
      />
    </div>
  );
}
