const axios = require("axios");
const Transaction = require("../models/transactions");
const { NALO_PAYMENT_URL } = require("../data/constants");
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
  try {
    const { status, invoice } = formatCallbackResponse(req.body);
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { invoice },
      { status }
    );

    if (updatedTransaction === null) {
      return res.status(404).json("Transaction not found!");
    }

    return res.json("Received");
  } catch (err) {
    return res.status(500).json("An Error Occurred!!");
  }
};

module.exports = { firePayment, handlePaymentCallback };
