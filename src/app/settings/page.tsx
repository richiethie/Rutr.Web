import { ErrorState } from "@/components/ApiState";
import { MemberRoleSelect, OrgEditForm } from "@/components/OrgSettings";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import {
  fetchIntegrationStatus,
  fetchOrganization,
  fetchOrgMembers,
  fetchStaffMe,
} from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await loadApi(fetchStaffMe);
  const org = await loadApi(fetchOrganization);
  const members = await loadApi(fetchOrgMembers);
  const integrations = await loadApi(fetchIntegrationStatus);

  if (!me.ok && !org.ok) {
    return (
      <StaffChrome active="settings">
        <PageHeader
          title="Settings"
          description="Org and messaging defaults for the Rutters Connect pilot."
        />
        <ErrorState error={me.ok ? org.error : me.error} />
      </StaffChrome>
    );
  }

  const staff = me.ok ? me.data : null;
  const messaging = integrations.ok ? integrations.data.messaging : "unknown";
  const useMocks = integrations.ok ? integrations.data.useMocks : true;

  return (
    <StaffChrome active="settings" live={me.ok || org.ok}>
      <PageHeader
        title="Settings"
        description="Org name, quiet hours, branding light, and staff roles (Admin / Pm / Sales)."
      />

      <div className="stagger-1 grid gap-4 lg:grid-cols-2">
        <section className="console-panel p-5">
          <h2 className="display-title text-[15px] font-semibold text-[var(--console-text)]">
            Organization
          </h2>
          {!org.ok ? (
            <div className="mt-3">
              <ErrorState error={org.error} />
            </div>
          ) : (
            <div className="mt-3">
              <p className="mb-3 font-mono-data text-[11px] text-muted-foreground">
                slug · {org.data.slug} · id · {org.data.id}
              </p>
              <OrgEditForm org={org.data} />
            </div>
          )}
        </section>

        <section className="console-panel p-5">
          <h2 className="display-title text-[15px] font-semibold text-[var(--console-text)]">
            Signed-in staff
          </h2>
          {!me.ok ? (
            <div className="mt-3">
              <ErrorState error={me.error} />
            </div>
          ) : (
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Name
                </dt>
                <dd className="mt-1 text-[13px]">
                  {staff!.displayName} · {staff!.role}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </dt>
                <dd className="mt-1 text-[13px]">{staff!.email}</dd>
              </div>
            </dl>
          )}
          <p className="mt-4 text-[13px] text-muted-foreground">
            Messaging mode:{" "}
            <span className="font-semibold text-[var(--signal)]">
              {messaging}
              {useMocks ? " (UseMocks)" : ""}
            </span>
          </p>
        </section>

        <section className="console-panel overflow-hidden lg:col-span-2">
          <div className="border-b border-[var(--line)] px-5 py-3">
            <h2 className="display-title text-[15px] font-semibold">Members &amp; roles</h2>
          </div>
          {!members.ok ? (
            <div className="p-5">
              <ErrorState error={members.error} />
            </div>
          ) : (
            <table className="console-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {members.data.map((m) => (
                  <tr key={m.id}>
                    <td className="font-semibold">{m.displayName}</td>
                    <td className="text-[13px]">{m.email}</td>
                    <td>
                      <span className="console-badge">{m.role}</span>
                    </td>
                    <td className="text-right">
                      <MemberRoleSelect member={m} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </StaffChrome>
  );
}
