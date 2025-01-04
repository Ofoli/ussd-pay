import express, { Request, Response, Express } from "express";
// import { handlePaymentCallback } from "./controllers/payment-handler";
import { handleUssdRequests } from "./ussd/controller";
import { config } from "./config/env";

const app: Express = express();
const port = config.app.port || 8000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "App is working" });
});

app.post(config.endpoints.ussd, handleUssdRequests);
// app.post(config.endpoints.paymentCallback, handlePaymentCallback);

app.listen(port, () => {
  console.log(`Started USSD app on port ${port}`);
});
