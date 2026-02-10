import { sql } from "drizzle-orm";
import { check, index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { user } from "../auth";
import {
  payoutProviderEnum,
  payoutStatusEnum,
  refundStatusEnum,
} from "./enums";
import { orders, vendorOrders } from "./checkout";
import { amount, tzTimestamp } from "./shared";
import { vendorProfiles } from "./vendor";

export const refunds = pgTable(
  "refunds",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    vendorOrderId: uuid("vendor_order_id")
      .notNull()
      .references(() => vendorOrders.id, { onDelete: "cascade" }),
    amount: amount("amount").notNull(),
    reason: text("reason"),
    status: refundStatusEnum("status").notNull().default("REQUESTED"),
    paymentRefundId: text("payment_refund_id"),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
    processedAt: tzTimestamp("processed_at"),
    createdByUserId: text("created_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    updatedByUserId: text("updated_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("refunds_order_id_idx").on(table.orderId),
    index("refunds_vendor_order_id_idx").on(table.vendorOrderId),
    index("refunds_status_idx").on(table.status),
    check("refunds_amount_non_negative_chk", sql`${table.amount} >= 0`),
  ],
);

export const payouts = pgTable(
  "payouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendorProfiles.id, { onDelete: "cascade" }),
    vendorOrderId: uuid("vendor_order_id")
      .notNull()
      .unique()
      .references(() => vendorOrders.id, { onDelete: "cascade" }),
    amount: amount("amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    payoutStatus: payoutStatusEnum("payout_status").notNull().default("PENDING"),
    payoutProvider: payoutProviderEnum("payout_provider").notNull().default("STRIPE"),
    payoutReference: text("payout_reference"),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
    paidAt: tzTimestamp("paid_at"),
    createdByUserId: text("created_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    updatedByUserId: text("updated_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("payouts_vendor_id_idx").on(table.vendorId),
    index("payouts_status_idx").on(table.payoutStatus),
    check("payouts_amount_non_negative_chk", sql`${table.amount} >= 0`),
    check("payouts_currency_format_chk", sql`${table.currency} ~ '^[A-Z]{3}$'`),
  ],
);
