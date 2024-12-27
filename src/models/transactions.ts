import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    invoice: String,
    orderId: String,
    status: String,
    customerNumber: Number,
    amount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);
