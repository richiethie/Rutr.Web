# Rutr.Web

Next.js 15 staff + homeowner portal for Project RUTR (Connect / Reporting pilot).

**GitHub:** https://github.com/richiethie/Rutr.Web (`main`)

## Intended local home

```text
~/practice/Rutr.Web
C:\Users\rthiesfeldt\practice\Rutr.Web
```

Cloud clone: `/agent/repos/Rutr.Web`. Sibling API: `Rutr.Api` on port **5188**.

## Run

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5188
npm install
npm run dev                  # http://localhost:3317
```

Start `Rutr.Api` on port **5188** first. If the API is unreachable, the UI falls back to clearly labeled sample data.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Brand home |
| `/login` | Demo staff JWT login |
| `/jobs` | Staff job list |
| `/jobs/[id]` | Job detail + drafts |
| `/approvals` | Approval queue + approve action |
| `/p/[token]` | Homeowner portal |

Demo portal tokens (from API seed): `keller-maple-demo`, `ellis-prairie-demo`, `nguyen-oak-demo`.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, TanStack Query-ready fetch helpers. Brand palette is asphalt / chalk / copper (not purple AI defaults).
