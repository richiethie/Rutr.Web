import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { ContactCreate } from "@/components/ContactCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchContacts } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const result = await loadApi(fetchContacts);

  if (!result.ok) {
    return (
      <StaffChrome active="contacts">
        <PageHeader
          title="Contacts"
          description="Homeowners and job contacts — full CRUD against the API."
          actions={<ContactCreate />}
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const contacts = result.data;

  return (
    <StaffChrome active="contacts" live>
      <PageHeader
        title="Contacts"
        description="Homeowners and job contacts — prefer channel + language hooks where cheap."
        meta={<span className="console-badge">{contacts.length} contacts</span>}
        actions={<ContactCreate />}
      />

      {contacts.length === 0 ? (
        <EmptyState
          title="No contacts"
          description="Seed data comes from the API. Create one here to verify CRUD."
          action={<ContactCreate />}
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <table className="console-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Channel</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link
                      href={`/contacts/${c.id}`}
                      className="font-semibold hover:text-[var(--signal)]"
                    >
                      {c.displayName || `${c.firstName} ${c.lastName}`}
                    </Link>
                  </td>
                  <td className="text-[13px]">{c.email}</td>
                  <td className="font-mono-data text-[12px]">{c.phone}</td>
                  <td>
                    <span className="console-badge">{c.role}</span>
                  </td>
                  <td>
                    <span className="console-badge">{c.preferredChannel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StaffChrome>
  );
}
