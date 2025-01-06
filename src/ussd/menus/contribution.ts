import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { AmountStage } from "./amount";
import { MESSAGES, CONTRIBUTION_TYPES } from "../constants";
import { ErrorAlert } from "./error";
import { isStringedNumber } from "../utils";
import type { MenuResponse } from "../../ussd-core/types";

export class ContributionStage extends StageHandler {
  stage: string = "contribution";

  getMenu(session: UssdSessionContext): MenuResponse {
    return { message: MESSAGES.STAGE_TWO, continueSession: true };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const contributionOption = session.getUssdData().userData;
    if (!this.isValidContributionOption(contributionOption)) {
      return new ErrorAlert("You entered an invalid input");
    }

    const contribution = CONTRIBUTION_TYPES[parseInt(contributionOption) - 1];
    session.update("contribution", contribution);
    return new AmountStage();
  }

  isValidContributionOption(option: string): boolean {
    return (
      isStringedNumber(option) &&
      parseInt(option) > 0 &&
      parseInt(option) < CONTRIBUTION_TYPES.length
    );
  }
}
