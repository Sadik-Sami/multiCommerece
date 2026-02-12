import { db } from '@multiCommerece/db';
import type { Context } from 'hono';
import { eq } from 'drizzle-orm';
import * as schema from '@multiCommerece/db/schema/auth';

/**
 * @api {get} /users Get All Users
 * @apiGroup Users
 * @access Private
 */
export const getAllUsers = async (c: Context) => {
	const users = await db.select().from(schema.user);
	return c.json(users);
};

/**
 * @api {get} /users/:id Get Single User
 * @apiGroup Users
 * @access Private
 */
export const getUserById = async (c: Context) => {
	const id = c.req.param('id');
	const user = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.id, id))
		.limit(1)
		.then((users) => users[0]);
	if (!user) {
		return c.json(
			{
				success: false,
				message: 'User not found',
				error: `No user found with id ${id}`,
			},
			404,
		);
	}
	return c.json(user);
};
