CREATE TYPE "public"."audit_panel" AS ENUM('ADMIN', 'VENDOR', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."category_created_by" AS ENUM('ADMIN', 'VENDOR');--> statement-breakpoint
CREATE TYPE "public"."category_status" AS ENUM('ACTIVE', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."coupon_status" AS ENUM('DRAFT', 'PENDING', 'ACTIVE', 'EXPIRED', 'DISABLED');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('PERCENT', 'FIXED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PLACED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."payout_provider" AS ENUM('STRIPE');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('PENDING', 'PAID', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('ACTIVE', 'DISABLED');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('REQUESTED', 'APPROVED', 'REJECTED', 'PROCESSED');--> statement-breakpoint
CREATE TYPE "public"."store_product_status" AS ENUM('DRAFT', 'PENDING', 'ACTIVE', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."store_status" AS ENUM('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('OPEN', 'UNDER_REVIEW', 'IN_CHAT', 'RESOLVED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."ticket_type" AS ENUM('ORDER', 'PRODUCT', 'BEHAVIOR', 'PAYMENT');--> statement-breakpoint
CREATE TYPE "public"."vendor_application_business_type" AS ENUM('INDIVIDUAL', 'COMPANY');--> statement-breakpoint
CREATE TYPE "public"."vendor_application_status" AS ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."vendor_order_status" AS ENUM('RECEIVED', 'PACKAGING', 'SHIPPED', 'DELIVERED');--> statement-breakpoint
CREATE TYPE "public"."vendor_profile_status" AS ENUM('NONE', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"inviter_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"impersonated_by" text,
	"active_organization_id" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"city" text,
	"country" text,
	"street" text,
	"zip_code" text,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" text,
	"panel" "audit_panel" NOT NULL,
	"action" text NOT NULL,
	"target_table" text NOT NULL,
	"target_id" uuid,
	"request_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parent_id" uuid,
	"status" "category_status" DEFAULT 'PENDING' NOT NULL,
	"created_by" "category_created_by" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"code" text NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"discount_value" numeric(12, 2) NOT NULL,
	"max_usage" integer DEFAULT 0 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"status" "coupon_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "coupons_discount_value_non_negative_chk" CHECK ("coupons"."discount_value" >= 0),
	CONSTRAINT "coupons_max_usage_non_negative_chk" CHECK ("coupons"."max_usage" >= 0),
	CONSTRAINT "coupons_used_count_non_negative_chk" CHECK ("coupons"."used_count" >= 0),
	CONSTRAINT "coupons_usage_consistency_chk" CHECK ("coupons"."used_count" <= "coupons"."max_usage"),
	CONSTRAINT "coupons_valid_window_chk" CHECK ("coupons"."valid_from" IS NULL OR "coupons"."valid_until" IS NULL OR "coupons"."valid_from" <= "coupons"."valid_until")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category_id" uuid NOT NULL,
	"description" text,
	"specs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"status" "product_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text
);
--> statement-breakpoint
CREATE TABLE "store_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"compare_at_price" numeric(12, 2),
	"stock" integer DEFAULT 0 NOT NULL,
	"sku" text,
	"status" "store_product_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "store_products_stock_non_negative_chk" CHECK ("store_products"."stock" >= 0),
	CONSTRAINT "store_products_price_non_negative_chk" CHECK ("store_products"."price" >= 0),
	CONSTRAINT "store_products_compare_at_price_non_negative_chk" CHECK ("store_products"."compare_at_price" IS NULL OR "store_products"."compare_at_price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"store_product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price_snapshot" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_quantity_positive_chk" CHECK ("cart_items"."quantity" > 0),
	CONSTRAINT "cart_items_price_snapshot_non_negative_chk" CHECK ("cart_items"."price_snapshot" >= 0)
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "carts_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_order_id" uuid NOT NULL,
	"store_product_id" uuid NOT NULL,
	"product_snapshot" jsonb NOT NULL,
	"price_at_purchase" numeric(12, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "order_items_quantity_positive_chk" CHECK ("order_items"."quantity" > 0),
	CONSTRAINT "order_items_price_at_purchase_non_negative_chk" CHECK ("order_items"."price_at_purchase" >= 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"order_status" "order_status" DEFAULT 'PLACED' NOT NULL,
	"payment_intent_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "orders_total_amount_non_negative_chk" CHECK ("orders"."total_amount" >= 0),
	CONSTRAINT "orders_currency_format_chk" CHECK ("orders"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "vendor_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"platform_fee" numeric(12, 2) DEFAULT '0' NOT NULL,
	"vendor_earning" numeric(12, 2) NOT NULL,
	"status" "vendor_order_status" DEFAULT 'RECEIVED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "vendor_orders_subtotal_non_negative_chk" CHECK ("vendor_orders"."subtotal" >= 0),
	CONSTRAINT "vendor_orders_platform_fee_non_negative_chk" CHECK ("vendor_orders"."platform_fee" >= 0),
	CONSTRAINT "vendor_orders_vendor_earning_non_negative_chk" CHECK ("vendor_orders"."vendor_earning" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"vendor_order_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"payout_status" "payout_status" DEFAULT 'PENDING' NOT NULL,
	"payout_provider" "payout_provider" DEFAULT 'STRIPE' NOT NULL,
	"payout_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "payouts_vendor_order_id_unique" UNIQUE("vendor_order_id"),
	CONSTRAINT "payouts_amount_non_negative_chk" CHECK ("payouts"."amount" >= 0),
	CONSTRAINT "payouts_currency_format_chk" CHECK ("payouts"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"vendor_order_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"reason" text,
	"status" "refund_status" DEFAULT 'REQUESTED' NOT NULL,
	"payment_refund_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "refunds_amount_non_negative_chk" CHECK ("refunds"."amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "conversation_participants" (
	"conversation_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conversation_participants_pkey" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conversations_ticket_id_unique" UNIQUE("ticket_id")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by_user_id" text NOT NULL,
	"against_vendor_id" uuid NOT NULL,
	"order_id" uuid,
	"vendor_order_id" uuid,
	"type" "ticket_type" NOT NULL,
	"status" "ticket_status" DEFAULT 'OPEN' NOT NULL,
	"subject" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by_user_id" text
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"banner_image" text,
	"logo" text,
	"contact_email" text,
	"contact_phone" text,
	"location" text,
	"rating_avg" numeric(3, 2) DEFAULT '0' NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"status" "store_status" DEFAULT 'DRAFT' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "stores_vendor_id_unique" UNIQUE("vendor_id"),
	CONSTRAINT "stores_rating_avg_range_chk" CHECK ("stores"."rating_avg" >= 0 AND "stores"."rating_avg" <= 5),
	CONSTRAINT "stores_rating_count_non_negative_chk" CHECK ("stores"."rating_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "vendor_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_name" text,
	"business_type" "vendor_application_business_type",
	"description" text,
	"contact_email" text,
	"contact_phone" text,
	"intended_categories" json,
	"terms_accepted" boolean DEFAULT false NOT NULL,
	"applied_at" timestamp with time zone,
	"status" "vendor_application_status" DEFAULT 'SUBMITTED' NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"status" "vendor_profile_status" DEFAULT 'NONE' NOT NULL,
	"approved_at" timestamp with time zone,
	"approved_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	CONSTRAINT "vendor_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_store_product_id_store_products_id_fk" FOREIGN KEY ("store_product_id") REFERENCES "public"."store_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_vendor_order_id_vendor_orders_id_fk" FOREIGN KEY ("vendor_order_id") REFERENCES "public"."vendor_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_store_product_id_store_products_id_fk" FOREIGN KEY ("store_product_id") REFERENCES "public"."store_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_orders" ADD CONSTRAINT "vendor_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_orders" ADD CONSTRAINT "vendor_orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_orders" ADD CONSTRAINT "vendor_orders_vendor_id_vendor_profiles_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_orders" ADD CONSTRAINT "vendor_orders_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_orders" ADD CONSTRAINT "vendor_orders_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_vendor_id_vendor_profiles_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_vendor_order_id_vendor_orders_id_fk" FOREIGN KEY ("vendor_order_id") REFERENCES "public"."vendor_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_vendor_order_id_vendor_orders_id_fk" FOREIGN KEY ("vendor_order_id") REFERENCES "public"."vendor_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_against_vendor_id_vendor_profiles_id_fk" FOREIGN KEY ("against_vendor_id") REFERENCES "public"."vendor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_vendor_order_id_vendor_orders_id_fk" FOREIGN KEY ("vendor_order_id") REFERENCES "public"."vendor_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_vendor_id_vendor_profiles_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_applications" ADD CONSTRAINT "vendor_applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_applications" ADD CONSTRAINT "vendor_applications_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_user_id_idx" ON "audit_logs" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_panel_idx" ON "audit_logs" USING btree ("panel");--> statement-breakpoint
CREATE INDEX "audit_logs_target_idx" ON "audit_logs" USING btree ("target_table","target_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_uidx" ON "categories" USING btree (lower("slug"));--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "coupons_store_code_uidx" ON "coupons" USING btree ("store_id",lower("code"));--> statement-breakpoint
CREATE INDEX "coupons_status_idx" ON "coupons" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_uidx" ON "products" USING btree (lower("slug"));--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "store_products_store_product_uidx" ON "store_products" USING btree ("store_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "store_products_store_sku_uidx" ON "store_products" USING btree ("store_id",lower("sku")) WHERE "store_products"."sku" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "store_products_status_idx" ON "store_products" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "cart_items_cart_store_product_uidx" ON "cart_items" USING btree ("cart_id","store_product_id");--> statement-breakpoint
CREATE INDEX "cart_items_store_product_id_idx" ON "cart_items" USING btree ("store_product_id");--> statement-breakpoint
CREATE INDEX "carts_user_id_idx" ON "carts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_vendor_order_store_product_uidx" ON "order_items" USING btree ("vendor_order_id","store_product_id");--> statement-breakpoint
CREATE INDEX "order_items_store_product_id_idx" ON "order_items" USING btree ("store_product_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_payment_status_idx" ON "orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "orders_order_status_idx" ON "orders" USING btree ("order_status");--> statement-breakpoint
CREATE UNIQUE INDEX "vendor_orders_order_store_uidx" ON "vendor_orders" USING btree ("order_id","store_id");--> statement-breakpoint
CREATE INDEX "vendor_orders_vendor_id_idx" ON "vendor_orders" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendor_orders_status_idx" ON "vendor_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payouts_vendor_id_idx" ON "payouts" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "payouts_status_idx" ON "payouts" USING btree ("payout_status");--> statement-breakpoint
CREATE INDEX "refunds_order_id_idx" ON "refunds" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "refunds_vendor_order_id_idx" ON "refunds" USING btree ("vendor_order_id");--> statement-breakpoint
CREATE INDEX "refunds_status_idx" ON "refunds" USING btree ("status");--> statement-breakpoint
CREATE INDEX "conversation_participants_user_id_idx" ON "conversation_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conversations_ticket_id_idx" ON "conversations" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_sender_id_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "tickets_created_by_user_id_idx" ON "tickets" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "tickets_against_vendor_id_idx" ON "tickets" USING btree ("against_vendor_id");--> statement-breakpoint
CREATE INDEX "tickets_status_idx" ON "tickets" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "stores_slug_uidx" ON "stores" USING btree (lower("slug"));--> statement-breakpoint
CREATE INDEX "stores_status_idx" ON "stores" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stores_is_active_idx" ON "stores" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "vendor_applications_user_id_idx" ON "vendor_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vendor_applications_status_idx" ON "vendor_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vendor_applications_reviewed_by_idx" ON "vendor_applications" USING btree ("reviewed_by");--> statement-breakpoint
CREATE INDEX "vendor_profiles_status_idx" ON "vendor_profiles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vendor_profiles_approved_by_idx" ON "vendor_profiles" USING btree ("approved_by");