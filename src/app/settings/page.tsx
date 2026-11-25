import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchIntegrationStatus, fetchStaffMe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await fetchStaffMe();
  const integrations = await fetchIntegrationStatus();
  const source = me.source === "api" || integrations.source === "api" ? "api" : "sample";
  const staff = me.data;

  return (
    <StaffChrome active="settings" source={source}>
      <PageHeader
        title="Settings"
        description="Org and messaging defaults for the Rutters Connect pilot."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="console-panel p-4">
          <h2 className="text-[13px] font-semibold text-[var(--console-text)]">Organization</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                Name
              </dt>
              <dd className="mt-1 text-[13px]">
                {staff?.organizationName ?? "Rutters Roofing & Exteriors"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                OrganizationId
              </dt>
              <dd className="mt-1 font-mono-data text-[12px]">
                {staff?.organizationId ?? "11111111-1111-1111-1111-111111111111"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                Signed-in staff
              </dt>
              <dd className="mt-1 text-[13px]">
                {staff ? `${staff.displayName} · ${staff.role}` : "Demo PM"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                Email
              </dt>
              <dd className="mt-1 text-[13px]">{staff?.email ?? "pm@rutters.demo"}</dd>
            </div>
          </dl>
        </section>

        <section className="console-panel p-4">
          <h2 className="text-[13px] font-semibold text-[var(--console-text)]">
            SMS consent &amp; quiet hours
          </h2>
          <p className="mt-2 text-[13px] text-[var(--console-muted)]">
            Digests only send with consent and outside quiet hours. Messaging mode:{" "}
            <span className="font-semibold text-[var(--console-accent)]">
              {integrations.data.messaging}
              {integrations.data.useMocks ? " (UseMocks)" : ""}
            </span>
            .
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                Quiet hours
              </dt>
              <dd className="mt-1 text-[13px]">8:00 PM – 8:00 AM CT</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                Consent
              </dt>
              <dd className="mt-1 text-[13px]">Required before first SMS</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                Timezone
              </dt>
              <dd className="mt-1 text-[13px]">America/Chicago</dd>
            </div>
          </dl>
        </section>

        <section className="console-panel p-4">
          <h2 className="text-[13px] font-semibold text-[var(--console-text)]">Webhook endpoints</h2>
          <p className="mt-2 text-[13px] text-[var(--console-muted)]">
            Point vendors at the API (not this Next app). Local base{" "}
            <span className="font-mono-data text-[var(--console-text)]">http://127.0.0.1:5188</span>.
          </p>
          <ul className="mt-3 space-y-1.5 font-mono-data text-[12px] text-[var(--console-muted)]">
            <li>POST /api/v1/webhooks/jobnimbus</li>
            <li>POST /api/v1/webhooks/companycam</li>
            <li>POST /api/v1/webhooks/twilio/sms</li>
          </ul>
        </section>

        <section className="console-panel p-4">
          <h2 className="text-[13px] font-semibold text-[var(--console-text)]">Portal media</h2>
          <p className="mt-2 text-[13px] text-[var(--console-muted)]">
            Only PM-approved photos become customer-visible. Production media will land in Cloudflare
            R2; the local slice uses seeded image URLs.
          </p>
        </section>
      </div>
    </StaffChrome>
  );
}
