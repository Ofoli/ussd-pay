import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import { AgeStage } from "./age";
import type { MenuResponse } from "../../ussd-core/types";

export class NameStage extends StageHandler {
  stage: string = "";

  getMenu(session: UssdSessionContext): MenuResponse {
    const message = "Please enter your name";
    return { message, continueSession: true };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const ussd = session.getUssdData();
    if (ussd.isFirstMenu) return this;

    const data = ussd.userData;
    session.update("name", data);

    return new AgeStage();
  }
}
