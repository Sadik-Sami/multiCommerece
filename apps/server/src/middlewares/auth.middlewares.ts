import type { Context, Next } from 'hono';
import { auth } from '@multiCommerece/auth';

export const authenticate = async (c: Context, next: Next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session || !session.user) {
		return c.json(
			{
				success: false,
				message: 'Unauthorized',
				error: 'No valid session found',
			},
			401,
		);
	}

	console.log(session.user);

	c.set('user', session.user);
	c.set('session', session.session);

	await next();
};

export const authorize = async (c: Context, next: Next, ...allowedRoles: string[]) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session || !session.user) {
		return c.json(
			{
				success: false,
				message: 'Unauthorized',
				error: 'No valid session found',
			},
			401,
		);
	}

	const userRole = session.user.role;

	if (!userRole) {
		return c.json(
			{
				success: false,
				message: 'Forbidden',
				error: 'User role is missing',
			},
			403,
		);
	}

	if (!allowedRoles.includes(userRole)) {
		return c.json(
			{
				success: false,
				message: 'Forbidden',
				error: 'User does not have the required role',
			},
			403,
		);
	}

	console.log(session.user);

	c.set('user', session.user);
	c.set('session', session.session);

	await next();
};
