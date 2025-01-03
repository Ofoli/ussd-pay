import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { MESSAGES } from "../constants";
import type { MenuResponse } from "../../ussd-core/types";

export class PromptStage extends StageHandler {
  stage: string = "prompt";

  getMenu(session: UssdSessionContext): MenuResponse {
    return { message: MESSAGES.STAGE_FIVE.proceed, continueSession: false };
  }

  getNext(session: UssdSessionContext): StageHandler {
    return this;
  }
}
