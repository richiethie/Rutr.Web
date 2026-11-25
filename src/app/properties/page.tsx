import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { PropertyCreate } from "@/components/PropertyCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchProperties } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const result = await loadApi(fetchProperties);

  if (!result.ok) {
    return (
      <StaffChrome active="properties">
        <PageHeader
          title="Properties"
          description="Address / property records tied to jobs."
          actions={<PropertyCreate />}
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const properties = result.data;

  return (
    <StaffChrome active="properties" live>
      <PageHeader
        title="Properties"
        description="Address / property records tied to jobs."
        meta={<span className="console-badge">{properties.length} properties</span>}
        actions={<PropertyCreate />}
      />

      {properties.length === 0 ? (
        <EmptyState
          title="No properties"
          description="Create a property to attach to jobs."
          action={<PropertyCreate />}
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <table className="console-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Type</th>
                <th>Year</th>
                <th>Jobs</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link
                      href={`/properties/${p.id}`}
                      className="font-semibold hover:text-[var(--signal)]"
                    >
                      {p.addressLine1}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-[var(--muted)]">
                      {p.city}, {p.state} {p.postalCode}
                    </p>
                  </td>
                  <td>
                    <span className="console-badge">{p.propertyType}</span>
                  </td>
                  <td className="font-mono-data text-[12px]">{p.yearBuilt ?? "—"}</td>
                  <td className="font-mono-data text-[12px]">{p.jobCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StaffChrome>
  );
}
