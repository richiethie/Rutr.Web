"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { CrudPanel, DeleteButton } from "@/components/EntityForm";
import {
  createProperty,
  deleteProperty,
  updateProperty,
  type PlacesDetailsResult,
  type Property,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

const controlClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-left text-[13px] text-foreground outline-none placeholder:text-left placeholder:text-muted-foreground focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--brand-ring)] disabled:cursor-not-allowed disabled:opacity-50";

const textareaClass =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-left text-[13px] text-foreground outline-none placeholder:text-left placeholder:text-muted-foreground focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--brand-ring)] disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "block text-left text-[12px] font-medium leading-none text-foreground";

type PropertyFormState = {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  propertyType: string;
  yearBuilt: string;
  notes: string;
  latitude: number | null;
  longitude: number | null;
};

function fromProperty(p?: Property): PropertyFormState {
  return {
    addressLine1: p?.addressLine1 ?? "",
    city: p?.city ?? "",
    state: p?.state ?? "IA",
    postalCode: p?.postalCode ?? "",
    propertyType: p?.propertyType ?? "Residential",
    yearBuilt: p?.yearBuilt != null ? String(p.yearBuilt) : "",
    notes: p?.notes ?? "",
    latitude: p?.latitude ?? null,
    longitude: p?.longitude ?? null,
  };
}

function PropertyForm({
  initial,
  submitLabel,
  onCancel,
  onSaved,
}: {
  initial?: Property;
  submitLabel: string;
  onCancel: () => void;
  onSaved: (body: {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    propertyType: string | null;
    yearBuilt: number | null;
    notes: string | null;
    latitude: number | null;
    longitude: number | null;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState(() => fromProperty(initial));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function applyDetails(details: PlacesDetailsResult) {
    setForm((prev) => ({
      ...prev,
      addressLine1: details.addressLine1 || prev.addressLine1,
      city: details.city || prev.city,
      state: details.state || prev.state,
      postalCode: details.postalCode || prev.postalCode,
      latitude:
        typeof details.latitude === "number" ? details.latitude : prev.latitude,
      longitude:
        typeof details.longitude === "number"
          ? details.longitude
          : prev.longitude,
    }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const yearRaw = form.yearBuilt.trim();
    startTransition(async () => {
      try {
        await onSaved({
          addressLine1: form.addressLine1.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          propertyType: form.propertyType.trim() || null,
          yearBuilt: yearRaw === "" ? null : Number(yearRaw),
          notes: form.notes.trim() || null,
          latitude: form.latitude,
          longitude: form.longitude,
        });
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
    <form onSubmit={onSubmit} className="space-y-4 text-left">
      <AddressAutocomplete
        value={form.addressLine1}
        required
        onChange={(addressLine1) =>
          setForm((prev) => ({
            ...prev,
            addressLine1,
            // Manual edits clear coords until a suggestion is chosen again.
            latitude: null,
            longitude: null,
          }))
        }
        onResolved={applyDetails}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-left">
          <label htmlFor="prop-city" className={labelClass}>
            City <span className="text-destructive">*</span>
          </label>
          <input
            id="prop-city"
            className={controlClass}
            required
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 text-left">
            <label htmlFor="prop-state" className={labelClass}>
              State <span className="text-destructive">*</span>
            </label>
            <input
              id="prop-state"
              className={controlClass}
              required
              value={form.state}
              onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5 text-left">
            <label htmlFor="prop-zip" className={labelClass}>
              ZIP <span className="text-destructive">*</span>
            </label>
            <input
              id="prop-zip"
              className={controlClass}
              required
              value={form.postalCode}
              onChange={(e) =>
                setForm((p) => ({ ...p, postalCode: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {form.latitude != null && form.longitude != null ? (
        <p className="text-left text-[11px] text-muted-foreground">
          Coordinates · {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
        </p>
      ) : null}

      <div className="space-y-1.5 text-left">
        <label htmlFor="prop-type" className={labelClass}>
          Type
        </label>
        <input
          id="prop-type"
          className={controlClass}
          value={form.propertyType}
          onChange={(e) =>
            setForm((p) => ({ ...p, propertyType: e.target.value }))
          }
        />
      </div>

      <div className="space-y-1.5 text-left">
        <label htmlFor="prop-year" className={labelClass}>
          Year built
        </label>
        <input
          id="prop-year"
          type="number"
          className={controlClass}
          value={form.yearBuilt}
          onChange={(e) => setForm((p) => ({ ...p, yearBuilt: e.target.value }))}
        />
      </div>

      <div className="space-y-1.5 text-left">
        <label htmlFor="prop-notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="prop-notes"
          rows={4}
          className={textareaClass}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        />
      </div>

      {error ? <p className="text-left text-[12px] text-destructive">{error}</p> : null}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
        <button type="button" className="console-btn console-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={pending} className="console-btn console-btn-primary">
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function PropertyCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <CrudPanel title="New property" open={open} onOpenChange={setOpen} triggerLabel="New property">
      <PropertyForm
        submitLabel="Create property"
        onCancel={() => setOpen(false)}
        onSaved={async (body) => {
          await createProperty(body);
          setOpen(false);
          router.refresh();
        }}
      />
    </CrudPanel>
  );
}

export function PropertyEdit({ property }: { property: Property }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CrudPanel
        title="Edit property"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Edit"
        triggerClassName="console-btn console-btn-secondary"
      >
        <PropertyForm
          initial={property}
          submitLabel="Save property"
          onCancel={() => setOpen(false)}
          onSaved={async (body) => {
            await updateProperty(property.id, body);
            setOpen(false);
            router.refresh();
          }}
        />
      </CrudPanel>
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
