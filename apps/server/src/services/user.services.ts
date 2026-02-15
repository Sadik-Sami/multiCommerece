import { db } from '@multiCommerece/db';
import * as schema from '@multiCommerece/db/schema/auth';
import { eq } from 'drizzle-orm';

export const allUsers = async (): Promise<schema.User[]> => {
	return await db.select().from(schema.user);
};

export const userById = async (id: string): Promise<schema.User | undefined> => {
	const user = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.id, id))
		.limit(1)
		.then((users) => users[0]);
	return user;
};

export const changeRole = async (userId: string, role: string): Promise<schema.User | undefined> => {
	const updatedUser = await db
		.update(schema.user)
		.set({ role })
		.where(eq(schema.user.id, userId))
		.returning()
		.then((users) => users[0]);
	return updatedUser;
};
