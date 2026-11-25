import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { PropertyEdit } from "@/components/PropertyCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchProperty } from "@/lib/api";
import { isNotFound } from "@/lib/api/errors";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadApi(() => fetchProperty(id));

  if (!result.ok) {
    return (
      <StaffChrome active="properties">
        <Link href="/properties" className="mb-3 inline-block text-[12px] font-semibold text-[var(--muted)]">
          ← Properties
        </Link>
        {isNotFound(result.error) ? (
          <EmptyState title="Property not found" />
        ) : (
          <ErrorState error={result.error} />
        )}
      </StaffChrome>
    );
  }

  const property = result.data;

  return (
    <StaffChrome active="properties" live title={property.addressLine1}>
      <Link href="/properties" className="mb-3 inline-block text-[12px] font-semibold text-[var(--muted)]">
        ← Properties
      </Link>
      <PageHeader
        title={property.addressLine1}
        description={`${property.city}, ${property.state} ${property.postalCode}`}
        meta={
          <>
            <span className="console-badge">{property.propertyType}</span>
            <span className="console-badge">{property.jobCount} jobs</span>
          </>
        }
      />
      <div className="console-panel max-w-lg p-5">
        <PropertyEdit property={property} />
      </div>
    </StaffChrome>
  );
}
