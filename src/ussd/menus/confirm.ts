import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { MESSAGES } from "../constants";
import { ErrorAlert } from "./error";
import { isStringedNumber } from "../validator";
import type { MenuResponse } from "../../ussd-core/types";

export class ConfirmStage extends StageHandler {
  stage: string = "confirm";

  getMenu(session: UssdSessionContext): MenuResponse {
    const amount = session.retrieve("amount");
    const contribution = session.retrieve("contribution");
    const message = MESSAGES.STAGE_FOUR(contribution, amount);
    return { message, continueSession: true };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const userOption = session.getUssdData().userData;

    if (userOption !== "1") return new ErrorAlert(MESSAGES.STAGE_FIVE.cancel);

    const name = session.retrieve("name");
    const amount = session.retrieve("amount");
    const contribution = session.retrieve("contribution");
    const paymentData = {
      amount,
      name,
      description: `Luxstek ${contribution} contribution`,
      number: session.getUssdData().msisdn,
      network: session.getUssdData().network,
    };
    if (this.firePayment(paymentData)) {
      return this;
    }
    return new ErrorAlert(MESSAGES.STAGE_FIVE.cancel);
  }

  firePayment(data: Record<string, string>): boolean {
    return true;
  }

  isValidAmount(amount: string): boolean {
    return isStringedNumber(amount) && parseInt(amount) > 0;
  }
}
