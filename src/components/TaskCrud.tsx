"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import { createTask, deleteTask, updateTask, type TaskItem } from "@/lib/api";

function fields(t?: Partial<TaskItem>) {
  return [
    { name: "jobId", label: "Job id", defaultValue: t?.jobId },
    { name: "contactId", label: "Contact id", defaultValue: t?.contactId },
    { name: "title", label: "Title", required: true, defaultValue: t?.title },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      defaultValue: t?.description,
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      defaultValue: t?.status ?? "Open",
      options: [
        { value: "Open", label: "Open" },
        { value: "InProgress", label: "In progress" },
        { value: "Done", label: "Done" },
      ],
    },
    {
      name: "dueAt",
      label: "Due at",
      type: "datetime-local" as const,
      defaultValue: t?.dueAt ? t.dueAt.slice(0, 16) : null,
    },
  ];
}

function toWrite(values: Record<string, string | boolean | number | null>) {
  const due = values.dueAt ? String(values.dueAt) : null;
  return {
    jobId: values.jobId ? String(values.jobId) : null,
    contactId: values.contactId ? String(values.contactId) : null,
    title: String(values.title ?? ""),
    description: values.description ? String(values.description) : null,
    status: values.status ? String(values.status) : null,
    dueAt: due ? new Date(due).toISOString() : null,
    assignedStaffId: null as string | null,
  };
}

export function TaskCreate({ defaultJobId }: { defaultJobId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="New task" open={open} onOpenChange={setOpen} triggerLabel="New task">
      <EntityForm
        fields={fields(defaultJobId ? { jobId: defaultJobId } : undefined)}
        submitLabel="Create task"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          await createTask(toWrite(values));
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function TaskRowActions({ task }: { task: TaskItem }) {
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
          confirm="Delete this task?"
          onDelete={async () => {
            await deleteTask(task.id);
            router.refresh();
          }}
        />
      </div>
    );
  }
  return (
    <EntityForm
      fields={fields(task)}
      submitLabel="Save"
      onCancel={() => setEditing(false)}
      onSubmit={async (values) => {
        await updateTask(task.id, toWrite(values));
        setEditing(false);
        router.refresh();
      }}
    />
  );
}
