require("dotenv").config();
const express = require("express");
const { USSD_ENPOINT, PAYMENT_CALLBACK_ENDPOINT } = require("./data/constants");
const handleUSSDRequests = require("./controllers/ussd-handler");
const { handlePaymentCallback } = require("./controllers/payment-handler");

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "App is working" });
});

app.post(USSD_ENPOINT, handleUSSDRequests);
app.post(PAYMENT_CALLBACK_ENDPOINT, handlePaymentCallback);

app.listen(port, () => {
  console.log(`Started USSD app on port ${port}`);
});
