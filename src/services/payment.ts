import crypto, { randomUUID } from "crypto";
import { Transaction } from "../payment/queries";
import { NaloPaymentGateway } from "./gateway";
import { Request, type SuccessResponse } from "../utils/request";
import type { PaymentData, Gateway } from "../payment/types";

export abstract class PaymentService {
  gateway: Gateway;

  constructor(gateway: Gateway) {
    this.gateway = gateway;
  }
  generateOrderId(): string {
    return randomUUID();
  }

  public abstract pay(data: PaymentData): void;
}

export class NaloPaymentService extends PaymentService {
  constructor() {
    super(NaloPaymentGateway);
  }

  private generateKey = () => {
    const digits = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    );
    return digits.join("");
  };

  private createMD5Hash = (str: string) => {
    const md5Hash = crypto.createHash("md5");
    md5Hash.update(str, "utf-8");
    return md5Hash.digest("hex");
  };

  private generateSecrete = (key: string) => {
    const hashedPassword = this.createMD5Hash(this.gateway.password);
    const secreteString = this.gateway.username + key + hashedPassword;
    const secrete = this.createMD5Hash(secreteString);
    return secrete;
  };

  generatePaymentPayload = (data: PaymentData) => {
    const key = this.generateKey();
    return {
      key,
      isussd: true,
      amount: data.amount,
      payby: data.network,
      customerName: data.name,
      customerNumber: data.number,
      orderId: this.generateOrderId(),
      secrete: this.generateSecrete(key),
      merchant_id: this.gateway.merchant,
      callback: this.gateway.callbackUrl,
      newVodaPayment: data.network === "VODAFONE",
      item_desc: `Luxstek ${data.contribution} contribution`,
    };
  };

  async makePayment(data: PaymentData) {
    const payload = this.generatePaymentPayload(data);
    const response = await Request.post(this.gateway.url, payload);

    if (!response.status || typeof response.data === "string") {
      //log error
      console.log({ action: "make-payment", details: response, data });
      return;
    }

    const { data: naloData } = response as SuccessResponse;

    try {
      await Transaction.create({
        ...data,
        orderId: naloData.Order_id as string,
        invoice: naloData.InvoiceNo as string,
      });
    } catch (err) {
      const { message } = err as Error;
      console.log({ action: "create-transaction", details: message, data });
    }
  }

  public pay(data: PaymentData) {
    setTimeout(() => this.makePayment(data), 5000);
  }
}
