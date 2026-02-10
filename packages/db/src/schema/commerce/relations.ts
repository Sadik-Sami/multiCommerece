import { relations } from "drizzle-orm";
import { user } from "../auth";
import { auditLogs } from "./auditing";
import {
  cartItems,
  carts,
  orderItems,
  orders,
  vendorOrders,
} from "./checkout";
import { categories, coupons, products, storeProducts } from "./catalog";
import { payouts, refunds } from "./payments";
import {
  conversationParticipants,
  conversations,
  messages,
  tickets,
} from "./support";
import { stores, vendorApplications, vendorProfiles } from "./vendor";

export const vendorProfilesRelations = relations(vendorProfiles, ({ many, one }) => ({
  ownerUser: one(user, {
    fields: [vendorProfiles.userId],
    references: [user.id],
    relationName: "vendor_profile_owner",
  }),
  approverUser: one(user, {
    fields: [vendorProfiles.approvedBy],
    references: [user.id],
    relationName: "vendor_profile_approver",
  }),
  store: one(stores, {
    fields: [vendorProfiles.id],
    references: [stores.vendorId],
  }),
  vendorOrders: many(vendorOrders),
  tickets: many(tickets),
  payouts: many(payouts),
}));

export const storesRelations = relations(stores, ({ many, one }) => ({
  vendor: one(vendorProfiles, {
    fields: [stores.vendorId],
    references: [vendorProfiles.id],
  }),
  storeProducts: many(storeProducts),
  vendorOrders: many(vendorOrders),
  coupons: many(coupons),
}));

export const vendorApplicationsRelations = relations(
  vendorApplications,
  ({ one }) => ({
    applicantUser: one(user, {
      fields: [vendorApplications.userId],
      references: [user.id],
      relationName: "vendor_application_applicant",
    }),
    reviewerUser: one(user, {
      fields: [vendorApplications.reviewedBy],
      references: [user.id],
      relationName: "vendor_application_reviewer",
    }),
  }),
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  children: many(categories, {
    relationName: "category_parent",
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  storeProducts: many(storeProducts),
}));

export const storeProductsRelations = relations(storeProducts, ({ many, one }) => ({
  store: one(stores, {
    fields: [storeProducts.storeId],
    references: [stores.id],
  }),
  product: one(products, {
    fields: [storeProducts.productId],
    references: [products.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const cartsRelations = relations(carts, ({ many, one }) => ({
  user: one(user, {
    fields: [carts.userId],
    references: [user.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  storeProduct: one(storeProducts, {
    fields: [cartItems.storeProductId],
    references: [storeProducts.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  vendorOrders: many(vendorOrders),
  tickets: many(tickets),
  refunds: many(refunds),
}));

export const vendorOrdersRelations = relations(vendorOrders, ({ many, one }) => ({
  order: one(orders, {
    fields: [vendorOrders.orderId],
    references: [orders.id],
  }),
  store: one(stores, {
    fields: [vendorOrders.storeId],
    references: [stores.id],
  }),
  vendor: one(vendorProfiles, {
    fields: [vendorOrders.vendorId],
    references: [vendorProfiles.id],
  }),
  items: many(orderItems),
  tickets: many(tickets),
  refunds: many(refunds),
  payout: one(payouts, {
    fields: [vendorOrders.id],
    references: [payouts.vendorOrderId],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  vendorOrder: one(vendorOrders, {
    fields: [orderItems.vendorOrderId],
    references: [vendorOrders.id],
  }),
  storeProduct: one(storeProducts, {
    fields: [orderItems.storeProductId],
    references: [storeProducts.id],
  }),
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
  store: one(stores, {
    fields: [coupons.storeId],
    references: [stores.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  createdByUser: one(user, {
    fields: [tickets.createdByUserId],
    references: [user.id],
  }),
  againstVendor: one(vendorProfiles, {
    fields: [tickets.againstVendorId],
    references: [vendorProfiles.id],
  }),
  order: one(orders, {
    fields: [tickets.orderId],
    references: [orders.id],
  }),
  vendorOrder: one(vendorOrders, {
    fields: [tickets.vendorOrderId],
    references: [vendorOrders.id],
  }),
  conversation: one(conversations, {
    fields: [tickets.id],
    references: [conversations.ticketId],
  }),
}));

export const conversationsRelations = relations(conversations, ({ many, one }) => ({
  ticket: one(tickets, {
    fields: [conversations.ticketId],
    references: [tickets.id],
  }),
  participants: many(conversationParticipants),
  messages: many(messages),
}));

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(user, {
      fields: [conversationParticipants.userId],
      references: [user.id],
    }),
  }),
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(user, {
    fields: [messages.senderId],
    references: [user.id],
  }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
  vendorOrder: one(vendorOrders, {
    fields: [refunds.vendorOrderId],
    references: [vendorOrders.id],
  }),
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
  vendor: one(vendorProfiles, {
    fields: [payouts.vendorId],
    references: [vendorProfiles.id],
  }),
  vendorOrder: one(vendorOrders, {
    fields: [payouts.vendorOrderId],
    references: [vendorOrders.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actorUser: one(user, {
    fields: [auditLogs.actorUserId],
    references: [user.id],
  }),
}));
