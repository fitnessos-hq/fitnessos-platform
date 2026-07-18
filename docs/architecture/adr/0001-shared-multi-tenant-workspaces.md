# ADR-0001: Shared multi-tenant workspaces

- **Status:** Accepted
- **Date:** 2026-07-18
- **Related issue:** fitnessos-platform#11

## Context

The original Sprint 0 foundation assumed one independent Supabase project per managed coach. The coach owner's authenticated user ID also represented the coaching business, team membership used the coach profile as the tenant boundary, and a singleton constraint allowed only one coach business per project.

FitnessOS is now being built primarily as a managed subscription SaaS. Standard Cloud customers must share a centrally operated platform while remaining strongly isolated.

## Decision

FitnessOS adopts a shared multi-tenant workspace architecture.

### Platform environments

Development, Staging, and Production each use one application deployment and one Supabase project. Every environment may contain multiple coaching-business workspaces.

### Identity and membership

A coaching business is represented by a `workspace` with an independently generated UUID.

A user's authenticated ID is never the workspace ID. Users receive access through explicit `workspace_memberships`. One user may belong to multiple workspaces, and one workspace may contain multiple users.

### Tenant boundary

Every tenant-owned business table must contain:

```sql
workspace_id uuid not null
```

Foreign keys, indexes, Row Level Security, server-side authorization, and automated negative tests must enforce the boundary.

### MVP authentication actors

Permanent Supabase Auth accounts are limited to coach owners, authorized team members, and explicit FitnessOS platform staff.

Leads, contacts, clients, and trainees are workspace-owned records. They use WhatsApp and secure purpose-limited links during the MVP. A future client portal is a separate product decision.

### Deployment variants

FitnessOS maintains one core codebase and one compatible schema:

- Cloud: many RLS-isolated workspaces in shared FitnessOS-managed infrastructure.
- Dedicated Managed: the same release and schema in separate FitnessOS-managed infrastructure.
- Self-hosted: the same release and schema in customer-controlled infrastructure under a separate enterprise agreement.

Dedicated and self-hosted deployments do not introduce a singleton-workspace constraint or an unmanaged customer-specific fork.

## Superseded decision

This ADR supersedes the former design of one independent Supabase project and one enforced coach profile per managed coach.

Historical migrations may retain the old implementation as an audit trail, but forward migrations and all new product work must follow the workspace model.

## Security invariants

1. Authentication proves user identity; membership grants tenant access.
2. No tenant query may rely on `workspace_id = auth.uid()`.
3. Cross-workspace reads and writes must fail safely.
4. Ownership changes must be explicit and protected from self-promotion.
5. FitnessOS platform roles remain separate from workspace roles.
6. Service-role credentials must never reach browser code.
7. Public client links must be purpose-limited, expiring, revocable, rate-limited, and auditable.
8. Webhooks and automations resolve workspace context through trusted integration mappings.
9. Every new tenant table requires automated isolation tests.

## Consequences

- Cloud customers are provisioned as workspaces rather than infrastructure projects.
- Releases and migrations are centralized.
- Team users can belong to the correct business independently of their user ID.
- Dedicated and self-hosted offers reuse the core product.
- RLS and tenant-isolation testing become mandatory release controls.

## Implementation sequence

1. Create workspace and membership tables.
2. Migrate legacy coach profiles and team memberships.
3. Rebuild RLS and authorization helpers.
4. Make onboarding transactional and server-controlled.
5. Resolve the active workspace independently from user ID.
6. Refactor dashboard and team-member routing.
7. Validate isolation, migration parity, recovery, and deployed Staging.
