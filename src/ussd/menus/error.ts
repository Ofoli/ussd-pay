import { StageHandler } from "../../ussd-core/stage-handler";
import { UssdSessionContext } from "../../ussd-core/session-context";
import type { MenuResponse } from "../../ussd-core/types";

export class ErrorAlert extends StageHandler {
  stage: string = "error";
  error: string;

  constructor(error: string) {
    super();
    this.error = error;
  }

  getMenu(session: UssdSessionContext): MenuResponse {
    return { message: this.error, continueSession: false };
  }

  getNext(session: UssdSessionContext): StageHandler {
    return this;
  }
}
