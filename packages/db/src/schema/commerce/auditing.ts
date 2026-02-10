import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { auditPanelEnum } from "./enums";
import { tzTimestamp } from "./shared";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: text("actor_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    panel: auditPanelEnum("panel").notNull(),
    action: text("action").notNull(),
    targetTable: text("target_table").notNull(),
    targetId: uuid("target_id"),
    requestId: text("request_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_actor_user_id_idx").on(table.actorUserId),
    index("audit_logs_panel_idx").on(table.panel),
    index("audit_logs_target_idx").on(table.targetTable, table.targetId),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ],
);
