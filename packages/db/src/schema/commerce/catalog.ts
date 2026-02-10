import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  categoryCreatedByEnum,
  categoryStatusEnum,
  couponStatusEnum,
  discountTypeEnum,
  productStatusEnum,
  storeProductStatusEnum,
} from "./enums";
import { amount, withActorColumns, withAuditColumns, tzTimestamp } from "./shared";
import { stores } from "./vendor";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    parentId: uuid("parent_id"),
    status: categoryStatusEnum("status").notNull().default("PENDING"),
    createdBy: categoryCreatedByEnum("created_by").notNull(),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "categories_parent_id_categories_id_fk",
    }).onDelete("cascade"),
    uniqueIndex("categories_slug_uidx").on(sql`lower(${table.slug})`),
    index("categories_parent_id_idx").on(table.parentId),
    index("categories_status_idx").on(table.status),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    description: text("description"),
    specs: jsonb("specs").notNull().default(sql`'{}'::jsonb`),
    images: jsonb("images").notNull().default(sql`'[]'::jsonb`),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: productStatusEnum("status").notNull().default("ACTIVE"),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    uniqueIndex("products_slug_uidx").on(sql`lower(${table.slug})`),
    index("products_category_id_idx").on(table.categoryId),
    index("products_status_idx").on(table.status),
  ],
);

export const storeProducts = pgTable(
  "store_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    price: amount("price").notNull(),
    compareAtPrice: amount("compare_at_price"),
    stock: integer("stock").notNull().default(0),
    sku: text("sku"),
    status: storeProductStatusEnum("status").notNull().default("DRAFT"),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    uniqueIndex("store_products_store_product_uidx").on(table.storeId, table.productId),
    uniqueIndex("store_products_store_sku_uidx")
      .on(table.storeId, sql`lower(${table.sku})`)
      .where(sql`${table.sku} IS NOT NULL`),
    index("store_products_status_idx").on(table.status),
    check("store_products_stock_non_negative_chk", sql`${table.stock} >= 0`),
    check("store_products_price_non_negative_chk", sql`${table.price} >= 0`),
    check(
      "store_products_compare_at_price_non_negative_chk",
      sql`${table.compareAtPrice} IS NULL OR ${table.compareAtPrice} >= 0`,
    ),
  ],
);

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: amount("discount_value").notNull(),
    maxUsage: integer("max_usage").notNull().default(0),
    usedCount: integer("used_count").notNull().default(0),
    validFrom: tzTimestamp("valid_from"),
    validUntil: tzTimestamp("valid_until"),
    status: couponStatusEnum("status").notNull().default("DRAFT"),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    uniqueIndex("coupons_store_code_uidx").on(table.storeId, sql`lower(${table.code})`),
    index("coupons_status_idx").on(table.status),
    check("coupons_discount_value_non_negative_chk", sql`${table.discountValue} >= 0`),
    check("coupons_max_usage_non_negative_chk", sql`${table.maxUsage} >= 0`),
    check("coupons_used_count_non_negative_chk", sql`${table.usedCount} >= 0`),
    check("coupons_usage_consistency_chk", sql`${table.usedCount} <= ${table.maxUsage}`),
    check(
      "coupons_valid_window_chk",
      sql`${table.validFrom} IS NULL OR ${table.validUntil} IS NULL OR ${table.validFrom} <= ${table.validUntil}`,
    ),
  ],
);
