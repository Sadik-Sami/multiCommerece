import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../auth";
import { orderStatusEnum, paymentStatusEnum, vendorOrderStatusEnum } from "./enums";
import { amount, tzTimestamp, withActorColumns, withAuditColumns } from "./shared";
import { storeProducts } from "./catalog";
import { stores, vendorProfiles } from "./vendor";

export const carts = pgTable(
  "carts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    ...withAuditColumns(),
  },
  (table) => [index("carts_user_id_idx").on(table.userId)],
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    storeProductId: uuid("store_product_id")
      .notNull()
      .references(() => storeProducts.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    priceSnapshot: amount("price_snapshot").notNull(),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
    updatedAt: tzTimestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("cart_items_cart_store_product_uidx").on(table.cartId, table.storeProductId),
    index("cart_items_store_product_id_idx").on(table.storeProductId),
    check("cart_items_quantity_positive_chk", sql`${table.quantity} > 0`),
    check("cart_items_price_snapshot_non_negative_chk", sql`${table.priceSnapshot} >= 0`),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    totalAmount: amount("total_amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("PENDING"),
    orderStatus: orderStatusEnum("order_status").notNull().default("PLACED"),
    paymentIntentId: text("payment_intent_id"),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_order_status_idx").on(table.orderStatus),
    check("orders_total_amount_non_negative_chk", sql`${table.totalAmount} >= 0`),
    check("orders_currency_format_chk", sql`${table.currency} ~ '^[A-Z]{3}$'`),
  ],
);

export const vendorOrders = pgTable(
  "vendor_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendorProfiles.id, { onDelete: "cascade" }),
    subtotal: amount("subtotal").notNull(),
    platformFee: amount("platform_fee").notNull().default("0"),
    vendorEarning: amount("vendor_earning").notNull(),
    status: vendorOrderStatusEnum("status").notNull().default("RECEIVED"),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    uniqueIndex("vendor_orders_order_store_uidx").on(table.orderId, table.storeId),
    index("vendor_orders_vendor_id_idx").on(table.vendorId),
    index("vendor_orders_status_idx").on(table.status),
    check("vendor_orders_subtotal_non_negative_chk", sql`${table.subtotal} >= 0`),
    check("vendor_orders_platform_fee_non_negative_chk", sql`${table.platformFee} >= 0`),
    check("vendor_orders_vendor_earning_non_negative_chk", sql`${table.vendorEarning} >= 0`),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vendorOrderId: uuid("vendor_order_id")
      .notNull()
      .references(() => vendorOrders.id, { onDelete: "cascade" }),
    storeProductId: uuid("store_product_id")
      .notNull()
      .references(() => storeProducts.id, { onDelete: "cascade" }),
    productSnapshot: jsonb("product_snapshot").notNull(),
    priceAtPurchase: amount("price_at_purchase").notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: tzTimestamp("created_at").defaultNow().notNull(),
    updatedAt: tzTimestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdByUserId: text("created_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    updatedByUserId: text("updated_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    uniqueIndex("order_items_vendor_order_store_product_uidx").on(
      table.vendorOrderId,
      table.storeProductId,
    ),
    index("order_items_store_product_id_idx").on(table.storeProductId),
    check("order_items_quantity_positive_chk", sql`${table.quantity} > 0`),
    check("order_items_price_at_purchase_non_negative_chk", sql`${table.priceAtPurchase} >= 0`),
  ],
);
