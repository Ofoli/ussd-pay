import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import type { MenuResponse } from "../../ussd-core/types";

export class LastStage extends StageHandler {
  stage: string = "Last";

  getMenu(session: UssdSessionContext): MenuResponse {
    const age = session.retrieve("age");
    const name = session.retrieve("name");

    const message = `Hello ${name},\n You are ${age} years old`;
    return { message, continueSession: false };
  }

  getNext(session: UssdSessionContext): StageHandler {
    return this;
  }
}
