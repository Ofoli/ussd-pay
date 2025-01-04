import { db } from "../db/index";
import { eq, and, sql } from "drizzle-orm";
import { transactions } from "../db/schema";
import type { TransData, UpdateTransData } from "./types";

export class Transaction {
  static async create(data: TransData) {
    try {
      await db.insert(transactions).values(data);
    } catch (err) {
      const { message } = err as Error;
      console.log({ action: "create-transaction", details: message, data });
    }
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
