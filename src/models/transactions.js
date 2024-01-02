const mongoose = require("mongoose");

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

module.exports = mongoose.model("Transaction", TransactionSchema);
