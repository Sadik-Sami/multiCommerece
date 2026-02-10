import { index, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { ticketStatusEnum, ticketTypeEnum } from "./enums";
import { tzTimestamp, withAuditColumns } from "./shared";
import { orders, vendorOrders } from "./checkout";
import { vendorProfiles } from "./vendor";

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    againstVendorId: uuid("against_vendor_id")
      .notNull()
      .references(() => vendorProfiles.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
    vendorOrderId: uuid("vendor_order_id").references(() => vendorOrders.id, {
      onDelete: "cascade",
    }),
    type: ticketTypeEnum("type").notNull(),
    status: ticketStatusEnum("status").notNull().default("OPEN"),
    subject: text("subject").notNull(),
    description: text("description"),
    ...withAuditColumns(),
    updatedByUserId: text("updated_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("tickets_created_by_user_id_idx").on(table.createdByUserId),
    index("tickets_against_vendor_id_idx").on(table.againstVendorId),
    index("tickets_status_idx").on(table.status),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ticketId: uuid("ticket_id")
      .notNull()
      .unique()
      .references(() => tickets.id, { onDelete: "cascade" }),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("conversations_ticket_id_idx").on(table.ticketId)],
);

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      name: "conversation_participants_pkey",
      columns: [table.conversationId, table.userId],
    }),
    index("conversation_participants_user_id_idx").on(table.userId),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    readAt: tzTimestamp("read_at"),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("messages_conversation_id_idx").on(table.conversationId),
    index("messages_sender_id_idx").on(table.senderId),
    index("messages_created_at_idx").on(table.createdAt),
  ],
);
