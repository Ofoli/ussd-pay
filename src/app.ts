import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { USSD_ENPOINT, PAYMENT_CALLBACK_ENDPOINT } from "./config/constants";
import { handlePaymentCallback } from "./controllers/payment-handler";
import { connectDB } from "./config/db";
import { handleUssdRequests } from "./ussd/controller";
import type { Request, Response, Express } from "express";

const port = process.env.PORT || 8000;
const app: Express = express();

dotenv.config();
app.use(express.json());
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "App is working" });
});

app.post(USSD_ENPOINT, handleUssdRequests);
app.post(PAYMENT_CALLBACK_ENDPOINT, handlePaymentCallback);

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`Started USSD app on port ${port}`);
  });
});
