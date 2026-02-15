import type { Context } from 'hono';
import { allUsers, changeRole, userById } from '@/services';

/**
 * @api {get} /users Get All Users
 * @apiGroup Users
 * @access Private
 */
export const getAllUsers = async (c: Context) => {
	const users = await allUsers();
	return c.json(users);
};

/**
 * @api {get} /users/:id Get Single User
 * @apiGroup Users
 * @access Private
 */
export const getUserById = async (c: Context) => {
	const id = c.req.param('id');
	const user = await userById(id);
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

export const updateRole = async (c: Context) => {
	const { userId, role }: { userId: string; role: string } = await c.req.json();
	const updatedUser = await changeRole(userId, role);
	if (!updatedUser) {
		return c.json(
			{
				success: false,
				message: 'User not found',
				error: `No user found with id ${userId}`,
			},
			404,
		);
	}
	return c.json(updatedUser);
};
