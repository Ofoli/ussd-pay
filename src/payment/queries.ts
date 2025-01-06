import { db } from "../db/index";
import { eq, and, sql } from "drizzle-orm";
import { transactions } from "../db/schema";
import { logger } from "../utils/logger";
import type { TransData, UpdateTransData } from "./types";

export class Transaction {
  static async query<R>(query: Promise<R>) {
    try {
      return await query;
    } catch (err) {
      const { message } = err as Error;
      logger.error({
        action: "query-transaction-model",
        details: message,
      });
    }
  }
  static async create(data: TransData) {
    await Transaction.query(db.insert(transactions).values(data));
  }

  static async retrieve(orderId: string) {
    const trans = await Transaction.query(
      db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.status, "Pending"),
            eq(transactions.orderId, orderId)
          )
        )
    );

    if (!trans || trans.length === 0) return null;
    return trans.pop();
  }

  static async update(data: UpdateTransData) {
    await Transaction.query(
      db
        .update(transactions)
        .set({ ...data, updatedAt: sql`(CURRENT_TIMESTAMP)` })
        .where(
          and(
            eq(transactions.status, "Pending"),
            eq(transactions.orderId, data.orderId)
          )
        )
    );
  }
}
