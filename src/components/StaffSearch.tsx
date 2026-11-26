"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  fetchApprovals,
  fetchContacts,
  fetchJobs,
  fetchProperties,
  type ApprovalItem,
  type Contact,
  type JobListItem,
  type Property,
} from "@/lib/api";

type Hit = {
  id: string;
  group: "Jobs" | "Contacts" | "Properties" | "Approvals" | "Pages";
  title: string;
  subtitle?: string;
  href: string;
};

const PAGES: Hit[] = [
  { id: "page-jobs", group: "Pages", title: "Jobs", href: "/jobs" },
  { id: "page-approvals", group: "Pages", title: "Approvals", href: "/approvals" },
  { id: "page-evidence", group: "Pages", title: "Evidence", href: "/evidence" },
  { id: "page-tasks", group: "Pages", title: "Tasks", href: "/tasks" },
  { id: "page-notes", group: "Pages", title: "Notes", href: "/notes" },
  { id: "page-milestones", group: "Pages", title: "Milestones", href: "/milestones" },
  { id: "page-contacts", group: "Pages", title: "Contacts", href: "/contacts" },
  { id: "page-properties", group: "Pages", title: "Properties", href: "/properties" },
  { id: "page-consents", group: "Pages", title: "Consents", href: "/consents" },
  { id: "page-integrations", group: "Pages", title: "Integrations", href: "/integrations" },
  { id: "page-settings", group: "Pages", title: "Settings", href: "/settings" },
];

function match(q: string, ...parts: Array<string | null | undefined>) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return parts.some((p) => (p ?? "").toLowerCase().includes(needle));
}

function toHits(
  jobs: JobListItem[],
  contacts: Contact[],
  properties: Property[],
  approvals: ApprovalItem[],
): Hit[] {
  return [
    ...jobs.map((j) => ({
      id: `job-${j.id}`,
      group: "Jobs" as const,
      title: j.addressLine1,
      subtitle: `${j.homeownerName} · ${j.city}, ${j.state} · ${j.stage}`,
      href: `/jobs/${j.id}`,
    })),
    ...contacts.map((c) => ({
      id: `contact-${c.id}`,
      group: "Contacts" as const,
      title: c.displayName || `${c.firstName} ${c.lastName}`,
      subtitle: `${c.email} · ${c.phone} · ${c.role}`,
      href: `/contacts/${c.id}`,
    })),
    ...properties.map((p) => ({
      id: `property-${p.id}`,
      group: "Properties" as const,
      title: p.addressLine1,
      subtitle: `${p.city}, ${p.state} ${p.postalCode} · ${p.propertyType}`,
      href: `/properties/${p.id}`,
    })),
    ...approvals.map((a) => ({
      id: `approval-${a.draftId}`,
      group: "Approvals" as const,
      title: a.subject,
      subtitle: `${a.addressLine1} · ${a.channel} · ${a.homeownerName}`,
      href: `/jobs/${a.jobId}`,
    })),
    ...PAGES,
  ];
}

export function StaffSearch() {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>(PAGES);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const loaded = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const openPalette = useCallback(() => {
    setOpen(true);
    setActive(0);
  }, []);

  const loadIndex = useCallback(async () => {
    if (loaded.current) return;
    setLoading(true);
    setError(null);
    try {
      const [jobs, contacts, properties, approvals] = await Promise.all([
        fetchJobs().catch(() => [] as JobListItem[]),
        fetchContacts().catch(() => [] as Contact[]),
        fetchProperties().catch(() => [] as Property[]),
        fetchApprovals().catch(() => [] as ApprovalItem[]),
      ]);
      setHits(toHits(jobs, contacts, properties, approvals));
      loaded.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search index failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openPalette();
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openPalette]);

  useEffect(() => {
    if (!open) return;
    void loadIndex();
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open, loadIndex]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return hits.filter((h) => h.group !== "Pages").slice(0, 8).concat(
        hits.filter((h) => h.group === "Pages").slice(0, 6),
      );
    }
    return hits.filter((h) => match(q, h.title, h.subtitle, h.group)).slice(0, 24);
  }, [hits, query]);

  useEffect(() => {
    setActive(0);
  }, [query, filtered.length]);

  function go(hit: Hit) {
    close();
    startTransition(() => {
      router.push(hit.href);
    });
  }

  const groups = useMemo(() => {
    const order: Hit["group"][] = ["Jobs", "Contacts", "Properties", "Approvals", "Pages"];
    return order
      .map((group) => ({ group, items: filtered.filter((h) => h.group === group) }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  const flat = groups.flatMap((g) => g.items);

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="hidden h-8 w-56 items-center gap-2 rounded-md border border-border bg-muted px-3 text-left text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground dark:bg-muted md:flex"
        aria-label="Search"
      >
        <span className="truncate">Search…</span>
      </button>
      <button
        type="button"
        onClick={openPalette}
        className="console-btn console-btn-secondary h-8 px-2.5 text-[12px] md:hidden"
        aria-label="Search"
      >
        Search
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close search"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative mx-auto mt-[12vh] w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-border px-3">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, contacts, properties…"
                className="h-12 w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-zinc-600"
                aria-controls={listId}
                aria-autocomplete="list"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    const hit = flat[active];
                    if (hit) go(hit);
                  }
                }}
              />
              {(loading || pending) && (
                <span className="text-[11px] text-muted-foreground">Loading…</span>
              )}
            </div>

            <div id={listId} role="listbox" className="max-h-[420px] overflow-y-auto p-2">
              {error ? (
                <p className="px-3 py-6 text-[13px] text-destructive">{error}</p>
              ) : flat.length === 0 ? (
                <p className="px-3 py-6 text-[13px] text-muted-foreground">
                  No matches{query ? ` for “${query}”` : ""}.
                </p>
              ) : (
                groups.map((g) => (
                  <div key={g.group} className="mb-2">
                    <p className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      {g.group}
                    </p>
                    <ul className="space-y-0.5">
                      {g.items.map((hit) => {
                        const index = flat.indexOf(hit);
                        const isActive = index === active;
                        return (
                          <li key={hit.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              className={
                                isActive
                                  ? "flex w-full flex-col rounded-md bg-zinc-100 px-3 py-2 text-left"
                                  : "flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-muted"
                              }
                              onMouseEnter={() => setActive(index)}
                              onClick={() => go(hit)}
                            >
                              <span className="text-[13px] font-medium text-foreground">
                                {hit.title}
                              </span>
                              {hit.subtitle ? (
                                <span className="mt-0.5 text-[12px] text-muted-foreground">
                                  {hit.subtitle}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
              <span>↑↓ navigate · ↵ open · esc close</span>
              <span>API-backed</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
