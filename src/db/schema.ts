import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { STATUSES } from "../payment/constants";
import { CONTRIBUTION_TYPES } from "../ussd/constants";

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoice: text("invoice"),
  amount: real("amount").notNull(),
  orderId: text("order_id").notNull(),
  customerNumber: text("customer_number").notNull(),
  status: text("status", { enum: STATUSES }).default("Pending"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  contribution: text("contribution_type", {
    enum: CONTRIBUTION_TYPES,
  }).notNull(),
});
