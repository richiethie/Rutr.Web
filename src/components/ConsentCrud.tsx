"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import {
  createConsent,
  deleteConsent,
  updateConsent,
  type Consent,
} from "@/lib/api";

function fields(c?: Partial<Consent>) {
  return [
    { name: "jobId", label: "Job id", defaultValue: c?.jobId },
    { name: "contactId", label: "Contact id", defaultValue: c?.contactId },
    {
      name: "smsOptIn",
      label: "SMS opt-in",
      type: "checkbox" as const,
      defaultValue: c?.smsOptIn ?? true,
      placeholder: "SMS allowed",
    },
    {
      name: "emailOptIn",
      label: "Email opt-in",
      type: "checkbox" as const,
      defaultValue: c?.emailOptIn ?? true,
      placeholder: "Email allowed",
    },
    {
      name: "smsStopped",
      label: "SMS stopped",
      type: "checkbox" as const,
      defaultValue: c?.smsStopped ?? false,
      placeholder: "STOP received",
    },
    {
      name: "source",
      label: "Source",
      defaultValue: c?.source ?? "manual",
    },
    {
      name: "disclosureText",
      label: "Disclosure",
      type: "textarea" as const,
      defaultValue: c?.disclosureText,
    },
  ];
}

function toWrite(values: Record<string, string | boolean | number | null>) {
  return {
    jobId: values.jobId ? String(values.jobId) : null,
    contactId: values.contactId ? String(values.contactId) : null,
    smsOptIn: Boolean(values.smsOptIn),
    emailOptIn: Boolean(values.emailOptIn),
    smsStopped: Boolean(values.smsStopped),
    source: values.source ? String(values.source) : null,
    disclosureText: values.disclosureText ? String(values.disclosureText) : null,
  };
}

export function ConsentCreate({ defaultJobId }: { defaultJobId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="New consent" open={open} onOpenChange={setOpen} triggerLabel="New consent">
      <EntityForm
        fields={fields(defaultJobId ? { jobId: defaultJobId } : undefined)}
        submitLabel="Create consent"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          await createConsent(toWrite(values));
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function ConsentRowActions({ consent }: { consent: Consent }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2">
      <CrudPanel
        title="Edit consent"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Edit"
        triggerClassName="console-btn console-btn-ghost text-[12px]"
      >
        <EntityForm
          fields={fields(consent)}
          submitLabel="Save"
          onCancel={() => setOpen(false)}
          onSubmit={async (values) => {
            await updateConsent(consent.id, toWrite(values));
            setOpen(false);
            router.refresh();
          }}
        />
      </CrudPanel>
      <DeleteButton
        label="Delete"
        confirm="Delete this consent record?"
        onDelete={async () => {
          await deleteConsent(consent.id);
          router.refresh();
        }}
      />
    </div>
  );
}
