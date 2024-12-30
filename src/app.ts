import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { USSD_ENPOINT, PAYMENT_CALLBACK_ENDPOINT } from "./config/constants";
import { handleUSSDRequests } from "./controllers/ussd-handler";
import { handlePaymentCallback } from "./controllers/payment-handler";
import { connectDB } from "./config/db";
import type { Request, Response, Express } from "express";
import { UssdApp } from "./ussd-core/app";
import { StageMapping } from "./ussd-core/handler-mapping";
import { StageHandlerMapping } from "./ussd-core/handler";
import type { UssdData } from "./ussd-core/types";

const port = process.env.PORT || 8000;
const app: Express = express();

dotenv.config();
app.use(express.json());
// connectDB();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "App is working" });
});
app.post("/test-code", (req: Request, res: Response) => {
  const data = req.body as UssdData;
  const mapping = new StageHandlerMapping(StageMapping);
  const response = UssdApp.run(data, mapping);
  res.json(response);
});

app.post(USSD_ENPOINT, handleUSSDRequests);
app.post(PAYMENT_CALLBACK_ENDPOINT, handlePaymentCallback);

app.listen(port, () => {
  console.log(`Started USSD app on port ${port}`);
});

// mongoose.connection.once("open", () => {
//   app.listen(port, () => {
//     console.log(`Started USSD app on port ${port}`);
//   });
// });
