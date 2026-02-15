import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '../schema/auth';

export const userRoles = ['admin', 'user', 'vendor'] as const;

export const userRoleSchema = z.enum(userRoles);

export const userSelectSchema = createSelectSchema(user, {
	role: () => userRoleSchema,
});

export const publicUserSelectSchema = userSelectSchema.omit({
	role: true,
	banned: true,
	banReason: true,
	banExpires: true,
});

export const userInsertSchema = createInsertSchema(user, {
	role: () => userRoleSchema,
});

export const userUpdateSchema = createUpdateSchema(user)
	.pick({
		name: true,
		email: true,
	})
	.required({
		name: true,
		email: true,
	});

const roleUpdateSchema = createUpdateSchema(user, {
	role: () => userRoleSchema,
})
	.pick({
		role: true,
	})
	.required({
		role: true,
	});

export const changeRoleSchema = roleUpdateSchema.extend({
	userId: z.string().min(1, 'User id is required'),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserSelect = z.infer<typeof userSelectSchema>;
export type PublicUserSelect = z.infer<typeof publicUserSelectSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
