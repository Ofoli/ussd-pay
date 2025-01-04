import { db } from "../db/index";
import { eq, and, sql } from "drizzle-orm";
import { transactions } from "../db/schema";
import type { PaymentData, UpdateTransData } from "./types";

export class Transaction {
  static async create(data: PaymentData) {
    const [trans] = await db.insert(transactions).values(data).returning();
    return trans;
  }

  static async retrieve(orderId: string) {
    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.status, "Pending"),
          eq(transactions.orderId, orderId)
        )
      );
  }

  static async update(data: UpdateTransData) {
    await db
      .update(transactions)
      .set({ ...data, updatedAt: sql`(CURRENT_TIMESTAMP)` })
      .where(
        and(
          eq(transactions.status, "Pending"),
          eq(transactions.orderId, data.orderId)
        )
      );
  }
}
