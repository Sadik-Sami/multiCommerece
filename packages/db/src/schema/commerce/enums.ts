import { pgEnum } from "drizzle-orm/pg-core";

export const vendorProfileStatusEnum = pgEnum("vendor_profile_status", [
  "NONE",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
]);

export const vendorApplicationBusinessTypeEnum = pgEnum(
  "vendor_application_business_type",
  ["INDIVIDUAL", "COMPANY"],
);

export const vendorApplicationStatusEnum = pgEnum("vendor_application_status", [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
]);

export const storeStatusEnum = pgEnum("store_status", [
  "DRAFT",
  "UNDER_REVIEW",
  "ACTIVE",
  "SUSPENDED",
]);

export const categoryStatusEnum = pgEnum("category_status", ["ACTIVE", "PENDING"]);

export const categoryCreatedByEnum = pgEnum("category_created_by", [
  "ADMIN",
  "VENDOR",
]);

export const productStatusEnum = pgEnum("product_status", ["ACTIVE", "DISABLED"]);

export const storeProductStatusEnum = pgEnum("store_product_status", [
  "DRAFT",
  "PENDING",
  "ACTIVE",
  "REJECTED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PLACED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

export const vendorOrderStatusEnum = pgEnum("vendor_order_status", [
  "RECEIVED",
  "PACKAGING",
  "SHIPPED",
  "DELIVERED",
]);

export const discountTypeEnum = pgEnum("discount_type", ["PERCENT", "FIXED"]);

export const couponStatusEnum = pgEnum("coupon_status", [
  "DRAFT",
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "DISABLED",
]);

export const ticketTypeEnum = pgEnum("ticket_type", [
  "ORDER",
  "PRODUCT",
  "BEHAVIOR",
  "PAYMENT",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "OPEN",
  "UNDER_REVIEW",
  "IN_CHAT",
  "RESOLVED",
  "CLOSED",
]);

export const refundStatusEnum = pgEnum("refund_status", [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "PROCESSED",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
  "PENDING",
  "PAID",
  "FAILED",
]);

export const payoutProviderEnum = pgEnum("payout_provider", ["STRIPE"]);

export const auditPanelEnum = pgEnum("audit_panel", ["ADMIN", "VENDOR", "SYSTEM"]);
