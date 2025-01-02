import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { USSD_ENPOINT, PAYMENT_CALLBACK_ENDPOINT } from "./config/constants";
import { handleUSSDRequests } from "./controllers/ussd-handler";
import { handlePaymentCallback } from "./controllers/payment-handler";
import { connectDB } from "./config/db";
import type { Request, Response, Express } from "express";
import { testUssdCore } from "./ussd/controller";

const port = process.env.PORT || 8000;
const app: Express = express();

dotenv.config();
app.use(express.json());
// connectDB();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "App is working" });
});

app.post("/test-code", testUssdCore);
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
