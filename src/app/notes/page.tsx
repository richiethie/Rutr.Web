import { EmptyState, ErrorState } from "@/components/ApiState";
import { NoteCreate, NoteRowActions } from "@/components/NoteCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchNotes } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const result = await loadApi(() => fetchNotes());

  if (!result.ok) {
    return (
      <StaffChrome active="notes">
        <PageHeader
          title="Notes"
          description="Timeline / activity entries on jobs and contacts."
          actions={<NoteCreate />}
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const notes = result.data;

  return (
    <StaffChrome active="notes" live>
      <PageHeader
        title="Notes"
        description="Timeline / activity entries on jobs and contacts."
        meta={<span className="console-badge">{notes.length} notes</span>}
        actions={<NoteCreate />}
      />

      {notes.length === 0 ? (
        <EmptyState
          title="No notes"
          description="Add a note tied to a job or contact."
          action={<NoteCreate />}
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <table className="console-table">
            <thead>
              <tr>
                <th>Body</th>
                <th>Job</th>
                <th>Contact</th>
                <th>When (CT)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {notes.map((n) => (
                <tr key={n.id}>
                  <td className="max-w-md text-[13px]">{n.body}</td>
                  <td className="font-mono-data text-[11px] text-muted-foreground">
                    {n.jobId?.slice(0, 8) ?? "—"}
                  </td>
                  <td className="font-mono-data text-[11px] text-muted-foreground">
                    {n.contactId?.slice(0, 8) ?? "—"}
                  </td>
                  <td className="font-mono-data whitespace-nowrap text-[12px] text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                    })}
                  </td>
                  <td>
                    <NoteRowActions note={n} />
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
