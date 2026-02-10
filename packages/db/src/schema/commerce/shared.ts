import { numeric, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";

export const tzTimestamp = (name: string) => timestamp(name, { withTimezone: true });

export const withAuditColumns = () => ({
  createdAt: tzTimestamp("created_at").defaultNow().notNull(),
  updatedAt: tzTimestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const withActorColumns = () => ({
  createdByUserId: text("created_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  updatedByUserId: text("updated_by_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
});

export const amount = (name: string) => numeric(name, { precision: 12, scale: 2 });
