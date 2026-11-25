import { StaffChrome } from "@/components/StaffChrome";

const integrations = [
  {
    name: "JobNimbus",
    role: "Jobs, stages, homeowner contacts",
    status: "Mock",
    detail: "UseMocks=true on the API. Live sync lands after the Connect pilot path is stable.",
  },
  {
    name: "CompanyCam",
    role: "Field photo evidence",
    status: "Mock",
    detail: "Seeded photos power digests. Customer visibility flips only after PM approval.",
  },
  {
    name: "Twilio SMS",
    role: "Outbound digests + STOP",
    status: "Planned",
    detail: "Quiet hours and consent live under Settings. Send path waits on API messaging.",
  },
  {
    name: "Resend Email",
    role: "Transactional digests",
    status: "Planned",
    detail: "Same approve → send audit as SMS once the API messaging adapters are live.",
  },
];

export default function IntegrationsPage() {
  return (
    <StaffChrome active="integrations" source="api">
      <div className="fade-up mb-8">
        <h1 className="text-3xl font-semibold text-[var(--rutr-chalk)]">Integrations</h1>
        <p className="mt-2 max-w-2xl text-[var(--rutr-mist)]">
          Connect pulls JobNimbus work and CompanyCam evidence into the approval queue. Vendor
          toggles stay API-owned; this page reflects pilot readiness.
        </p>
      </div>

      <ul className="fade-up-delay divide-y divide-[var(--rutr-line)] border-y border-[var(--rutr-line)]">
        {integrations.map((item) => (
          <li key={item.name} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <p className="text-lg text-[var(--rutr-chalk)]">{item.name}</p>
              <p className="mt-1 text-sm text-[var(--rutr-mist)]">{item.role}</p>
              <p className="mt-3 text-sm text-[var(--rutr-sage)]">{item.detail}</p>
            </div>
            <span
              className={
                item.status === "Mock"
                  ? "self-start rounded-sm border border-[var(--rutr-copper)]/50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--rutr-copper-hot)]"
                  : "self-start rounded-sm border border-[var(--rutr-line)] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]"
              }
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </StaffChrome>
  );
}
