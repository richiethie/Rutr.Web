"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DetailFields } from "@/components/DetailFields";
import { EntityForm } from "@/components/EntityForm";
import {
  updateMemberRole,
  updateOrganization,
  type Organization,
  type StaffMember,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { toastError, toastSuccess } from "@/lib/toast";

export function OrgEditForm({ org }: { org: Organization }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="space-y-4">
        <DetailFields
          bare
          fields={[
            { label: "Org name", value: org.name },
            {
              label: "Brand color",
              value: org.brandPrimaryColor ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block size-3 rounded-full border border-border"
                    style={{ background: org.brandPrimaryColor }}
                  />
                  {org.brandPrimaryColor}
                </span>
              ) : (
                "—"
              ),
            },
            {
              label: "Quiet hours",
              value: `${org.quietHoursStartLocal ?? "—"} – ${org.quietHoursEndLocal ?? "—"}`,
            },
            { label: "Timezone", value: org.timeZoneId || "—" },
          ]}
        />
        <button
          type="button"
          className="console-btn console-btn-secondary"
          onClick={() => setEditing(true)}
        >
          Edit organization
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[12px] text-muted-foreground">
        Editing organization — Save to apply, or Cancel to discard.
      </p>
      <EntityForm
        key={org.id}
        fields={[
          { name: "name", label: "Org name", required: true, defaultValue: org.name },
          {
            name: "brandPrimaryColor",
            label: "Brand color",
            defaultValue: org.brandPrimaryColor,
            placeholder: "#0369a1",
          },
          {
            name: "quietHoursStartLocal",
            label: "Quiet hours start (local hour 0–23)",
            type: "number",
            defaultValue: org.quietHoursStartLocal,
          },
          {
            name: "quietHoursEndLocal",
            label: "Quiet hours end (local hour 0–23)",
            type: "number",
            defaultValue: org.quietHoursEndLocal,
          },
          {
            name: "timeZoneId",
            label: "Timezone",
            defaultValue: org.timeZoneId,
          },
        ]}
        submitLabel="Save organization"
        onCancel={() => setEditing(false)}
        onSubmit={async (values) => {
          try {
            await updateOrganization({
              name: values.name ? String(values.name) : null,
              brandPrimaryColor: values.brandPrimaryColor
                ? String(values.brandPrimaryColor)
                : null,
              quietHoursStartLocal:
                typeof values.quietHoursStartLocal === "number"
                  ? values.quietHoursStartLocal
                  : null,
              quietHoursEndLocal:
                typeof values.quietHoursEndLocal === "number"
                  ? values.quietHoursEndLocal
                  : null,
              timeZoneId: values.timeZoneId ? String(values.timeZoneId) : null,
            });
            toastSuccess("Organization updated");
            setEditing(false);
            router.refresh();
          } catch (err) {
            toastError("Failed to save organization", err);
            throw err;
          }
        }}
      />
    </div>
  );
}

export function MemberRoleSelect({ member }: { member: StaffMember }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState(member.role);
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="console-badge">{member.role}</span>
        <button
          type="button"
          className="console-btn console-btn-ghost h-7 px-2 text-[11px]"
          onClick={() => setEditing(true)}
        >
          Change role
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        className="rounded-md border border-input bg-background px-2 py-1.5 text-[12px] text-foreground focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--brand-ring)]"
        value={role}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          setRole(next);
          setError(null);
          startTransition(async () => {
            try {
              await updateMemberRole(member.id, next);
              toastSuccess(`Role updated to ${next}`);
              setEditing(false);
              router.refresh();
            } catch (err) {
              setRole(member.role);
              toastError("Failed to update role", err);
              setError(
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Role update failed",
              );
            }
          });
        }}
      >
        <option value="Admin">Admin</option>
        <option value="Pm">Pm</option>
        <option value="Sales">Sales</option>
      </select>
      <button
        type="button"
        className="console-btn console-btn-ghost h-7 px-2 text-[11px]"
        disabled={pending}
        onClick={() => {
          setRole(member.role);
          setEditing(false);
          setError(null);
        }}
      >
        Cancel
      </button>
      {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
    </div>
  );
}
