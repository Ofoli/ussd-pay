import crypto, { randomUUID } from "crypto";
import { Transaction } from "../payment/queries";
import { NaloPaymentGateway } from "./gateway";
import { Request, type SuccessResponse } from "../utils/request";
import type { PaymentData, Gateway } from "../payment/types";
import { taskQueue } from "./queue";

export abstract class PaymentService {
  gateway: Gateway;

  constructor(gateway: Gateway) {
    this.gateway = gateway;
  }
  protected generateOrderId(): string {
    return randomUUID();
  }
  protected abstract generatePaymentPayload(
    data: PaymentData,
    orderId: string
  ): Record<string, string | number | boolean>;

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

  protected generatePaymentPayload = (data: PaymentData) => {
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

  private async makePayment(data: PaymentData) {
    const payload = this.generatePaymentPayload(data);
    const response = await Request.post(this.gateway.url, payload);

    if (!response.status || response.data.Status) {
      //log error
      console.log({ response });
      return;
    }
    const { data: naloData } = response as SuccessResponse;
    await Transaction.create({
      ...data,
      orderId: naloData.Order_id as string,
      invoice: naloData.InvoiceNo as string,
    });
  }

  public pay(data: PaymentData) {
    taskQueue.enqueue({
      method: this.makePayment,
      params: [data],
      delay: 5000,
    });
  }
}
