import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { ContactEdit } from "@/components/ContactCrud";
import { DetailFields } from "@/components/DetailFields";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchContact } from "@/lib/api";
import { isNotFound } from "@/lib/api/errors";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadApi(() => fetchContact(id));

  if (!result.ok) {
    return (
      <StaffChrome active="contacts">
        <Link href="/contacts" className="mb-3 inline-block text-[12px] font-semibold text-muted-foreground">
          ← Contacts
        </Link>
        {isNotFound(result.error) ? (
          <EmptyState title="Contact not found" />
        ) : (
          <ErrorState error={result.error} />
        )}
      </StaffChrome>
    );
  }

  const contact = result.data;

  return (
    <StaffChrome active="contacts" live title={contact.displayName}>
      <Link href="/contacts" className="mb-3 inline-block text-[12px] font-semibold text-muted-foreground">
        ← Contacts
      </Link>
      <PageHeader
        title={contact.displayName || `${contact.firstName} ${contact.lastName}`}
        description={`${contact.email} · ${contact.phone}`}
        meta={
          <>
            <span className="console-badge">{contact.role}</span>
            <span className="console-badge">{contact.preferredChannel}</span>
          </>
        }
      />
      <DetailFields
        title="Contact details"
        actions={<ContactEdit contact={contact} />}
        fields={[
          { label: "First name", value: contact.firstName },
          { label: "Last name", value: contact.lastName },
          { label: "Email", value: contact.email },
          { label: "Phone", value: contact.phone },
          { label: "Role", value: contact.role },
          { label: "Preferred channel", value: contact.preferredChannel },
        ]}
      />
    </StaffChrome>
  );
}
