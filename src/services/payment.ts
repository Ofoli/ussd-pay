import crypto, { randomUUID } from "crypto";
import { Transaction } from "../payment/queries";
import { NaloPaymentGateway } from "./gateway";
import { logger } from "../utils/logger";
import { Request } from "../utils/request";
import type { PaymentData, Gateway, NaloResponse } from "../payment/types";
import winston from "winston";
import { STATUSES } from "../payment/constants";

export abstract class PaymentService {
  protected readonly gateway: Gateway;
  protected readonly logger: winston.Logger = logger;

  constructor(gateway: Gateway) {
    this.gateway = gateway;
  }
  protected generateOrderId(): string {
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

  private generatePaymentPayload = (data: PaymentData) => {
    const key = this.generateKey();
    return {
      key,
      isussd: true,
      amount: data.amount,
      payby: data.network,
      customerName: data.name,
      customerNumber: data.number,
      order_id: this.generateOrderId(),
      secrete: this.generateSecrete(key),
      merchant_id: this.gateway.merchant,
      callback: this.gateway.callbackUrl,
      newVodaPayment: data.network === "VODAFONE",
      item_desc: `Luxstek ${data.contribution} contribution`,
    };
  };

  private async makePayment(data: PaymentData) {
    const payload = this.generatePaymentPayload(data);
    const response = await this.callNaloApi(payload);

    if (!response) return;

    await Transaction.create({
      ...data,
      orderId: response.Order_id,
      invoice: response.InvoiceNo,
    });
  }

  private async callNaloApi(
    payload: ReturnType<NaloPaymentService["generatePaymentPayload"]>
  ): Promise<NaloResponse | null> {
    const response = await Request.post(this.gateway.url, payload);

    if (!response.status || typeof response.data === "string") {
      const data = { amount: payload.amount, orderId: payload.order_id };
      this.logger.error({
        action: "call-payment-api",
        details: response,
        data,
      });
      return null;
    }

    return response.data as NaloResponse;
  }

  public pay(data: PaymentData) {
    setTimeout(() => this.makePayment(data), 5000);
  }

  public async processCallback(data: NaloResponse) {
    const trans = await Transaction.retrieve(data.Order_id);
    if (!trans) return { status: 404, message: "Transaction Not Found" };

    await Transaction.update({
      invoice: data.InvoiceNo,
      orderId: data.Order_id,
      status: data.Status === "PAID" ? STATUSES[2] : STATUSES[1],
    });

    return { status: 200, message: "ok" };
  }
}
