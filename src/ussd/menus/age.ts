import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { LastStage } from "./last";
import type { MenuResponse } from "../../ussd-core/types";

export class AgeStage extends StageHandler {
  stage: string = "Age";

  getMenu(session: UssdSessionContext): MenuResponse {
    const message = "Please enter your age";
    return { message, continueSession: true };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const age = session.getUssdData().userData;
    session.update("age", age);

    return new LastStage();
  }
}
