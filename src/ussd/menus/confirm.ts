import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { MESSAGES } from "../constants";
import { ErrorAlert } from "./error";
import { PromptStage } from "./prompt";
import { isStringedNumber } from "../utils";
import { PaymentService, NaloPaymentService } from "../../services/payment";
import type { MenuResponse } from "../../ussd-core/types";
import { PaymentData } from "../../payment/types";

export class ConfirmStage extends StageHandler {
  stage: string = "confirm";
  paymentService: PaymentService;

  constructor(paymentService: PaymentService = new NaloPaymentService()) {
    super();
    this.paymentService = paymentService;
  }

  getMenu(session: UssdSessionContext): MenuResponse {
    const amount = session.retrieve("amount");
    const contribution = session.retrieve("contribution");
    const message = MESSAGES.STAGE_FOUR(contribution, amount);
    return { message, continueSession: true };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const userOption = session.getUssdData().userData;

    if (userOption !== "1") return new ErrorAlert(MESSAGES.STAGE_FIVE.cancel);

    const paymentData = {
      name: session.retrieve("name"),
      number: session.getUssdData().msisdn,
      network: session.getUssdData().network,
      contribution: session.retrieve("contribution"),
      amount: parseFloat(session.retrieve("amount")),
    } as PaymentData;

    this.paymentService.pay(paymentData);
    return new PromptStage();
  }

  isValidAmount(amount: string): boolean {
    return isStringedNumber(amount) && parseInt(amount) > 0;
  }
}
