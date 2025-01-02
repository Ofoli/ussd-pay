import axios, { type AxiosError } from "axios";
import { NALO_PAYMENT_URL } from "../config/constants";
import {
  generatePaymentPayload,
  formatCallbackResponse,
} from "../payment/utils";
import type { Request, Response } from "express";

const Transaction = require("../models/transactions");

async function firePayment(data: Record<string, string>) {
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
    const { response } = err as AxiosError;
    const { message } = err as Error;
    console.log({ PAYMENT_REQUEST_FAILED: response?.data ?? message });
  }
}

async function handlePaymentCallback(req: Request, res: Response) {
  try {
    const { status, invoice } = formatCallbackResponse(req.body);
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { invoice },
      { status }
    );

    if (updatedTransaction === null) {
      res.status(404).json("Transaction not found!");
      return;
    }

    res.json("Received");
  } catch (err) {
    res.status(500).json("An Error Occurred!!");
  }
}

export { firePayment, handlePaymentCallback };
