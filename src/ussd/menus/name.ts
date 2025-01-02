import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { ContributionStage } from "./contribution";
import { MESSAGES } from "../constants";
import type { MenuResponse } from "../../ussd-core/types";

export class NameStage extends StageHandler {
  stage: string = "";

  getMenu(session: UssdSessionContext): MenuResponse {
    return { message: MESSAGES.STAGE_ONE, continueSession: true };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const ussd = session.getUssdData();
    if (ussd.isFirstMenu) return this;

    const data = ussd.userData;
    session.update("name", data);

    return new ContributionStage();
  }
}
