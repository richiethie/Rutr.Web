"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EntityForm } from "@/components/EntityForm";
import {
  updateMemberRole,
  updateOrganization,
  type Organization,
  type StaffMember,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

export function OrgEditForm({ org }: { org: Organization }) {
  const router = useRouter();
  return (
    <EntityForm
      fields={[
        { name: "name", label: "Org name", required: true, defaultValue: org.name },
        {
          name: "brandPrimaryColor",
          label: "Brand color",
          defaultValue: org.brandPrimaryColor,
          placeholder: "#E05A1A",
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
      onSubmit={async (values) => {
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
        router.refresh();
      }}
    />
  );
}

export function MemberRoleSelect({ member }: { member: StaffMember }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState(member.role);

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        className="rounded-[8px] border border-[var(--line)] bg-white px-2 py-1.5 text-[12px]"
        value={role}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          setRole(next);
          setError(null);
          startTransition(async () => {
            try {
              await updateMemberRole(member.id, next);
              router.refresh();
            } catch (err) {
              setRole(member.role);
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
      {error ? <p className="text-[11px] text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
