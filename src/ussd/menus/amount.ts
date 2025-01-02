import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { MESSAGES } from "../constants";
import { ErrorAlert } from "./error";
import { isStringedNumber } from "../validator";
import type { MenuResponse } from "../../ussd-core/types";

export class AmountStage extends StageHandler {
  stage: string = "amount";

  getMenu(session: UssdSessionContext): MenuResponse {
    const contribution = session.retrieve("contribution");
    const message = MESSAGES.STAGE_THREE(contribution);
    return { message, continueSession: true };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const amount = session.getUssdData().userData;

    if (!this.isValidAmount(amount))
      return new ErrorAlert("You entered an invalid input");

    session.update("amount", amount);
    return this;
  }

  isValidAmount(amount: string): boolean {
    return isStringedNumber(amount) && parseInt(amount) > 0;
  }
}
