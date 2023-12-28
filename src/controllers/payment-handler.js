const { updateTransaction, addTransaction } = require("../models/payment");
const { FAILED_STATUS } = require("../data/constants");
const { generatePaymentPayload } = require("../utils/payment");

const firePayment = async (data) => {
  const payload = generatePaymentPayload(data);
};

const handlePaymentCallback = async (req, res) => {
  const { name, invoice } = req.body;

  if (!name || !invoice) {
    res.statusCode = 400;
    return res.json({
      status: FAILED_STATUS,
      message: "both name and invoice are required",
    });
  }

  const { status, data } = await updateTransaction({ name, invoice });
  if (status === FAILED_STATUS) {
    res.status = 500;
    return res.json({ status: FAILED_STATUS, message: data });
  }

  const values = generatePaymentPayload({
    name: "Lawrence",
    amount: "10",
    description: "Luxstek Offering Contribution",
    number: "233547036245",
    network: "VODAFONE",
  });

  return res.json({ data, values });
};

module.exports = { firePayment, handlePaymentCallback };
