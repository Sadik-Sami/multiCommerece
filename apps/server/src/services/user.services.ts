import { db } from '@multiCommerece/db';
import * as schema from '@multiCommerece/db/schema/auth';
// import { eq } from 'drizzle-orm';

export const getAllUsers = async (): Promise<schema.User[]> => {
	return await db.select().from(schema.user);
};
