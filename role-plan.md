# Global Roles + Store Organizations (Better Auth + Drizzle)

## Summary
- Enable Better Auth admin plugin for global roles (admin/vendor/user), role changes, and bans.
- Enable Better Auth organization plugin to model stores and staff (organization/member/invitation tables plus session active-org fields).
- Add vendor approval metadata via user additional fields.
- Update schema and migrations via Better Auth CLI generate + Drizzle kit.

## Decisions Locked
- Single global role per user.
- Stores are modeled as organizations using default roles.
- Vendor approval fields: vendorStatus, vendorApprovedAt, vendorApprovedBy.
- Initial admins bootstrapped via adminUserIds.

## Milestone 0: Plan Doc
- [ ] Save this plan to role-plan.md (this file).

## Milestone 1: Auth Config + Env
- [ ] Add admin plugin with defaultRole "user", adminRoles ["admin"], adminUserIds from env.
- [ ] Add organization plugin and restrict org creation to vendors.
- [ ] Add user.additionalFields:
  - vendorStatus: enum [none, pending, approved, rejected, suspended], default none, input false
  - vendorApprovedAt: number (epoch ms), input false
  - vendorApprovedBy: string (admin user ID), input false
- [ ] Add ADMIN_USER_IDS to server env schema and .env.
- [ ] Document vendor approval state machine:
  - apply -> pending
  - approve -> set role=vendor + vendorApprovedAt/by
  - reject -> vendorStatus=rejected
  - suspend -> vendorStatus=suspended

## Milestone 2: Schema + Migrations
- [ ] Run Better Auth CLI schema generation:
  - pnpm dlx @better-auth/cli@latest generate --config packages/auth/src/index.ts --output packages/db/src/schema/better-auth.generated.ts
- [ ] Update Drizzle schema to include:
  - Admin fields on user/session
  - Organization tables (organization, member, invitation) and session active-org/team fields
  - Vendor approval fields on user
- [ ] Update schema exports/relations as needed.
- [ ] Generate and apply migrations:
  - pnpm --filter @multiCommerece/db db:generate
  - pnpm --filter @multiCommerece/db db:migrate

## Milestone 3: Client Setup
- [ ] Register adminClient + organizationClient plugins in auth client.
- [ ] Add inferAdditionalFields<typeof auth>() for typed vendor fields.
- [ ] Add helpers like isAdmin/isVendor for gating UI/routes.

## Milestone 4: Admin + Vendor Workflow Hooks
- [ ] Use admin endpoints to set role and ban/unban users.
- [ ] Wire vendor approval flow to update vendorStatus/vendorApprovedAt/vendorApprovedBy.

## End Goals
- Global role system live (admin/vendor/user).
- Vendor approval metadata available on user and typed in client/server.
- Stores modeled as organizations with staff management.
- Schema and migrations aligned with Better Auth + Drizzle docs.
