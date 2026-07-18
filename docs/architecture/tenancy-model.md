# FitnessOS tenancy model

## Core entities

- A profile represents a human platform user and maps one-to-one to `auth.users`.
- A workspace represents one coaching business and has an independent UUID.
- A workspace membership grants a user a role inside a workspace.
- Platform staff authorization is separate from customer workspace membership.
- Leads, contacts, clients, and trainees are workspace-owned business records, not permanent authenticated users during the MVP.

## Data ownership contract

Every tenant-owned table must contain a non-null `workspace_id`.

Examples include leads, contacts, clients, conversations, messages, notes, tasks, subscriptions, payments, forms, assessments, plans, check-ins, measurements, renewals, workflow jobs, notification outbox records, and audit events.

## Authorization flow

1. Authenticate the user.
2. Resolve active workspace memberships.
3. Select only an authorized workspace.
4. Apply the role permission.
5. Execute a workspace-scoped query protected by RLS.

Cookies, routes, forms, API bodies, webhook payloads, and automation inputs are untrusted selectors and never grant access by themselves.

## RLS contract

Tenant policies must use reusable workspace-membership helpers. Every tenant table requires RLS, operation policies, indexes, foreign keys, and positive and negative isolation tests.

## Deployment variants

Cloud uses one deployment and one Supabase project per environment with many isolated workspaces.

Dedicated Managed and Self-hosted use the same compatible release and schema in separate infrastructure. Customization uses settings, branding, entitlements, feature flags, integration configuration, and approved extension points rather than a permanent code fork.

## Automation context

Every event or automation invocation must carry or resolve `workspace_id`, event ID, actor ID when applicable, source, occurrence timestamp, idempotency key, and schema version.

Unauthenticated inbound channels resolve the workspace through trusted mappings such as the configured WhatsApp account or phone number.

## Client interaction boundary

MVP clients interact through WhatsApp and secure onboarding, assessment, and check-in links. Public tokens must be unguessable, purpose-limited, workspace-bound, expiring, revocable, rate-limited, and audited.
