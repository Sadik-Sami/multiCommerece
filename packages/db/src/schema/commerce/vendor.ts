import { sql } from "drizzle-orm";
import {
  boolean,
  json,
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../auth";
import {
  storeStatusEnum,
  vendorApplicationBusinessTypeEnum,
  vendorApplicationStatusEnum,
  vendorProfileStatusEnum,
} from "./enums";
import { tzTimestamp, withActorColumns, withAuditColumns } from "./shared";

export const vendorProfiles = pgTable(
  "vendor_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    status: vendorProfileStatusEnum("status").notNull().default("NONE"),
    approvedAt: tzTimestamp("approved_at"),
    approvedBy: text("approved_by").references(() => user.id, {
      onDelete: "set null",
    }),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    index("vendor_profiles_status_idx").on(table.status),
    index("vendor_profiles_approved_by_idx").on(table.approvedBy),
  ],
);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vendorId: uuid("vendor_id")
      .notNull()
      .unique()
      .references(() => vendorProfiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    bannerImage: text("banner_image"),
    logo: text("logo"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    location: text("location"),
    ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 }).notNull().default("0"),
    ratingCount: integer("rating_count").notNull().default(0),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: storeStatusEnum("status").notNull().default("DRAFT"),
    isActive: boolean("is_active").notNull().default(true),
    ...withAuditColumns(),
    ...withActorColumns(),
  },
  (table) => [
    uniqueIndex("stores_slug_uidx").on(sql`lower(${table.slug})`),
    index("stores_status_idx").on(table.status),
    index("stores_is_active_idx").on(table.isActive),
    check("stores_rating_avg_range_chk", sql`${table.ratingAvg} >= 0 AND ${table.ratingAvg} <= 5`),
    check("stores_rating_count_non_negative_chk", sql`${table.ratingCount} >= 0`),
  ],
);

export const vendorApplications = pgTable(
  "vendor_applications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    businessName: text("business_name"),
    businessType: vendorApplicationBusinessTypeEnum("business_type"),
    description: text("description"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    intendedCategories: json("intended_categories"),
    termsAccepted: boolean("terms_accepted").notNull().default(false),
    appliedAt: tzTimestamp("applied_at"),
    status: vendorApplicationStatusEnum("status").notNull().default("SUBMITTED"),
    reviewedBy: text("reviewed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewedAt: tzTimestamp("reviewed_at"),
    adminNote: text("admin_note"),
    ...withAuditColumns(),
  },
  (table) => [
    index("vendor_applications_user_id_idx").on(table.userId),
    index("vendor_applications_status_idx").on(table.status),
    index("vendor_applications_reviewed_by_idx").on(table.reviewedBy),
  ],
);
