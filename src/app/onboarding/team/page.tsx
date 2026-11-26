"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import {
  addOrgMember,
  createOrgInvite,
  fetchOrgInvites,
  fetchOrgMembers,
  STAFF_ROLES,
  type Invite,
  type StaffMember,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { readToken } from "@/lib/auth";
import { STAFF_PASSWORD_MIN, staffPasswordError } from "@/lib/password";

type Mode = "invite" | "add";

export default function OnboardingTeamPage() {
  const [mode, setMode] = useState<Mode>("invite");
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [booting, setBooting] = useState(true);

  function refresh() {
    startTransition(async () => {
      try {
        const [m, i] = await Promise.all([fetchOrgMembers(), fetchOrgInvites()]);
        setMembers(m);
        setInvites(i);
        setLoadError(null);
      } catch (err) {
        setLoadError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not load team.",
        );
      } finally {
        setBooting(false);
      }
    });
  }

  useEffect(() => {
    if (!readToken()) {
      window.location.href = "/login";
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const displayName = String(form.get("displayName") ?? "").trim();
    const role = String(form.get("role") ?? "Pm");
    const temporaryPassword = String(form.get("temporaryPassword") ?? "");

    setFormError(null);
    setNotice(null);
    if (mode === "add") {
      const pwErr = staffPasswordError(temporaryPassword);
      if (pwErr) {
        setFormError(pwErr);
        return;
      }
    }
    startTransition(async () => {
      try {
        if (mode === "add") {
          const member = await addOrgMember({
            email,
            displayName,
            role,
            temporaryPassword,
          });
          setNotice(`Added ${member.displayName} as ${member.role}.`);
          e.currentTarget.reset();
        } else {
          const invite = await createOrgInvite({
            email,
            displayName: displayName || null,
            role,
          });
          const link = `${window.location.origin}/invite?token=${encodeURIComponent(invite.inviteToken)}`;
          setNotice(`Invite created for ${invite.email}. Share link: ${link}`);
          e.currentTarget.reset();
        }
        refresh();
      } catch (err) {
        setFormError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not add teammate.",
        );
      }
    });
  }

  return (
    <AuthShell step="team" wide>
      <AuthCard
        title="Invite your team"
        description="Add Admin / Pm / Sales now, or create invite links (no email send in MVP)."
      >
        {booting ? (
          <p className="text-[13px] text-muted-foreground">Loading team…</p>
        ) : loadError ? (
          <div className="space-y-3">
            <p className="text-[12px] text-destructive">{loadError}</p>
            <p className="text-[12px] text-muted-foreground">
              Waiting on API onboarding routes — you can continue and come back.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-[12px] font-medium text-muted-foreground">Members</p>
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {members.length === 0 ? (
                  <li className="px-3 py-3 text-[13px] text-muted-foreground">
                    No members returned from API yet.
                  </li>
                ) : (
                  members.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {m.displayName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">{m.email}</p>
                      </div>
                      <span className="console-badge shrink-0">{m.role}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {invites.length > 0 ? (
              <div>
                <p className="text-[12px] font-medium text-muted-foreground">Pending invites</p>
                <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                  {invites.map((inv) => (
                    <li
                      key={inv.id}
                      className="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {inv.displayName || inv.email}
                        </p>
                        <p className="truncate font-mono-data text-[11px] text-muted-foreground">
                          {inv.status} · {inv.inviteToken}
                        </p>
                      </div>
                      <span className="console-badge shrink-0">{inv.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className={
              mode === "invite"
                ? "console-filter console-filter-active"
                : "console-filter"
            }
            onClick={() => setMode("invite")}
          >
            Invite link
          </button>
          <button
            type="button"
            className={
              mode === "add" ? "console-filter console-filter-active" : "console-filter"
            }
            onClick={() => setMode("add")}
          >
            Admin-add now
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label className="block text-[12px] font-medium text-foreground">
            Email
            <input className="console-input mt-1.5" name="email" type="email" required />
          </label>
          <label className="block text-[12px] font-medium text-foreground">
            Display name
            <input className="console-input mt-1.5" name="displayName" required={mode === "add"} />
          </label>
          <label className="block text-[12px] font-medium text-foreground">
            Role
            <select className="console-input mt-1.5" name="role" defaultValue="Pm">
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {mode === "add" ? (
            <label className="block text-[12px] font-medium text-foreground">
              Temporary password
              <input
                className="console-input mt-1.5"
                name="temporaryPassword"
                type="password"
                minLength={STAFF_PASSWORD_MIN}
                required
              />
              <span className="mt-1.5 block text-[11px] font-normal text-muted-foreground">
                At least {STAFF_PASSWORD_MIN} characters, with a letter and a number.
              </span>
            </label>
          ) : null}
          {formError ? <p className="text-[12px] text-destructive">{formError}</p> : null}
          {notice ? (
            <p className="break-all rounded-md bg-muted px-3 py-2 text-[12px] text-foreground">
              {notice}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="console-btn console-btn-primary w-full"
          >
            {pending
              ? "Saving…"
              : mode === "add"
                ? "Add member"
                : "Create invite"}
          </button>
        </form>
      </AuthCard>

      <div className="flex items-center justify-between gap-3 text-[12px]">
        <Link
          href="/signup"
          className="font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          Back
        </Link>
        <Link
          href="/onboarding/import"
          className="console-btn console-btn-primary h-9"
        >
          Continue to data
        </Link>
      </div>
    </AuthShell>
  );
}
