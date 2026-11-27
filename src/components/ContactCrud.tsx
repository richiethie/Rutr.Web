"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import {
  createContact,
  deleteContact,
  updateContact,
  type Contact,
} from "@/lib/api";

const contactFields = (c?: Contact) => [
  { name: "firstName", label: "First name", required: true, defaultValue: c?.firstName },
  { name: "lastName", label: "Last name", required: true, defaultValue: c?.lastName },
  { name: "email", label: "Email", type: "email" as const, required: true, defaultValue: c?.email },
  { name: "phone", label: "Phone", type: "tel" as const, required: true, defaultValue: c?.phone },
  { name: "role", label: "Role", defaultValue: c?.role ?? "Homeowner" },
  {
    name: "preferredChannel",
    label: "Preferred channel",
    type: "select" as const,
    defaultValue: c?.preferredChannel ?? "Sms",
    options: [
      { value: "Sms", label: "SMS" },
      { value: "Email", label: "Email" },
      { value: "Phone", label: "Phone" },
    ],
  },
];

function toWrite(values: Record<string, string | boolean | number | null>) {
  return {
    firstName: String(values.firstName ?? ""),
    lastName: String(values.lastName ?? ""),
    email: String(values.email ?? ""),
    phone: String(values.phone ?? ""),
    role: values.role ? String(values.role) : null,
    preferredChannel: values.preferredChannel ? String(values.preferredChannel) : null,
  };
}

export function ContactCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="New contact" open={open} onOpenChange={setOpen} triggerLabel="New contact">
      <EntityForm
        fields={contactFields()}
        submitLabel="Create contact"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          await createContact(toWrite(values));
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function ContactEdit({ contact }: { contact: Contact }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CrudPanel
        title="Edit contact"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Edit"
        triggerClassName="console-btn console-btn-secondary"
      >
        <EntityForm
          fields={contactFields(contact)}
          submitLabel="Save contact"
          onCancel={() => setOpen(false)}
          onSubmit={async (values) => {
            await updateContact(contact.id, toWrite(values));
            setOpen(false);
            router.refresh();
          }}
        />
      </CrudPanel>
      <DeleteButton
        confirm="Delete this contact?"
        onDelete={async () => {
          await deleteContact(contact.id);
          router.push("/contacts");
        }}
      />
    </div>
  );
}
