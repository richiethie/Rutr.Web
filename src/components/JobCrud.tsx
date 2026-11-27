"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import {
  createJob,
  deleteJob,
  updateJob,
  updateJobStatus,
  type JobDetail,
} from "@/lib/api";
import { JOB_STAGES } from "@/lib/api/types";
import { toastError, toastSuccess } from "@/lib/toast";

const jobFields = (j?: JobDetail) => [
  { name: "title", label: "Title", defaultValue: j?.title },
  {
    name: "jobType",
    label: "Job type",
    type: "select" as const,
    defaultValue: j?.jobType ?? "Retail",
    options: [
      { value: "Retail", label: "Retail" },
      { value: "Insurance", label: "Insurance" },
    ],
  },
  { name: "addressLine1", label: "Address", required: true, defaultValue: j?.addressLine1 },
  { name: "city", label: "City", required: true, defaultValue: j?.city },
  { name: "state", label: "State", required: true, defaultValue: j?.state ?? "IA" },
  { name: "postalCode", label: "Postal code", required: true, defaultValue: j?.postalCode },
  {
    name: "homeownerName",
    label: "Homeowner name",
    required: true,
    defaultValue: j?.homeownerName,
  },
  {
    name: "homeownerEmail",
    label: "Homeowner email",
    type: "email" as const,
    required: true,
    defaultValue: j?.homeownerEmail,
  },
  {
    name: "homeownerPhone",
    label: "Homeowner phone",
    type: "tel" as const,
    required: true,
    defaultValue: j?.homeownerPhone,
  },
  {
    name: "status",
    label: "Status",
    defaultValue: j?.status ?? "InProgress",
  },
  {
    name: "stage",
    label: "Stage",
    type: "select" as const,
    defaultValue: j?.stage ?? "Lead",
    options: JOB_STAGES.map((s) => ({ value: s, label: s })),
  },
  {
    name: "externalJobNimbusId",
    label: "JobNimbus id",
    defaultValue: j?.externalJobNimbusId,
  },
  {
    name: "propertyId",
    label: "Property id",
    defaultValue: j?.propertyId,
  },
  {
    name: "primaryContactId",
    label: "Primary contact id",
    defaultValue: j?.primaryContactId,
  },
];

function toWrite(values: Record<string, string | boolean | number | null>) {
  return {
    title: values.title ? String(values.title) : null,
    jobType: values.jobType ? String(values.jobType) : null,
    addressLine1: String(values.addressLine1 ?? ""),
    city: String(values.city ?? ""),
    state: String(values.state ?? ""),
    postalCode: String(values.postalCode ?? ""),
    homeownerName: String(values.homeownerName ?? ""),
    homeownerEmail: String(values.homeownerEmail ?? ""),
    homeownerPhone: String(values.homeownerPhone ?? ""),
    status: values.status ? String(values.status) : null,
    stage: values.stage ? String(values.stage) : null,
    externalJobNimbusId: values.externalJobNimbusId
      ? String(values.externalJobNimbusId)
      : null,
    propertyId: values.propertyId ? String(values.propertyId) : null,
    primaryContactId: values.primaryContactId ? String(values.primaryContactId) : null,
  };
}

export function JobCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel
      title="New job"
      open={open}
      onOpenChange={setOpen}
      triggerLabel="New job"
      wide
    >
      <EntityForm
        fields={jobFields()}
        submitLabel="Create job"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          try {
            const job = await createJob(toWrite(values));
            toastSuccess("Job created");
            setOpen(false);
            router.push(`/jobs/${job.id}`);
            router.refresh();
          } catch (err) {
            toastError("Failed to create job", err);
            throw err;
          }
        }}
      />
    </CrudPanel>
  );
}

export function JobEdit({ job }: { job: JobDetail }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CrudPanel
        title="Edit job"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Edit"
        triggerClassName="console-btn console-btn-secondary"
        wide
      >
        <EntityForm
          fields={jobFields(job)}
          submitLabel="Save job"
          onCancel={() => setOpen(false)}
          onSubmit={async (values) => {
            try {
              const body = toWrite(values);
              await updateJob(job.id, body);
              if (body.status || body.stage) {
                try {
                  await updateJobStatus(job.id, body.status ?? job.status, body.stage);
                } catch {
                  /* status endpoint may land with full CRUD */
                }
              }
              toastSuccess("Job updated");
              setOpen(false);
              router.refresh();
            } catch (err) {
              toastError("Failed to save job", err);
              throw err;
            }
          }}
        />
      </CrudPanel>
      <DeleteButton
        confirm="Delete this job?"
        successToast="Job deleted"
        failToast="Failed to delete job"
        onDelete={async () => {
          await deleteJob(job.id);
          router.push("/jobs");
        }}
      />
    </div>
  );
}
