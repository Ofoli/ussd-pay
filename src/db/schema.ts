import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { STATUSES } from "../payment/constants";
import { CONTRIBUTION_TYPES } from "../ussd/constants";

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoice: text("invoice"),
  name: text("name").notNull(),
  number: text("number").notNull(),
  amount: real("amount").notNull(),
  network: text("number").notNull(),
  orderId: text("order_id").notNull(),
  status: text("status", { enum: STATUSES }).default("Pending").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  contribution: text("contribution_type", {
    enum: CONTRIBUTION_TYPES,
  }).notNull(),
});
