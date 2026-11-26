"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import {
  createMilestone,
  deleteMilestone,
  updateMilestone,
  type Milestone,
} from "@/lib/api";

function fields(m?: Milestone) {
  return [
    { name: "jobId", label: "Job id", required: true, defaultValue: m?.jobId },
    { name: "name", label: "Name", required: true, defaultValue: m?.name },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      defaultValue: m?.status ?? "Pending",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "InProgress", label: "In progress" },
        { value: "Complete", label: "Complete" },
      ],
    },
    {
      name: "sortOrder",
      label: "Sort order",
      type: "number" as const,
      defaultValue: m?.sortOrder ?? 0,
    },
    {
      name: "dueAt",
      label: "Due at",
      type: "datetime-local" as const,
      defaultValue: m?.dueAt ? m.dueAt.slice(0, 16) : null,
    },
  ];
}

function toWrite(values: Record<string, string | boolean | number | null>) {
  const due = values.dueAt ? String(values.dueAt) : null;
  return {
    jobId: String(values.jobId ?? ""),
    name: String(values.name ?? ""),
    status: values.status ? String(values.status) : null,
    sortOrder: typeof values.sortOrder === "number" ? values.sortOrder : null,
    dueAt: due ? new Date(due).toISOString() : null,
    completedAt: null as string | null,
  };
}

export function MilestoneCreate({ defaultJobId }: { defaultJobId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel
      title="New milestone"
      open={open}
      onOpenChange={setOpen}
      triggerLabel="New milestone"
    >
      <EntityForm
        fields={fields(defaultJobId ? ({ jobId: defaultJobId } as Milestone) : undefined)}
        submitLabel="Create milestone"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          await createMilestone(toWrite(values));
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function MilestoneRowActions({ milestone }: { milestone: Milestone }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2">
      <CrudPanel
        title="Edit milestone"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Edit"
        triggerClassName="console-btn console-btn-ghost text-[12px]"
      >
        <EntityForm
          fields={fields(milestone)}
          submitLabel="Save"
          onCancel={() => setOpen(false)}
          onSubmit={async (values) => {
            await updateMilestone(milestone.id, toWrite(values));
            setOpen(false);
            router.refresh();
          }}
        />
      </CrudPanel>
      <DeleteButton
        label="Delete"
        confirm="Delete this milestone?"
        onDelete={async () => {
          await deleteMilestone(milestone.id);
          router.refresh();
        }}
      />
    </div>
  );
}
