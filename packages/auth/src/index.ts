import { db } from '@multiCommerece/db';
import * as schema from '@multiCommerece/db/schema/auth';
import { env } from '@multiCommerece/env/server';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, organization } from 'better-auth/plugins';

export const GlobalRoles = ['admin', 'vendor', 'user'] as const;
export type GlobalRole = (typeof GlobalRoles)[number];

const adminUserIds =
	env.ADMIN_USER_IDS?.split(',')
		.map((id) => id.trim())
		.filter(Boolean) ?? [];

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema,
	}),
	trustedOrigins: [env.CORS_ORIGIN],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: 'none',
			secure: true,
			httpOnly: true,
		},
	},
	user: {
		additionalFields: {
			vendorStatus: {
				type: ['none', 'pending', 'approved', 'rejected', 'suspended'],
				defaultValue: 'none',
				input: false,
			},
			vendorApprovedAt: {
				type: 'number',
				input: false,
			},
			vendorApprovedBy: {
				type: 'string',
				input: false,
			},
		},
	},
	plugins: [
		admin({
			defaultRole: 'user',
			adminRoles: ['admin'],
			adminUserIds,
		}),
		organization({
			allowUserToCreateOrganization: (user) => user.role === 'vendor',
		}),
	],
});
