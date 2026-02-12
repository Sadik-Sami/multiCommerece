import { db } from '@multiCommerece/db';
import * as schema from '@multiCommerece/db/schema/auth';
import { sendEmail, resetPasswordTemplate, verificationEmailTemplate } from '@multiCommerece/email';
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
		disableSignUp: false,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		autoSignIn: true,
		requireEmailVerification: false,
		// Password reset email
		sendResetPassword: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				subject: 'Reset your password',
				html: resetPasswordTemplate(url),
			});
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: 'none',
			secure: true,
			httpOnly: true,
		},
	},
	// Email verification
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				subject: 'Verify your email',
				html: verificationEmailTemplate(url),
			});
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 1000 * 60 * 60 * 24, // 24 hours
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
