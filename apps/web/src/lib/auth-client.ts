import { env } from "@multiCommerece/env/web";
import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import type { auth } from "@multiCommerece/auth";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [adminClient(), organizationClient()],
});

type SessionUser = (typeof authClient.$Infer.Session)["user"];

export const isAdmin = (user?: SessionUser | null) => user?.role === "admin";
export const isVendor = (user?: SessionUser | null) => user?.role === "vendor";
