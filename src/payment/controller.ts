import { validateCallbackData } from "./utils";
import { NaloPaymentService } from "../services/payment";
import type { Request, Response } from "express";

export async function handleNaloPaymentCallback(req: Request, res: Response) {
  const validationResponse = validateCallbackData(req.body);
  if (!validationResponse.status) {
    res.status(400).json(validationResponse);
    return;
  }

  const response = await new NaloPaymentService().processCallback(req.body);
  res.status(response.status).json(response.message);
}
