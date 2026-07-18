# Sprint 1 foundation contract

Sprint 1 may begin only after Sprint 0R exit criteria are satisfied.

## Tenant boundary

Every Sprint 1 tenant-owned table must use:

```sql
workspace_id uuid not null references public.workspaces(id)
```

Required indexes, foreign keys, Row Level Security, and automated isolation tests accompany each table.

No Sprint 1 implementation may use `workspace_id = auth.uid()` or `coach_profile_id = auth.uid()`.

## Initial business records

Leads, contacts, sources, conversations, notes, and tasks are workspace-owned records. Clients and trainees are not Supabase Auth users and are not `workspace_memberships`.

## Request context

Authenticated requests resolve an active workspace membership before querying tenant data.

Unauthenticated WhatsApp and webhook requests resolve the workspace through trusted integration configuration. A caller-provided workspace ID is never sufficient authorization.

## Definition of ready

- Workspace schema exists.
- Legacy migration is validated.
- Workspace-aware RLS policies pass negative tests.
- Atomic onboarding exists.
- Workspace resolver and dashboard routing work for owners and team members.
- Development and Staging migration histories match.
- Recovery validation covers the new tenant schema.
- Deployed Staging proves isolation between at least two workspaces.