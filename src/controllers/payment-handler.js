const axios = require("axios");
const Transaction = require("../models/transactions");
const { updateTransaction } = require("../models/payment");
const { FAILED_STATUS, NALO_PAYMENT_URL } = require("../data/constants");
const {
  generatePaymentPayload,
  formatCallbackResponse,
} = require("../utils/payment");

async function firePayment(data) {
  const payload = generatePaymentPayload(data);
  try {
    const { data } = await axios.post(NALO_PAYMENT_URL, payload);
    if (!data.Status) throw new Error(data);

    const transactionData = formatCallbackResponse(data);
    const { customerNumber, amount } = payload;
    await Transaction.create({
      ...transactionData,
      customerNumber,
      amount,
    });
  } catch (err) {
    console.log({ PAYMENT_REQUEST_FAILED: err?.response?.data ?? err.message });
  }
}

const handlePaymentCallback = async (req, res) => {
  const transaction = formatCallbackResponse(req.body);
  const { status, data } = await updateTransaction(transaction);

  if (status === FAILED_STATUS) {
    return res.status(404).json({ status: FAILED_STATUS, message: data });
  }

  return res.json("Received");
};

module.exports = { firePayment, handlePaymentCallback };
