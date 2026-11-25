"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrudPanel, DeleteButton, EntityForm } from "@/components/EntityForm";
import {
  createProperty,
  deleteProperty,
  updateProperty,
  type Property,
} from "@/lib/api";

const propertyFields = (p?: Property) => [
  { name: "addressLine1", label: "Address", required: true, defaultValue: p?.addressLine1 },
  { name: "city", label: "City", required: true, defaultValue: p?.city },
  { name: "state", label: "State", required: true, defaultValue: p?.state ?? "IA" },
  { name: "postalCode", label: "Postal code", required: true, defaultValue: p?.postalCode },
  {
    name: "propertyType",
    label: "Type",
    defaultValue: p?.propertyType ?? "Residential",
  },
  {
    name: "yearBuilt",
    label: "Year built",
    type: "number" as const,
    defaultValue: p?.yearBuilt,
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea" as const,
    defaultValue: p?.notes,
  },
];

function toWrite(values: Record<string, string | boolean | number | null>) {
  return {
    addressLine1: String(values.addressLine1 ?? ""),
    city: String(values.city ?? ""),
    state: String(values.state ?? ""),
    postalCode: String(values.postalCode ?? ""),
    propertyType: values.propertyType ? String(values.propertyType) : null,
    yearBuilt: typeof values.yearBuilt === "number" ? values.yearBuilt : null,
    notes: values.notes ? String(values.notes) : null,
  };
}

export function PropertyCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="New property" open={open} onOpenChange={setOpen} triggerLabel="New property">
      <EntityForm
        fields={propertyFields()}
        submitLabel="Create property"
        onCancel={() => setOpen(false)}
        onSubmit={async (values) => {
          await createProperty(toWrite(values));
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function PropertyEdit({ property }: { property: Property }) {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <EntityForm
        fields={propertyFields(property)}
        submitLabel="Save property"
        onSubmit={async (values) => {
          await updateProperty(property.id, toWrite(values));
          router.refresh();
        }}
      />
      <DeleteButton
        confirm="Delete this property?"
        onDelete={async () => {
          await deleteProperty(property.id);
          router.push("/properties");
        }}
      />
    </div>
  );
}
