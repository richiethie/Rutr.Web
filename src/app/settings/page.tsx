import { ErrorState } from "@/components/ApiState";
import { MemberRoleSelect, OrgEditForm } from "@/components/OrgSettings";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { ThemeToggle } from "@/components/theme";
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
        description="Appearance, org defaults, and staff roles (Admin / Pm / Sales)."
      />

      <div className="stagger-1 grid gap-4 lg:grid-cols-2">
        <section className="console-panel overflow-hidden lg:col-span-2">
          <div className="border-b border-border bg-muted/50 px-5 py-3 dark:bg-muted/40">
            <h2 className="text-[14px] font-semibold text-foreground">Appearance</h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Light, dark, or match your OS — surfaces stay layered either way.
            </p>
          </div>
          <div className="p-5">
            <ThemeToggle />
          </div>
        </section>

        <section className="console-panel overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-5 py-3 dark:bg-muted/40">
            <h2 className="text-[14px] font-semibold text-foreground">Organization</h2>
          </div>
          <div className="p-5">
            {!org.ok ? (
              <ErrorState error={org.error} />
            ) : (
              <>
                <p className="mb-3 font-mono-data text-[11px] text-muted-foreground">
                  slug · {org.data.slug} · id · {org.data.id}
                </p>
                <OrgEditForm org={org.data} />
              </>
            )}
          </div>
        </section>

        <section className="console-panel overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-5 py-3 dark:bg-muted/40">
            <h2 className="text-[14px] font-semibold text-foreground">Signed-in staff</h2>
          </div>
          <div className="p-5">
            {!me.ok ? (
              <ErrorState error={me.error} />
            ) : (
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/40 p-3 dark:bg-muted/30">
                  <dt className="text-[11px] font-medium text-muted-foreground">Name</dt>
                  <dd className="mt-1 text-[13px] font-medium">
                    {staff!.displayName} · {staff!.role}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3 dark:bg-muted/30">
                  <dt className="text-[11px] font-medium text-muted-foreground">Email</dt>
                  <dd className="mt-1 text-[13px] font-medium">{staff!.email}</dd>
                </div>
              </dl>
            )}
            <p className="mt-4 text-[13px] text-muted-foreground">
              Messaging mode:{" "}
              <span className="font-semibold text-brand">
                {messaging}
                {useMocks ? " (UseMocks)" : ""}
              </span>
            </p>
          </div>
        </section>

        <section className="console-panel overflow-hidden lg:col-span-2">
          <div className="border-b border-border bg-muted/50 px-5 py-3 dark:bg-muted/40">
            <h2 className="text-[14px] font-semibold text-foreground">Members &amp; roles</h2>
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
