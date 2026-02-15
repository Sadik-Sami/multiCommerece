import type { Context } from 'hono';
import { z, ZodError } from 'zod';

export function validateData(schema: z.ZodObject<any, any>, c: Context) {
	return (data: z.infer<typeof schema>) => {
		try {
			return schema.parse(data);
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.issues.map((issue: any) => ({
					message: `${issue.path.join('.')}: ${issue.message}`,
				}));
				c.status(400);
				c.json({ errors: errorMessages });
			} else {
				c.status(500);
				c.json({ errors: [{ message: 'Internal server error' }] });
			}
			throw error;
		}
	};
}
