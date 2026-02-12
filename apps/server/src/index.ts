import { auth } from '@multiCommerece/auth';
import { env } from '@multiCommerece/env/server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { compress } from 'hono/compress';

import { errorHandler, notFound } from './middlewares';

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>({ strict: false });

// Logger middleware
app.use(logger());
// Compress middleware
app.use(compress({ encoding: 'gzip' }));
// CORS configuration (tightened for security)
app.use(
	'/*',
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
);

// Better-Auth - Handle all auth routes
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

// Home Route
app.get('/', (c) => {
	return c.json({
		message: 'MultiCommerce API is running',
	});
});

// Error Handler (improved to use err)
app.onError(errorHandler);
// Not Found Handler (standardized response)
app.notFound(notFound);

import { serve } from '@hono/node-server';

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
