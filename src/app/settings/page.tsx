import { StaffChrome } from "@/components/StaffChrome";
import { fetchIntegrationStatus, fetchStaffMe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await fetchStaffMe();
  const integrations = await fetchIntegrationStatus();
  const source = me.source === "api" || integrations.source === "api" ? "api" : "sample";
  const staff = me.data;

  return (
    <StaffChrome active="settings" source={source}>
      <div className="fade-up mb-8">
        <h1 className="text-3xl font-semibold text-[var(--rutr-chalk)]">Settings</h1>
        <p className="mt-2 max-w-2xl text-[var(--rutr-mist)]">
          Org and messaging defaults for the Rutters Connect pilot. Quiet hours / consent are
          enforced on send; STOP lands on the Twilio webhook.
        </p>
      </div>

      <div className="fade-up-delay space-y-10">
        <section className="border-y border-[var(--rutr-line)] py-8">
          <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">Organization</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">Name</dt>
              <dd className="mt-1 text-[var(--rutr-chalk)]">
                {staff?.organizationName ?? "Rutters Roofing & Exteriors"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">
                OrganizationId
              </dt>
              <dd className="mt-1 font-mono text-sm text-[var(--rutr-chalk)]">
                {staff?.organizationId ?? "11111111-1111-1111-1111-111111111111"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">
                Signed-in staff
              </dt>
              <dd className="mt-1 text-[var(--rutr-chalk)]">
                {staff ? `${staff.displayName} · ${staff.role}` : "Demo PM"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">Email</dt>
              <dd className="mt-1 text-[var(--rutr-chalk)]">{staff?.email ?? "pm@rutters.demo"}</dd>
            </div>
          </dl>
        </section>

        <section className="border-b border-[var(--rutr-line)] pb-8">
          <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
            SMS consent &amp; quiet hours
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--rutr-mist)]">
            Digests only send when the homeowner has SMS consent and the local clock is outside quiet
            hours. Messaging mode:{" "}
            <span className="text-[var(--rutr-copper-hot)]">
              {integrations.data.messaging}
              {integrations.data.useMocks ? " (UseMocks)" : ""}
            </span>
            .
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">
                Quiet hours
              </dt>
              <dd className="mt-1 text-[var(--rutr-chalk)]">8:00 PM – 8:00 AM CT</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">
                Default consent
              </dt>
              <dd className="mt-1 text-[var(--rutr-chalk)]">Required before first SMS</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">Timezone</dt>
              <dd className="mt-1 text-[var(--rutr-chalk)]">America/Chicago</dd>
            </div>
          </dl>
        </section>

        <section className="border-b border-[var(--rutr-line)] pb-8">
          <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
            Webhook endpoints
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--rutr-mist)]">
            Point vendors at the API (not this Next app). Local base{" "}
            <span className="font-mono text-[var(--rutr-chalk)]">http://127.0.0.1:5188</span>.
          </p>
          <ul className="mt-4 space-y-2 font-mono text-xs text-[var(--rutr-mist)]">
            <li>POST /api/v1/webhooks/jobnimbus</li>
            <li>POST /api/v1/webhooks/companycam</li>
            <li>POST /api/v1/webhooks/twilio/sms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
            Portal media
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--rutr-mist)]">
            Only PM-approved photos become customer-visible. Production media will land in Cloudflare
            R2; the local slice uses seeded image URLs.
          </p>
        </section>
      </div>
    </StaffChrome>
  );
}
