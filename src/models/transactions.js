const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now },
  createdAt: Date,
  invoice: String,
  orderId: String,
  status: String,
  customerNumber: Number,
  amount: Number,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
