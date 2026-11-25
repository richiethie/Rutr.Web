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
Copy-Item .env.example .env.local   # NEXT_PUBLIC_API_URL=http://127.0.0.1:5188
npm install
npm run gen:api                     # from openapi/openapi.json (or gen:api:live)
npm run dev                         # http://localhost:3317
```

Prefer `127.0.0.1` over `localhost` on Windows if IPv6 resolution is flaky. If the API is unreachable, the UI falls back to labeled sample data.

### Demo staff login

- Email: `pm@rutters.demo`
- Password: `rutters-demo`

### Demo portal tokens

`keller-maple-demo`, `ellis-prairie-demo`, `nguyen-oak-demo`

## Connect MVP routes

| Path | Purpose |
|------|---------|
| `/` | Redirects to `/jobs` (staff console) |
| `/login` | Staff JWT login |
| `/jobs` | Dense job table + stage filters |
| `/jobs/[id]` | Evidence, drafts, approve/reject/send, audit |
| `/approvals` | PM approval queue |
| `/integrations` | Status + mock sync |
| `/settings` | Org (from `/auth/me`), quiet hours, webhooks |
| `/p/[token]` | Homeowner portal |

### Staff flow

1. Integrations → **Run mock sync**
2. Approvals / job detail → **Approve digest** → **Send SMS/Email**
3. Open homeowner portal link — only approved photos/updates appear

## OpenAPI client

```powershell
npm run gen:api        # committed openapi/openapi.json
npm run gen:api:live   # http://127.0.0.1:5188/swagger/v1/swagger.json
```

Generated types: `src/lib/api/schema.d.ts`. Runtime helpers with sample fallback: `src/lib/api/index.ts`.

## Stack

Next.js App Router, TypeScript, Tailwind, TanStack Query, openapi-typescript / openapi-fetch, asphalt / chalk / copper brand UI.
