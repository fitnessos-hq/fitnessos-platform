# FitnessOS Platform

FitnessOS is a secure, shared multi-tenant operating system for online fitness coaching businesses.

## Approved tenancy model

FitnessOS Cloud uses one application release and one Supabase project per platform environment:

- Development contains multiple isolated test workspaces.
- Staging contains multiple isolated staging workspaces.
- Production will contain multiple isolated customer workspaces.
- Each coaching business is represented by an independent workspace.
- Every tenant-owned business record must contain a non-null `workspace_id`.
- Row Level Security and server-side authorization enforce workspace isolation.

An authenticated user ID identifies a person, not a tenant. Users gain access through explicit `workspace_memberships`, and one user may belong to multiple workspaces.

## Deployment variants

- **FitnessOS Cloud:** shared application and database environment containing many isolated workspaces.
- **Dedicated Managed:** the same core release and compatible schema in separate FitnessOS-managed infrastructure.
- **Self-hosted:** the same core release and compatible schema in customer-controlled infrastructure under an enterprise agreement.

Dedicated and self-hosted deployments do not require a customer-specific code fork or a singleton-workspace schema.

## MVP actors

Permanent Supabase Auth accounts are limited to:

- Coach owners
- Authorized coaching-team members
- Explicit FitnessOS platform staff

Leads, contacts, clients, and trainees are workspace-owned business records. During the MVP they interact through WhatsApp and secure purpose-limited forms or links; they do not receive permanent FitnessOS platform accounts.

## Architecture documentation

- [ADR-0001: Shared multi-tenant workspaces](docs/architecture/adr/0001-shared-multi-tenant-workspaces.md)
- [Tenancy model](docs/architecture/tenancy-model.md)
- [Sprint 1 foundation contract](docs/sprint-1-foundation-contract.md)

## Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Supabase
- Isolated Development, Staging, and Production platform environments

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Never commit `.env.local`, service-role credentials, access tokens, customer secrets, or production keys.
