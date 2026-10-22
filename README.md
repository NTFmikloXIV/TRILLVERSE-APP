# TrillVerse v0.1 — engineering starter (NOT production-ready)

Expo/React Native/TypeScript frontend and a **fail-closed** Supabase SQL candidate for sign-in → profile → privacy-audience text composer. Not a replacement for the existing Notion contract.

## Important
- Repo lookup found no repositories in the connected GitHub account at preparation time.
- No Supabase project, external builds, tests, admission procedures, or working credentials were verified.
- The SQL migration creates pending accounts and **intentionally rejects publishing**, even after auth. Do not remove the rejection until the access contract and real API tests are approved.
- Privacy selector describes intended backend audience semantics; it is not E2EE. The demo's DM UI is excluded from v0.1.
- Do not expose `service_role` or secret API keys via `EXPO_PUBLIC_*`.

## Run locally
1. Install Node.js LTS, then run `npm install` in this directory.
2. Copy `.env.example` to `.env`; enter only the **test** Supabase URL + publishable key.
3. `npm run typecheck` to check TS, `npm start` for Expo.
4. Review `supabase/migrations/202610200001_step1_candidate.sql` before applying it on an isolated **new test database**. Never apply to a production DB.
5. Do not enable open signups or manually mark users active as a substitute for real admission.

## Product design and documented source
- Notion: TrillVerse v0.1 — Pre-Implementation Decision Log, Dependency-Ordered Implementation Sequence, and Data Model, Permissions & RLS Contract (September 2026).
- Decision-log D03 proposes Public = all active admitted testers, **not** signed-out anonymous Internet visitors.
- D04 age/admission, D01 report availability, D02 gateway media, D05 retention, and D06 removed content require explicit acceptance and broader implementation.
- The `publish_text_post` function is intentionally blocked by a terminal exception. This is a reviewable *interface stub*, not a completed write path.

## Best next implementation unit
Finalize D01–D06 acceptance record and run clean typecheck/schema checks, then add controlled invitations, access-grant API persona tests, and follow/block transactional commands before enabling posting.

## Execution checkpoint — 2026-10-20
- `npm run test:static`: four static SQL guardrail checks passed (RLS declarations, fail-closed publishing, no anonymous table read grant, no client table-write grant).
- These are **text inspections, not real PostgreSQL/RLS authorization tests**.
- `npm install` could not complete within the execution time limit; TypeScript and Android build remain unverified.
- No remote GitHub repository or Supabase project has been created or modified.
