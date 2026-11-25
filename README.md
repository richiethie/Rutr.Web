# Rutr.Web

Next.js 15 staff + homeowner portal for Project RUTR (Connect / Reporting pilot).

**GitHub:** https://github.com/richiethie/Rutr.Web (`main`)

## Local home

```text
C:\Users\rthiesfeldt\practice\Rutr.Web
```

Sibling API: `C:\Users\rthiesfeldt\practice\Rutr.Api` on port **5188**.

## Run

```powershell
cd C:\Users\rthiesfeldt\practice\Rutr.Web
Copy-Item .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5188
npm install
npm run dev                         # http://localhost:3317
```

Start `Rutr.Api` on **5188** first. If the API is unreachable, the UI falls back to clearly labeled sample data.

### Demo staff login

- Email: `pm@rutters.demo`
- Password: `rutters-demo`
- JWT stored for client approve calls; SSR uses `X-Demo-Auth` when no cookie yet

### Demo portal tokens

`keller-maple-demo`, `ellis-prairie-demo`, `nguyen-oak-demo`

## Routes (Connect MVP)

| Path | Purpose |
|------|---------|
| `/` | Brand home |
| `/login` | Staff JWT login |
| `/jobs` | Job list + stage filter |
| `/jobs/[id]` | Evidence, drafts, approve → portal |
| `/approvals` | PM approval queue |
| `/integrations` | JobNimbus / CompanyCam / messaging readiness |
| `/settings` | Org, quiet hours, SMS consent placeholders |
| `/p/[token]` | Homeowner portal (mobile-first) |

## Stack

Next.js App Router, TypeScript, Tailwind CSS, TanStack Query, asphalt / chalk / copper brand UI.
